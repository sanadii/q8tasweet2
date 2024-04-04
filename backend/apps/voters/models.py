# Elector Model
from django.db import models
from django.utils import timezone
from django.core.validators import RegexValidator

from apps.configs.models import TrackModel
from utils.models_helper import GenderOptions


class Voter(models.Model):
    civil = models.BigAutoField(primary_key=True)
    full_name = models.CharField(max_length=255, blank=True, null=True)
    family_name = models.CharField(max_length=255, blank=True, null=True)
    gender = models.IntegerField(choices=GenderOptions.choices, null=True, blank=True)
    serial_number = models.CharField(max_length=255, blank=True, null=True)
    membership_no = models.CharField(max_length=255, blank=True, null=True)
    box_no = models.CharField(max_length=255, blank=True, null=True)
    enrollment_date = models.DateField(blank=True, null=True)
    relationship = models.CharField(max_length=255, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)


    class Meta:
        # managed = False
        db_table = 'voters'
        verbose_name = "Voter"
        verbose_name_plural = "Voters"
        default_permissions = []
        permissions  = [
            ("canViewElector", "Can View Elector"),
            ("canAddElector", "Can Add Elector"),
            ("canChangeElector", "Can Change Elector"),
            ("canDeleteElector", "Can Delete Elector"),
            ]

