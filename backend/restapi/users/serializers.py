from rest_framework import serializers
from .models import User

# USER
class UserSerializer(serializers.ModelSerializer):
    full_name = (
        serializers.SerializerMethodField()
    )  # If you want to include a computed full name

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "full_name",
            "email",
        ]  # Include other fields as needed

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"

class UserFullNameSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["full_name"]

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"

class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "username", "name", "email", "image"]

    def get_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'  # or specify the fields you want to include

class EntryByUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = 'id'  # or specify the fields you want to include

class UserJWTLoginSerializer(serializers.ModelSerializer):
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
