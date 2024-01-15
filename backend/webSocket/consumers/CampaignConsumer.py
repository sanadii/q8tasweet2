import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from apps.campaigns.models import CampaignSorting
from apps.elections.models import ElectionCommittee, ElectionSorting

class CampaignConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.campaign_slug = self.scope['url_route']['kwargs']['slug']
        self.room_group_name = f'campaign_{self.campaign_slug}'

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

        # Add dataGroup and campaign to the data
        data['dataGroup'] = 'Campaigns'
        data['campaign'] = self.campaign_slug

        if data['dataType'] == 'electionSorting':
            await self.handle_election_sorting(data)

    async def handle_election_sorting(self, data):
        election_candidate_id = data['electionCandidateId']
        new_votes = data['votes']
        election_committee_id = data['electionCommitteeId']
            
        await self.update_campaign_sorting_db(election_candidate_id, new_votes, election_committee_id)
            
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'send_election_sorting_update',
                'message': data,
            }
        )
        
        # print(f"CampaignConsumer: Received electionSorting message from CampaignConsumer: {data}")
        # Check if user is in ElectionCommittee
        is_user_in_election_committee = await self.is_user_in_election_committee(data)
        print("Is user in committee:", is_user_in_election_committee)

        if is_user_in_election_committee:
            try:

                await self.update_election_sorting_db(election_candidate_id, new_votes, election_committee_id)

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
                print(f"CampaignConsumer: Forwarded election sorting message to GlobalConsumer: {data}")
            except Exception as e:
                print(f"Error forwarding message: {e}")
        # print(f"CampaignConsumer:Forwarded election sorting message to CampaignConsumer: {data}")

    async def send_election_sorting_update(self, event):
        await self.send(text_data=json.dumps(event['message']))
        print(f"Sent election sorting update: {event['message']}")

    @sync_to_async
    def update_campaign_sorting_db(self, election_candidate_id, new_votes, election_committee_id):
        try:
            sorting_entry = CampaignSorting.objects.get(election_candidate_id=election_candidate_id, election_committee_id=election_committee_id)
            sorting_entry.votes = new_votes
            sorting_entry.save()
            print(f"Vote count updated for candidate {election_candidate_id} in committee {election_committee_id} to {new_votes}")

        except CampaignSorting.DoesNotExist:
            sorting_entry = CampaignSorting.objects.create(election_candidate_id=election_candidate_id, votes=new_votes, election_committee_id=election_committee_id)
            print(f"New CampaignSorting entry created for candidate {election_candidate_id} in committee {election_committee_id} with votes {new_votes}")


    @sync_to_async
    def update_election_sorting_db(self, election_candidate_id, new_votes, election_committee_id):
        try:
            sorting_entry = ElectionSorting.objects.get(election_candidate_id=election_candidate_id, election_committee_id=election_committee_id)
            sorting_entry.votes = new_votes
            sorting_entry.save()
            print(f"Vote count updated for candidate {election_candidate_id} in committee {election_committee_id} to {new_votes}")
            
        except ElectionSorting.DoesNotExist:
            sorting_entry = ElectionSorting.objects.create(election_candidate_id=election_candidate_id, votes=new_votes, election_committee_id=election_committee_id)
            print(f"New ElectionSorting entry created for candidate {election_candidate_id} in committee {election_committee_id} with votes {new_votes}")


    # Check if the campaignSorter is an electionSorter to decide on sending the msg to the Global Channel or not
    @sync_to_async
    def is_user_in_election_committee(self, data):
        user = self.scope["user"]
        user = userId = user.id
        electionCommitteeId = data.get('electionCommitteeId')
        electionId = data.get('electionId')
        print("user: ", userId, "electionId: ", electionId, "committeeId: ", electionCommitteeId)
        return ElectionCommittee.objects.filter(id=electionCommitteeId, sorter=userId, election=electionId).exists()

    async def campaign_message(self, event):
        response_message = json.dumps(event['message'])
        await self.send(text_data=response_message)
        print(f"Campign: From GlobalConsumer: {response_message}")
