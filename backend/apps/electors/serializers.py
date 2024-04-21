# Campaign Serializers
from rest_framework import serializers
from apps.electors.models import Elector


class ElectorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Elector
        fields = '__all__'
        # fields = [
        #     "civil",
        #     "full_name",
        #     "gender",
        #     "box_no",
        #     "membership_no",
        #     "enrollment_date",
        #     "notes",
        # ]
