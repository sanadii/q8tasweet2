# Campaign Serializers
from rest_framework import serializers
from apps.voters.models import Voter

class ElectorsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Voter
        fields = ["civil", "full_name", "gender", "box_no", "membership_no", "enrollment_date", "notes"]
