# user/serializers.py
from rest_framework import serializers
from apps.auths.models import User
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from utils.base_serializer import TrackMixin, TaskMixin, AdminFieldMixin
from rest_framework.serializers import ModelSerializer
from django.contrib.auth.hashers import make_password
from django.conf import settings  # Import Django settings to access MEDIA_URL



# USER
class UserLoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'username']

class UserSerializer(AdminFieldMixin, serializers.ModelSerializer):
    """ Serializer for the Usel Model. """
    password = serializers.CharField(write_only=True)
    admin_serializer_classes = (TrackMixin,)
    full_name = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    groups = serializers.SerializerMethodField()
    permissions = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", 'phone',
                  "image", 'civil', 'gender', 'date_of_birth', 'description',
                  "full_name", 'twitter', 'instagram','password',
                  'is_staff', 'is_active', 'groups', 'permissions'
                  ]

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"

    def get_groups(self, obj):
        groups = obj.groups.all()
        if groups.exists():
            formatted_groups = ["is" + name.replace(" ", "").capitalize() for name in groups.values_list('name', flat=True)]
            return formatted_groups
        else:
            return []

    def get_image(self, obj):
        # Check if the image field is not empty and generate the desired URL format
        if obj.image:
            return f"{settings.MEDIA_URL}{obj.image}"  # Use Django's MEDIA_URL to build the URL
        return None  # Return None if the image field is empty


    def get_permissions(self, obj):
        user_permissions = list(obj.user_permissions.all().values_list('codename', flat=True))
        group_permissions = list(Permission.objects.filter(group__user=obj).values_list('codename', flat=True))
        all_permissions = list(set(user_permissions + group_permissions))
        return all_permissions
    
    #--- Changed Create User ------
    def create(self, validated_data):
        request = self.context.get('request')
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        # Set the password for the user
        if password:
            password = make_password(password)
        user = request.user if request and hasattr(request, 'user') else None

        # Set created_by to None if user is not authenticated
        created_by = None
        if isinstance(user, User):
            created_by = user
        # Remove 'created_by' from validated_data to avoid passing it twice
        validated_data.pop('created_by', None)
        instance = User.objects.create(created_by=created_by,password=password, **validated_data)
        return instance
    

    # def create(self, validated_data):
    #     request = self.context.get('request')
    #     user = request.user if request and hasattr(request, 'user') else None
    #     instance = User.objects.create(**validated_data, created_by=user)
     #   return instance


    def update(self, instance, validated_data):
        request = self.context.get('request')
        user = request.user if request and hasattr(request, 'user') else None
        if user:
            instance.updated_by = user
        return super().update(instance, validated_data)

# Groups, Permissions
class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ['codename']
        # fields = ['name', 'codename']

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'name', 'category', 'permissions', 'display_name']

class GroupPermissionSerializer(ModelSerializer):
    class Meta:
        model = Permission
        fields = '__all__'

class ContentTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContentType
        fields = '__all__'  # or list specific fields you want to include
