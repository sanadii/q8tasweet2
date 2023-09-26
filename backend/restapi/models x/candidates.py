# Categories Model
from django.db import models
from django.utils import timezone
from django.core.validators import RegexValidator
from .modelsHelper import *

class Candidates(models.Model):
    # Basic Information
    id = models.BigAutoField(primary_key=True)
    image = models.ImageField(upload_to="users/", blank=True, null=True)
    name = models.CharField(max_length=255, blank=False, null=False)
    gender = models.IntegerField(choices=Gender.choices, default=Gender.UNDEFINED)

    description = models.CharField(max_length=255, blank=True, null=True)
    birthdate = models.DateField(blank=True, null=True)

    # Contacts
    phone = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    twitter = models.CharField(max_length=255, blank=True, null=True)
    instagram = models.CharField(max_length=255, blank=True, null=True)

    # Education & Career
    education = models.CharField(max_length=255, blank=True, null=True)
    position = models.CharField(max_length=255, blank=True, null=True)
    party = models.CharField(max_length=100, blank=True, null=True)

    # Taxonomies (Categories and Tags)
    tags = models.CharField(max_length=255, blank=True, null=True)

    # Administration
    moderators = models.CharField(max_length=255, blank=True, null=True)
    status = models.IntegerField(blank=True, null=True)
    priority = models.IntegerField(blank=True, null=True)

    # Tracking Information
    created_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='created_candidates')
    updated_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='updated_candidates')
    deleted_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='deleted_candidates')
    created_date = models.DateTimeField(auto_now_add=True, null=False)
    updated_date = models.DateTimeField(auto_now=True, null=False)
    deleted_date = models.DateTimeField(auto_now=True, null=False)
    deleted = models.BooleanField(default=False, null=True)

    class Meta:
        db_table = "candidate"
        verbose_name = "Candidate"
        verbose_name_plural = "Candidates"

    def __str__(self):
        return self.name
    