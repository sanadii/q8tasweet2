from rest_framework import serializers
from .models import *

class ProjectInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectInfo
        fields = '__all__'

# class userSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Users
#         fields = "__all__"


class electionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Elections
        fields = "__all__"


class menuSerializer(serializers.ModelSerializer):
    class Meta:
        model = Menu
        fields = "__all__"


class permissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = "__all__"


class permissionMenuSerializer(serializers.ModelSerializer):
    class Meta:
        model = PermissionMenu
        fields = "__all__"


class roleSerializer(serializers.ModelSerializer):
    class Meta:
        model = UsersRole
        fields = "__all__"


class rankSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserRank
        fields = "__all__"
