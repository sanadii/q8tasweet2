# Committees & Committee Results
# elections/serializers.py
from rest_framework import serializers
from utils.base_serializer import TrackMixin, TaskMixin, AdminFieldMixin

# Models
from apps.committees.results.models import CommitteeResultCandidate


# # Votting and Sorting
class CommitteeResultCandidateSerializer(serializers.ModelSerializer):
    admin_serializer_classes = (TrackMixin,)

    class Meta:
        model = CommitteeResultCandidate
        fields = "__all__"
        # fields = ["committee", "election_candidate", "votes"]


# class ElectionPartyCommitteeResultSerializer(
#     AdminFieldMixin, serializers.ModelSerializer
# ):
#     admin_serializer_classes = (TrackMixin,)

#     class Meta:
#         model = PartyCommitteeResult
#         fields = ["election_committee", "votes"]


# class ElectionPartyCandidateCommitteeResultSerializer(
#     AdminFieldMixin, serializers.ModelSerializer
# ):
#     admin_serializer_classes = (TrackMixin,)

#     class Meta:
#         model = PartyCandidateCommitteeResult
#         fields = ["election_committee", "votes"]


# class CampaignSortingSerializer(serializers.ModelSerializer):

#     class Meta:
#         model = CampaignSorting
#         fields = "__all__"