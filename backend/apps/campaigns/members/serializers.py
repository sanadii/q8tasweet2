# campaigns/serializers.py
from rest_framework import serializers
from apps.campaigns.members.models import CampaignMember
from rest_framework import serializers


#
# Campaign Members Serializers
#
class BaseCampaignMemberSerializer(serializers.ModelSerializer):

    class Meta:
        abstract = True  # Mark as abstract to prevent direct usage

    def get_name(self, obj):
        if obj.user:
            return f"{obj.user.first_name} {obj.user.last_name}"
        return "User not found"

    # def get_permissions(self, obj):
    #     # Ensure that the campaign member has an associated role
    #     if not obj.role:
    #         return []

    def get_permissions(self, obj):
        if obj.role:
            # Access permissions as a property, not as a method
            campaign_member_permissions = list(
                obj.role.permissions.values_list("codename", flat=True)
            )
            return campaign_member_permissions
        return []


class CampaignMemberSerializer(BaseCampaignMemberSerializer):
    name = serializers.SerializerMethodField()
    permissions = serializers.SerializerMethodField()

    class Meta:
        model = CampaignMember
        fields = "__all__"  # Or specify required fields

    def get_name(self, obj):
        if obj.user:
            return f"{obj.user.first_name} {obj.user.last_name}"
        return "User not found"

    # def get_permissions(self, obj):
    #     # Ensure that the campaign member has an associated role
    #     if not obj.role:
    #         return []

    def get_permissions(self, obj):
        if obj.role:
            # Access permissions as a property, not as a method
            campaign_member_permissions = list(
                obj.role.permissions.values_list("codename", flat=True)
            )
            return campaign_member_permissions
        return []


# class CampaignPartyMemberSerializer(BaseCampaignMemberSerializer):
#     class Meta:
#         model = CampaignPartyMember
#         fields = "__all__"  # Or specify required fields
