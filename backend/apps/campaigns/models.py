# campaigns/models
from django.db import models
from django_extensions.db.fields import AutoSlugField
from django.utils.text import slugify
import uuid

from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

from apps.settings.models import TrackModel, TaskModel

class Campaign(TrackModel, TaskModel):
    # Basic Information
    slug = models.SlugField(max_length=255, unique=True, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    target_votes = models.PositiveIntegerField(blank=True, null=True)

    # Relationships
    campaign_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    campaigner_id = models.PositiveIntegerField()
    content_object = GenericForeignKey("campaign_type", "campaigner_id")

    # Media Coverage
    twitter = models.CharField(max_length=120, blank=True, null=True)
    instagram = models.CharField(max_length=120, blank=True, null=True)
    website = models.CharField(max_length=120, blank=True, null=True)

    class Meta:
        db_table = "campaign"
        verbose_name = "Campaign"
        verbose_name_plural = "Campaign"
        default_permissions = []
        permissions = [
            ("canViewCampaign", "Can View Campaign"),
            ("canAddCampaign", "Can Add Campaign"),
            ("canChangeCampaign", "Can Change Campaign"),
            ("canDeleteCampaign", "Can Delete Campaign"),
            # TODO:
            ("canChangeCampaignModerator", "can Change Campaign Moderator"),
            ("canChangeCampaignCandidate", "can Change Campaign Candidate"),
            ("canChangeCampaignManager", "can Change Campaign Manager"),
            ("canChangeCampaignAssistant", "can Change Campaign Assistant"),
        ]
        unique_together = ["campaign_type", "campaigner_id"]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = uuid.uuid4().hex[:8].upper()

        # Debugging before saving
        print(f"Before save: campaign_type={self.campaign_type}, campaigner_id={self.campaigner_id}, content_object={self.content_object}")

        super().save(*args, **kwargs)  # Call the "real" save() method

        # Debugging after saving
        print(f"After save: campaign_type={self.campaign_type}, campaigner_id={self.campaigner_id}, content_object={self.content_object}")




# class CampaignProfile(TrackModel, TaskModel):
#     campaign = models.OneToOneField('Campaign', on_delete=models.SET_NULL, null=True, blank=True, related_name="profile_campaigns")

#     class Meta:
#         db_table = 'campaign_profile'
#         verbose_name = "Campaign Profile"
#         verbose_name_plural = "Campaign Profiles"
#         default_permissions = []

# class CampaignCommittee(TrackModel):
#     campaign = models.ForeignKey('Campaign', on_delete=models.SET_NULL, null=True, blank=True, related_name='committee_campaigns')
#     election_committee = models.ForeignKey('committees.Committee', on_delete=models.SET_NULL, null=True, blank=True, related_name='election_committee_campaigns')
#     campaign_member = models.ForeignKey('CampaignMember', on_delete=models.SET_NULL, null=True, blank=True, related_name='committee_campaign_members')

#     class Meta:
#         db_table = 'campaign_committee'
#         verbose_name = "Campaign Committee"
#         verbose_name_plural = "Campaign Committees"
#         default_permissions = []
#         permissions  = [
#             ("canViewCampaignCommittee", "Can View Campaign Committee"),
#             ("canAddCampaignCommittee", "Can Add Campaign Committee"),
#             ("canChangeCampaignCommittee", "Can Change Campaign Committee"),
#             ("canDeleteCampaignCommittee", "Can Delete Campaign Committee"),
#             ]



# Campaign Parties
# class CampaignParty(TrackModel, TaskModel):
#     # Basic Information
#     election_party = models.ForeignKey('elections.ElectionParty', on_delete=models.SET_NULL, null=True, blank=True, related_name='election_party_campaigns')
#     slug = models.SlugField(max_length=255, unique=True, blank=True, null=True)
#     description = models.TextField(blank=True, null=True)
#     target_votes = models.PositiveIntegerField(blank=True, null=True)

#     # Media Coverage
#     twitter = models.CharField(max_length=120, blank=True, null=True)
#     instagram = models.CharField(max_length=120, blank=True, null=True)
#     website = models.CharField(max_length=120, blank=True, null=True)

#     # Activities

#     class Meta:
#         db_table = "campaign_party"
#         verbose_name = "Campaign Party"
#         verbose_name_plural = "Campaign Parties"
#         default_permissions = []
#         permissions  = []
#     def __str__(self):
#         return f"{self.election_party.party.name} - Year"

#     def save(self, *args, **kwargs):
#         if not self.slug:
#             self.slug = uuid.uuid4().hex[:8].upper()

#         super().save(*args, **kwargs)  # Call the "real" save() method


# class CampaignPartyMember(TrackModel):
#     user = models.ForeignKey('auths.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='campaign_party_users')
#     campaign = models.ForeignKey('CampaignParty', on_delete=models.SET_NULL, null=True, blank=True, related_name='campaign_party_members')
#     role = models.ForeignKey(Group, on_delete=models.SET_NULL, null=True, blank=True, related_name='campaign_party_role_members')
#     supervisor = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='supervised_members')
#     committee = models.ForeignKey('committees.Committee', on_delete=models.SET_NULL, null=True, blank=True, related_name='campaign_party_committee_members')
#     civil = models.CharField(max_length=12, blank=True, null=True, validators=[civil_validator])
#     phone = models.CharField(max_length=8, blank=True, null=True, validators=[phone_validator])
#     notes = models.TextField(blank=True, null=True)
#     status = models.IntegerField(choices=GuaranteeStatusOptions.choices, blank=True, null=True)

#     class Meta:
#         db_table = 'campaign_party_member'
#         verbose_name = "Campaign Party Member"
#         verbose_name_plural = "Campaign Party Members"
#         default_permissions = []
#         permissions  = []


# class CampaignPartyGuarantee(TrackModel):
#     campaign = models.ForeignKey('CampaignParty', on_delete=models.SET_NULL, null=True, blank=True, related_name='campaign_party_guarantees')
#     member = models.ForeignKey('CampaignPartyMember', on_delete=models.SET_NULL, null=True, blank=True, related_name='campaign_party_guarantee_guarantors')
#     civil = models.ForeignKey('electors.Elector', on_delete=models.SET_NULL, null=True, blank=True, related_name='campaign_party_voter_guarantees')
#     phone = models.CharField(max_length=8, blank=True, null=True)  # or any other field type suitable for your requirements
#     notes = models.TextField(blank=True, null=True)
#     status = models.IntegerField(choices=GuaranteeStatusOptions.choices, blank=True, null=True)

#     class Meta:
#         db_table = 'campaign_party_guarantee'
#         verbose_name = "Campaign Party Guarantee"
#         verbose_name_plural = "Campaign Party Guarantees"
#         default_permissions = []
#         permissions  = []

