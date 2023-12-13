import json
from channels.generic.websocket import AsyncWebsocketConsumer
from enum import Enum
from urllib.parse import parse_qs

class DataType(Enum):
    NOTIFICATION = 'notification'
    ELECTION_SORT = 'electionSort'
    CAMPAIGN_UPDATE = 'campaignUpdate'
    CHAT = 'chat'
    # Add more as needed

class GlobalConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        self.channel_type = self.scope['url_route']['kwargs'].get('type', 'default')
        self.room_group_name = f'global_channel_{self.channel_type}'

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        if self.is_valid_message(data):
            await self.process_message(data)

    def is_valid_message(self, data):
        required_fields = ['dataType', 'notificationGroup', 'messageType', 'message']
        return all(field in data for field in required_fields)

    async def process_message(self, data):
        notificationGroup = data.get('notificationGroup')
        if notificationGroup == 'users':
            await self.send_message_to_users(data)
        elif notificationGroup == 'campaigns':
            await self.send_message_to_campaigns(data)
        elif notificationGroup == 'elections':
            await self.send_message_to_elections(data)
        else:
            print(f"Invalid group: {notificationGroup}")

    async def send_message_to_users(self, data):
        userGroup = data.get('userGroup')
        user = self.scope["user"]
        if not user.is_authenticated or (userGroup == 'adminUsers' and not user.is_staff) or \
           (userGroup == 'nonAdminUsers' and user.is_staff):
            return

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'broadcast_message',
                'message': data
            }
        )


    async def send_message_to_campaigns(self, data):
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'broadcast_message',
                'message': data
            }
        )

    async def send_message_to_elections(self, data):
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'broadcast_message',
                'message': data
            }
        )

    async def broadcast_message(self, event):
        await self.send(text_data=json.dumps(event['message']))