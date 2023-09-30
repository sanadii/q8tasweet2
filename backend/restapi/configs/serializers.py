# Campaign Serializers
from rest_framework import serializers
from restapi.models import *

# PROJECT
class ConfigsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Configs
        fields = "__all__"
