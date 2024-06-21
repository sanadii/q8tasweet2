import json

from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.utils.timesince import timesince

from apps.auths.models import User
from apps.campaigns.models import Campaign, SortingCampaign

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Handle chat room connection
        pass

    async def disconnect(self, close_code):
        # Handle disconnection from chat room
        pass

    async def receive(self, text_data):
        # Handle chat messages here
        # Example: sending and receiving chat messages in a room
        pass

    # Define message sending methods as needed





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
