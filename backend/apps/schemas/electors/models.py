# Elector Model
from django.db import models
from apps.schemas.schemaModels import DynamicSchemaModel
from apps.schemas.committees.models import Committee
from apps.schemas.areas.models import Area
from utils.models import GENDER_CHOICES

class Elector(DynamicSchemaModel):

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
    age = models.PositiveIntegerField(blank=True, null=True)

    # Elector Address
    address = models.TextField(blank=True, null=True)
    area = models.ForeignKey(Area, on_delete=models.CASCADE, related_name='elector_areas')
    area_name = models.TextField(blank=True, null=True)
    block = models.TextField(blank=True, null=True)
    street = models.TextField(blank=True, null=True)
    lane = models.TextField(blank=True, null=True)
    house = models.TextField(blank=True, null=True)

    # Elector Election Details
    circle = models.TextField(blank=True, null=True)
    committee = models.ForeignKey(Committee, blank=True, null=True, on_delete=models.CASCADE, related_name='elector_committees')
    committee_area = models.TextField(blank=True, null=True)
    committee_name = models.TextField(blank=True, null=True)
    letter = models.TextField(blank=True, null=True)
    code_number = models.TextField(blank=True, null=True)
    status_code = models.TextField(blank=True, null=True)
    
    class Meta:
        managed = False
        db_table = "elector"
        verbose_name = "الناخب"
        verbose_name_plural = "الناخبين"
        default_permissions = []

    def __str__(self):
        return self.full_name


