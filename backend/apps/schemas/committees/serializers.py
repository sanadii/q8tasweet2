# Committees & Committee Results
# elections/serializers.py
import json
from datetime import datetime  # Importing datetime
from django.db.models import F
from rest_framework import serializers
from utils.base_serializer import TrackMixin, TaskMixin, AdminFieldMixin

# Models
from apps.schemas.areas.models import Area
from apps.schemas.committees.models import CommitteeSite, Committee
from apps.schemas.committee_results.models import CommitteeResultCandidate

from apps.schemas.areas.serializers import AreaSerializer


# Serializers
class CommitteeSerializer(serializers.ModelSerializer):
    """Serializer for the Committee model."""
    name = serializers.SerializerMethodField("get_committee_name")

    class Meta:
        model = Committee
        fields = ["id", "type", "letters", "area_name", "committee_site", "name"]

    def get_committee_name(self, obj):
        committee_site_name = obj.committee_site.name
        committee_type = obj.type
        committee_id = obj.id
        return f"{committee_site_name} - {committee_type} {committee_id}"


class CommitteeSiteSerializer(serializers.ModelSerializer):
    committees = CommitteeSerializer(many=True, read_only=True, source='committee_site_committees')
    area_name = serializers.SerializerMethodField()

    class Meta:
        model = CommitteeSite
        fields = [
            "id",
            "serial",
            "name",
            "circle",
            "area",
            "area_name",
            "gender",
            "description",
            "address",
            # "elector_count",
            "tags",
            "election",
            "committees",
        ]

    def get_area_name(self, obj):
        # Assuming 'area' is a ForeignKey to an Area model which has a 'name' field
        if obj.area:
            return obj.area.name
        return None

    def create(self, validated_data):
        committees_data = validated_data.pop(
            "committees", None
        )  # Example of extracting related data
        instance = super().create(validated_data)
        if committees_data:
            for committee_data in committees_data:
                Committee.objects.create(committee_site=instance, **committee_data)
        return instance

    def update(self, instance, validated_data):
        committees_data = validated_data.pop("committees", None)
        instance = super().update(instance, validated_data)
        if committees_data:
            # Example: Clear old data and replace with new
            instance.committees.all().delete()
            for committee_data in committees_data:
                Committee.objects.create(committee_site=instance, **committee_data)
        return instance

