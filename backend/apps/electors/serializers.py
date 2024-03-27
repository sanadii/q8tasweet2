# Campaign Serializers
from rest_framework import serializers
from apps.electors.models import Elector

class ElectorsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Elector
        fields = ["civil", "full_name", "gender", "box_no", "membership_no", "enrollment_date", "notes"]
