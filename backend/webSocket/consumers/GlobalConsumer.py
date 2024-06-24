import json
from channels.generic.websocket import AsyncWebsocketConsumer
from enum import Enum
from urllib.parse import parse_qs
from apps.campaigns.models import Campaign
from apps.notifications.models import NotificationUser, NotificationCampaign, NotificationElection
from asgiref.sync import sync_to_async


class DataType(Enum):
    NOTIFICATION = 'notification'
    ELECTION_SORT = 'electionSorting'
    CAMPAIGN_UPDATE = 'campaignUpdate'
    CHAT = 'chat'
    # Add more as needed

class GlobalConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # self.user = self.scope["user"]
        self.channel_type = self.scope['url_route']['kwargs'].get('type', 'default')
        self.room_group_name = f'global_channel_{self.channel_type}'

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        # if self.is_valid_message(data):
        await self.process_message(data)

    # def is_valid_message(self, data):
    #     required_fields = ['dataType', 'dataGroup', 'messageType', 'message']
    #     return all(field in data for field in required_fields)

    async def process_message(self, data):
        dataGroup = data.get('dataGroup')
        channel = data.get('channel')
        
        if dataGroup == "users":
            await self.send_notification_to_users(data)

        if dataGroup == 'campaigns':
            await self.send_notification_to_campaigns(data)
        
        elif dataGroup == 'elections':
            await self.send_notification_to_elections(data)
        
        elif channel == 'campaign':
            await self.handle_campaign_message(data)
        
        else:
            print(f"Invalid group or channel: {dataGroup}, {channel}")


    async def handle_campaign_message(self, data):
        if data['dataType'] == 'electionSorting':
            # Process election sorting data from campaign
            # For example, saving to database or notifying users
            print(f"GlobalConsumer: Processing election sorting message from CampaignConsumer: {data}")
            # Your processing logic here
            pass

    def save_notification(self, data):
        notification = NotificationUser(
            user_group=data.get('userGroup'),
            message_type=data.get('messageType'),
            message=data.get('message')
        )
        notification.save()


    async def send_notification_to_users(self, data):
        userGroup = data.get('userGroup')
        # user = self.scope["user"]
        # if not user.is_authenticated or (userGroup == 'adminUsers' and not user.is_staff) or \
        #    (userGroup == 'nonAdminUsers' and user.is_staff):
            # return

        # Use sync_to_async to save the notification
        await sync_to_async(self.save_notification)(data)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'broadcast_message',
                'message': data
            }
        )

    async def send_notification_to_campaigns(self, data):
        campaign_slug = data.get('campaign')
        if campaign_slug:
            campaign_room_group_name = f'campaign_{campaign_slug}'
            await self.channel_layer.group_send(
                campaign_room_group_name,
                {
                    'type': 'campaign_message',
                    'message': data
                }
            )

            # Save the campaign notification
            await sync_to_async(self.save_campaign_notification)(data, campaign_slug)

        # Also send to the global channel
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'broadcast_message',
                'message': data
            }
        )
        

    async def send_notification_to_elections(self, data):
        election_id = data.get('election')
        if election_id:
            # Save the election notification
            await sync_to_async(self.save_election_notification)(data)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'broadcast_message',
                'message': data
            }
        )

    def save_campaign_notification(self, data, campaign_slug):
        try:
            campaign = Campaign.objects.get(slug=campaign_slug)
            campaign_notification = NotificationCampaign(
                campaign=campaign,
                message_type=data.get('messageType'),
                message=data.get('message')
            )
            campaign_notification.save()
        except Campaign.DoesNotExist:
            print(f"Campaign with slug '{campaign_slug}' does not exist.")

    def save_election_notification(self, data):
        election_notification = NotificationElection(
            election_id=data.get('election'),
            message_type=data.get('messageType'),
            message=data.get('message')
        )
        election_notification.save()

    async def broadcast_message(self, event):
        response_message = json.dumps(event['message'])
        await self.send(text_data=response_message)
        print(f"GlobalConsumer: Received electionSorting message from CampaignConsumer: {response_message}")

