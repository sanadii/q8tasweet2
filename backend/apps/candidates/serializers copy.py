# Campaign Serializers
from rest_framework import serializers
# Models
from apps.campaigns.models import Campaign, CampaignMember, CampaignGuarantee, CampaignAttendee
from apps.elections.models import Election, ElectionCandidate, ElectionCommittee
from apps.candidates.models import Candidate
from electors.models import Elector
from apps.categories.models import Category
from django.contrib.auth.models import Group, Permission
import json

class CandidateSerializer(serializers.ModelSerializer):
    moderators = serializers.SerializerMethodField()  # New custom field

    # Change to camelCase for react State use
    createdDate = serializers.CharField(source="created_date")
    updatedDate = serializers.CharField(source="updated_date")
    deletedDate = serializers.CharField(source="deleted_date")  # Add this line

    createdBy = serializers.SerializerMethodField()  # Renamed to camelCase
    updatedBy = serializers.SerializerMethodField()  # Renamed to camelCase
    deletedBy = serializers.SerializerMethodField()  # Renamed to camelCase

    class Meta:
        model = Candidate
        fields = [
            "id",  "name", "image",
            # "description", "gender", "phone", "email", "twitter", "instagram",
            "status", "priority", 
            "moderators", "createdBy", "updatedBy", "deletedBy", "createdDate", "updatedDate", "deletedDate", "deleted",
        ]

    def get_createdBy(self, obj):  # Updated method name
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
                    "img": mod.image.url,
                    "name": f"{mod.first_name} {mod.last_name}",
                }
                for mod in moderators
            ]
        else:
            return []

