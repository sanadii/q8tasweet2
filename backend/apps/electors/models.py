# Elector Model
from django.db import models
from django.utils import timezone
from django.core.validators import RegexValidator

from apps.settings.models import TrackModel
from utils.models_helper import GenderOptions
from utils.models import GENDER_CHOICES


from apps.committees.models import CommitteeSite, Committee


class Elector(models.Model):

    # Name Details
    full_name = models.TextField(blank=True, null=True)
    first_name = models.TextField(blank=True, null=True)
    second_name = models.TextField(blank=True, null=True)
    third_name = models.TextField(blank=True, null=True)
    fourth_name = models.TextField(blank=True, null=True)
    fifth_name = models.TextField(blank=True, null=True)
    sixth_name = models.TextField(blank=True, null=True)
    seventh_name = models.TextField(blank=True, null=True)
    eighth_name = models.TextField(blank=True, null=True)
    ninth_name = models.TextField(blank=True, null=True)
    tenth_name = models.TextField(blank=True, null=True)
    eleventh_name = models.TextField(blank=True, null=True)
    twelveth_name = models.TextField(blank=True, null=True)
    last_name = models.TextField(blank=True, null=True)
    family = models.TextField(blank=True, null=True)
    branch = models.TextField(blank=True, null=True)
    sect = models.TextField(blank=True, null=True)

    # Elector Details
    gender = models.CharField(
        max_length=1, choices=GENDER_CHOICES, blank=True, null=True
    )
    job = models.TextField(blank=True, null=True)
    birth_date = models.DateField(blank=True, null=True)  # Age

    # Elector Address
    address = models.TextField(blank=True, null=True)
    area = models.TextField(blank=True, null=True)
    block = models.TextField(blank=True, null=True)
    street = models.TextField(blank=True, null=True)
    lane = models.TextField(blank=True, null=True)
    house = models.TextField(blank=True, null=True)

    # Elector Election Details
    circle = models.TextField(blank=True, null=True)
    committee = models.ForeignKey(Committee, blank=True, null=True, on_delete=models.CASCADE, related_name='committees')
    committee_area = models.TextField(blank=True, null=True)
    committee_name = models.TextField(blank=True, null=True)
    letter = models.TextField(blank=True, null=True)
    code_number = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = "electors"
        verbose_name = "Electors"
        verbose_name_plural = "Electorss"
        default_permissions = []

    def __str__(self):
        return self.full_name
