# settings/models.py
from django.conf import settings
from django.db import models
from django.utils import timezone


from utils.html import TagCloser
from utils.models import base_concrete_model, get_user_model_name, get_current_user
# from apps.auths.models import User
# from utils.sites import current_request, current_site_id
# from utils.urls import admin_url, slugify, unique_slug


class StatusOptions(models.IntegerChoices):
    PUBLISHED = 1, 'منشور'
    PRIVATE = 2, 'خاص'
    PENDING_APPROVAL = 3, 'في أنتظار الموافقة'
    MISSING_DATA = 4, 'يفتقد للبيانات'
    IN_PROGRESS = 5, 'جاري العمل عليه'
    NEW = 6, 'جديد'
    DELETED = 9, 'محذوف'

class PriorityOptions(models.IntegerChoices):
    HIGH = 3, 'عالي'
    MEDIUM = 2, 'متوسط'
    LOW = 1, 'منخفض'
    

class Setting(models.Model):
    key = models.CharField(max_length=255, unique=True, null=True)
    value = models.TextField(null=True)

    class Meta:
        db_table = "setting"
        verbose_name = "Setting"
        verbose_name_plural = "Setting"
        default_permissions = []
        permissions  = [
            ("canViewSetting", "Can View Setting"),
            ("canAddSetting", "Can Add Setting"),
            ("canChangeSetting", "Can Change Setting"),
            ("canDeleteSetting", "Can Delete Setting"),
            ]
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

    def __str__(self):
        return self.key

class TrackModel(models.Model):
    """
    TrackModel is an abstract base class that provides a comprehensive set of fields and methods to track the creation,
    update, and deletion of model instances. It is designed to be inherited by other Django models to easily implement
    and standardize these tracking features across different parts of the application.
    """
    
    created_by = models.ForeignKey(
        get_user_model_name(),
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='%(class)s_created',
        verbose_name='Created by',
        help_text='The user who created this object.'
        )

    updated_by = models.ForeignKey(
        get_user_model_name(),
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='%(class)s_updated',
        verbose_name='Updated by',
        help_text='The user who updated this object.'
        )

    deleted_by = models.ForeignKey(
        get_user_model_name(),
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='%(class)s_deleted',
        verbose_name='Deleted by',
        help_text='The user who deleted this object.'
        )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(blank=True, null=True)
    deleted_at = models.DateTimeField(blank=True, null=True)
    deleted = models.BooleanField(default=False)

    class Meta:
        abstract = True
        ordering = ['-created_at']
        # default_permissions = ()

    # to check if the current user has permission to edit the object.
    def is_editable(self, request):
        """
        Determines if the current user has permission to edit the instance.
        It returns True if the user is a superuser or if they are the creator of the instance.
        """
        return request.user.is_superuser or (self.created_by and request.user == self.created_by)

    def save(self, *args, **kwargs):
        if not self.id:
            self.deleted = False
            if 'user' in kwargs:
                self.created_by = kwargs.pop('user')
        else:
            self.updated_at = timezone.now()
            if 'user' in kwargs:
                self.updated_by = kwargs.pop('user')

        super().save(*args, **kwargs)




    # def delete(self, user=None, *args, **kwargs):
    #     """
    #     Marks the instance as deleted by setting the 'deleted' flag to True, updating the 'deleted_at' timestamp,
    #     and setting the 'deleted_by' field to the current user.
    #     """
    #     self.deleted = True
    #     self.deleted_at = timezone.now()
    #     self.deleted_by = user
    #     self.save()

    # def hard_delete(self):
    #     """
    #     Permanently delete the instance from the database.
    #     """
    #     self.delete()

    def restore(self, *args, **kwargs):
        """
        Reverts the deletion of an instance by resetting the 'deleted' flag, 'deleted_at' timestamp, and 'deleted_by' field.
        """
        self.deleted = False
        self.deleted_at = None
        self.deleted_by = None
        self.save()

class TaskModel(models.Model):
    status = models.IntegerField(choices=StatusOptions.choices, blank=True, null=True)
    priority = models.IntegerField(choices=PriorityOptions.choices, blank=True, null=True)
    moderators = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        abstract = True
