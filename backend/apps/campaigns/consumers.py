import json

from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.utils.timesince import timesince

from apps.auths.models import User
from apps.campaigns.models import Campaign, CampaignSorting

class CampaignSortingConsumer(AsyncWebsocketConsumer):
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

class GlobalConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # You can add any group name that suits your application
        self.room_group_name = 'global_room'

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'send_message',
                'message': message
            }
        )

    # Receive message from room group
    async def send_message(self, event):
        message = event['message']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))


# class ChatConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         self.room_name = self.scope['url_route']['kwargs']['room_name']
#         self.room_group_name = f'chat_{self.room_name}'
#         self.user = self.scope['user']

#         # Join room group
#         await self.get_room()
#         await self.channel_layer.group_add(self.room_group_name, self.channel_name)
#         await self.accept()

#         # Inform user
#         if self.user.is_staff:
#             await self.channel_layer.group_send(
#                 self.room_group_name,
#                 {
#                     'type': 'users_update'
#                 }
#             )

#     async def disconnect(self, close_code):
#         # Leave room
#         await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

#         if not self.user.is_staff:
#             await self.set_room_closed()

#     async def receive(self, text_data):
#         text_data_json = json.loads(text_data)
#         print("Received JSON:", text_data_json)

#         type = text_data_json['type']
#         message = text_data_json['message']
#         created_by = text_data_json.get('createdBy', None)  # Corrected key

#         print('Received created_by:', created_by)
#         # ... rest of your code ...

#         if type == 'message':
#             new_message = await self.create_message(message, created_by)

#             # Send message to group / room
#             await self.channel_layer.group_send(
#                 self.room_group_name, {
#                     'type': 'chat_message',
#                     'message': message,
#                     'created_by': created_by,
#                     'created_at': timesince(new_message.created_at),
#                 }
#             )
#         elif type == 'update':
#             print('is update')
#             # Send update to the room
#             await self.channel_layer.group_send(
#                 self.room_group_name, {
#                     'type': 'writing_active',
#                     'message': message,
#                     'created_by': created_by,
#                 }
#             )

#     async def chat_message(self, event):
#         # Send message to WebSocket (front end)
#         await self.send(text_data=json.dumps({
#             'type': event['type'],
#             'message': event['message'],
#             'createdBy': event['createdBy'],
#             'created_at': event['created_at'],
#             'roomUuid': self.room_name,  # Add the roomUuid here
#         }))

#     async def writing_active(self, event):
#         # Send writing is active to room
#         await self.send(text_data=json.dumps({
#             'type': event['type'],
#             'message': event['message'],
#             'name': event['name'],
#             'created_by': event['created_by'],
#             'initials': event['initials'],
#         }))

#     async def users_update(self, event):
#         # Send information to the web socket (front end)
#         await self.send(text_data=json.dumps({
#             'type': 'users_update'
#         }))

#     @sync_to_async
#     def get_room(self):
#         self.room = ChatRoom.objects.get(uuid=self.room_name)

#     @sync_to_async
#     def set_room_closed(self):
#         self.room = ChatRoom.objects.get(uuid=self.room_name)
#         self.room.status = ChatRoom.CLOSED
#         self.room.save()

#     @sync_to_async
#     def create_message(self, message, created_by):
#         print("Creating message with created_by:", created_by)
#         new_message = None

#         if created_by:
#             try:
#                 user = User.objects.get(pk=created_by)
#                 new_message = Message.objects.create(
#                     message=message, created_by=user)
#                 print("Assigned user:", user)
#             except User.DoesNotExist:
#                 print("User not found for ID:", created_by)
#                 # Handle the case where the user does not exist

#         if new_message:
#             self.room.messages.add(new_message)

#         return new_message
