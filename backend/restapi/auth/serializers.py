# restapi/user/serializers.py
from rest_framework import serializers
from restapi.models import User
from django.contrib.auth.models import Group, Permission

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
        fields = ['id', 'name', 'category', 'role']


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    roles = serializers.SerializerMethodField()  # Changed the field name to 'roles'
    permissions = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "username", "email", 
                  "first_name", "last_name", "full_name", "image",
                  "is_active", "is_staff",
                  'roles', 'permissions'
                  ]
        
    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"

    def get_roles(self, obj):
        # Gets the role attribute for all the groups associated with the user
        roles = [group.role for group in obj.groups.all()]
        
        # Format each role to prepend "is" and capitalize the first letter
        formatted_roles = ["is" + role.replace(" ", "").capitalize() for role in roles]
        
        return formatted_roles

    def get_permissions(self, obj):
        user_permissions = list(obj.user_permissions.all().values_list('codename', flat=True))
        group_permissions = list(Permission.objects.filter(group__user=obj).values_list('codename', flat=True))
        all_permissions = list(set(user_permissions + group_permissions))
        return all_permissions


