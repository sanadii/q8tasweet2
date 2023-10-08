# restapi/campaigns/models
from django.db import models
from django.contrib.auth.models import Group
from django.utils import timezone
from django.core.validators import RegexValidator
from restapi.helper.models_helper import TrackModel, TaskModel, RankOptions, StatusOptions, GuaranteeStatusOptions, PriorityOptions
from restapi.helper.validators import civil_validator, phone_validator, today

class Campaigns(TrackModel, TaskModel):
    # Basic Information
    election_candidate = models.ForeignKey('ElectionCandidates', on_delete=models.SET_NULL, null=True, blank=True, related_name='candidate_campaigns')
    description = models.TextField(blank=True, null=True)

    # Media Coverage
    twitter = models.CharField(max_length=120, blank=True, null=True)
    instagram = models.CharField(max_length=120, blank=True, null=True)
    website = models.URLField(max_length=120, blank=True, null=True)

    # Activities
    target_votes = models.PositiveIntegerField(blank=True, null=True)

    class Meta:
        db_table = "campaign"
        verbose_name = "Campaign"
        verbose_name_plural = "Campaigns"

    def __str__(self):
        return f"{self.election_candidate.candidate.name} - Year"  # Assuming the candidate's name is accessible through the relation

class CampaignMembers(TrackModel):
    user = models.ForeignKey('User', on_delete=models.SET_NULL, null=True, blank=True, related_name='campaign_users')
    campaign = models.ForeignKey('Campaigns', on_delete=models.SET_NULL, null=True, blank=True, related_name='campaign_members')
    rank = models.ForeignKey(Group, on_delete=models.SET_NULL, null=True, blank=True, related_name='campaign_members_by_rank')
    supervisor = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='campaign_supervisors')
    committee = models.ForeignKey('ElectionCommittees', on_delete=models.SET_NULL, null=True, blank=True, related_name='committee_members')
    civil = models.CharField(max_length=12, blank=True, null=True, validators=[civil_validator])
    phone = models.CharField(max_length=8, blank=True, null=True, validators=[phone_validator])
    notes = models.TextField(blank=True, null=True)
    status = models.IntegerField(choices=GuaranteeStatusOptions.choices, blank=True, null=True)
   
    class Meta:
        db_table = 'campaign_member'
        verbose_name = "Campaign Member"
        verbose_name_plural = "Campaign Members"

class CampaignGuarantees(TrackModel):
    campaign = models.ForeignKey('Campaigns', on_delete=models.SET_NULL, null=True, blank=True, related_name='campaign_guarantees')
    member = models.ForeignKey('CampaignMembers', on_delete=models.SET_NULL, null=True, blank=True, related_name='member_guarantees')
    civil = models.ForeignKey('Electors', on_delete=models.SET_NULL, null=True, blank=True, related_name='civil_guarantees')
    phone = models.CharField(max_length=8, blank=True, null=True)  # or any other field type suitable for your requirements
    notes = models.TextField(blank=True, null=True)
    status = models.IntegerField(choices=GuaranteeStatusOptions.choices, blank=True, null=True)

    class Meta:
        db_table = 'campaign_guarantee'
        verbose_name = "Campaign Guarantee"
        verbose_name_plural = "Campaign Guarantees"
    

class CampaignAttendees(TrackModel):
    user = models.ForeignKey('User', on_delete=models.SET_NULL, null=True, blank=True, related_name='attendant_elections')
    election = models.ForeignKey('Elections', on_delete=models.SET_NULL, null=True, blank=True, related_name='Campaign_attendees')
    committee = models.ForeignKey('ElectionCommittees', on_delete=models.SET_NULL, null=True, blank=True, related_name='committee_attendees')
    elector = models.ForeignKey('Electors', on_delete=models.SET_NULL, null=True, blank=True, related_name='elector_attendees')
    notes = models.TextField(blank=True, null=True)
    status = models.IntegerField(blank=True, null=True)

    class Meta:
        db_table = 'Campaign_attendee'
        verbose_name = "Campaign Attendee"
        verbose_name_plural = "Campaign Attendees"
