# from campaigns.models import Campaign
from django.http import JsonResponse
from django.http.response import JsonResponse
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.shortcuts import render
from rest_framework.views import APIView
from restapi.serializers import *
from restapi.models import *
from .models import *
import ast 
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication, SessionAuthentication

from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

from django.db.models import Count, Case, When, IntegerField
from collections import defaultdict
from rest_framework import status
import jwt
from django.conf import settings


# class GetCampaigns(APIView):
#     def get(self, request):
#         campaigns_data = Campaign.objects.all()
#         data_serializer = CampaignsSerializer(campaigns_data, many=True)

#         return Response({"data": data_serializer.data, "code": 200})

class GetCategories(APIView):
    def get(self, request):
        categories = Category.objects.filter(parent=None).exclude(id=0)
        subcategories = Category.objects.exclude(parent=None).exclude(id=0)
        categories_serializer = CategoriesSerializer(categories, many=True)
        subcategories_serializer = SubCategoriesSerializer(subcategories, many=True)
        return Response({"data": {"categories": categories_serializer.data, "subCategories": subcategories_serializer.data}, "code": 200})



class UpdateCategory(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, id):
        try:
            category = Category.objects.get(id=id)
        except Category.DoesNotExist:
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
            category.parent = Category.objects.get(id=parent)

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
