# campaigns/serializers.py
from rest_framework import serializers
from django.conf import settings  # Import Django settings to access MEDIA_URL
from django.contrib.auth.models import Group, Permission
from rest_framework import serializers

# Apps
from apps.campaigns.members.models import CampaignMember
from apps.campaigns.guarantees.models import CampaignGuarantee, CampaignGuaranteeGroup
from utils.base_serializer import TrackMixin, TaskMixin, AdminFieldMixin



#
# Campaign Guarantee Serializers
#
class CampaignGuaranteeGroupSerializer(serializers.ModelSerializer):
    # Ensure these fields exist on the CampaignGuaranteeGroup model or related models
    class Meta:
        model = CampaignGuaranteeGroup
        fields = ["id", "name", "member", "phone", "note"]

    def create(self, validated_data):
        # Custom creation logic here
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # Custom update logic here
        return super().update(instance, validated_data)


#
# Campaign Guarantee Serializers
#
class CampaignGuaranteeSerializer(serializers.ModelSerializer):

    # get the data from Elector Model Directly
    full_name = serializers.CharField(
        source="civil.full_name", default="Not Found", read_only=True
    )
    gender = serializers.IntegerField(source="civil.gender", default=-1, read_only=True)
    membership_no = serializers.CharField(
        source="civil.membership_no", default="Not Found", read_only=True
    )
    box_no = serializers.CharField(
        source="civil.box_no", default="Not Found", read_only=True
    )
    enrollment_date = serializers.DateField(
        source="civil.enrollment_date", default=None, read_only=True
    )
    relationship = serializers.CharField(
        source="civil.relationship", default="Not Found", read_only=True
    )
    voter_notes = serializers.CharField(
        source="civil.notes", default="Not Found", read_only=True
    )
    # attended = serializers.SerializerMethodField()
    guarantee_groups = serializers.PrimaryKeyRelatedField(
        many=True, queryset=CampaignGuaranteeGroup.objects.all(), required=False
    )

    class Meta:
        model = CampaignGuarantee
        fields = [
            "id",
            "campaign",
            "member",
            "civil",
            "full_name",
            "gender",
            "phone",
            "notes",
            "status",
            # "attended",
            "membership_no",
            "box_no",
            "enrollment_date",
            "relationship",
            "voter_notes",
            "guarantee_groups",
        ]

    # def get_attended(self, obj):
    #     return CampaignAttendee.objects.filter(civil=obj.civil).exists()


#
# Campaign Party Guarantee Serializer
#
# class CampaignPartyGuaranteeSerializer(serializers.ModelSerializer):

#     # get the data from Elector Model Directly
#     full_name = serializers.CharField(
#         source="civil.full_name", default="Not Found", read_only=True
#     )
#     gender = serializers.IntegerField(source="civil.gender", default=-1, read_only=True)
#     membership_no = serializers.CharField(
#         source="civil.membership_no", default="Not Found", read_only=True
#     )
#     box_no = serializers.CharField(
#         source="civil.box_no", default="Not Found", read_only=True
#     )
#     enrollment_date = serializers.DateField(
#         source="civil.enrollment_date", default=None, read_only=True
#     )
#     relationship = serializers.CharField(
#         source="civil.relationship", default="Not Found", read_only=True
#     )
#     voter_notes = serializers.CharField(
#         source="civil.notes", default="Not Found", read_only=True
#     )
#     attended = serializers.SerializerMethodField()

#     class Meta:
#         model = CampaignPartyGuarantee
#         fields = [
#             "id",
#             "campaign",
#             "member",
#             "civil",
#             "full_name",
#             "gender",
#             "phone",
#             "notes",
#             "status",
#             "attended",
#             "membership_no",
#             "box_no",
#             "enrollment_date",
#             "relationship",
#             "voter_notes",
#         ]

#     def get_attended(self, obj):
#         return CampaignAttendee.objects.filter(civil=obj.civil).exists()

#     def create(self, validated_data):
#         return super().create(validated_data)

#     def update(self, instance, validated_data):
#         return super().update(instance, validated_data)
