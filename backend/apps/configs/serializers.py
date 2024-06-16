# Campaign Serializers
from rest_framework import serializers
from apps.configs.models import Config

# PROJECT
class ConfigsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Config
        fields = "__all__"
