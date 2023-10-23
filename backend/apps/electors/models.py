# Elector Model
from django.db import models
from django.utils import timezone
from django.core.validators import RegexValidator
from helper.models_helper import TrackModel, GenderOptions


class Elector(models.Model):
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
        db_table = 'electors'
        verbose_name = "Elector"
        verbose_name_plural = "Elector"
        default_permissions = []
        permissions  = [
            ("canViewElector", "Can View Elector"),
            ("canAddElector", "Can Add Elector"),
            ("canChangeElector", "Can Change Elector"),
            ("canDeleteElector", "Can Delete Elector"),
            ]

