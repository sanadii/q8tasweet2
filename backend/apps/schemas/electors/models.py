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
    last_name = models.TextField(blank=True, null=True)
    family = models.TextField(blank=True, null=True)
    branch = models.TextField(blank=True, null=True)
    sect = models.TextField(blank=True, null=True)

    # Elector Details
    gender = models.IntegerField(choices=GENDER_CHOICES, blank=True, null=True)
    job = models.TextField(blank=True, null=True)
    age = models.PositiveIntegerField(blank=True, null=True)

    # Elector Address
    address = models.TextField(blank=True, null=True)
    area = models.ForeignKey(
        Area,
        on_delete=models.CASCADE,
        related_name="elector_areas",
        blank=True,
        null=True,
    )
    block = models.TextField(blank=True, null=True)
    street = models.TextField(blank=True, null=True)
    lane = models.TextField(blank=True, null=True)
    house = models.TextField(blank=True, null=True)

    # Elector Committee Details,
    committee = models.ForeignKey(
        Committee,
        blank=True,
        null=True,
        on_delete=models.CASCADE,
        related_name="elector_committees",
    )

    # to be removed later
    area_name = models.TextField(blank=True, null=True)
    committee_area = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = "elector"
        verbose_name = "الناخب"
        verbose_name_plural = "الناخبين"
        default_permissions = []

    def __str__(self):
        return self.full_name

    def get_dynamic_fields(self):
        fields = {}
        if self.election_category == 1000:
            fields["code_number"] = models.TextField(blank=True, null=True)
            fields["status"] = models.TextField(blank=True, null=True)
            fields["letter"] = models.TextField(blank=True, null=True)

        if self.election_category == 3000:
            fields["membership_number"] = models.IntegerField(blank=True, null=True)
            fields["box_number"] = models.IntegerField(blank=True, null=True)
            fields["civil_id"] = models.IntegerField(blank=True, null=True)
            fields["enrollment_date"] = models.DateField(blank=True, null=True)

        return fields


# Note
# fields to add for Coops
# membership_number
# box_number
# enrolment_date
# civil_id
