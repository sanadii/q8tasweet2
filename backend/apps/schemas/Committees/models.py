
from django.db import models
from django.contrib.auth import get_user_model

# Models
from apps.schemas.areas.models import Area
from utils.model_options import GenderOptions
from apps.schemas.schemaModels import DynamicSchemaModel

User = get_user_model()
     
class CommitteeSite(DynamicSchemaModel):
    serial = models.IntegerField(blank=True, null=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    circle = models.CharField(max_length=255, blank=True, null=True)
    area = models.ForeignKey(
        Area,
        on_delete=models.CASCADE,
        related_name="committee_site_areas",
        null=True,
        blank=True,
    )
    area_name = models.CharField(max_length=255, blank=True, null=True)
    gender = models.IntegerField(choices=GenderOptions.choices, null=True, blank=True)
    description = models.TextField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    # elector_count = models.IntegerField(blank=True, null=True)
    tags = models.TextField(blank=True, null=True)
    election = models.IntegerField(null=True, blank=True)

    class Meta:
        managed = False
        db_table = "committee_site"
        verbose_name = "موقع اللجنة"
        verbose_name_plural = "مواقع اللجان"
        default_permissions = []

    def __str__(self):
        return f"CommitteeSite {self.id}"

    def get_dynamic_fields(self):
        fields = {}
        if self.election_category == 3000:
            fields['test_site'] = models.IntegerField(blank=True, null=True)
        return fields


class Committee(DynamicSchemaModel):
    area_name = models.TextField(blank=True, null=True)
    letters = models.TextField(blank=True, null=True)
    committee_site = models.ForeignKey(
        CommitteeSite, 
        related_name="committee_site_committees",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    type = models.TextField(max_length=25, blank=True, null=True)

    class Meta:
        managed = False
        db_table = "committee"
        verbose_name = "اللجنة"
        verbose_name_plural = "اللجان"
        default_permissions = []

    def __str__(self):
        return f"Committee {self.id}"

    def get_dynamic_fields(self):
        fields = {}
        if self.election_category == 3000:
            fields['testing'] = models.IntegerField(blank=True, null=True)
        return fields


