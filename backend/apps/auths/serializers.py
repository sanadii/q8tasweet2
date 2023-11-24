# user/serializers.py
from rest_framework import serializers
from apps.auths.models import User
from django.contrib.auth.models import Group, Permission
from helper.base_serializer import TrackMixin, TaskMixin, AdminFieldMixin

# USER

class UserLoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'username']


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

class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ['codename']
        # fields = ['name', 'codename']

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'name', 'permissions', 'display_name']


class UserSerializer(AdminFieldMixin, serializers.ModelSerializer):
    """ Serializer for the Usel Model. """
    admin_serializer_classes = (TrackMixin,)
    full_name = serializers.SerializerMethodField()
    image = serializers.ImageField(required=False)
    groups = serializers.SerializerMethodField()  # Changed the field name to 'names'
    permissions = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", 'phone',
                  "image", 'civil', 'gender', 'date_of_birth', 'description',
                  "full_name", 'twitter', 'instagram',
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


    def get_permissions(self, obj):
        user_permissions = list(obj.user_permissions.all().values_list('codename', flat=True))
        group_permissions = list(Permission.objects.filter(group__user=obj).values_list('codename', flat=True))
        all_permissions = list(set(user_permissions + group_permissions))
        return all_permissions

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


