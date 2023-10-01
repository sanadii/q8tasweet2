from rest_framework import serializers
from restapi.models import Candidates, User
from restapi.base_serializer import TrackMixin, TaskMixin

class CandidatesSerializer(TrackMixin, TaskMixin, serializers.ModelSerializer):
    class Meta:
        model = Candidates
        fields = [
            "id",  "name", "gender", "image", "description",
            "phone", "email", "twitter", "instagram",
            "status", "priority", 
            "moderators",
            "created_by", "updated_by", "deleted_by",
            "created_at", "updated_at", "deleted_at",
            "deleted",
        ]
