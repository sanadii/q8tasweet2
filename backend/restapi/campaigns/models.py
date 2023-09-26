# Categories Model
from django.db import models
from django.utils import timezone
from django.core.validators import RegexValidator
from ..modelsHelper import *

class Campaigns(models.Model):
    # Basic Information
    id = models.BigAutoField(primary_key=True)
    election_candidate = models.ForeignKey('ElectionCandidates', on_delete=models.SET_NULL, null=True, blank=True)
    title = models.CharField(max_length=255, blank=False, null=False)
    description = models.TextField(blank=True, null=True)

    # logo = models.ImageField(upload_to="campaigns/", blank=True, null=True)
    banner = models.ImageField(upload_to="campaigns/", blank=True, null=True)
    # video = models.FileField(upload_to='campaign/videos/', blank=True, null=True)

    # Contacts
    twitter = models.CharField(max_length=120, blank=True, null=True)
    instagram = models.CharField(max_length=120, blank=True, null=True)
    website = models.URLField(max_length=120, blank=True, null=True)

    # Activities
    target_score = models.PositiveIntegerField(blank=True, null=True)
    results = models.IntegerField(blank=True, null=True)
    events = models.PositiveIntegerField(blank=True, null=True)
    media_coverage = models.PositiveIntegerField(blank=True, null=True)


    # Administration
    moderators = models.CharField(max_length=255, blank=True, null=True)
    status = models.IntegerField(blank=True, null=True)
    priority = models.IntegerField(blank=True, null=True)

    # Tracking Information
    created_by = models.ForeignKey('User', on_delete=models.SET_NULL, null=True, blank=True, related_name='created_campaigns')
    updated_by = models.ForeignKey('User', on_delete=models.SET_NULL, null=True, blank=True, related_name='updated_campaigns')
    deleted_by = models.ForeignKey('User', on_delete=models.SET_NULL, null=True, blank=True, related_name='deleted_campaigns')
    created_date = models.DateTimeField(auto_now_add=True, null=False)
    updated_date = models.DateTimeField(auto_now=True, null=False)
    deleted_date = models.DateTimeField(auto_now=True, null=False)
    deleted = models.BooleanField(default=False, null=True)

    class Meta:
        db_table = "campaign"
        verbose_name = "Campaign"
        verbose_name_plural = "Campaigns"

    def __str__(self):
        return f"{self.election_candidate.candidate.name} - {self.title}"  # Assuming the candidate's name is accessible through the relation


civil_validator = RegexValidator(regex=r'^\d{12}$', message="Civil must be exactly 12 digits.")
mobile_validator = RegexValidator(regex=r'^\d{8}$', message="Mobile must be exactly 8 digits.")

class CampaignMembers(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey('User', on_delete=models.SET_NULL, null=True, blank=True, related_name='campaign_members')
    campaign = models.ForeignKey('Campaigns', on_delete=models.SET_NULL, null=True, blank=True, related_name='campaign_members')
    rank = models.IntegerField(choices=Rank.choices, blank=True, null=True)
    supervisor = models.ForeignKey('CampaignMembers', on_delete=models.SET_NULL, null=True, blank=True, related_name='supervised_members')
    committee = models.ForeignKey('ElectionCommittees', on_delete=models.SET_NULL, null=True, blank=True, related_name='members')
    civil = models.CharField(max_length=12, blank=True, null=True, validators=[civil_validator])
    mobile = models.CharField(max_length=8, blank=True, null=True, validators=[mobile_validator])
    notes = models.TextField(blank=True, null=True)
    status = models.IntegerField(blank=True, null=True)

    # Tracking Information
    created_by = models.ForeignKey('User', on_delete=models.SET_NULL, null=True, blank=True, related_name='created_campaign_members')
    updated_by = models.ForeignKey('User', on_delete=models.SET_NULL, null=True, blank=True, related_name='updated_campaign_members')
    deleted_by = models.ForeignKey('User', on_delete=models.SET_NULL, null=True, blank=True, related_name='deleted_campaign_members')
    created_date = models.DateTimeField(auto_now_add=True, null=False)
    updated_date = models.DateTimeField(auto_now=True, null=False)
    deleted_date = models.DateTimeField(auto_now=True, null=False)
    deleted = models.BooleanField(default=False, null=True)
   
    class Meta:
        # managed = False
        db_table = 'campaign_member'
        verbose_name = "Campaign Member"
        verbose_name_plural = "Campaign Members"

class CampaignGuarantees(models.Model):
    id = models.BigAutoField(primary_key=True)
    campaign = models.ForeignKey('Campaigns', on_delete=models.SET_NULL, null=True, blank=True, related_name='guarantee_campaigns')
    member = models.ForeignKey('CampaignMembers', on_delete=models.SET_NULL, null=True, blank=True, related_name='guarantee_members')
    civil = models.ForeignKey('Electors', on_delete=models.SET_NULL, null=True, blank=True, related_name='campaign_guarantees')
    mobile = models.CharField(max_length=8, blank=True, null=True)  # or any other field type suitable for your requirements
    notes = models.TextField(blank=True, null=True)
    status = models.IntegerField(choices=GuaranteeStatus.choices, default=GuaranteeStatus.NEW)

    # Tracking Information
    created_by = models.ForeignKey('User', on_delete=models.SET_NULL, null=True, blank=True, related_name='created_guarantee_members')
    updated_by = models.ForeignKey('User', on_delete=models.SET_NULL, null=True, blank=True, related_name='updated_guarantee_members')
    deleted_by = models.ForeignKey('User', on_delete=models.SET_NULL, null=True, blank=True, related_name='deleted_guarantee_members')
    created_date = models.DateTimeField(auto_now_add=True, null=False)
    updated_date = models.DateTimeField(auto_now=True, null=False)
    deleted_date = models.DateTimeField(auto_now=True, null=False)
    deleted = models.BooleanField(default=False, null=True)

    class Meta:
        # managed = False
        db_table = 'campaign_guarantee'
        verbose_name = "Campaign Guarantee"
        verbose_name_plural = "Campaign Guarantees"
    

class ElectionAttendees(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey('User', on_delete=models.SET_NULL, null=True, blank=True, related_name='attendee_users')
    election = models.ForeignKey('Elections', on_delete=models.SET_NULL, null=True, blank=True, related_name='attendee_elections')
    committee = models.ForeignKey('ElectionCommittees', on_delete=models.SET_NULL, null=True, blank=True, related_name='attendee_election_committees')
    elector = models.ForeignKey('Electors', on_delete=models.SET_NULL, null=True, blank=True, related_name='electionAttendees')
    notes = models.TextField(blank=True, null=True)
    status = models.IntegerField(blank=True, null=True)

    # Tracking Information
    created_by = models.ForeignKey('User', on_delete=models.SET_NULL, null=True, blank=True, related_name='created_guarantee_users')
    updated_by = models.ForeignKey('User', on_delete=models.SET_NULL, null=True, blank=True, related_name='updated_guarantee_users')
    deleted_by = models.ForeignKey('User', on_delete=models.SET_NULL, null=True, blank=True, related_name='deleted_guarantee_users')
    created_date = models.DateTimeField(auto_now_add=True, null=False)
    updated_date = models.DateTimeField(auto_now=True, null=False)
    deleted_date = models.DateTimeField(auto_now=True, null=False)
    deleted = models.BooleanField(default=False, null=True)

    class Meta:
        # managed = False
        db_table = 'election_attendee'
        verbose_name = "Election Attendee"
        verbose_name_plural = "Election Attendees"
