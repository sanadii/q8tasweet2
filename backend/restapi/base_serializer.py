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


class TaskMixin(serializers.BaseSerializer):
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
            # Check if moderators is already a list
            if isinstance(obj.moderators, list):
                moderator_ids = obj.moderators
            else:  # Attempt to load JSON string
                try:
                    moderator_ids = json.loads(obj.moderators)
                except (json.JSONDecodeError, TypeError):
                    moderator_ids = []
                    
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

from rest_framework import serializers
from collections.abc import Iterable  # Import Iterable to check if an object is iterable

class AdminFieldMixin(serializers.Serializer):
    def __init__(self, *args, **kwargs):
        # Initialize instances of TrackMixin and TaskMixin
        track_mixin_instance = TrackMixin()
        task_mixin_instance = TaskMixin()

        # Store instances in a tuple so they can be iterated over
        self.admin_serializer_instances = (track_mixin_instance, task_mixin_instance)
        
        super(AdminFieldMixin, self).__init__(*args, **kwargs)

    def to_representation(self, instance):
        # Check if 'request' is in context and get the user from it
        user = self.context.get('request').user if 'request' in self.context else None
        representation = super().to_representation(instance)
        
        # Check if the user is set and is_staff
        if user and user.is_staff:
            # Check if admin_serializer_instances is iterable before attempting to iterate
            if isinstance(self.admin_serializer_instances, Iterable):
                for serializer_instance in self.admin_serializer_instances:
                    key = serializer_instance.__class__.__name__.lower().replace('mixin', '')
                    representation[key] = serializer_instance.data  # Attach the serializer_instance data to the representation under the derived key name
        return representation

