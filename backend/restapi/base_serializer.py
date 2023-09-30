# restapi/base_serializer.py
from rest_framework import serializers
from restapi.models import User, Candidates

class TrackingSerializer(serializers.ModelSerializer):
    class Meta:  # <-- Add this Meta class
        fields = ['created_by', 'updated_by', 'deleted_by']

    created_by = serializers.SerializerMethodField('get_created_by')
    updated_by = serializers.SerializerMethodField('get_updated_by')
    deleted_by = serializers.SerializerMethodField('get_deleted_by')

    def get_created_by(self, obj):
        """Retrieve the name of the creator of the object."""
        return self.get_user_name(obj.created_by)
    
    def get_updated_by(self, obj):
        """Retrieve the name of the updater of the object."""
        return self.get_user_name(obj.updated_by)
        
    def get_deleted_by(self, obj):
        """Retrieve the name of the deleter of the object."""
        return self.get_user_name(obj.deleted_by)
    
    def get_user_name(self, user):
        """Retrieve the full name of a user."""
        if user:
            return f"{user.first_name} {user.last_name}"
        return "Unknown"


class AdminModeratorSerializer(serializers.ModelSerializer):
    # image = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'image', 'name']

    # def get_image(self, obj):
    #     return getattr(obj.image, 'url', None)

    def get_name(self, obj):
        return f"{getattr(obj, 'first_name', '')} {getattr(obj, 'last_name', '')}"
    
class AdminControlSerializer(serializers.ModelSerializer):
    status = serializers.CharField()
    priority = serializers.IntegerField()
    moderators = AdminModeratorSerializer(many=True, read_only=True)

    class Meta:
        model = Candidates  # Specify the model here
        fields = ['status', 'priority', 'moderators'] + TrackingSerializer.Meta.fields
