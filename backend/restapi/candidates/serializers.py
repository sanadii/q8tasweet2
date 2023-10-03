from rest_framework import serializers
from restapi.models import Candidates, User
from restapi.base_serializer import TrackMixin, TaskMixin, AdminFieldMixin

class CandidatesSerializer(AdminFieldMixin, serializers.ModelSerializer):
    """ Serializer for the Candidates model. """
    admin_serializer_classes = (TrackMixin, TaskMixin)  # Define the tuple of admin serializers here.
   
    class Meta:
        model = Candidates
        fields = [
            "id",  "name", "gender", "image", "description",
            "phone", "email", "twitter", "instagram",
        ]
        # Exlude when used by other Serliazier + Action: get_fields
        exclude_task_track_fields = ["task", "track"]

    def get_fields(self):
        fields = super().get_fields()
        if self.context.get("exclude_task_track", False):
            for field in self.Meta.exclude_task_track_fields:
                fields.pop(field, None)
        return fields
