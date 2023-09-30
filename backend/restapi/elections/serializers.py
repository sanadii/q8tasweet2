# restapi/elections/serializers.py
import importlib
from rest_framework import serializers
from restapi.base_serializer import TrackingSerializer
from restapi.models import (
    User,
    Elections, ElectionCandidates, ElectionCommittees, ElectionCommitteeResults,
    Campaigns,
    Candidates,
    Categories,
    Electors
)
import json

class ElectionsSerializer(TrackingSerializer, serializers.ModelSerializer):
    """Serializer for the Elections model."""
    name = serializers.SerializerMethodField('get_election_name')
    image = serializers.SerializerMethodField('get_election_image')
    moderators = serializers.SerializerMethodField('get_election_moderators')

    class Meta:
        model = Elections
        fields = [
            "id", "name", "image", "duedate",
            "type", "result", "votes", "seats",
            "electors", "electors_males", "electors_females",
            "attendees", "attendees_males", "attendees_females",
            "category", "sub_category",
            "status", "priority", 
            "moderators",
            "created_by", "updated_by", "deleted_by",
            "created_at", "updated_at", "deleted_at",
            "deleted",
        ]

    def get_election_name(self, obj):
        """Construct a name for the election."""
        sub_category = getattr(obj, 'sub_category', None)
        if sub_category:
            year = getattr(obj.duedate, 'year', None)
            return f"{sub_category.name} - {year or 'No Due Date'}"
        return None

    def get_election_image(self, obj):
        """Retrieve the image URL of the election."""
        sub_category = getattr(obj, 'sub_category', None)
        if sub_category:
            image = getattr(sub_category, 'image', None)
            if image:
                return image.url
        return None
    
    def get_election_moderators(self, obj):
        """Retrieve the list of moderators for the election."""
        moderators_data = getattr(obj, 'moderators', None)
        if moderators_data:
            try:
                moderator_ids = json.loads(moderators_data)
                moderators = User.objects.filter(id__in=moderator_ids)
                return [{"id": mod.id, "image": mod.image.url, "name": f"{mod.first_name} {mod.last_name}"} for mod in moderators]
            except (json.JSONDecodeError, TypeError):
                return []
        return []

class ElectionCandidatesSerializer(serializers.ModelSerializer):

    class Meta:
        model = ElectionCandidates
        fields = ["id", "election", "candidate", "votes", "is_active", "deleted", "candidate_id", "name", "image", "gender", "candidate_deleted"]

    name = serializers.SerializerMethodField('get_candidate_name')
    image = serializers.SerializerMethodField('get_candidate_image')
    gender = serializers.CharField(source='candidate.gender', read_only=True)
    candidate_deleted = serializers.BooleanField(source='candidate.deleted', read_only=True)

    def get_candidate_name(self, obj):
        return obj.candidate.name if obj.candidate else None
    
    def get_candidate_image(self, obj):
        if obj.candidate:
            CandidatesSerializer = importlib.import_module('restapi.serializers').CandidatesSerializer
            candidate_serializer = CandidatesSerializer(obj.candidate)
            return candidate_serializer.data["image"]
        return None

class ElectionCommitteesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ElectionCommittees
        fields = "__all__"

class ElectionCommitteeResultsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ElectionCommitteeResults
        fields = ('id', 'election_committee', 'election_candidate', 'votes')
