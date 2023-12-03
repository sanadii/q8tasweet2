import json

from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.utils.timesince import timesince

from apps.auths.models import User
from apps.campaigns.models import Campaign, CampaignSorting


class ElectionConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.election_slug = self.scope['url_route']['kwargs']['slug']
        self.room_group_name = f'election_{self.election_slug}'
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        # Leave election group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        # Handle election-related messages here
        # Example: vote updates, election status changes, etc.
        pass

    # Define message sending methods as needed
