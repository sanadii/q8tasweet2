# Django built-in libraries
from django.http import JsonResponse
from django.conf import settings


# Django REST Framework
from rest_framework.views import APIView


# Built-in Python libraries
import os, base64, random, string
from rest_framework.permissions import AllowAny, IsAuthenticated
