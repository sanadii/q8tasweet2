# Category Model
from django.db import models
from django_extensions.db.fields import AutoSlugField
from django.utils.text import slugify
import uuid

from apps.settings.models import TrackModel

class Tag(models.Model):
    name = models.CharField(max_length=255, null=True, blank=True)
    slug = models.SlugField(unique=True, null=True, blank=True)

    class Meta:
        db_table = "Tag"
        verbose_name = "Tag"
        verbose_name_plural = "Tag"
        default_permissions = []


    def __str__(self):
        return self.name
