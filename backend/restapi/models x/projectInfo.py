# Categories Model
from django.db import models
from django.utils import timezone
from django.core.validators import RegexValidator
from .modelsHelper import *

class ProjectInfo(models.Model):
    id = models.BigAutoField(primary_key=True)
    data = models.JSONField()

    def __str__(self):
        return str(self.id)
