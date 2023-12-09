import json
from channels.generic.websocket import AsyncWebsocketConsumer

class GlobalConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Extract the channel type from the URL route
        self.channel_type = self.scope['url_route']['kwargs'].get('type', 'default')
        self.room_group_name = f'global_channel_{self.channel_type}'

        # Join the room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        # Leave the room group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        # Load the received message
        text_data_json = json.loads(text_data)
        channel = text_data_json.get('channel', 'public')
        data_type = text_data_json.get('dataType', 'default')
        message = text_data_json.get('message', '')

        # Build the event for the group send
        event = {
            'type': 'broadcast_message',
            'message': message,
            'channel': channel,
            'dataType': data_type,
        }

        # Send message to the room group
        await self.channel_layer.group_send(self.room_group_name, event)

        # Send to a specific channel group if different
        specific_room_group_name = f'global_channel_{channel}'
        if specific_room_group_name != self.room_group_name:
            await self.channel_layer.group_send(specific_room_group_name, event)

    async def broadcast_message(self, event):
        # Send a message to WebSocket
        try:
            await self.send(text_data=json.dumps({
                'channel': event['channel'],
                'message': event['message'],
                'dataType': event['dataType'],
            }))
        except Exception as e:
            # Handle errors (e.g., connection issues)
            print(f"Error sending message: {e}")
