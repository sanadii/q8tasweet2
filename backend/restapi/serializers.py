from rest_framework import serializers
from .models import *
from users.models import User
import json


# PROJECT
class ProjectInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectInfo
        fields = "__all__"

# USER
class UserSerializer(serializers.ModelSerializer):
    full_name = (
        serializers.SerializerMethodField()
    )  # If you want to include a computed full name

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "full_name",
            "email",
        ]  # Include other fields as needed

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"


class UserFullNameSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["full_name"]

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"


# CATEGORIES
class CategoriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categories
        fields = ["id", "name"]


class ElectorsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Electors
        fields = "__all__"


# SUB-CATEGORIES
class SubCategoriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categories
        fields = ["id", "name", "parent"]


# ELECTIONS
class ElectionsSerializer(serializers.ModelSerializer):
    moderators = serializers.SerializerMethodField()  # New custom field

    # Change to camelCase for react State use
    dueDate = serializers.CharField(source="duedate")  # Add this line
    createdDate = serializers.CharField(source="created_date")  # Add this line
    updatedDate = serializers.CharField(source="updated_date")  # Add this line
    deletedDate = serializers.CharField(source="deleted_date")  # Add this line

    category = serializers.SerializerMethodField()  # New custom field for category name
    subCategory = (
        serializers.SerializerMethodField()
    )  # New custom field for subcategory name

    createdBy = serializers.SerializerMethodField()  # Renamed to camelCase
    updatedBy = serializers.SerializerMethodField()  # Renamed to camelCase
    deletedBy = serializers.SerializerMethodField()  # Renamed to camelCase

    class Meta:
        model = Elections
        fields = [
            "id",  "name", "description", "dueDate", "image",
            "type", "result", "votes", "seats", "electors", "attendees",
            "category", "subCategory", "tags",
            "status", "priority", 
            "moderators", "createdBy", "updatedBy", "deletedBy", "createdDate", "updatedDate", "deletedDate", "deleted",
        ]

    def get_createdBy(self, obj):  # Updated method name
        if obj.created_by:
            return f"{obj.created_by.first_name} {obj.created_by.last_name}"
        return "Unknown"  # or simply return ""

    def get_updatedBy(self, obj):  # Updated method name
        if obj.updated_by:
            return f"{obj.updated_by.first_name} {obj.updated_by.last_name}"
        return "Unknown"  # or simply return ""

    def get_deletedBy(self, obj):  # Updated method name
        if obj.deleted_by:
            return f"{obj.deleted_by.first_name} {obj.deleted_by.last_name}"
        return "Unknown"  # or simply return ""
    
    def get_moderators(self, obj):
        if obj.moderators is not None:
            moderator_ids = json.loads(obj.moderators)
            moderators = User.objects.filter(id__in=moderator_ids)
            return [
                {
                    "id": mod.id,
                    "img": mod.image.url,
                    "name": f"{mod.first_name} {mod.last_name}",
                }
                for mod in moderators
            ]
        else:
            return []

    def get_category(self, obj):
        return obj.category.id if obj.category else None

    def get_subCategory(self, obj):
        return obj.sub_category.id if obj.sub_category else None

    # def get_categoryName(self, obj):
    #     return obj.category.name if obj.category else None

    # def get_subCategoryName(self, obj):
    #     return obj.sub_category.name if obj.sub_category else None

    # New method to get the candidates count for each election
    def get_candidateCount(self, obj):
        return ElectionCandidates.objects.filter(election=obj).count()


# CANDIDATE
class CandidatesSerializer(serializers.ModelSerializer):
    moderators = serializers.SerializerMethodField()  # New custom field

    # Change to camelCase for react State use
    createdDate = serializers.CharField(source="created_date")
    updatedDate = serializers.CharField(source="updated_date")
    deletedDate = serializers.CharField(source="deleted_date")  # Add this line

    createdBy = serializers.SerializerMethodField()  # Renamed to camelCase
    updatedBy = serializers.SerializerMethodField()  # Renamed to camelCase
    deletedBy = serializers.SerializerMethodField()  # Renamed to camelCase

    class Meta:
        model = Candidates
        fields = [
            "id",  "name", "description", "image",
            "gender", "phone", "email", "twitter", "instagram",
            "status", "priority", 
            "moderators", "createdBy", "updatedBy", "deletedBy", "createdDate", "updatedDate", "deletedDate", "deleted",
        ]

    def get_createdBy(self, obj):  # Updated method name
        if obj.created_by:
            return f"{obj.created_by.first_name} {obj.created_by.last_name}"
        return "Unknown"  # or simply return ""

    def get_updatedBy(self, obj):  # Updated method name
        if obj.updated_by:
            return f"{obj.updated_by.first_name} {obj.updated_by.last_name}"
        return "Unknown"  # or simply return ""
    
    def get_deletedBy(self, obj):  # Updated method name
        if obj.deleted_by:
            return f"{obj.deleted_by.first_name} {obj.deleted_by.last_name}"
        return "Unknown"  # or simply return ""


    def get_moderators(self, obj):
        if obj.moderators is not None:
            moderator_ids = json.loads(obj.moderators)
            moderators = User.objects.filter(id__in=moderator_ids)
            return [
                {
                    "id": mod.id,
                    "img": mod.image.url,
                    "name": f"{mod.first_name} {mod.last_name}",
                }
                for mod in moderators
            ]
        else:
            return []


# CAMPAIGN
class CampaignsSerializer(serializers.ModelSerializer):

    class Meta:
        model = Campaigns
        fields = "__all__"

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        # Candidate
        candidate = {
            "id": instance.election_candidate.candidate.id,
            "name": instance.election_candidate.candidate.name,
            "image": instance.election_candidate.candidate.image.url if instance.election_candidate.candidate.image else None,
            "gender": instance.election_candidate.candidate.gender,
            "phone": instance.election_candidate.candidate.phone,
            "email": instance.election_candidate.candidate.email,
            "twitter": instance.election_candidate.candidate.twitter,
            "instagram": instance.election_candidate.candidate.instagram,
            "description": instance.election_candidate.candidate.description,
        }

        # Election
        election_obj = instance.election_candidate.election
        election = {
            "id": election_obj.id,
            "image": election_obj.image.url if election_obj.image else None,
            "name": election_obj.name,
            "duedate": election_obj.duedate,
            "category": election_obj.category.name if election_obj.category else None,
            "subCategory": election_obj.sub_category.name if election_obj.sub_category else None,
            "type": election_obj.type,
            "result": election_obj.result,
            "votes": election_obj.votes,
            "seats": election_obj.seats,
            "electors": election_obj.electors,
            "attendees": election_obj.attendees,
        }

        # Update the representation to have candidate and election dicts
        representation['candidate'] = candidate
        representation['election'] = election

        return representation

class CampaignElectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Elections
        fields = "__all__"

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        return {"election_" + key: value for key, value in representation.items()}


class CampaignCandidateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Candidates
        fields = "__all__"

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        return {"candidate_" + key: value for key, value in representation.items()}


class ElectionCandidatesSerializer(serializers.ModelSerializer):
    election = ElectionsSerializer(read_only=True)  # Corrected the field name here
    candidate = CandidatesSerializer(read_only=True)
    campaigns = CampaignsSerializer(
        many=True, read_only=True, source="campaigns.all"
    )  # Add this line

    class Meta:
        model = ElectionCandidates
        fields = [
            "id",
            "name",
            "image",
            "gender",
            "status",
            "deleted",
            "election",
            "candidate",
            "capaigns",
        ]

    def to_representation(self, instance):
        candidate_serializer = CandidatesSerializer(instance.candidate)

        return {
            "id": instance.id,
            "position": instance.position,
            "votes": instance.votes,
            "is_winner": instance.is_winner,
            "is_active": instance.is_active,
            "deleted": instance.deleted,
            # Candidate
            "candidate_id": instance.candidate_id,
            "name": instance.candidate.name,
            "image": candidate_serializer.data["image"],  # Using the serialized image
            "gender": instance.candidate.gender,
            "Candidate_deleted": instance.candidate.deleted,
            # Campaign
            # "name": instance.campaign.name,
            # "attendees": instance.campaign.attendees,
            # "election_deleted":  instance.candidate.deleted,
        }


class ElectionCommitteesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ElectionCommittees
        fields = "__all__"

class ElectionCommitteeResultsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommitteeResults
        fields = ['id', 'election', 'committee', 'votes']  # Add or remove fields as appropriate


class ElectorsSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(read_only=True)

    class Meta:
        model = Electors
        fields = [
            'civil',
            'full_name',
            'gender',
            # 'membership_no',
            # 'box_no',
            # 'enrollment_date',
            # 'relationship',
            # 'notes',
        ]

# CampainMembers
class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "username", "name", "email", "image"]

    def get_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"

class CampaignMembersSerializer(serializers.ModelSerializer):
    user = UserSerializer()  # Removed source="user"
    rank = serializers.IntegerField()

    class Meta:
        model = CampaignMembers
        fields = [
            # Member Data
            "id",
            "user",
            "campaign",
            "rank",
            "supervisor",
            "committee",
            "notes",
            "mobile",
            "status",
        ]


class CampaignGuaranteesSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    gender = serializers.SerializerMethodField()
    membership_no = serializers.SerializerMethodField()
    box_no = serializers.SerializerMethodField()
    enrollment_date = serializers.SerializerMethodField()
    relationship = serializers.SerializerMethodField()
    elector_notes = serializers.SerializerMethodField()

    class Meta:
        model = CampaignGuarantees
        fields = [
            "id",
            "campaign",
            "member",
            "civil",
            "full_name",
            "mobile",
            "gender",
            "membership_no",
            "box_no",
            "enrollment_date",
            "relationship",
            "elector_notes",
            "notes",
            "status",
            # "created_by",
            # "updated_by",
            # "deleted_by",
            # "created_date",
            # "updated_date",
            # "deleted_date",
            "deleted",
        ]
    # def get_full_name(self, obj):
    #     if obj.civil:
    #         elector = obj.civil
    #         names = [elector.name_1, elector.name_2, elector.name_3, elector.name_4, elector.last_name]
    #         return ' '.join([name for name in names if name])  # concatenate non-empty names
    #     return None

    def get_full_name(self, obj):
        try:
            return obj.civil.full_name if obj.civil else None
        except Electors.DoesNotExist:
            return "Not Found"

    def get_gender(self, obj):
        try:
            return obj.civil.gender if obj.civil else None
        except Electors.DoesNotExist:
            return "Not Found"

    def get_membership_no(self, obj):
        try:
            return obj.civil.membership_no if obj.civil else None
        except Electors.DoesNotExist:
            return "Not Found"

    def get_box_no(self, obj):
        try:
            return obj.civil.box_no if obj.civil else None
        except Electors.DoesNotExist:
            return "Not Found"

    def get_enrollment_date(self, obj):
        try:
            return obj.civil.enrollment_date if obj.civil else None
        except Electors.DoesNotExist:
            return "Not Found"

    def get_relationship(self, obj):
        try:
            return obj.civil.relationship if obj.civil else None
        except Electors.DoesNotExist:
            return "Not Found"

    def get_elector_notes(self, obj):
        try:
            return obj.civil.notes if obj.civil else None
        except Electors.DoesNotExist:
            return "Not Found"



class ElectionAttendeesSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    civil = serializers.SerializerMethodField()
    gender = serializers.SerializerMethodField()
    membership_no = serializers.SerializerMethodField()
    box_no = serializers.SerializerMethodField()
    enrollment_date = serializers.SerializerMethodField()
    relationship = serializers.SerializerMethodField()
    elector_notes = serializers.SerializerMethodField()

    class Meta:
        model = ElectionAttendees
        fields = [
            "id",
            "election",
            "committee",
            "user",
            "civil",
            "full_name",
            "gender",
            "membership_no",
            "box_no",
            "enrollment_date",
            "relationship",
            "elector_notes",
            "notes",
            "status",
            "deleted",
        ]

    # def get_full_name(self, obj):
    #     if obj.elector:
    #         elector = obj.elector
    #         names = [elector.name_1, elector.name_2, elector.name_3, elector.name_4, elector.last_name]
    #         return ' '.join([name for name in names if name])  # concatenate non-empty names
    #     return None

    def get_full_name(self, obj):
        try:
            return obj.elector.full_name if obj.elector else None
        except Electors.DoesNotExist:
            return "Not Found"

    def get_gender(self, obj):
        try:
            return obj.elector.gender if obj.elector else None
        except Electors.DoesNotExist:
            return "Not Found"

    def get_membership_no(self, obj):
        try:
            return obj.elector.membership_no if obj.elector else None
        except Electors.DoesNotExist:
            return "Not Found"

    def get_box_no(self, obj):
        try:
            return obj.elector.box_no if obj.elector else None
        except Electors.DoesNotExist:
            return "Not Found"

    def get_enrollment_date(self, obj):
        try:
            return obj.elector.enrollment_date if obj.elector else None
        except Electors.DoesNotExist:
            return "Not Found"

    def get_relationship(self, obj):
        try:
            return obj.elector.relationship if obj.elector else None
        except Electors.DoesNotExist:
            return "Not Found"

    def get_elector_notes(self, obj):
        try:
            return obj.elector.notes if obj.elector else None
        except Electors.DoesNotExist:
            return "Not Found"
        
    def get_civil(self, obj):
        try:
            return obj.elector.civil if obj.elector else None
        except Electors.DoesNotExist:
            return "Not Found"
# CampainDetails
class CampaignDetailsSerializer(serializers.ModelSerializer):
    election = ElectionsSerializer(read_only=True)
    candidate = CandidatesSerializer(read_only=True)
    # user = UserSerializer(read_only=True)  # Assuming the user field name is 'user'
    # image = serializers.ImageField(use_url=True)  # Ensure the image's URL is returned, not its data

    class Meta:
        model = ElectionCandidates
        fields = [
            "id",
            "position",
            "votes",
            "is_winner",
            "deleted",
            "election",
            "candidate",
        ]

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
