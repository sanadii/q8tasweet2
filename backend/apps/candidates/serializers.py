from rest_framework import serializers

# Models
from apps.candidates.models import Candidate
from apps.auths.models import User

from helper.base_serializer import TrackMixin, TaskMixin, AdminFieldMixin

class CandidatesSerializer(AdminFieldMixin, serializers.ModelSerializer):
    """ Serializer for the Candidate model. """
    admin_serializer_classes = (TrackMixin, TaskMixin)
    image = serializers.ImageField(required=False)

    class Meta:
        model = Candidate
        fields = [
            "id",  "name", "slug", "gender", "image",
            # "description", "gender", "phone", "email", "twitter", "instagram",
            # "phone", "email", "twitter", "instagram",
        ]
