# Campaign Serializers
from rest_framework import serializers
from apps.categories.models import Category

# CATEGORIES
class CategoriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "image", "parent"]

# SUB-CATEGORIES
class SubCategoriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "parent", "image"]
