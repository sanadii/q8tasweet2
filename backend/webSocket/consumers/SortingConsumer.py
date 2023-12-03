import json

from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.utils.timesince import timesince

from apps.auths.models import User
from apps.campaigns.models import Campaign, CampaignSorting


class SortingConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.campaign_slug = self.scope['url_route']['kwargs']['slug']
        self.room_group_name = f'campaign_sorting_{self.campaign_slug}'
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        # Leave campaign sorting group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        if text_data_json['type'] == 'vote_update':
            election_candidate_id = text_data_json['electionCandidateId']
            new_votes = text_data_json['votes']
            election_committee_id = text_data_json['electionCommitteeId']
            await self.update_vote_count(election_candidate_id, new_votes, election_committee_id)
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'send_vote_update',
                    'electionCandidateId': election_candidate_id,
                    'votes': new_votes,
                    'electionCommitteeId': election_committee_id,
                }
            )
            print(f"Received message: {text_data}")  # Debugging line


    async def send_vote_update(self, event):
        # Prepare the message
        message = {
            'type': 'vote_update',
            'electionCandidateId': event['electionCandidateId'],
            'votes': event['votes'],
            'electionCommitteeId': event['electionCommitteeId'],
        }
        print(f"Sending message to group: {message}")  # Debugging line
        await self.send(text_data=json.dumps(message))

    @sync_to_async
    def update_vote_count(self, election_candidate_id, new_votes, election_committee_id):
        try:
            # Updated to filter by both candidate ID and committee ID
            sorting_entry = CampaignSorting.objects.get(election_candidate_id=election_candidate_id, election_committee_id=election_committee_id)
            sorting_entry.votes = new_votes
            sorting_entry.save()
            print(f"Vote count updated for candidate {election_candidate_id} in committee {election_committee_id} to {new_votes}")
        except CampaignSorting.DoesNotExist:
            # Create a new entry if it doesn't exist
            sorting_entry = CampaignSorting.objects.create(election_candidate_id=election_candidate_id, votes=new_votes, election_committee_id=election_committee_id)
            print(f"New CampaignSorting entry created for candidate {election_candidate_id} in committee {election_committee_id} with votes {new_votes}")

