from django.db import models

# Models
from apps.schemas.committees.models import Committee, CommitteeSite
from apps.schemas.schemaModels import DynamicSchemaModel

class CommitteeSiteMember(DynamicSchemaModel):
    committee_site = models.ForeignKey(
        CommitteeSite,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="committee_site_member_committee_sites",
        db_column="committee_site_id"  # Specify the database column name
    )
    member = models.IntegerField(null=True, blank=True)

    class Meta:
        managed = False
        db_table = "committee_site_member"
        verbose_name = "Committee Member"
        verbose_name_plural = "Committee Members"

    def __str__(self):
        return f"CommitteeSiteMember {self.id}"  # Ensure this returns a string


class CommitteeMember(DynamicSchemaModel):
    committee = models.ForeignKey(
        Committee,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="committee_member_committees",
    )
    member = models.IntegerField(null=True, blank=True)

    class Meta:
        managed = False
        db_table = "committee_member"
        verbose_name = "Committee Member"
        verbose_name_plural = "Committee Members"

    def __str__(self):
        return f"CommitteeMember {self.id}"  # Ensure this returns a string
