# campaigns/serializers.py
from rest_framework import serializers
from apps.campaigns.members.models import CampaignMember

class CampaignMemberSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    permissions = serializers.SerializerMethodField()
    role_id = serializers.SerializerMethodField()
    role_name = serializers.SerializerMethodField()
    role_codename = serializers.SerializerMethodField()

    class Meta:
        model = CampaignMember
        fields = "__all__"  # Or specify required fields

    def get_name(self, obj):
        if obj.user:
            return f"{obj.user.first_name} {obj.user.last_name}"
        return "User not found"

    def get_permissions(self, obj):
        if obj.role:
            campaign_member_permissions = list(
                obj.role.permissions.values_list("codename", flat=True)
            )
            return campaign_member_permissions
        return []

    def get_role_attribute(self, obj, attribute):
        if obj.role:
            return getattr(obj.role, attribute, "Attribute not found")
        return "Group not found"

    def get_role_id(self, obj):
        return self.get_role_attribute(obj, 'id')

    def get_role_name(self, obj):
        return self.get_role_attribute(obj, 'name')

    def get_role_codename(self, obj):
        return self.get_role_attribute(obj, 'codename')
