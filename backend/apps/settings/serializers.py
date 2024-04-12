# Campaign Serializers
from rest_framework import serializers
from apps.settings.models import Config

# PROJECT
class ConfigsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Config
        fields = "__all__"
