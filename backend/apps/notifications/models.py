from django.db import models
from apps.configs.models import TrackModel
from apps.campaigns.models import Campaign, CampaignParty
from apps.elections.models import Election

USER_GROUP_CHOICES = [
    ('allUsers', 'All Users'),
    ('adminUsers', 'Admin Users'),
    ('nonAdminUsers', 'Non Admin Users'),
    ('registeredUsers', 'Registered Users'),
]

MESSAGE_TYPE_CHOICES = [
    ('info', 'Info'),
    ('warning', 'Warning'),
    ('danger', 'Danger'),
    ('success', 'Success'),
]

class BaseNotification(TrackModel):
    message_type = models.CharField(max_length=50, choices=MESSAGE_TYPE_CHOICES)
    message = models.TextField()

    class Meta:
        abstract = True  # Mark as an abstract base model

class ElectionNotification(BaseNotification):
    election = models.ForeignKey(Election, on_delete=models.SET_NULL, null=True, blank=True, related_name="notification_elections")

    class Meta:
        # managed = False
        db_table = "election_notification"
        verbose_name = "Election Notification"
        verbose_name_plural = "Election Notifications"
        default_permissions = []
        permissions  = []

    def __str__(self):
        return f"{self.message}"
    
class CampaignNotification(BaseNotification):
    campaign = models.ForeignKey(Campaign, on_delete=models.SET_NULL, null=True, blank=True, related_name="notification_campaigns")

    class Meta:
        db_table = "campaign_notification"
        verbose_name = "Campaign Notification"
        verbose_name_plural = "Campaign Notifications"
        default_permissions = []
        permissions = []

    def __str__(self):
        return f"{self.message}"

class CampaignPartyNotification(BaseNotification):
    campaign = models.ForeignKey(CampaignParty, on_delete=models.SET_NULL, null=True, blank=True, related_name="notification_campaign_partiess")

    class Meta:
        db_table = "campaign_party_notification"
        verbose_name = "Campaign Party Notification"
        verbose_name_plural = "Campaign Party Notifications"
        default_permissions = []
        permissions = []

    def __str__(self):
        return f"{self.message}"

class UserNotification(BaseNotification):
    user_group = models.CharField(max_length=50, choices=USER_GROUP_CHOICES)

    class Meta:
        db_table = "user_notification"
        verbose_name = "User Notification"
        verbose_name_plural = "User Notifications"
        default_permissions = []
        permissions = []

    def __str__(self):
        return f"{self.message}"
