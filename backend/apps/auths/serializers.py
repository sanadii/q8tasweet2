# user/serializers.py
<<<<<<< HEAD
from rest_framework import serializers
from apps.auths.models import User
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from helper.base_serializer import TrackMixin, TaskMixin, AdminFieldMixin
from rest_framework.serializers import ModelSerializer
=======
from django.conf import settings  # Import Django settings to access MEDIA_URL
from django.contrib.auth.models import Group, Permission
from django.contrib.auth.hashers import make_password
from django.contrib.contenttypes.models import ContentType
from apps.auths.models import User
from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from utils.base_serializer import TrackMixin, AdminFieldMixin
>>>>>>> sanad



# USER
class UserLoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'username']

<<<<<<< HEAD

class UserCreateSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    username = serializers.CharField(required=True)
    password = serializers.CharField(min_length=8, write_only=True)

    class Meta:
        model = User
        fields = ('email', 'username', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        # as long as the fields are the same, we can just use this
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance





class UserSerializer(AdminFieldMixin, serializers.ModelSerializer):
    """ Serializer for the Usel Model. """
    admin_serializer_classes = (TrackMixin,)
    full_name = serializers.SerializerMethodField()
    image = serializers.ImageField(required=False)
    groups = serializers.SerializerMethodField()  # Changed the field name to 'names'
=======
class UserSerializer(AdminFieldMixin, serializers.ModelSerializer):
    """ Serializer for the Usel Model. """
    password = serializers.CharField(write_only=True)
    admin_serializer_classes = (TrackMixin,)
    full_name = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    groups = serializers.SerializerMethodField()
>>>>>>> sanad
    permissions = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", 'phone',
                  "image", 'civil', 'gender', 'date_of_birth', 'description',
<<<<<<< HEAD
                  "full_name", 'twitter', 'instagram',
=======
                  "full_name", 'twitter', 'instagram', 'password',
>>>>>>> sanad
                  'is_staff', 'is_active', 'groups', 'permissions'
                  ]

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"

    def get_groups(self, obj):
        groups = obj.groups.all()
        if groups.exists():
<<<<<<< HEAD
            formatted_groups = ["is" + name.replace(" ", "").capitalize() for name in groups.values_list('name', flat=True)]
=======
            formatted_groups = []
            for group in groups:
                formatted_groups.append({
                    'id': group.id,
                    'name': group.name,
                    'codename': group.codename,  # Assuming 'code' exists in your Group model
                })
>>>>>>> sanad
            return formatted_groups
        else:
            return []


<<<<<<< HEAD
=======
    def get_image(self, obj):
        # Check if the image field is not empty and generate the desired URL format
        if obj.image:
            return f"{settings.MEDIA_URL}{obj.image}"  # Use Django's MEDIA_URL to build the URL
        return None  # Return None if the image field is empty


>>>>>>> sanad
    def get_permissions(self, obj):
        user_permissions = list(obj.user_permissions.all().values_list('codename', flat=True))
        group_permissions = list(Permission.objects.filter(group__user=obj).values_list('codename', flat=True))
        all_permissions = list(set(user_permissions + group_permissions))
        return all_permissions
<<<<<<< HEAD

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user if request and hasattr(request, 'user') else None
        instance = User.objects.create(**validated_data, created_by=user)
        return instance


    def update(self, instance, validated_data):
        request = self.context.get('request')
        user = request.user if request and hasattr(request, 'user') else None
        if user:
            instance.updated_by = user
        return super().update(instance, validated_data)


# Groups, Categories, Permissions
=======
    
    #--- Changed Create User ------
    def create(self, validated_data):
        request = self.context.get('request')
        password = validated_data.pop('password', None)
        
        # Explicitly set the password using make_password
        if password:
            validated_data['password'] = make_password(password) 

        user = User.objects.create(**validated_data)

        # Handle group assignment after user creation
        group_ids = request.data.getlist('groups', [])
        if group_ids:
            groups = Group.objects.filter(pk__in=group_ids)
            user.groups.set(groups)

        return user

    def update(self, instance, validated_data):
        request = self.context.get('request')
        password = validated_data.pop('password', None)

        # Update password if provided in the request data
        if password:
            instance.set_password(password)
            instance.save()

        # Handle group assignment (or removal) after user update
        group_ids = request.data.get('groups', [])  
        if group_ids:
            groups = Group.objects.filter(pk__in=group_ids)
            instance.groups.set(groups)
        else:
            instance.groups.clear()  # Remove all existing groups

        return super().update(instance, validated_data)

# Groups, Permissions
>>>>>>> sanad
class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ['codename']
        # fields = ['name', 'codename']

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
<<<<<<< HEAD
        fields = ['id', 'name', 'category', 'permissions', 'display_name']
=======
        fields = ['id', 'name', 'category', 'permissions', 'codename']
>>>>>>> sanad

class GroupPermissionSerializer(ModelSerializer):
    class Meta:
        model = Permission
        fields = '__all__'

class ContentTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContentType
        fields = '__all__'  # or list specific fields you want to include
