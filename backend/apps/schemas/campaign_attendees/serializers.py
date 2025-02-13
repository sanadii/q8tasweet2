# /schemas/election_attendees/serializers.py
from rest_framework import serializers

# Models
from apps.schemas.campaign_attendees.models import CampaignAttendee

# class CampaignAttendeeSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = CampaignAttendee
#         fields = '__all__'


class CampaignAttendeeSerializer(serializers.ModelSerializer):
    # Directly get the data from the Elector Model
    full_name = serializers.CharField(
        source="elector.full_name", default="Not Found", read_only=True
    )
    gender = serializers.IntegerField(source="elector.gender", default=-1, read_only=True)
    membership_no = serializers.CharField(
        source="elector.membership_no", default="Not Found", read_only=True
    )
    box_no = serializers.CharField(
        source="elector.box_no", default="Not Found", read_only=True
    )
    enrollment_date = serializers.DateField(
        source="elector.enrollment_date", default=None, read_only=True
    )
    relationship = serializers.CharField(
        source="elector.relationship", default="Not Found", read_only=True
    )
    voter_notes = serializers.CharField(
        source="elector.notes", default="Not Found", read_only=True
    )
    # attended field will not be included here since it's specific to CampaignGuarantee model

    class Meta:
        model = CampaignAttendee
        fields = [
            "id",
            "member",
            "committee",
            "elector",
            "notes",
            "full_name",
            "gender",
            "membership_no",
            "box_no",
            "enrollment_date",
            "relationship",
            "voter_notes",
        ]

    def create(self, validated_data):
        return super().create(validated_data)

    def update(self, instance, validated_data):
        return super().update(instance, validated_data)


# class CampaignCommitteeAttendeeSerializer(AdminFieldMixin, serializers.ModelSerializer):
#     """Serializer for the Committee model."""

#     admin_serializer_classes = (TrackMixin,)

#     # sorter = UserSerializer(read_only=True)

#     class Meta:
#         model = CampaignCommitteeAttendee
#         fields = ["id", "user", "campaign", "committee"]

#     def create(self, validated_data):
#         """Customize creation (POST) of an instance"""
#         return super().create(validated_data)

#     def update(self, instance, validated_data):
#         """Customize update (PUT, PATCH) of an instance"""
#         # Additional logic to customize instance updating
#         return super().update(instance, validated_data)
