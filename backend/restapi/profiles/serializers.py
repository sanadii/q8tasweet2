# restapi/user/serializers.py
from rest_framework import serializers
from restapi.models import User
from django.contrib.auth.models import Group, Permission

# USER