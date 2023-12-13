# Election Model
from django.db import models
from django.db.models.signals import post_save, post_delete
from django_extensions.db.fields import AutoSlugField, SlugField
from django.dispatch import receiver
from django.db.models import Sum

from django.utils.text import slugify
import uuid

from apps.configs.models import TrackModel, TaskModel

from helper.models_helper import ElectionTypeOptions, ElectionResultsOptions, GenderOptions
from helper.models_permission_manager import ModelsPermissionManager, CustomPermissionManager

class ElectionNotification(TrackModel):
    # Election Essential Information
    election = models.ForeignKey('Election', on_delete=models.SET_NULL, null=True, blank=True, related_name="notification_elections")
    message_type = 
    message = 

    class Meta:
        # managed = False
        db_table = "election_notification"
        verbose_name = "Election Notification"
        verbose_name_plural = "Election Notifications"
        default_permissions = []
        permissions  = []

    def __str__(self):
        return f"{self.message}"
    
