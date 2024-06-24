import json

from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.utils.timesince import timesince

from apps.auths.models import User
from apps.campaigns.models import Campaign, SortingCampaign

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope['user']  # Assuming user is authenticated
        await self.accept()

    async def disconnect(self, close_code):
        # Handle disconnection
        pass

    async def receive(self, text_data):
        # Handle notification-related messages here
        # Example: sending notifications to a specific user
        pass

    # Define message sending methods as needed
