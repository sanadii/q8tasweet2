# from elections.models import Elections
from django.http import JsonResponse
from django.http.response import JsonResponse
from django.db.models.query import QuerySet
from django.db.models import Sum
from django.contrib.auth import get_user_model
from django.shortcuts import render

from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from restapi.serializers import *
from restapi.models import *
import ast 
from datetime import datetime  # Add this line to import the datetime class

