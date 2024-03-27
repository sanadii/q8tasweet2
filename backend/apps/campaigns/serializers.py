# campaigns/serializers.py
from rest_framework import serializers
from helper.base_serializer import TrackMixin, TaskMixin, AdminFieldMixin
from django.conf import settings  # Import Django settings to access MEDIA_URL

# Models
from django.contrib.auth.models import Group, Permission
from apps.campaigns.models import (
    Campaign,
    CampaignMember,
    CampaignPartyMember,
    CampaignPartyGuarantee,
    CampaignGuarantee,
    CampaignAttendee,
    CampaignSorting,
)

from apps.elections.models import (
    Election,
    ElectionCategory,
    ElectionCandidate,
    ElectionParty,
    ElectionCommittee,
)
from apps.candidates.models import Candidate, Party
from apps.electors.models import Elector

# Serializers
from apps.candidates.serializers import CandidateSerializer, PartySerializer
from apps.elections.serializers import (
    ElectionSerializer,
    ElectionCandidateSerializer,
    ElectionCommitteeSerializer,
)
from apps.auths.serializers import UserSerializer
from apps.electors.serializers import ElectorsSerializer


class CampaignSerializer(AdminFieldMixin, serializers.ModelSerializer):
    """Serializer for the Campaign model, using the generic foreign key."""

    admin_serializer_classes = (TrackMixin, TaskMixin)
    campaign_type = serializers.SerializerMethodField()
    # campaign = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()

    election = ElectionSerializer(source="election_candidate.election", read_only=True)
    campaign_type = serializers.SerializerMethodField()  # Use SerializerMethodField

    class Meta:
        model = Campaign
        fields = [
            "id",
            "election_candidate",
            "campaign_type",
            "election",
            "name",
            "image",
            "slug",
            "description",
            "target_votes",
            "twitter",
            "instagram",
            "website",
        ]

    def get_campaign_type(self, obj):
        """Customize the campaign_type representation."""
        model_name = obj.campaign_type.model
        if model_name.startswith("election"):
            model_name = model_name[8:]  # Remove 'election' prefix
        return model_name.lower()  # Convert to lowercase for consistency

    # def get_campaign(self, obj):
    #     print ("obj.campaign_type.model: ", obj.campaign_type.model)
    #     if obj.campaign_type.model in ('electioncandidate'):
    #         campaign_entity = obj.campaign_type_object.candidate  # Access the related object
    #         return CandidateSerializer(campaign_entity).data  # Use CandidateSerializer for both
    #     elif obj.campaign_type.model in ('electionparty'):
    #         campaign_entity = obj.campaign_type_object.party  # Access the related object
    #         return PartySerializer(campaign_entity).data  # Use CandidateSerializer for both
    #     return None

    def get_name(self, obj):
        """Retrieve the name dynamically based on campaign_type."""
        try:
            if obj.campaign_type.model == "electioncandidate":
                return obj.campaign_type_object.candidate.name
            elif obj.campaign_type.model == "electionparty":
                return obj.campaign_type_object.party.name
            else:
                raise ValueError(f"Invalid campaign_type: {obj.campaign_type.model}")
        except AttributeError:
            raise ValueError(
                "Campaign object is missing campaign_type or campaign_type_object"
            )

    def get_image(self, obj):
        """Retrieve the image URL, handling cases where images might be missing."""
        try:
            if obj.campaign_type.model == "electioncandidate":
                image = obj.campaign_type_object.candidate.image
            elif obj.campaign_type.model == "electionparty":
                image = obj.campaign_type_object.party.image
            else:
                raise ValueError(f"Invalid campaign_type: {obj.campaign_type.model}")

            return image.url if image else None  # Return None if image is missing
        except AttributeError:
            raise ValueError(
                "Campaign object is missing campaign_type or campaign_type_object"
            )

    def to_representation(self, instance):
        rep = super().to_representation(instance)

        # Remove unwanted fields from nested serializers
        if "election" in rep:
            rep["election"].pop("track", None)
            rep["election"].pop("task", None)

        # if "candidate" in rep:
        #     rep["candidate"].pop("track", None)
        #     rep["candidate"].pop("task", None)

        return rep


# class CampaignCombinedSerializer(AdminFieldMixin, serializers.Serializer):
#     # Serialize common fields
#     id = serializers.IntegerField()
#     image = serializers.ImageField(read_only=True)  # Moved inside conditional blocks
#     slug = serializers.SlugField()
#     description = serializers.CharField()
#     target_votes = serializers.IntegerField()
#     twitter = serializers.CharField(allow_blank=True, max_length=120)
#     instagram = serializers.CharField(allow_blank=True, max_length=120)
#     website = serializers.CharField(allow_blank=True, max_length=120)

#     # Handle election field consistently
#     # election = ElectionSerializer(source='election_candidate.election', read_only=True)

#     # Conditionally handle candidate/party fields
#     candidate = CandidateSerializer(source='election_candidate.candidate', read_only=True)
#     party = PartySerializer(source='election_party.party', read_only=True)

#     # Conditionally handle candidate/party fields
#     election_candidate = serializers.PrimaryKeyRelatedField(
#         read_only=True, source="election_candidate.candidate"
#     )
#     candidate = CandidateSerializer(read_only=True, source="election_candidate.candidate")

#     election_party = serializers.PrimaryKeyRelatedField(
#         read_only=True, source="election_party.party"
#     )
#     party = PartySerializer(read_only=True, source="election_party.party")

#     def to_representation(self, instance):
#         representation = super().to_representation(instance)

#         # Include only relevant candidate/party fields based on instance type
#         if isinstance(instance, Campaign):
#             representation["election"] = ElectionSerializer(
#                 instance.election_candidate.election, read_only=True
#             ).data

#             representation["candidate"] = representation.pop("election_candidate")
#             representation["campaignType"] = "candidates"
#             representation["name"] = instance.election_candidate.candidate.name

#         else:
#             representation["election"] = ElectionSerializer(
#                 instance.election_party.election, read_only=True
#             ).data

#             representation["party"] = representation.pop("election_party")
#             representation["campaignType"] = "parties"
#             representation["name"] = instance.election_party.party.name

#         return representation


class CampaignDetailsSerializer(AdminFieldMixin, serializers.ModelSerializer):

    def get_elections_candidates(self):

        election = ElectionSerializer(read_only=True)
        candidate = CandidateSerializer(read_only=True)
        user = UserSerializer(read_only=True)  # Assuming the user field name is 'user'
        # image = serializers.ImageField(use_url=True)  # Ensure the image's URL is returned, not its data

    class Meta:
        model = ElectionCandidate
        fields = ["id", "votes", "deleted", "election", "candidate"]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation["candidate_id"] = instance.candidate_id
        representation["name"] = instance.candidate.name
        representation["image"] = (
            instance.candidate.image.url if instance.candidate.image else None
        )
        representation["gender"] = instance.candidate.gender
        representation["Candidate_deleted"] = instance.candidate.deleted
        return representation

#
# Campaign Members Serializers
#
class BaseCampaignMemberSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    permissions = serializers.SerializerMethodField()

    class Meta:
        abstract = True  # Mark as abstract to prevent direct usage

    def get_name(self, obj):
        if obj.user:
            return f"{obj.user.first_name} {obj.user.last_name}"
        return "User not found"

    # def get_permissions(self, obj):
    #     # Ensure that the campaign member has an associated role
    #     if not obj.role:
    #         return []

    def get_permissions(self, obj):
        if obj.role:
            # Access permissions as a property, not as a method
            campaign_member_permissions = list(obj.role.permissions.values_list('codename', flat=True))
            return campaign_member_permissions
        return []

class CampaignMemberSerializer(BaseCampaignMemberSerializer):
    class Meta:
        model = CampaignMember
        fields = "__all__"  # Or specify required fields

class CampaignPartyMemberSerializer(BaseCampaignMemberSerializer):
    class Meta:
        model = CampaignPartyMember
        fields = "__all__"  # Or specify required fields


#
# Campaign Guarantee Serializers
#
class CampaignGuaranteeSerializer(serializers.ModelSerializer):

    # get the data from Elector Model Directly
    full_name = serializers.CharField(
        source="civil.full_name", default="Not Found", read_only=True
    )
    gender = serializers.IntegerField(source="civil.gender", default=-1, read_only=True)
    membership_no = serializers.CharField(
        source="civil.membership_no", default="Not Found", read_only=True
    )
    box_no = serializers.CharField(
        source="civil.box_no", default="Not Found", read_only=True
    )
    enrollment_date = serializers.DateField(
        source="civil.enrollment_date", default=None, read_only=True
    )
    relationship = serializers.CharField(
        source="civil.relationship", default="Not Found", read_only=True
    )
    elector_notes = serializers.CharField(
        source="civil.notes", default="Not Found", read_only=True
    )
    attended = serializers.SerializerMethodField()

    class Meta:
        model = CampaignGuarantee
        fields = [
            "id",
            "campaign",
            "member",
            "civil",
            "full_name",
            "gender",
            "phone",
            "notes",
            "status",
            "attended",
            "membership_no",
            "box_no",
            "enrollment_date",
            "relationship",
            "elector_notes",
        ]

    def get_attended(self, obj):
        return CampaignAttendee.objects.filter(civil=obj.civil).exists()

    def create(self, validated_data):
        return super().create(validated_data)

    def update(self, instance, validated_data):
        return super().update(instance, validated_data)

class CampaignPartyGuaranteeSerializer(serializers.ModelSerializer):

    # get the data from Elector Model Directly
    full_name = serializers.CharField(
        source="civil.full_name", default="Not Found", read_only=True
    )
    gender = serializers.IntegerField(source="civil.gender", default=-1, read_only=True)
    membership_no = serializers.CharField(
        source="civil.membership_no", default="Not Found", read_only=True
    )
    box_no = serializers.CharField(
        source="civil.box_no", default="Not Found", read_only=True
    )
    enrollment_date = serializers.DateField(
        source="civil.enrollment_date", default=None, read_only=True
    )
    relationship = serializers.CharField(
        source="civil.relationship", default="Not Found", read_only=True
    )
    elector_notes = serializers.CharField(
        source="civil.notes", default="Not Found", read_only=True
    )
    attended = serializers.SerializerMethodField()

    class Meta:
        model = CampaignPartyGuarantee
        fields = [
            "id",
            "campaign",
            "member",
            "civil",
            "full_name",
            "gender",
            "phone",
            "notes",
            "status",
            "attended",
            "membership_no",
            "box_no",
            "enrollment_date",
            "relationship",
            "elector_notes",
        ]

    def get_attended(self, obj):
        return CampaignAttendee.objects.filter(civil=obj.civil).exists()

    def create(self, validated_data):
        return super().create(validated_data)

    def update(self, instance, validated_data):
        return super().update(instance, validated_data)

class CampaignAttendeeSerializer(serializers.ModelSerializer):
    # Directly get the data from the Elector Model
    full_name = serializers.CharField(
        source="civil.full_name", default="Not Found", read_only=True
    )
    gender = serializers.IntegerField(source="civil.gender", default=-1, read_only=True)
    membership_no = serializers.CharField(
        source="civil.membership_no", default="Not Found", read_only=True
    )
    box_no = serializers.CharField(
        source="civil.box_no", default="Not Found", read_only=True
    )
    enrollment_date = serializers.DateField(
        source="civil.enrollment_date", default=None, read_only=True
    )
    relationship = serializers.CharField(
        source="civil.relationship", default="Not Found", read_only=True
    )
    elector_notes = serializers.CharField(
        source="civil.notes", default="Not Found", read_only=True
    )
    # attended field will not be included here since it's specific to CampaignGuarantee model

    class Meta:
        model = CampaignAttendee
        fields = [
            "id",
            "user",
            "election",
            "committee",
            "civil",
            "notes",
            "status",
            "full_name",
            "gender",
            "membership_no",
            "box_no",
            "enrollment_date",
            "relationship",
            "elector_notes",
        ]

    def create(self, validated_data):
        return super().create(validated_data)

    def update(self, instance, validated_data):
        return super().update(instance, validated_data)


#
# Campaign Sorting Serializers
#
class CampaignSortingSerializer(serializers.ModelSerializer):

    class Meta:
        model = CampaignSorting
        fields = "__all__"


# For CampaignGuaranteeSerializer and CampaignAttendeeSerializer,
# you could have a method like this to avoid repeating the same logic
def get_field_or_not_found(self, obj, field_name):
    try:
        return getattr(obj, field_name) if obj else None
    except Elector.DoesNotExist:
        return "Not Found"


# class CampaignPartySerializer(AdminFieldMixin, serializers.ModelSerializer):
#     """ Serializer for the Campaign model. """
#     admin_serializer_classes = (TrackMixin, TaskMixin)
#     party = PartySerializer(source='election_party.party', read_only=True)
#     election = ElectionSerializer(source='election_party.election', read_only=True)

#     class Meta:
#         model = Campaign
#         fields = [
#             "id", "election_party", "election", "party", "slug",
#             "description", "target_votes",
#             "twitter", "instagram", "website",
#             ]

#     def to_representation(self, instance):
#         rep = super().to_representation(instance)

#         # Remove unwanted fields from nested serializers
#         if "election" in rep:
#             rep["election"].pop("track", None)
#             rep["election"].pop("task", None)

#         if "party" in rep:
#             rep["party"].pop("track", None)
#             rep["party"].pop("task", None)

#         return rep
