# restapi/elections/serializers.py
from rest_framework import serializers
from restapi.base_serializer import TrackingMixin, TaskingMixin, AdminFieldMixin
from restapi.models import (
    Elections, ElectionCandidates, ElectionCommittees, ElectionCommitteeResults,
    Campaigns,
    Candidates,
    Categories,
    Electors
)
import json

class ElectionsSerializer(AdminFieldMixin, serializers.ModelSerializer):
    """ Serializer for the Elections model. """
    admin_serializer_classes = (TrackingMixin, TaskingMixin)  # Define the tuple of admin serializers here.
    name = serializers.SerializerMethodField('get_election_name')
    image = serializers.SerializerMethodField('get_election_image')
    
    class Meta:
        model = Elections
        fields = [
            "id", "name", "image", "duedate",
            "category", "sub_category",
            "type", "result", "votes", "seats",
            "electors", "electors_males", "electors_females",
            "attendees", "attendees_males", "attendees_females",
        ]
            

    def get_election_name(self, obj):
        sub_category = getattr(obj, 'sub_category', None)
        if sub_category:
            year = getattr(obj.duedate, 'year', None)
            return f"{sub_category.name} - {year or 'No Due Date'}"
        return None

    def get_election_image(self, obj):
        sub_category = getattr(obj, 'sub_category', None)
        if sub_category:
            image = getattr(sub_category, 'image', None)
            if image:
                return image.url
        return None
 
class ElectionCandidatesSerializer(TrackingMixin, serializers.ModelSerializer):

    class Meta:
        model = ElectionCandidates
        fields = [
            "id", "election", "candidate", "votes", "is_active",
            "deleted",
            "candidate_id", "name", "image", "gender",
            "created_by", "updated_by", "deleted_by",
            "created_at", "updated_at", "deleted_at",
            "deleted",
]

    name = serializers.SerializerMethodField('get_candidate_name')
    image = serializers.SerializerMethodField('get_candidate_image')
    gender = serializers.CharField(source='candidate.gender', read_only=True)

    def get_candidate_name(self, obj):
        return obj.candidate.name if obj.candidate else None
    
    def get_candidate_image(self, obj):
        if obj.candidate:
            from restapi.serializers import CandidatesSerializer
            candidate_serializer = CandidatesSerializer(obj.candidate)
            return candidate_serializer.data["image"]
        return None

class ElectionCommitteesSerializer(TrackingMixin, serializers.ModelSerializer):
    class Meta:
        model = ElectionCommittees
        fields = "__all__"

class ElectionCommitteeResultsSerializer(TrackingMixin, serializers.ModelSerializer):
    class Meta:
        model = ElectionCommitteeResults
        fields = "__all__"
