# restapi/base_serializer.py
from rest_framework import serializers
from restapi.models import User, Candidates, Elections
import json


class TrackMixin(serializers.BaseSerializer):  # Using BaseSerializer as it doesn’t impose a model requirement
    def to_representation(self, obj):
        # Implement the logic to return the serialized data for track
        return {
            'created_by': self.get_user_name(obj.created_by),
            'updated_by': self.get_user_name(obj.updated_by),
            'deleted_by': self.get_user_name(obj.deleted_by),
            'created_at': obj.created_at,
            'updated_at': obj.updated_at,
            'deleted_at': obj.deleted_at,
            'deleted': obj.deleted
            }
    
    def get_user_name(self, user):
        if user and hasattr(user, 'username'):
            return user.username
        return None


class TaskMixin(serializers.BaseSerializer):  # Using BaseSerializer as it doesn’t impose a model requirement
    def to_representation(self, obj):
        # Implement the logic to return the serialized data for task
        moderators = self.get_moderators(obj)
        return {
            'priority': obj.priority,
            'status': obj.status,
            'moderators': moderators,
        }

    def get_moderators(self, obj):
        if obj.moderators is not None:
            moderator_ids = json.loads(obj.moderators)
            moderators = User.objects.filter(id__in=moderator_ids)
            return [
                {
                    "id": getattr(mod, 'id', None),
                    "img": getattr(mod.image, 'url', None),
                    "name": f"{getattr(mod, 'first_name', '')} {getattr(mod, 'last_name', '')}",
                }
                for mod in moderators
            ]
        else:
            return []

    """
    Mixin to conditionally append admin-specific fields to serialized output
    based on the user’s administrative status.
    """
class AdminFieldMixin(serializers.Serializer):
    admin_serializer_classes = (TrackMixin, TaskMixin)  # Tuple of admin serializer classes
    
    def to_representation(self, instance):
        user = self.context.get('request').user
        representation = super().to_representation(instance)
        
        if user and user.is_staff:
            for serializer_class in self.admin_serializer_classes:
                # Convert the serializer_class name to lowercase and use it as a key
                key = serializer_class.__name__.lower().replace('mixin', '')
                serializer_instance = serializer_class(instance=instance, context=self.context)
                representation[key] = serializer_instance.data  # Correctly nesting under the derived key name
        return representation

