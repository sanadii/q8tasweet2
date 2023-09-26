# Campaign Serializers
from rest_framework import serializers
from .models import *

# PROJECT
class ProjectInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectInfo
        fields = "__all__"
