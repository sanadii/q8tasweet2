# campaigns/guarantees/serializers.py
from rest_framework import serializers

# Apps
from apps.schemas.guarantees.models import CampaignGuarantee, CampaignGuaranteeGroup


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
    full_name = serializers.CharField(
        source="elector.full_name", default="Elector Full Name Not Found", read_only=True
    )
    gender = serializers.CharField(
        source="elector.gender", default="Elector Gender Not Found", read_only=True
    )
    job = serializers.CharField(
        source="elector.job", default="Elector Job Not Found", read_only=True
    )
    age = serializers.IntegerField(
        source="elector.age", default=None, read_only=True
    )
    committee = serializers.CharField(
        source="elector.committee.name", default="Elector Committee Name Not Found", read_only=True
    )
    committee_area = serializers.CharField(
        source="elector.committee_area", default="Elector Committee Area Not Found", read_only=True
    )
    committee_name = serializers.CharField(
        source="elector.committee_name", default="Elector Committee Name Not Found", read_only=True
    )
    letter = serializers.CharField(
        source="elector.letter", default="Elector Letter Not Found", read_only=True
    )
    code_number = serializers.CharField(
        source="elector.code_number", default="Elector Code Number Not Found", read_only=True
    )
    status_code = serializers.CharField(
        source="elector.status_code", default="Elector Status Not Found", read_only=True
    )
    address = serializers.CharField(
        source="elector.address", default="Elector Address Not Found", read_only=True
    )

    class Meta:
        model = CampaignGuarantee
        fields = [
            # guarantee
            "id", "member", "elector", "guarantee_group", "phone", "status",
            # Elector
            "full_name", 
            "gender", "job", "age",
            "address",
            # # Election Details 
            "committee", "committee_area",  "committee_name",
            "letter", "code_number", "status_code",
        ]


    # def get_attended(self, obj):
    #     return CampaignAttendee.objects.filter(elector=obj.elector).exists()


#
# Campaign Party Guarantee Serializer
#
# class CampaignPartyGuaranteeSerializer(serializers.ModelSerializer):

#     # get the data from Elector Model Directly
#     full_name = serializers.CharField(
#         source="elector.full_name", default="Not Found", read_only=True
#     )
#     gender = serializers.IntegerField(source="elector.gender", default=-1, read_only=True)
#     membership_no = serializers.CharField(
#         source="elector.membership_no", default="Not Found", read_only=True
#     )
#     box_no = serializers.CharField(
#         source="elector.box_no", default="Not Found", read_only=True
#     )
#     enrollment_date = serializers.DateField(
#         source="elector.enrollment_date", default=None, read_only=True
#     )
#     relationship = serializers.CharField(
#         source="elector.relationship", default="Not Found", read_only=True
#     )
#     voter_notes = serializers.CharField(
#         source="elector.notes", default="Not Found", read_only=True
#     )
#     attended = serializers.SerializerMethodField()

#     class Meta:
#         model = CampaignPartyGuarantee
#         fields = [
#             "id",
#             "campaign",
#             "member",
#             "elector",
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
#         return CampaignAttendee.objects.filter(elector=obj.elector).exists()

#     def create(self, validated_data):
#         return super().create(validated_data)

#     def update(self, instance, validated_data):
#         return super().update(instance, validated_data)