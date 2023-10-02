from rest_framework import serializers
from restapi.models import Candidates, User
from restapi.base_serializer import TrackMixin, TaskMixin, AdminFieldMixin

class CandidatesSerializer(AdminFieldMixin, serializers.ModelSerializer):
    """ Serializer for the Candidates model. """
    admin_serializer_classes = (TrackMixin)  # Define the tuple of admin serializers here.
    class Meta:
        model = Candidates
        fields = [
            "id",  "name", "gender", "image", "description",
            "phone", "email", "twitter", "instagram",
        ]
