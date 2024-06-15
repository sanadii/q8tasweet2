# campaigns/guarantees/serializers.py
from rest_framework import serializers

# Apps
from apps.schemas.guarantees.models import CampaignGuarantee, CampaignGuaranteeGroup
from apps.schemas.campaign_attendees.models import CampaignAttendee


#
# Campaign Guarantee Serializers
#
class CampaignGuaranteeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CampaignGuarantee
        fields = ["id", "name", "member", "attended"]

class CampaignGuaranteeGroupSerializer(serializers.ModelSerializer):
    guarantees = serializers.SerializerMethodField()

    class Meta:
        model = CampaignGuaranteeGroup
        fields = ["id", "name", "member", "phone", "notes", "guarantees"]

    def get_guarantees(self, obj):
        # Query CampaignGuarantee to get related objects
        campaign_guarantees = CampaignGuarantee.objects.filter(guarantee_group=obj)
        return CampaignGuaranteeSerializer(campaign_guarantees, many=True).data

    def create(self, validated_data):
        # Custom creation logic here
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # Custom update logic here
        return super().update(instance, validated_data)

    def save(self, **kwargs):
        # Call the original save method to save CampaignGuaranteeGroup instance
        super().save(**kwargs)

        # Get the guarantees from the context or request data
        campaign_guarantee_ids = self.context["request"].data.get("guarantees")

        # Handle campaign_guarantee_ids
        if campaign_guarantee_ids:
            try:
                for guarantee_id in campaign_guarantee_ids:
                    # Retrieve the CampaignGuarantee object
                    guarantee = CampaignGuarantee.objects.get(id=guarantee_id)
                    
                    # Update the guarantee_group field in the CampaignGuarantee object
                    guarantee.guarantee_group = self.instance
                    guarantee.save()

                    print(f"CampaignGuarantee for guarantee {guarantee_id} updated successfully")
            except CampaignGuarantee.DoesNotExist:
                print(f"CampaignGuarantee with id {guarantee_id} does not exist")
                raise serializers.ValidationError(f"CampaignGuarantee with id {guarantee_id} does not exist")
            except Exception as e:
                print(f"Unexpected error occurred: {e}")
                raise serializers.ValidationError(f"Unexpected error: {e}")
        else:
            # If no campaign_guarantee_ids, remove all CampaignGuarantee entries related to the guarantee_group
            CampaignGuarantee.objects.filter(guarantee_group=self.instance).delete()
            print("All CampaignGuarantee entries related to the guarantee_group have been deleted")


#
# Campaign Guarantee Serializers
#
class CampaignGuaranteeSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(
        source="elector.full_name",
        default="Elector Full Name Not Found",
        read_only=True,
    )
    gender = serializers.CharField(
        source="elector.gender", default="Elector Gender Not Found", read_only=True
    )
    job = serializers.CharField(
        source="elector.job", default="Elector Job Not Found", read_only=True
    )
    age = serializers.IntegerField(source="elector.age", default=None, read_only=True)
    committee = serializers.CharField(
        source="elector.committee.name",
        default="Elector Committee Name Not Found",
        read_only=True,
    )
    committee_area = serializers.CharField(
        source="elector.committee_area",
        default="Elector Committee Area Not Found",
        read_only=True,
    )
    committee_name = serializers.CharField(
        source="elector.committee_name",
        default="Elector Committee Name Not Found",
        read_only=True,
    )
    letter = serializers.CharField(
        source="elector.letter", default="Elector Letter Not Found", read_only=True
    )
    code_number = serializers.CharField(
        source="elector.code_number",
        default="Elector Code Number Not Found",
        read_only=True,
    )
    status_code = serializers.CharField(
        source="elector.status_code", default="Elector Status Not Found", read_only=True
    )
    address = serializers.CharField(
        source="elector.address", default="Elector Address Not Found", read_only=True
    )
    attended = serializers.SerializerMethodField()

    class Meta:
        model = CampaignGuarantee
        fields = [
            # guarantee
            "id",
            "member",
            "elector",
            "guarantee_group",
            "phone",
            "status",
            # Elector
            "full_name",
            "gender",
            "job",
            "age",
            "address",
            # Committee
            "committee",
            "committee_area",
            "committee_name",
            "letter",
            "code_number",
            "status_code",
            # Attendeed?
            "attended",
        ]

    def get_attended(self, obj):
        attended = CampaignAttendee.objects.filter(elector=obj.elector).exists()
        return attended


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
