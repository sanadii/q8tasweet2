# Committees & Committee Results
# elections/serializers.py
from rest_framework import serializers
from datetime import datetime  # Importing datetime
from django.db.models import F
import json

from utils.base_serializer import TrackMixin, TaskMixin, AdminFieldMixin

# Models
from apps.areas.models import Area

from apps.committees.models import Committee, Committee

# ,CommitteResult

from apps.areas.serializers import AreaSerializer


# Serializers
class CommitteSerializer(serializers.ModelSerializer):
    """Serializer for the Committee model."""

    class Meta:
        model = Committee
        fields = ["id",
                #   "serial", 
                  "type", "letters", 
                  "area_name",
                  "committee"]


class CommitteeSerializer(serializers.ModelSerializer):
    """Serializer for the Committee model."""

    committees = CommitteSerializer(many=True, read_only=True)
    # area = AreaSerializer(read_only=True)

    class Meta:
        model = Committee
        fields = [
            'id',
            "serial",
            "name",
            "circle",
            # "area",
            "area_name",
            "gender",
            "description",
            "address",
            "voter_count",
            "committee_count",
            "tag",
            "election",
            "committees",
        ]

    def create(self, validated_data):
        """Customize creation (POST) of an instance"""
        return super().create(validated_data)

    def update(self, instance, validated_data):
        """Customize update (PUT, PATCH) of an instance"""
        # Additional logic to customize instance updating
        return super().update(instance, validated_data)


# # Votting and Sorting
# class CommitteeResultSerializer(serializers.ModelSerializer):
#     admin_serializer_classes = (TrackMixin,)

#     class Meta:
#         model = CommitteResult
#         # fields = "__all__"
#         fields = ["election_committee", "votes"]


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
