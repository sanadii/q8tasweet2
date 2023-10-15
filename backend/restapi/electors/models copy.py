# Elector Model
from django.db import models
from django.utils import timezone
from django.core.validators import RegexValidator
from backend.restapi.helper.models_helper import TrackModel, GenderOptions


class Elector(models.Model):
    civil = models.BigAutoField(primary_key=True)
    
    # Name fields
    full_name = models.CharField(max_length=255, blank=True, null=True)
    family_name = models.CharField(max_length=255, blank=True, null=True)

    # name_1 = models.CharField(max_length=255, blank=True, null=True)
    # name_2 = models.CharField(max_length=255, blank=True, null=True)
    # name_3 = models.CharField(max_length=255, blank=True, null=True)
    # name_4 = models.CharField(max_length=255, blank=True, null=True)
    # name_5 = models.CharField(max_length=255, blank=True, null=True)
    # name_6 = models.CharField(max_length=255, blank=True, null=True)
    # name_7 = models.CharField(max_length=255, blank=True, null=True)
    # name_8 = models.CharField(max_length=255, blank=True, null=True)
    # name_9 = models.CharField(max_length=255, blank=True, null=True)
    # name_10 = models.CharField(max_length=255, blank=True, null=True)
    
    # # Last name fields
    # last_1 = models.CharField(max_length=255, blank=True, null=True)
    # last_2 = models.CharField(max_length=255, blank=True, null=True)
    # last_3 = models.CharField(max_length=255, blank=True, null=True)
    # last_4 = models.CharField(max_length=255, blank=True, null=True)
    # last_name = models.CharField(max_length=255, blank=True, null=True)
    
    gender = models.IntegerField(choices=GenderOptions.choices, null=True, blank=True)
    serial_number = models.CharField(max_length=255, blank=True, null=True)
    membership_no = models.CharField(max_length=255, blank=True, null=True)
    box_no = models.CharField(max_length=255, blank=True, null=True)
    enrollment_date = models.DateField(blank=True, null=True)
    relationship = models.CharField(max_length=255, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)

    # def full_name(self):
    #     names = [self.name_1, self.name_2, self.name_3, self.name_4, self.last_name,] # Include all name fields
    #     # Filter out None values and join to form the full name
    #     return ' '.join([name for name in names if name is not None])

    # def all_names(self):
    #     names = [self.name_1, self.name_2, self.name_3, self.name_4, self.name_5, self.name_6, self.name_7, self.name_8, self.name_9, self.name_10, self.last_1, self.last_2, self.last_3, self.last_4, self.last_name,] # Include all name fields
    #     # Filter out None values and join to form the full name
    #     return ' '.join([name for name in names if name is not None])


    class Meta:
        # managed = False
        db_table = 'electors'
        verbose_name = "Elector"
        verbose_name_plural = "Elector"

