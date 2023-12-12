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

class Group(Enum):
    ALL_USERS = 'allUsers'
    ADMIN_USERS = 'adminUsers'
    NON_ADMIN_USERS = 'nonAdminUsers'
    REGISTERED_USERS = 'registeredUsers'
    CAMPAIGNS = 'campaigns'
    # Add more groups as needed


class GlobalConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # To access the user
        user = self.scope["user"]
        print("user:", user)
        print("self.scope:", self.scope)

        # Extract the channel type from the URL route kwargs
        self.channel_type = self.scope['url_route']['kwargs'].get('type', 'default')
        self.room_group_name = f'global_channel_{self.channel_type}'

        # Join the room notificationGroup
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()


    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)


    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            print("Received data:", data)  # Add this line for debugging
        except json.JSONDecodeError:
            print("Invalid JSON received")
            return  # Or handle as needed

        if not self.is_valid_message(data):
            print("Invalid message format")
            return  # Or handle as needed

        await self.process_message(data)


    def is_valid_message(self, data):
        required_fields = ['channel', 'dataType', 'notificationGroup', 'messageType', 'message']
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


    async def send_message_to_users(self, event, data):
        # Check if the user is authenticated
        userGroup = data.get('userGroup')

        user = self.scope["user"]
        if not user.is_authenticated:
            return

        # Check for specific notificationGroup values
        if (userGroup == 'adminUsers' and not user.is_staff) or \
           (userGroup == 'nonAdminUsers' and user.is_staff):
            return  # Do not send to non-admin users if 'adminUsers' and vice versa

        # Check for 'registeredUsers' notificationGroup
        if userGroup == 'registeredUsers' and not user.is_authenticated:
            return  # Do not send to unregistered users

        # Logic to send to specific campaign
        if data['notificationGroup'] == 'campaigns':
            campaign_slug = data.get('campaign')  # Assuming campaignSlug is passed in the message
            campaign_room_group_name = f'campaign_{campaign_slug}'

            await self.channel_layer.group_send(
                campaign_room_group_name,
                {
                    'type': 'send_campaign_message',
                    'dataType': data['dataType'],
                    'messageType': data['messageType'],
                    'message': data['message'],
                }
            )

        # Check for 'allUsers' notificationGroup
        if userGroup == 'allUsers':
            # This notificationGroup includes all users, so no additional checks are needed
            pass

        # Handeling Event
        event = {
            'type': 'send_message_to_users',
            'channel': data['channel'],
            'notificationGroup': data['notificationGroup'],
            'message': data['message'],
            'messageType': data['messageType'],
            'dataType': data['dataType'],
        }
        print(f"Sending Event: {event}")
        await self.channel_layer.group_send(self.room_group_name, event)

        # Additional logic for client channel
        if self.channel_type == 'Client' and data['dataType'] not in ['chat']:
            client_room_group_name = 'global_channel_Client'
            print(f"Sending to Client Group: {client_room_group_name}")
            await self.channel_layer.group_send(client_room_group_name, event)


        if data['dataType'] in [
            DataType.NOTIFICATION.value,
            DataType.ELECTION_SORT.value,
            DataType.CAMPAIGN_UPDATE.value
            ]:

            client_room_group_name = 'global_channel_Client'
            await self.channel_layer.group_send(client_room_group_name, event)




        print(f"Sending Message: {event}")
        # Additional conditions can be added here if needed
        await self.send(text_data=json.dumps({
            'channel': event['channel'],
            'message': event['message'],
            'messageType': event['messageType'],
            'dataType': event['dataType'],
        }))


    async def send_message_to_campaigns(self, event):
        print(f"Sending Message: {event}")
        # Additional conditions can be added here if needed
        await self.send(text_data=json.dumps({
            'channel': event['channel'],
            'campaign': event['campaign'],
            'message': event['message'],
            'messageType': event['messageType'],
            'dataType': event['dataType'],
        }))


    async def send_message_to_elections(self, event):
        print(f"Sending Message: {event}")
        # Additional conditions can be added here if needed
        await self.send(text_data=json.dumps({
            'channel': event['channel'],
            'election': event['election'],
            'message': event['message'],
            'messageType': event['messageType'],
            'dataType': event['dataType'],
        }))  

