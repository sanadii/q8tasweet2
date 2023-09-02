from django.http import JsonResponse
import json
import hashlib
import os
import base64
import random
import string
import datetime

from django.shortcuts import render
from django.http.response import JsonResponse

from django.conf import settings
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.core.serializers import serialize

from django.views.static import serve
from django.http import FileResponse
from django.db import connection
from datetime import date

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView

from restapi.serializers import *
from restapi.models import *


class GetCategories(APIView):
    def get(self, request):
        categories = Categories.objects.filter(parent=None).exclude(id=0)
        subcategories = Categories.objects.exclude(parent=None).exclude(id=0)
        categories_serializer = CategoriesSerializer(categories, many=True)
        subcategories_serializer = SubCategoriesSerializer(subcategories, many=True)
        return Response({"data": {"categories": categories_serializer.data, "subCategories": subcategories_serializer.data}, "code": 200})
