# Campaign Serializers
from rest_framework import serializers
from apps.notifications.models import NotificationUser, NotificationCampaign, NotificationElection
from utils.base_serializer import TrackMixin, TaskMixin, AdminFieldMixin
from django.contrib.auth import get_user_model


class NotificationUserSerializer(AdminFieldMixin, serializers.ModelSerializer):
    class Meta:
        model = NotificationUser
        fields = '__all__'
        

User = get_user_model()

class NotificationCampaignSerializer(serializers.ModelSerializer):
    created_by_name = serializers.SerializerMethodField()

    class Meta:
        model = NotificationCampaign
        fields = ['id', 'campaign', 'message', 'message_type', 'created_by', 'created_at', 'created_by_name']

    def get_created_by_name(self, obj):
        # Assuming obj.created_by is a User instance
        user = obj.created_by
        if user:
            return f"{user.first_name} {user.last_name}"
        return ""

class NotificationElectionSerializer(serializers.ModelSerializer):

    class Meta:
        model = NotificationElection
        fields = '__all__'