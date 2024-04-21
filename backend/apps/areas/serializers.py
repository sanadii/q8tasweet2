from rest_framework import serializers
from apps.areas.models import Area

class AreaSerializer(serializers.ModelSerializer):
    """Serializer for the Area model."""

    class Meta:
        model = Area
        fields = ["id", "name", "code", "governorate"]
