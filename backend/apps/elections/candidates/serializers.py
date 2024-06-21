# elections/serializers.py
from rest_framework import serializers


# Apps Models
from apps.elections.candidates.models import (
    ElectionCandidate,
    ElectionParty,
    ElectionPartyCandidate,
)

from apps.campaigns.models import Campaign
from apps.schemas.committee_results.models import CommitteeResultCandidate
from apps.schemas.committees.models import Committee
from apps.schemas.campaign_sorting.models import SortingCampaign, SortingElection


# Apps Serializers
from utils.base_serializer import TrackMixin, TaskMixin, AdminFieldMixin
from apps.campaigns.serializers import CampaignSerializer
from apps.schemas.committee_results.serializers import (
    CommitteeResultCandidateSerializer,
)
from apps.schemas.campaign_sorting.serializers import CampaignSortingSerializer

from utils.schema import schema_context


class ElectionCandidateSerializer(AdminFieldMixin, serializers.ModelSerializer):
    """Serializer for the ElectionCandidate model."""

    admin_serializer_classes = (TrackMixin,)

    name = serializers.CharField(source="candidate.name", read_only=True)
    gender = serializers.IntegerField(source="candidate.gender", read_only=True)
    image = serializers.SerializerMethodField("get_candidate_image")
    campaign = serializers.SerializerMethodField("get_candidate_campaign")
    party = serializers.SerializerMethodField("get_candidate_party")
    party_name = serializers.SerializerMethodField("get_candidate_party_name")
    committee_results = serializers.SerializerMethodField("get_committee_results")
    campaign_sorting = serializers.SerializerMethodField("get_campaign_sorting")

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
            "result",
            "position",
            "campaign",
            "party",
            "party_name",
            "committee_results",
            "campaign_sorting",
        ]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        is_current = self.context.get("is_current", True)
        if not is_current:
            self.fields.pop("committee_results")
            self.fields.pop("campaign_sorting")

    def get_candidate_image(self, obj):
        if obj.candidate and obj.candidate.image:
            return obj.candidate.image.url
        return None

    def get_candidate_party(self, obj):
        try:
            election_party = ElectionPartyCandidate.objects.get(election_candidate=obj.id)
            return election_party.election_party.id
        except ElectionPartyCandidate.DoesNotExist:
            return None

    def get_candidate_party_name(self, obj):
        try:
            election_party = ElectionPartyCandidate.objects.get(election_candidate=obj.id)
            return election_party.election_party.party.name
        except ElectionPartyCandidate.DoesNotExist:
            return None

    def get_candidate_campaign(self, obj):
        try:
            campaign = Campaign.objects.get(election_candidate=obj.id)
            return CampaignSerializer(campaign).data
        except Exception:
            return None

    def get_committee_results(self, obj):
        request = self.context.get("request")
        election = obj.election
        schema = election.slug if election else None

        if not schema:
            return None

        with schema_context(schema):
            committee_results = CommitteeResultCandidate.objects.filter(election_candidate=obj.id)
            return CommitteeResultCandidateSerializer(committee_results, many=True).data

    def get_campaign_sorting(self, obj):
        request = self.context.get("request")
        election = obj.election
        schema = election.slug if election else None

        if not schema:
            return None

        with schema_context(schema):
            sorting_data = self.get_sorting_data_from_source(obj)
            return CampaignSortingSerializer(sorting_data, many=True, read_only=True).data

    def get_sorting_data_from_source(self, obj):
        request = self.context.get("request")
        if request and "GetElectionDetails" in request.resolver_match.url_name:
            return SortingElection.objects.filter(election_candidate=obj.id)
        else:
            return SortingCampaign.objects.filter(election_candidate=obj.id)


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
            "notes",
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

    name = serializers.CharField(
        source="election_candidate.candidate.name", read_only=True
    )
    gender = serializers.IntegerField(
        source="election_candidate.candidate.gender", read_only=True
    )
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
            "notes",
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
