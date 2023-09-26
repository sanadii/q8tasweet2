# Categories Model
from django.db import models
from django.utils import timezone
from django.core.validators import RegexValidator
# from . import models
from .modelsHelper import *

class Areas(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255, null=True, blank=True)
    parent = models.ForeignKey("self", on_delete=models.CASCADE, null=True, blank=True)
    image = models.ImageField(upload_to="categories/", null=True, blank=True)
    slug = models.SlugField(unique=True, null=True, blank=True)
    description = models.TextField(max_length=255, null=True, blank=True)
    is_active = models.BooleanField(default=True)

    # Tracking Information
    created_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='created_areas')
    updated_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='updated_areas')
    deleted_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='deleted_areas')
    created_date = models.DateTimeField(auto_now_add=True, null=False)
    updated_date = models.DateTimeField(auto_now=True, null=False)
    deleted_date = models.DateTimeField(auto_now=True, null=False)
    deleted = models.BooleanField(default=False, null=True)

    class Meta:
        db_table = "area"
        verbose_name = "Area"
        verbose_name_plural = "Areas"

    def __str__(self):
        return self.name
    
