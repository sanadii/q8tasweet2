from rest_framework import serializers
from restapi.models import User, Elections, ElectionCandidates, ElectionCommittees, ElectionCommitteeResults,Campaigns, Candidates, Categories, Electors
import json

# ELECTIONS
class ElectionsSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    category = serializers.SerializerMethodField()
    subCategory = serializers.SerializerMethodField()
    dueDate = serializers.CharField(source="duedate")

    attendeesMales = serializers.CharField(source="attendees_males")
    attendeesFemales = serializers.CharField(source="attendees_females")
    electorsMales = serializers.CharField(source="electors_males")
    electorsFemales = serializers.CharField(source="electors_females")

    # Admin & Tracking Information 
    moderators = serializers.SerializerMethodField()

    class Meta:
        model = Elections
        fields = [
            "id",  "name", "image", "dueDate",
            "type", "result", "votes", "seats",
            "electors", "electorsMales", "electorsFemales",
            "attendees", "attendeesMales", "attendeesFemales",
            "category", "subCategory",
            "status", "priority", 
            "moderators", "created_by", "updated_by", "deleted_by", "created_at", "updated_at", "deleted_at", "deleted",
        ]

    def get_name(self, obj):
        if obj.sub_category:
            # Check if duedate exists and is not None
            if obj.duedate:
                # Extract the year from the duedate field of the object
                year = obj.duedate.year  
                return f"{obj.sub_category.name} - {year}"
            else:
                # Handle the case where duedate is None
                return f"{obj.sub_category.name} - No Due Date"
        return None  # Return None or a default name if you have one

    def get_image(self, obj):
        if obj.sub_category and obj.sub_category.image:
            return obj.sub_category.image.url
        return None  # Return None or a default image URL if you have one

    def get_created_y(self, obj):  # Updated method name
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
                    "image": mod.image.url,
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

    # New method to get the candidates count for each election
    def get_candidateCount(self, obj):
        return ElectionCandidates.objects.filter(election=obj).count()


class ElectionCandidatesSerializer(serializers.ModelSerializer):
    def get_required_serializers(self):
        from ..serializers import CandidatesSerializer, CampaignsSerializer
        election = ElectionsSerializer(read_only=True)  # Corrected the field name here
        candidate = CandidatesSerializer(read_only=True)
        campaigns = CampaignsSerializer(
            many=True, read_only=True, source="campaigns.all"
        )

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
        model = ElectionCommitteeResults
        fields = ('id', 'election_committee', 'election_candidate', 'votes')
