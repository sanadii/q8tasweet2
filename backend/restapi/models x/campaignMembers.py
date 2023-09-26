# Categories Model
from django.db import models
from django.utils import timezone
from django.core.validators import RegexValidator
from .modelsHelper import *

civil_validator = RegexValidator(regex=r'^\d{12}$', message="Civil must be exactly 12 digits.")
mobile_validator = RegexValidator(regex=r'^\d{8}$', message="Mobile must be exactly 8 digits.")

class CampaignMembers(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='campaign_members')
    campaign = models.ForeignKey('Campaigns', on_delete=models.SET_NULL, null=True, blank=True, related_name='campaign_members')
    rank = models.IntegerField(choices=Rank.choices, blank=True, null=True)
    supervisor = models.ForeignKey('CampaignMembers', on_delete=models.SET_NULL, null=True, blank=True, related_name='supervised_members')
    committee = models.ForeignKey('ElectionCommittees', on_delete=models.SET_NULL, null=True, blank=True, related_name='members')
    civil = models.CharField(max_length=12, blank=True, null=True, validators=[civil_validator])
    mobile = models.CharField(max_length=8, blank=True, null=True, validators=[mobile_validator])
    notes = models.TextField(blank=True, null=True)
    status = models.IntegerField(blank=True, null=True)

    # Tracking Information
    created_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='created_campaign_members')
    updated_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='updated_campaign_members')
    deleted_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='deleted_campaign_members')
    created_date = models.DateTimeField(auto_now_add=True, null=False)
    updated_date = models.DateTimeField(auto_now=True, null=False)
    deleted_date = models.DateTimeField(auto_now=True, null=False)
    deleted = models.BooleanField(default=False, null=True)
   
    class Meta:
        # managed = False
        db_table = 'campaign_member'
        verbose_name = "Campaign Member"
        verbose_name_plural = "Campaign Members"
