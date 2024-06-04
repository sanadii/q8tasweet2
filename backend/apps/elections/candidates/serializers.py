# elections/serializers.py
from rest_framework import serializers
from datetime import datetime  # Importing datetime
from django.db.models import F
import json

from utils.base_serializer import TrackMixin, TaskMixin, AdminFieldMixin

from apps.elections.candidates.models import (
    ElectionCandidate,
    ElectionParty,
    ElectionPartyCandidate,
)

from django.contrib.contenttypes.models import ContentType
from apps.campaigns.models import Campaign
from apps.campaigns.serializers import CampaignSerializer

from apps.schemas.committee_results.models import CommitteeResultCandidate
from apps.schemas.committees.models import Committee
from apps.auths.serializers import UserSerializer
from apps.schemas.committees.serializers import CommitteeSerializer
from apps.schemas.committee_results.serializers import CommitteeResultCandidateSerializer
from utils.schema import schema_context


class ElectionCandidateSerializer(AdminFieldMixin, serializers.ModelSerializer):
    """Serializer for the ElectionCandidate model."""

    admin_serializer_classes = (TrackMixin,)

    name = serializers.CharField(source="candidate.name", read_only=True)
    gender = serializers.IntegerField(source="candidate.gender", read_only=True)
    image = serializers.SerializerMethodField("get_candidate_image")
    campaign = serializers.SerializerMethodField("get_candidate_campaign")
    # committee_results = serializers.SerializerMethodField("get_committee_results")

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
            "note",
            "result",
            "position",
            "campaign",
            # "committee_results",
        ]

    def get_candidate_image(self, obj):
        if obj.candidate and obj.candidate.image:
            return obj.candidate.image.url
        return None

    def get_committee_results(self, obj):
        request = self.context.get("request")
        schema = request.resolver_match.kwargs.get("slug") if request else None

        if not schema:
            return None

        try:
            with schema_context(schema):
                # Fetch all committee results from the custom schema
                committee_result_candidate = CommitteeResultCandidate.objects.filter(
                    election_candidate=obj.id
                )
                committee_result_candidate_serialized = (
                    CommitteeResultCandidateSerializer(
                        committee_result_candidate, many=True
                    ).data
                )

                return committee_result_candidate_serialized
        except Exception as e:
            print(f"Error: {str(e)}")
            return None

    def get_candidate_campaign(self, obj):
        try:
            campaign = Campaign.objects.get(campaigner_id=obj.id)
            return CampaignSerializer(campaign).data
        except Exception as e:
            return None


class ElectionPartySerializer(AdminFieldMixin, serializers.ModelSerializer):
    """Serializer for the ElectionParty model."""

    admin_serializer_classes = (TrackMixin,)

    name = serializers.CharField(source="party.name", read_only=True)
    image = serializers.SerializerMethodField("get_party_image")
    # committee_results = ElectionPartyCommitteeResultSerializer(
    #     source="party_committee_result_candidates", many=True, read_only=True
    # )
    # committee_sorting = serializers.SerializerMethodField()

    class Meta:
        model = ElectionParty
        fields = [
            "id",
            "election",
            "party",
            "name",
            "image",
            "votes",
            "note",
            # "committee_results",
            # "committee_sorting"
        ]

    def get_party_image(self, obj):
        if obj.party and obj.party.image:
            return obj.party.image.url
        return None

    def create(self, validated_data):
        """Customize creation (POST) of an instance"""
        return super().create(validated_data)

    def update(self, instance, validated_data):
        """Customize update (PUT, PATCH) of an instance"""
        # Additional logic to customize instance updating
        return super().update(instance, validated_data)


class ElectionPartyCandidateSerializer(AdminFieldMixin, serializers.ModelSerializer):
    """Serializer for the ElectionPartyCandidate model."""

    admin_serializer_classes = (TrackMixin,)

    name = serializers.CharField(source="election_candidate.candidate.name", read_only=True)
    gender = serializers.IntegerField(source="election_candidate.candidate.gender", read_only=True)
    image = serializers.SerializerMethodField("get_candidate_image")
    # committee_results = ElectionPartyCandidateCommitteeResultSerializer(
    #     source="party_candidate_committee_result_candidates", many=True, read_only=True
    # )
    # committee_sorting = serializers.SerializerMethodField()

    class Meta:
        model = ElectionPartyCandidate
        fields = [
            "id",
            "election_party",
            "election_candidate",
            "name",
            "gender",
            "image",
            "votes",
            "note",
            # "committee_results",
            # "committee_sorting"
        ]

    def get_candidate_image(self, obj):
        if obj.election_candidate and obj.election_candidate.candidate.image:
            return obj.election_candidate.candidate.image.url
        return None

    def create(self, validated_data):
        """Customize creation (POST) of an instance"""
        return super().create(validated_data)

    def update(self, instance, validated_data):
        """Customize update (PUT, PATCH) of an instance"""
        # Additional logic to customize instance updating
        return super().update(instance, validated_data)
