from rest_framework import serializers
from restapi.models import Candidates, User
from restapi.helper.base_serializer import TrackMixin, TaskMixin, AdminFieldMixin

class CandidatesSerializer(AdminFieldMixin, serializers.ModelSerializer):
    """ Serializer for the Candidates model. """
    admin_serializer_classes = (TrackMixin, TaskMixin)
   
    class Meta:
        model = Candidates
        fields = [
            "id",  "name", "gender", "image", "description",
            "phone", "email", "twitter", "instagram",
        ]
