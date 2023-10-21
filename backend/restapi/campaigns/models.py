# restapi/campaigns/models
from django.db import models
from django.contrib.auth.models import Group
from restapi.helper.models_helper import TrackModel, TaskModel, GuaranteeStatusOptions
from restapi.helper.validators import civil_validator, phone_validator

class Campaign(TrackModel, TaskModel):
    # Basic Information
    election_candidate = models.ForeignKey('ElectionCandidate', on_delete=models.SET_NULL, null=True, blank=True, related_name='candidate_campaigns')
    description = models.TextField(blank=True, null=True)
    target_votes = models.PositiveIntegerField(blank=True, null=True)

    # Media Coverage
    twitter = models.CharField(max_length=120, blank=True, null=True)
    instagram = models.CharField(max_length=120, blank=True, null=True)
    website = models.CharField(max_length=120, blank=True, null=True)

    # Activities

    class Meta:
        db_table = "campaign"
        verbose_name = "Campaign"
        verbose_name_plural = "Campaign"
        default_permissions = []
        permissions  = [
            ("canViewCampaign", "Can View Campaign"),
            ("canAddCampaign", "Can Add Campaign"),
            ("canChangeCampaign", "Can Change Campaign"),
            ("canDeleteCampaign", "Can Delete Campaign"),
            ("canChangeCampaignModerator", "can Change Campaign Moderator"),
            ("canChangeCampaignCandidate", "can Change Campaign Candidate"),
            ("canChangeCampaignManager", "can Change Campaign Manager"),
            ("canChangeCampaignAssistant", "can Change Campaign Assistant"),
            ]
    def __str__(self):
        return f"{self.election_candidate.candidate.name} - Year"  # Assuming the candidate's name is accessible through the relation

class CampaignProfile(TrackModel, TaskModel):
    campaign = models.OneToOneField('Campaign', on_delete=models.SET_NULL, null=True, blank=True, related_name="profile_campaigns")

    class Meta:
        db_table = 'campaign_profile'
        verbose_name = "Campaign Profile"
        verbose_name_plural = "Campaign Profiles"
        default_permissions = []

class CampaignMember(TrackModel):
    user = models.ForeignKey('User', on_delete=models.SET_NULL, null=True, blank=True, related_name='memberships')
    campaign = models.ForeignKey('Campaign', on_delete=models.SET_NULL, null=True, blank=True, related_name='campaign_members')
    role = models.ForeignKey(Group, on_delete=models.SET_NULL, null=True, blank=True, related_name='campaign_role_members')
    supervisor = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='supervised_members')
    committee = models.ForeignKey('ElectionCommittee', on_delete=models.SET_NULL, null=True, blank=True, related_name='committee_members')
    civil = models.CharField(max_length=12, blank=True, null=True, validators=[civil_validator])
    phone = models.CharField(max_length=8, blank=True, null=True, validators=[phone_validator])
    notes = models.TextField(blank=True, null=True)
    status = models.IntegerField(choices=GuaranteeStatusOptions.choices, blank=True, null=True)
   
    class Meta:
        db_table = 'campaign_member'
        verbose_name = "Campaign Member"
        verbose_name_plural = "Campaign Members"
        default_permissions = []
        permissions  = [
            ("canViewCampaignMember", "Can View Test Now"),
            ("canAddCampaignMember", "Can Add Test Now"),
            ("canChangeCampaignMember", "Can Change Test Now"),
            ("canDeleteCampaignMember", "Can Delete Test Now"),
            ]
        
class CampaignGuarantee(TrackModel):
    campaign = models.ForeignKey('Campaign', on_delete=models.SET_NULL, null=True, blank=True, related_name='campaign_guarantees')
    member = models.ForeignKey('CampaignMember', on_delete=models.SET_NULL, null=True, blank=True, related_name='guarantee_guarantors')
    civil = models.ForeignKey('Elector', on_delete=models.SET_NULL, null=True, blank=True, related_name='elector_guarantees')
    phone = models.CharField(max_length=8, blank=True, null=True)  # or any other field type suitable for your requirements
    notes = models.TextField(blank=True, null=True)
    status = models.IntegerField(choices=GuaranteeStatusOptions.choices, blank=True, null=True)

    class Meta:
        db_table = 'campaign_guarantee'
        verbose_name = "Campaign Guarantee"
        verbose_name_plural = "Campaign Guarantees"
        default_permissions = []
        permissions  = [
            ("canViewCampaignGuarantee", "Can View Campaign Guarantee"),
            ("canAddCampaignGuarantee", "Can Add Campaign Guarantee"),
            ("canChangeCampaignGuarantee", "Can Change Campaign Guarantee"),
            ("canDeleteCampaignGuarantee", "Can Delete Campaign Guarantee"),
            ]

class CampaignAttendee(TrackModel):
    user = models.ForeignKey('User', on_delete=models.SET_NULL, null=True, blank=True, related_name='attendant_attendees')
    election = models.ForeignKey('Election', on_delete=models.SET_NULL, null=True, blank=True, related_name='election_attendees')
    committee = models.ForeignKey('ElectionCommittee', on_delete=models.SET_NULL, null=True, blank=True, related_name='committee_attendees')
    civil = models.ForeignKey('Elector', on_delete=models.SET_NULL, null=True, blank=True, related_name='elector_attendees')
    notes = models.TextField(blank=True, null=True)
    status = models.IntegerField(blank=True, null=True)

    class Meta:
        db_table = 'campaign_attendee'
        verbose_name = "Campaign Attendee"
        verbose_name_plural = "Campaign Attendees"
        default_permissions = []
        permissions  = [
            ("canViewCampaignAttendee", "Can View Campaign Attendee"),
            ("canAddCampaignAttendee", "Can Add Campaign Attendee"),
            ("canChangeCampaignAttendee", "Can Change Campaign Attendee"),
            ("canDeleteCampaignAttendee", "Can Delete Campaign Attendee"),
            ]
        

# ElectionParty

# class Party(TrackModel):
#     # name = models.CharField(max_length=255, blank=False, null=False)
#     # image = models.ImageField(upload_to="parties/", blank=True, null=True)
#     # tags = models.CharField(max_length=255, blank=True, null=True)

#     class Meta:
#         db_table = 'party'
#         verbose_name = "Party"
#         verbose_name_plural = "Parties"
#         default_permissions = []
#         permissions  = [
#             ("canViewParty", "Can View Party"),
#             ("canAddParty", "Can Add Party"),
#             ("canChangeParty", "Can Change Party"),
#             ("canDeleteParty", "Can Delete Party"),
#             ]
        

# class CampaignParty(TrackModel):
#     # campaign = models.ForeignKey('User', on_delete=models.SET_NULL, null=True, blank=True, related_name='attendant_attendees')
#     # election_party = models.ForeignKey('Election', on_delete=models.SET_NULL, null=True, blank=True, related_name='election_attendees')

#     class Meta:
#         db_table = 'campaign_party'
#         verbose_name = "Campaign Party"
#         verbose_name_plural = "Campaign Parties"
#         default_permissions = []
#         permissions  = [
#             ("canViewCampaignParty", "Can View Campaign Party"),
#             ("canAddCampaignParty", "Can Add Campaign Party"),
#             ("canChangeCampaignParty", "Can Change Campaign Party"),
#             ("canDeleteCampaignParty", "Can Delete Campaign Party"),
#             ]

