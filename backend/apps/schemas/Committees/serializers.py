
# elections/serializers.py
from rest_framework import serializers
from datetime import datetime  # Importing datetime
from django.db.models import F
import json

from utils.base_serializer import TrackMixin, TaskMixin, AdminFieldMixin

# Models
from apps.areas.models import Area

from apps.elections.models import (
    Election,
    ElectionCategory,
    ElectionCandidate,
    ElectionParty,
    ElectionPartyCandidate,
    ElectionCommittee,
    ElectionCommitteeGroup,
    ElectionCommitteeResult,
    ElectionPartyCandidateCommitteeResult,
    ElectionPartyCommitteeResult,
)

# from apps.committees.models import Committee, CommitteeGroup
from apps.campaigns.models import CampaignSorting

from apps.auths.serializers import UserSerializer


# Candidates and Parties
class ElectionCandidateSerializer(AdminFieldMixin, serializers.ModelSerializer):
    """Serializer for the ElectionCandidate model."""

    admin_serializer_classes = (TrackMixin,)

    name = serializers.CharField(source="candidate.name", read_only=True)
    gender = serializers.IntegerField(source="candidate.gender", read_only=True)
    image = serializers.SerializerMethodField("get_candidate_image")
    committee_votes = ElectionCommitteeResultSerializer(
        source="committee_result_candidates", many=True, read_only=True
    )
    
    committee_sorting = serializers.SerializerMethodField()

    class Meta:
        model = ElectionCandidate
        fields = [
            "id",
            "election",
            "candidate",
            "name",
            "gender",
            "image",
            "votes",
            "notes",
            "committee_votes",
            "committee_sorting",
            
            "result",
            "position",
        ]

    def get_committee_sorting(self, obj):
        # Access the request context from self.context
        request = self.context.get("request") if self.context else None
        source = (
            "election_candidate_sortings"
            if request and "GetElectionDetails" in request.resolver_match.url_name
            else "campaign_candidate_sortings"
        )
        # Assuming you have a method to get the sorting data from the source
        sorting_data = self.get_sorting_data_from_source(obj, source)
        return CampaignSortingSerializer(sorting_data, many=True, read_only=True).data

    # You might need to implement this method based on your logic
    def get_sorting_data_from_source(self, obj, source):
        if source == "election_candidate_sortings":
            return (
                obj.election_candidate_sortings.all()
            )  # Replace with appropriate query
        elif source == "campaign_candidate_sortings":
            return (
                obj.campaign_candidate_sortings.all()
            )  # Replace with appropriate query
        else:
            raise ValueError(f"Invalid source: {source}")

    def get_candidate_image(self, obj):
        if obj.candidate and obj.candidate.image:
            return obj.candidate.image.url
        return None

    def create(self, validated_data):
        """Customize creation (POST) of an instance"""
        return super().create(validated_data)

    def update(self, instance, validated_data):
        """Customize update (PUT, PATCH) of an instance"""
        # Additional logic to customize instance updating
        return super().update(instance, validated_data)

