# campaigns/serializers.py
from rest_framework import serializers
from utils.base_serializer import TrackMixin, TaskMixin, AdminFieldMixin
from django.conf import settings  # Import Django settings to access MEDIA_URL

# Models
from django.contrib.auth.models import Group, Permission
from apps.campaigns.members.models import CampaignMember
from apps.campaigns.models import (
    Campaign,
    # CampaignPartyMember,
    # CampaignCommittee,
    # CampaignCommitteeAttendee,
    # CampaignCommitteeSorter,
    # CampaignPartyGuarantee,
    # CampaignGuarantee,
    # CampaignGuaranteeGroup,
    # CampaignAttendee,
    # CampaignSorting,
)

from apps.elections.models import (
    Election,
    ElectionCategory,
)

from apps.elections.candidates.models import (
    ElectionCandidate,
    ElectionParty,
)
from apps.committees.models import Committee
from apps.candidates.models import Candidate, Party
from apps.electors.models import Elector
from django.contrib.contenttypes.models import ContentType

# Serializers
from apps.candidates.serializers import CandidateSerializer, PartySerializer
from apps.elections.serializers import ElectionSerializer


from rest_framework import serializers
from django.contrib.contenttypes.models import ContentType
from apps.campaigns.models import Campaign
from apps.elections.candidates.models import ElectionCandidate


class ElectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ElectionCandidate
        fields = ["id", "name"]


from django.db.utils import IntegrityError


class CampaignSerializer(AdminFieldMixin, serializers.ModelSerializer):
    """Serializer for the Campaign model, using the generic foreign key."""

    admin_serializer_classes = (TrackMixin, TaskMixin)

    campaign_type = serializers.CharField(write_only=True)
    campaigner_id = serializers.IntegerField(write_only=True)

    name = serializers.SerializerMethodField()
    # image = serializers.SerializerMethodField()

    class Meta:
        model = Campaign
        fields = [
            "id",
            "campaign_type",
            "campaigner_id",
            "name",
            # "image",
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
        return model_name.lower()  # Convert to lowercase for consistency

    def get_campaign_related_object(self, obj):
        """Helper function to retrieve the related ElectionCandidate or ElectionParty object based on campaign_type."""
        if obj.campaign_type and obj.campaigner_id:
            if obj.campaign_type.model == "candidate":
                return ElectionCandidate.objects.get(id=getattr(obj, 'campaigner_id', None))
            elif obj.campaign_type.model == "party":
                return ElectionParty.objects.get(id=getattr(obj, 'campaigner_id', None))
            else:
                raise ValueError(f"Invalid campaign_type: {obj.campaign_type.model}")
        else:
            raise ValueError("Campaign object is missing campaign_type or campaign_type_object")

    def get_name(self, obj):
        """Retrieve the name dynamically based on campaign_type."""
        try:
            related_object = self.get_campaign_related_object(obj)
            if obj.campaign_type.model == "candidate":
                return related_object.candidate.name
            elif obj.campaign_type.model == "party":
                return related_object.party.name
        except AttributeError:
            raise ValueError("Campaign object is missing campaign_type or campaign_type_object")

    def get_image(self, obj):
        """Retrieve the image URL, handling cases where images might be missing."""
        try:
            related_object = self.get_campaign_related_object(obj)
            if obj.campaign_type.model == "candidate":
                image = related_object.candidate.image
            elif obj.campaign_type.model == "party":
                image = related_object.party.image

            return image.url if image else None  # Return None if image is missing
        except AttributeError as e:
            print(f"AttributeError in get_image: {e}")
            raise ValueError("Campaign object is missing campaign_type or campaign_type_object")

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        # Add election ID to the representation if available
        rep["election_id"] = (
            instance.campaign_type_object.election.id
            if hasattr(instance.campaign_type_object, "election")
            else None
        )
        return rep

    def create(self, validated_data):
        # Log validated_data to debug
        print("Validated data:", validated_data)

        # Ensure campaign_type and campaigner_id are in validated_data
        campaign_type_model = validated_data.pop("campaign_type", None)
        campaigner_id = validated_data.pop("campaigner_id", None)

        # Debugging prints
        print("Campaign type model:", campaign_type_model)
        print("Campaigner ID:", campaigner_id)

        if not campaign_type_model:
            raise serializers.ValidationError(
                {"campaign_type": "This field is required."}
            )
        if not campaigner_id:
            raise serializers.ValidationError(
                {"campaigner_id": "This field is required."}
            )

        campaign_type = ContentType.objects.get(model=campaign_type_model)

        # Check if a campaign with the same campaign_type and campaigner_id already exists
        existing_campaign = Campaign.objects.filter(
            campaign_type=campaign_type, campaigner_id=campaigner_id
        ).first()
        if existing_campaign:
            raise serializers.ValidationError(
                "A campaign with this campaign_type and campaigner_id already exists."
            )

        # Remove 'campaign_type' and 'campaigner_id' from validated_data
        campaign_data = validated_data.copy()
        print("Campaign data before removing extra fields:", campaign_data)

        # Create the campaign object first
        # campaign = Campaign.objects.create(**campaign_data, campaign_type=campaign_type, campaigner_id=campaigner_id)
        campaign = Campaign.objects.create(
            **validated_data, campaign_type=campaign_type, campaigner_id=campaigner_id
        )

        # Fetch the full instance including related fields
        campaign = Campaign.objects.select_related("campaign_type").get(id=campaign.id)
        print(f"Created campaign: {campaign}")
        print(f"campaign_type: {campaign.campaign_type}")
        print(f"campaign_type_object: {campaign.campaign_type_object}")

        return campaign


# class CampaignSerializer(AdminFieldMixin, serializers.ModelSerializer):
#     """Serializer for the Campaign model, using the generic foreign key."""

#     admin_serializer_classes = (TrackMixin, TaskMixin)

#     election = ElectionSerializer(source="election_candidate.election", read_only=True)
#     campaign_type = serializers.SerializerMethodField()  # Use SerializerMethodField
#     campaigner_id = serializers.IntegerField()

#     name = serializers.SerializerMethodField()
#     image = serializers.SerializerMethodField()


#     class Meta:
#         model = Campaign
#         fields = [
#             "id",
#             "election_candidate",
#             "campaign_type",
#             "campaigner_id",
#             "election",
#             "name",
#             "image",
#             "slug",
#             "description",
#             "target_votes",
#             "twitter",
#             "instagram",
#             "website",
#         ]

#     def get_campaign_type(self, obj):
#         """Customize the campaign_type representation."""
#         model_name = obj.campaign_type.model
#         if model_name.startswith("election"):
#             model_name = model_name[8:]  # Remove 'election' prefix
#         return model_name.lower()  # Convert to lowercase for consistency

#     # def get_campaign(self, obj):
#     #     print ("obj.campaign_type.model: ", obj.campaign_type.model)
#     #     if obj.campaign_type.model in ('electioncandidate'):
#     #         campaign_entity = obj.campaign_type_object.candidate  # Access the related object
#     #         return CandidateSerializer(campaign_entity).data  # Use CandidateSerializer for both
#     #     elif obj.campaign_type.model in ('electionparty'):
#     #         campaign_entity = obj.campaign_type_object.party  # Access the related object
#     #         return PartySerializer(campaign_entity).data  # Use CandidateSerializer for both
#     #     return None

#     def get_name(self, obj):
#         """Retrieve the name dynamically based on campaign_type."""
#         try:
#             if obj.campaign_type.model == "candidate_only":
#                 return obj.campaign_type_object.candidate.name
#             else:
#                 return obj.campaign_type_object.party.name
#         except AttributeError:
#             raise ValueError(
#                 "Campaign object is missing campaign_type or campaign_type_object"
#             )

#     def get_image(self, obj):
#         """Retrieve the image URL, handling cases where images might be missing."""
#         try:
#             if obj.campaign_type.model == "electioncandidate":
#                 image = obj.campaign_type_object.candidate.image
#             elif obj.campaign_type.model == "electionparty":
#                 image = obj.campaign_type_object.party.image
#             else:
#                 raise ValueError(f"Invalid campaign_type: {obj.campaign_type.model}")

#             return image.url if image else None  # Return None if image is missing
#         except AttributeError:
#             raise ValueError(
#                 "Campaign object is missing campaign_type or campaign_type_object"
#             )

#     def to_representation(self, instance):
#         rep = super().to_representation(instance)

#         # Remove unwanted fields from nested serializers
#         # if "election" in rep:
#         #     rep["election"].pop("track", None)
#         #     rep["election"].pop("task", None)

#         # if "candidate" in rep:
#         #     rep["candidate"].pop("track", None)
#         #     rep["candidate"].pop("task", None)

#         return rep

#     def create(self, validated_data):
#         campaign_type_model = validated_data.pop('campaign_type')
#         campaign_type = ContentType.objects.get(model=campaign_type_model)
#         validated_data['campaign_type'] = campaign_type
#         return super().create(validated_data)


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


# class CampaignDetailsSerializer(AdminFieldMixin, serializers.ModelSerializer):

#     def get_elections_candidates(self):

#         election = ElectionSerializer(read_only=True)
#         candidate = CandidateSerializer(read_only=True)
#         user = UserSerializer(read_only=True)  # Assuming the user field name is 'user'
#         # image = serializers.ImageField(use_url=True)  # Ensure the image's URL is returned, not its data

#     class Meta:
#         model = ElectionCandidate
#         fields = ["id", "votes", "is_deleted", "election", "candidate"]

#     def to_representation(self, instance):
#         representation = super().to_representation(instance)
#         representation["candidate_id"] = instance.candidate_id
#         representation["name"] = instance.candidate.name
#         representation["image"] = (
#             instance.candidate.image.url if instance.candidate.image else None
#         )
#         representation["gender"] = instance.candidate.gender
#         representation["Candidate_is_deleted"] = instance.candidate.is_deleted
#         return representation


# class CampaignCommitteeSerializer(AdminFieldMixin, serializers.ModelSerializer):
#     """Serializer for the Committee model."""

#     admin_serializer_classes = (TrackMixin,)

#     # sorter = UserSerializer(read_only=True)

#     class Meta:
#         model = CampaignCommittee
#         fields = [
#             "id",
#             "campaign",
#             "election_committee",
#             "campaign_member",
#         ]

#     def create(self, validated_data):
#         """Customize creation (POST) of an instance"""
#         return super().create(validated_data)

#     def update(self, instance, validated_data):
#         """Customize update (PUT, PATCH) of an instance"""
#         # Additional logic to customize instance updating
#         return super().update(instance, validated_data)


# class CampaignCommitteeAttendeeSerializer(AdminFieldMixin, serializers.ModelSerializer):
#     """Serializer for the Committee model."""

#     admin_serializer_classes = (TrackMixin,)

#     # sorter = UserSerializer(read_only=True)

#     class Meta:
#         model = CampaignCommitteeAttendee
#         fields = ["id", "user", "campaign", "committee"]

#     def create(self, validated_data):
#         """Customize creation (POST) of an instance"""
#         return super().create(validated_data)

#     def update(self, instance, validated_data):
#         """Customize update (PUT, PATCH) of an instance"""
#         # Additional logic to customize instance updating
#         return super().update(instance, validated_data)


# class CampaignCommitteeSorterSerializer(AdminFieldMixin, serializers.ModelSerializer):
#     """Serializer for the Committee model."""

#     admin_serializer_classes = (TrackMixin,)

#     # sorter = UserSerializer(read_only=True)

#     class Meta:
#         model = CampaignCommitteeSorter
#         fields = ["id", "user", "campaign", "committee"]

#     def create(self, validated_data):
#         """Customize creation (POST) of an instance"""
#         return super().create(validated_data)

#     def update(self, instance, validated_data):
#         """Customize update (PUT, PATCH) of an instance"""
#         # Additional logic to customize instance updating
#         return super().update(instance, validated_data)



# class CampaignAttendeeSerializer(serializers.ModelSerializer):
#     # Directly get the data from the Elector Model
#     full_name = serializers.CharField(
#         source="civil.full_name", default="Not Found", read_only=True
#     )
#     gender = serializers.IntegerField(source="civil.gender", default=-1, read_only=True)
#     membership_no = serializers.CharField(
#         source="civil.membership_no", default="Not Found", read_only=True
#     )
#     box_no = serializers.CharField(
#         source="civil.box_no", default="Not Found", read_only=True
#     )
#     enrollment_date = serializers.DateField(
#         source="civil.enrollment_date", default=None, read_only=True
#     )
#     relationship = serializers.CharField(
#         source="civil.relationship", default="Not Found", read_only=True
#     )
#     voter_notes = serializers.CharField(
#         source="civil.notes", default="Not Found", read_only=True
#     )
#     # attended field will not be included here since it's specific to CampaignGuarantee model

#     class Meta:
#         model = CampaignAttendee
#         fields = [
#             "id",
#             "user",
#             "election",
#             "committee",
#             "civil",
#             "notes",
#             "status",
#             "full_name",
#             "gender",
#             "membership_no",
#             "box_no",
#             "enrollment_date",
#             "relationship",
#             "voter_notes",
#         ]

#     def create(self, validated_data):
#         return super().create(validated_data)

#     def update(self, instance, validated_data):
#         return super().update(instance, validated_data)


# #
# # Campaign Sorting Serializers
# #
# class CampaignSortingSerializer(serializers.ModelSerializer):

#     class Meta:
#         model = CampaignSorting
#         fields = "__all__"


# # For CampaignGuaranteeSerializer and CampaignAttendeeSerializer,
# # you could have a method like this to avoid repeating the same logic
# def get_field_or_not_found(self, obj, field_name):
#     try:
#         return getattr(obj, field_name) if obj else None
#     except Elector.DoesNotExist:
#         return "Not Found"


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
