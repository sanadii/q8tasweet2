import json
from channels.generic.websocket import AsyncWebsocketConsumer
from enum import Enum
from urllib.parse import parse_qs


class DataType(Enum):
    NOTIFICATION = 'notification'
    ELECTION_SORT = 'electionSort'
    CAMPAIGN_UPDATE = 'campaignUpdate'
    CHAT = 'Chat'
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

        # Join the room group
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
        required_fields = ['channel', 'group', 'dataType', 'messageStyle', 'message']
        return all(field in data for field in required_fields)


    async def process_message(self, data):

        # Handeling messages based on user role
        group_value = data.get('group')
        user = self.scope["user"]

        print(f"User: {user}, Authenticated: {user.is_authenticated}, Is Staff: {user.is_staff}")

        if not user.is_authenticated:
            return  # Handle unauthenticated user

        # Validate the group value
        try:
            group_enum = Group[group_value]
        except KeyError:
            print(f"Invalid group: {group_value}")
            return

        if group_enum == Group.NON_ADMIN_USERS and user.is_staff:
            return  # Do not send to admin users

        # Handeling Event
        event = {
            'type': 'send_message',
            'channel': data['channel'],
            'group': data['group'],
            'message': data['message'],
            'messageStyle': data['messageStyle'],
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



    async def send_message(self, event):
        print(f"Sending Message: {event}")
        # Additional conditions can be added here if needed
        await self.send(text_data=json.dumps({
            'channel': event['channel'],
            'group': event['group'],
            'message': event['message'],
            'messageStyle': event['messageStyle'],
            'dataType': event['dataType'],
        }))

    # async def send_message(self, event):
    #     # Only proceed if the channel type is 'Client' and the data type is one of the specified ones
    #     if self.channel_type == 'Client' and event['dataType'] in ['chat']:
    #         return  # Stop processing further if the message is sent to the 'Client' channel

    #     if event['dataType'] in ['notification']:
    #         await self.send(text_data=json.dumps({
    #             'channel': event['channel'],
    #             'message': event['message'],
    #             'messageStyle': event['messageStyle'],
    #             'dataType': event['dataType'],
    #         }))
    #         return

    #     if event['dataType'] in ['electionSort']:
    #         await self.send(text_data=json.dumps({
    #             'channel': event['channel'],
    #             'message': event['message'],
    #             'messageStyle': event['messageStyle'],
    #             'dataType': event['dataType'],
    #         }))
    #         return  # Stop processing further if the message is sent to the 'Client' channel
        
    #     if event['dataType'] in ['campaignUpdate']:
    #         await self.send(text_data=json.dumps({
    #             'channel': event['channel'],
    #             'message': event['message'],
    #             'messageStyle': event['messageStyle'],
    #             'dataType': event['dataType'],
    #         }))
    #         return  # Stop processing further if the message is sent to the 'Client' channel
        

    #     # For other channel types or data types, do not send the message
    #     # You can add more logic here if needed for other channels


