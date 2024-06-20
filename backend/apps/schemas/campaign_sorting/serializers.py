# campaigns/serializers.py
from rest_framework import serializers
from utils.base_serializer import TrackMixin, TaskMixin, AdminFieldMixin
from django.conf import settings  # Import Django settings to access MEDIA_URL

# App Models
from apps.campaigns.models import Campaign
from apps.elections.candidates.models import ElectionPartyCandidate
# Serializers
from apps.elections.serializers import ElectionSerializer
# from apps.elections.candidates.serializers import ElectionPartySerializer
from apps.candidates.serializers import CandidateSerializer, PartySerializer
from apps.schemas.campaign_sorting.models import CampaignSorting
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


class CampaignPartySerializer(AdminFieldMixin, serializers.ModelSerializer):
    """ Serializer for the Campaign model. """
    admin_serializer_classes = (TrackMixin, TaskMixin)
    party = PartySerializer(source='election_party.party', read_only=True)
    election = ElectionSerializer(source='election_party.election', read_only=True)

    class Meta:
        model = Campaign
        fields = [
            "id", "election_party", "election", "party", "slug",
            "description", "target_votes",
            "twitter", "instagram", "website",
            ]

    def to_representation(self, instance):
        rep = super().to_representation(instance)

        # Remove unwanted fields from nested serializers
        if "election" in rep:
            rep["election"].pop("track", None)
            rep["election"].pop("task", None)

        if "party" in rep:
            rep["party"].pop("track", None)
            rep["party"].pop("task", None)

        return rep
