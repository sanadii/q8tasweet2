import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from apps.schemas.campaign_sorting.models import SortingCampaign, SortingElection
from apps.schemas.committees.models import Committee
from apps.schemas.schema import schema_context


class CampaignConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.campaign_slug = self.scope['url_route']['kwargs']['slug']
        self.room_group_name = f'campaign_{self.campaign_slug}'
        await self.join_room()

    async def join_room(self):
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        if self.is_valid_message(data):
            await self.process_message(data)

    def is_valid_message(self, data):
        required_fields = ['dataType', 'electionCandidateId', 'votes', 'electionCommitteeId']
        return all(field in data for field in required_fields)

    async def process_message(self, data):
        data['dataGroup'] = 'Campaigns'
        data['campaign'] = self.campaign_slug

        if data['dataType'] == 'electionSorting':
            await self.handle_election_sorting(data)

    async def handle_election_sorting(self, data):
        election_candidate = data['electionCandidateId']
        new_votes = data['votes']
        committee_id = data['electionCommitteeId']

        election_schema = await self.get_election_schema(election_candidate)

        await self.update_campaign_sorting_db(election_candidate, new_votes, committee_id, election_schema)
        await self.send_group_message(data)
        
        if await self.is_user_in_election_committee(data):
            await self.forward_to_global_channel(data, election_candidate, new_votes, committee_id, election_schema)

    async def get_election_schema(self, election_candidate_id):
        election = await sync_to_async(lambda: SortingCampaign.objects.filter(election_candidate=election_candidate_id).select_related('election').first())()
        return election.election.schema.slug if election else None

    async def send_group_message(self, data):
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'send_election_sorting_update',
                'message': data,
            }
        )

    async def forward_to_global_channel(self, data, election_candidate, new_votes, committee_id, election_schema):
        try:
            await self.update_election_sorting_db(election_candidate, new_votes, committee_id, election_schema)
            await self.channel_layer.group_send(
                'global_channel_default',
                {
                    'type': 'broadcast_message',
                    'message': data,
                    'channel': 'campaign',
                    'dataType': 'electionSorting',
                    'dataGroup': 'campaigns',
                }
            )
            print(f"Forwarded election sorting message to GlobalConsumer: {data}")
        except Exception as e:
            print(f"Error forwarding message: {e}")

    async def send_election_sorting_update(self, event):
        await self.send(text_data=json.dumps(event['message']))
        print(f"Sent election sorting update: {event['message']}")

    @sync_to_async
    def update_campaign_sorting_db(self, election_candidate, new_votes, committee_id, schema):
        with schema_context(schema):
            try:
                sorting_entry = SortingCampaign.objects.get(election_candidate=election_candidate, committee_id=committee_id)
                sorting_entry.votes = new_votes
                sorting_entry.save()
                print(f"Vote count updated for candidate {election_candidate} in committee {committee_id} to {new_votes}")
            except SortingCampaign.DoesNotExist:
                SortingCampaign.objects.create(election_candidate=election_candidate, votes=new_votes, committee_id=committee_id)
                print(f"New SortingCampaign entry created for candidate {election_candidate} in committee {committee_id} with votes {new_votes}")

    @sync_to_async
    def update_election_sorting_db(self, election_candidate, new_votes, committee_id, schema):
        with schema_context(schema):
            try:
                sorting_entry = SortingElection.objects.get(election_candidate=election_candidate, committee_id=committee_id)
                sorting_entry.votes = new_votes
                sorting_entry.save()
                print(f"Vote count updated for candidate {election_candidate} in committee {committee_id} to {new_votes}")
            except SortingElection.DoesNotExist:
                SortingElection.objects.create(election_candidate=election_candidate, votes=new_votes, committee_id=committee_id)
                print(f"New SortingElection entry created for candidate {election_candidate} in committee {committee_id} with votes {new_votes}")

    @sync_to_async
    def is_user_in_election_committee(self, data):
        user = self.scope["user"]
        user_id = user.id
        election_committee_id = data.get('electionCommitteeId')
        election_id = data.get('electionId')
        print("user: ", user_id, "electionId: ", election_id, "committeeId: ", election_committee_id)
        return Committee.objects.filter(id=election_committee_id, sorter=user_id, election=election_id).exists()

    async def campaign_message(self, event):
        response_message = json.dumps(event['message'])
        await self.send(text_data=response_message)
        print(f"Campaign: From GlobalConsumer: {response_message}")
