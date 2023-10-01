# restapi/base_serializer.py
from rest_framework import serializers
from restapi.models import User, Candidates, Elections
import json

class AdminFieldMixin(serializers.Serializer):
    """
    Mixin to conditionally append admin-specific fields to serialized output
    based on the user’s administrative status.
    """
    admin_serializer_classes = ()  # This will hold the Tuple of Serializer Classes for admin fields

    def to_representation(self, instance):
        user = self.context.get('request').user
        representation = super().to_representation(instance)
        
        if user and user.is_staff:
            for serializer_class in self.admin_serializer_classes:
                if serializer_class:
                    admin_serializer = serializer_class(instance=instance, context=self.context)
                    representation.update(admin_serializer.data)
                
        return representation

class TrackingMixin(serializers.Serializer):
    """
    Mixin to append tracking-related fields for monitoring resource 
    lifecycle events consistently across serializers.
    """

    created_by = serializers.SerializerMethodField()
    updated_by = serializers.SerializerMethodField()
    deleted_by = serializers.SerializerMethodField()
    
    @staticmethod
    def get_tracking_fields():
        return [
            "created_by", "created_at",
            "updated_by", "updated_at",
            "deleted_by", "deleted_at", "deleted"
        ]
    
    def get_created_by(self, obj):
        return self.get_user_name(obj.created_by)
    
    def get_updated_by(self, obj):
        return self.get_user_name(obj.updated_by)
        
    def get_deleted_by(self, obj):
        return self.get_user_name(obj.deleted_by)
    
    def get_user_name(self, user):
        if user and hasattr(user, 'username'):
            return user.username
        return None

class TaskingMixin(serializers.Serializer):
    """
    Mixin to standardize the representation of task-related fields
    and moderator information across serializers.
    """
    moderators = serializers.SerializerMethodField('get_moderators')

    @staticmethod
    def get_tasking_fields():
        return [
            "status", "priority", "moderators",
        ]

    def get_moderators(self, obj):
        if obj.moderators is not None:
            moderator_ids = json.loads(obj.moderators)
            moderators = User.objects.filter(id__in=moderator_ids)
            return [
                {
                    "id": getattr(mod, 'id', None),  # Default to None if attribute does not exist
                    "img": getattr(mod.image, 'url', None),  # Default to None if attribute does not exist
                    "name": f"{getattr(mod, 'first_name', '')} {getattr(mod, 'last_name', '')}",  # Default to empty strings if attributes do not exist
                }
                for mod in moderators
            ]
        else:
            return []
