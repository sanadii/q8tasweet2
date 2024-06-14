# Campaign Serializers
from rest_framework import serializers
from apps.notifications.models import UserNotification, CampaignNotification, ElectionNotification
<<<<<<< HEAD
from helper.base_serializer import TrackMixin, TaskMixin, AdminFieldMixin
=======
from utils.base_serializer import TrackMixin, TaskMixin, AdminFieldMixin
>>>>>>> sanad
from django.contrib.auth import get_user_model


class UserNotificationSerializer(AdminFieldMixin, serializers.ModelSerializer):
    class Meta:
        model = UserNotification
        fields = '__all__'
        

User = get_user_model()

class CampaignNotificationSerializer(serializers.ModelSerializer):
    created_by_name = serializers.SerializerMethodField()

    class Meta:
        model = CampaignNotification
        fields = ['id', 'campaign', 'message', 'message_type', 'created_by', 'created_at', 'created_by_name']

    def get_created_by_name(self, obj):
        # Assuming obj.created_by is a User instance
        user = obj.created_by
        if user:
            return f"{user.first_name} {user.last_name}"
        return ""

class ElectionNotificationSerializer(serializers.ModelSerializer):

    class Meta:
        model = ElectionNotification
        fields = '__all__'