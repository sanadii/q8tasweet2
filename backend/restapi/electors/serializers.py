# Campaign Serializers
from rest_framework import serializers
from restapi.models import *

class ElectorsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Electors
        fields = "__all__"