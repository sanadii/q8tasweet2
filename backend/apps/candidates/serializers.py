from rest_framework import serializers
from django.conf import settings  # Import Django settings to access MEDIA_URL

# Models
from apps.candidates.models import Candidate, Party
from apps.auths.models import User

from helper.base_serializer import TrackMixin, TaskMixin, AdminFieldMixin

class CandidateSerializer(AdminFieldMixin, serializers.ModelSerializer):
    """ Serializer for the Candidate model. """
    admin_serializer_classes = (TrackMixin, TaskMixin)
    image = serializers.SerializerMethodField()  # Use SerializerMethodField for custom serialization

    class Meta:
        model = Candidate
        fields = [
            "id", "name", "slug", "gender", "image",
            # "status", "priority", #TODO: need to be removed when task is fixing on Add/Edit/Delete
        ]

    def get_image(self, obj):
        # Check if the image field is not empty and generate the desired URL format
        if obj.image:
            return f"{settings.MEDIA_URL}{obj.image}"  # Use Django's MEDIA_URL to build the URL
        return None  # Return None if the image field is empty

class PartySerializer(AdminFieldMixin, serializers.ModelSerializer):
    """ Serializer for the Candidate model. """
    admin_serializer_classes = (TrackMixin, TaskMixin)
    image = serializers.SerializerMethodField()  # Use SerializerMethodField for custom serialization

    class Meta:
        model = Party
        fields = [
            "id", "name", "slug", "image",
        ]

    def get_image(self, obj):
        # Check if the image field is not empty and generate the desired URL format
        if obj.image:
            return f"{settings.MEDIA_URL}{obj.image}"  # Use Django's MEDIA_URL to build the URL
        return None  # Return None if the image field is empty
