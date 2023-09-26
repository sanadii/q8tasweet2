# Campaign Serializers
from rest_framework import serializers
from ..models import *

# CATEGORIES
class CategoriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categories
        fields = ["id", "name", "image", "parent"]

# SUB-CATEGORIES
class SubCategoriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categories
        fields = ["id", "name", "parent", "image"]
