# campaigns/models
from django.db import models
from django_extensions.db.fields import AutoSlugField
from django.utils.text import slugify
import uuid
<<<<<<< HEAD

from django.contrib.auth.models import Group
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

from apps.configs.models import TrackModel, TaskModel
from helper.models_helper import GuaranteeStatusOptions
from helper.validators import civil_validator, phone_validator

# from apps.campaigns.models import ElectionCandidate

class Campaign(TrackModel, TaskModel):
    # Basic Information
    election_candidate = models.ForeignKey('elections.ElectionCandidate', on_delete=models.SET_NULL, null=True, blank=True, related_name='candidate_campaigns')
=======
# from django.contrib.contenttypes.fields import GenericForeignKey
from apps.elections.candidates.models import ElectionCandidate
from apps.settings.models import TrackModel, TaskModel

class Campaign(TrackModel, TaskModel):
    # Basic Information
>>>>>>> sanad
    slug = models.SlugField(max_length=255, unique=True, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    target_votes = models.PositiveIntegerField(blank=True, null=True)

    # Relationships
<<<<<<< HEAD
    campaign_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    campaign_type_object = GenericForeignKey('campaign_type', 'object_id')
=======
    election_candidate = models.ForeignKey(ElectionCandidate, on_delete=models.CASCADE)
    # campaign_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    # campaigner_id = models.PositiveIntegerField()
    # content_object = GenericForeignKey("campaign_type", "campaigner_id")
>>>>>>> sanad

    # Media Coverage
    twitter = models.CharField(max_length=120, blank=True, null=True)
    instagram = models.CharField(max_length=120, blank=True, null=True)
    website = models.CharField(max_length=120, blank=True, null=True)

<<<<<<< HEAD
    # Activities

=======
>>>>>>> sanad
    class Meta:
        db_table = "campaign"
        verbose_name = "Campaign"
        verbose_name_plural = "Campaign"
        default_permissions = []
<<<<<<< HEAD
        permissions  = [
=======
        permissions = [
>>>>>>> sanad
            ("canViewCampaign", "Can View Campaign"),
            ("canAddCampaign", "Can Add Campaign"),
            ("canChangeCampaign", "Can Change Campaign"),
            ("canDeleteCampaign", "Can Delete Campaign"),
<<<<<<< HEAD
=======
            # TODO:
>>>>>>> sanad
            ("canChangeCampaignModerator", "can Change Campaign Moderator"),
            ("canChangeCampaignCandidate", "can Change Campaign Candidate"),
            ("canChangeCampaignManager", "can Change Campaign Manager"),
            ("canChangeCampaignAssistant", "can Change Campaign Assistant"),
<<<<<<< HEAD
            ]
    def __str__(self):
        return f"{self.election_candidate.candidate.name} - Year"
=======
        ]
        # unique_together = ["campaign_type", "campaigner_id"]
        # indexes = [
        #     models.Index(fields=["campaign_type", "campaigner_id"]),
        # ]
>>>>>>> sanad

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = uuid.uuid4().hex[:8].upper()

<<<<<<< HEAD
        super().save(*args, **kwargs)  # Call the "real" save() method


class CampaignProfile(TrackModel, TaskModel):
    campaign = models.OneToOneField('Campaign', on_delete=models.SET_NULL, null=True, blank=True, related_name="profile_campaigns")

    class Meta:
        db_table = 'campaign_profile'
        verbose_name = "Campaign Profile"
        verbose_name_plural = "Campaign Profiles"
        default_permissions = []


class CampaignMember(TrackModel):
    user = models.ForeignKey('auths.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='campaign_users')
    campaign = models.ForeignKey('Campaign', on_delete=models.SET_NULL, null=True, blank=True, related_name='campaign_members')
    role = models.ForeignKey(Group, on_delete=models.SET_NULL, null=True, blank=True, related_name='campaign_role_members')
    supervisor = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='supervised_members')
    committee = models.ForeignKey('elections.ElectionCommittee', on_delete=models.SET_NULL, null=True, blank=True, related_name='campaign_committee_members')
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
    member = models.ForeignKey('CampaignMember', on_delete=models.SET_NULL, null=True, blank=True, related_name='campaign_guarantee_guarantors')
    civil = models.ForeignKey('electors.Elector', on_delete=models.SET_NULL, null=True, blank=True, related_name='campaign_elector_guarantees')
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
    user = models.ForeignKey('auths.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='attendant_attendees')
    election = models.ForeignKey('elections.Election', on_delete=models.SET_NULL, null=True, blank=True, related_name='election_attendees')
    committee = models.ForeignKey('elections.ElectionCommittee', on_delete=models.SET_NULL, null=True, blank=True, related_name='committee_attendees')
    civil = models.ForeignKey('electors.Elector', on_delete=models.SET_NULL, null=True, blank=True, related_name='elector_attendees')
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
        

# Campaign Parties
class CampaignParty(TrackModel, TaskModel):
    # Basic Information
    election_party = models.ForeignKey('elections.ElectionParty', on_delete=models.SET_NULL, null=True, blank=True, related_name='election_party_campaigns')
    slug = models.SlugField(max_length=255, unique=True, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    target_votes = models.PositiveIntegerField(blank=True, null=True)

    # Media Coverage
    twitter = models.CharField(max_length=120, blank=True, null=True)
    instagram = models.CharField(max_length=120, blank=True, null=True)
    website = models.CharField(max_length=120, blank=True, null=True)

    # Activities

    class Meta:
        db_table = "campaign_party"
        verbose_name = "Campaign Party"
        verbose_name_plural = "Campaign Parties"
        default_permissions = []
        permissions  = []
    def __str__(self):
        return f"{self.election_party.party.name} - Year"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = uuid.uuid4().hex[:8].upper()

        super().save(*args, **kwargs)  # Call the "real" save() method


class CampaignPartyMember(TrackModel):
    user = models.ForeignKey('auths.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='campaign_party_users')
    campaign = models.ForeignKey('CampaignParty', on_delete=models.SET_NULL, null=True, blank=True, related_name='campaign_party_members')
    role = models.ForeignKey(Group, on_delete=models.SET_NULL, null=True, blank=True, related_name='campaign_party_role_members')
    supervisor = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='supervised_members')
    committee = models.ForeignKey('elections.ElectionCommittee', on_delete=models.SET_NULL, null=True, blank=True, related_name='campaign_party_committee_members')
    civil = models.CharField(max_length=12, blank=True, null=True, validators=[civil_validator])
    phone = models.CharField(max_length=8, blank=True, null=True, validators=[phone_validator])
    notes = models.TextField(blank=True, null=True)
    status = models.IntegerField(choices=GuaranteeStatusOptions.choices, blank=True, null=True)
   
    class Meta:
        db_table = 'campaign_party_member'
        verbose_name = "Campaign Party Member"
        verbose_name_plural = "Campaign Party Members"
        default_permissions = []
        permissions  = []
        

class CampaignPartyGuarantee(TrackModel):
    campaign = models.ForeignKey('CampaignParty', on_delete=models.SET_NULL, null=True, blank=True, related_name='campaign_party_guarantees')
    member = models.ForeignKey('CampaignPartyMember', on_delete=models.SET_NULL, null=True, blank=True, related_name='campaign_party_guarantee_guarantors')
    civil = models.ForeignKey('electors.Elector', on_delete=models.SET_NULL, null=True, blank=True, related_name='campaign_party_elector_guarantees')
    phone = models.CharField(max_length=8, blank=True, null=True)  # or any other field type suitable for your requirements
    notes = models.TextField(blank=True, null=True)
    status = models.IntegerField(choices=GuaranteeStatusOptions.choices, blank=True, null=True)

    class Meta:
        db_table = 'campaign_party_guarantee'
        verbose_name = "Campaign Party Guarantee"
        verbose_name_plural = "Campaign Party Guarantees"
        default_permissions = []
        permissions  = []


# class CampaignSorting(models.Model):
#     user = models.ForeignKey('auths.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='sorter_sortees')
#     election_candidate = models.ForeignKey('elections.ElectionCandidate', on_delete=models.SET_NULL, null=True, blank=True, related_name='election_candidate_sortings')
#     election_committee = models.ForeignKey('elections.ElectionCommittee', on_delete=models.SET_NULL, null=True, blank=True, related_name='election_committee_sortees')
#     votes = models.PositiveIntegerField(default=0)
#     notes = models.TextField(blank=True, null=True)

#     class Meta:
#         db_table = 'campaign_sorting'
#         verbose_name = "Campaign Sorting"
#         verbose_name_plural = "Campaign Sortings"
#         default_permissions = []
#         permissions  = [
#             ("canViewCampaignSorting", "Can View Campaign Sorting"),
#             ("canAddCampaignSorting", "Can Add Campaign Sorting"),
#             ("canChangeCampaignSorting", "Can Change Campaign Sorting"),
#             ("canDeleteCampaignSorting", "Can Delete Campaign Sorting"),
#             ]

# class CampaignPartySorting(models.Model):
#     user = models.ForeignKey('auths.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='sorter_sortees')
#     election_party = models.ForeignKey('elections.ElectionParty', on_delete=models.SET_NULL, null=True, blank=True, related_name='election_party_sortings')
#     election_committee = models.ForeignKey('elections.ElectionCommittee', on_delete=models.SET_NULL, null=True, blank=True, related_name='election_committee_sortees')
#     votes = models.PositiveIntegerField(default=0)
#     notes = models.TextField(blank=True, null=True)

#     class Meta:
#         db_table = 'campaign_party_sorting'
#         verbose_name = "Campaign Party Sorting"
#         verbose_name_plural = "Campaign Party Sortings"
#         default_permissions = []
#         permissions  = []

# class CampaignPartyCandidateSorting(models.Model):
#     user = models.ForeignKey('auths.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='sorter_sortees')
#     election_party_candidate = models.ForeignKey('elections.ElectionPartyCandidate', on_delete=models.SET_NULL, null=True, blank=True, related_name='election_party_candidate_sortings')
#     election_committee = models.ForeignKey('elections.ElectionCommittee', on_delete=models.SET_NULL, null=True, blank=True, related_name='election_committee_sortees')
#     votes = models.PositiveIntegerField(default=0)
#     notes = models.TextField(blank=True, null=True)

#     class Meta:
#         db_table = 'campaign_party_candidate_sorting'
#         verbose_name = "Campaign Party Candidate Sorting"
#         verbose_name_plural = "Campaign Party Candidate Sortings"
=======
        # # Debugging before saving
        # print(f"Before save: campaign_type={self.campaign_type}, campaigner_id={self.campaigner_id}, content_object={self.content_object}")

        super().save(*args, **kwargs)  # Call the "real" save() method

        # # Debugging after saving
        # print(f"After save: campaign_type={self.campaign_type}, campaigner_id={self.campaigner_id}, content_object={self.content_object}")




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

<<<<<<< HEAD
=======

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
>>>>>>> sanad
#         default_permissions = []
#         permissions  = []


<<<<<<< HEAD
class BaseCampaignSorting(models.Model):
    user = models.ForeignKey(
        'auths.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='%(class)s_users',
    )
    election_committee = models.ForeignKey(
        'elections.ElectionCommittee',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='%(class)s_election_committees',
    )
    votes = models.PositiveIntegerField(default=0)
    notes = models.TextField(blank=True, null=True)

    class Meta:
        abstract = True  # Prevents direct model creation
        permissions = [
            ("canViewCampaignSorting", "Can View Campaign Sorting"),
            ("canAddCampaignSorting", "Can Add Campaign Sorting"),
            ("canChangeCampaignSorting", "Can Change Campaign Sorting"),
            ("canDeleteCampaignSorting", "Can Delete Campaign Sorting"),
        ]

class CampaignSorting(BaseCampaignSorting):
    election_candidate = models.ForeignKey('elections.ElectionCandidate', on_delete=models.SET_NULL, null=True, blank=True, related_name='campaign_candidate_sortings')

    class Meta(BaseCampaignSorting.Meta):
        db_table = 'campaign_sorting'
        verbose_name = "Campaign Sorting"
        verbose_name_plural = "Campaign Sortings"

class CampaignPartySorting(BaseCampaignSorting):
    election_party = models.ForeignKey('elections.ElectionParty', on_delete=models.SET_NULL, null=True, blank=True, related_name='campaign_party_sortings')

    class Meta(BaseCampaignSorting.Meta):
        db_table = 'campaign_party_sorting'
        verbose_name = "Campaign Party Sorting"
        verbose_name_plural = "Campaign Party Sortings"

class CampaignPartyCandidateSorting(BaseCampaignSorting):
    election_party_candidate = models.ForeignKey('elections.ElectionPartyCandidate', on_delete=models.SET_NULL, null=True, blank=True, related_name='campaign_party_candidate_sortings')

    class Meta(BaseCampaignSorting.Meta):
        db_table = 'campaign_party_candidate_sorting'
        verbose_name = "Campaign Party Candidate Sorting"
        verbose_name_plural = "Campaign Party Candidate Sortings"
=======
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

>>>>>>> sanad
>>>>>>> b8f542d5e774864905c059891f0ccbdc03cf3b39
