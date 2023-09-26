# Categories Model
from django.db import models
from django.utils import timezone
from django.core.validators import RegexValidator
from .modelsHelper import *

class CampaignGuarantees(models.Model):
    id = models.BigAutoField(primary_key=True)
    campaign = models.ForeignKey('Campaigns', on_delete=models.SET_NULL, null=True, blank=True, related_name='guarantee_campaigns')
    member = models.ForeignKey('CampaignMembers', on_delete=models.SET_NULL, null=True, blank=True, related_name='guarantee_members')
    civil = models.ForeignKey('Electors', on_delete=models.SET_NULL, null=True, blank=True, related_name='campaign_guarantees')
    mobile = models.CharField(max_length=8, blank=True, null=True)  # or any other field type suitable for your requirements
    notes = models.TextField(blank=True, null=True)
    status = models.IntegerField(choices=GuaranteeStatus.choices, default=GuaranteeStatus.NEW)

    # Tracking Information
    created_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='created_guarantee_members')
    updated_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='updated_guarantee_members')
    deleted_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='deleted_guarantee_members')
    created_date = models.DateTimeField(auto_now_add=True, null=False)
    updated_date = models.DateTimeField(auto_now=True, null=False)
    deleted_date = models.DateTimeField(auto_now=True, null=False)
    deleted = models.BooleanField(default=False, null=True)

    class Meta:
        # managed = False
        db_table = 'campaign_guarantee'
        verbose_name = "Campaign Guarantee"
        verbose_name_plural = "Campaign Guarantees"
    