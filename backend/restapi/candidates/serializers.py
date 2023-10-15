from rest_framework import serializers
from restapi.models import Candidate, User
from restapi.helper.base_serializer import TrackMixin, TaskMixin, AdminFieldMixin

class CandidatesSerializer(AdminFieldMixin, serializers.ModelSerializer):
    """ Serializer for the Candidate model. """
    admin_serializer_classes = (TrackMixin, TaskMixin)
   
    class Meta:
        model = Candidate
        fields = [
            "id",  "name", "gender", "image",
            # "description", "gender", "phone", "email", "twitter", "instagram",
            # "phone", "email", "twitter", "instagram",
        ]
