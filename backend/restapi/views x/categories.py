from django.http import JsonResponse
import json
import hashlib
import os
import base64
import random
import string
import datetime
from rest_framework.permissions import AllowAny, IsAuthenticated

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



class UpdateCategory(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, id):
        try:
            category = Categories.objects.get(id=id)
        except Categories.DoesNotExist:
            return Response({"error": "Category not found"}, status=404)

        # Extract the desired fields from the request data
        name = request.data.get("name")
        image = request.data.get("image")
        parent = request.data.get("parent")

        updated_by = request.user

        # Update the category object with the new values
        category.name = name if name else category.name
        if image:
            category.image = image
        if parent:
            category.parent = Categories.objects.get(id=parent)

        # System
        category.updated_by = updated_by

        category.save()

        # Prepare the updated category data for response
        updated_category_data = self.prepare_updated_category_data(category)

        return Response({"data": updated_category_data, "count": 0, "code": 200})

    def prepare_updated_category_data(self, category):
        updated_category_data = {
            "id": category.id,
            "name": category.name,
            "image": category.image.url if category.image else None,
            "parent": category.parent.id if category.parent else None,
            "updatedBy": category.updated_by.username
        }
        return updated_category_data
