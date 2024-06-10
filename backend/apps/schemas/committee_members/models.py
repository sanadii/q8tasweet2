from django.db import models

# Models
from apps.schemas.committees.models import Committee, CommitteeSite
from apps.schemas.schemaModels import DynamicSchemaModel

class MemberCommitteeSite(DynamicSchemaModel):
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
        db_table = "member_committee_site"
        verbose_name = "Member Committee Site"
        verbose_name_plural = "وكلاء اللجان"

    def __str__(self):
        return f"MemberCommitteeSite {self.id}"  # Ensure this returns a string


class MemberCommittee(DynamicSchemaModel):
    committee = models.ForeignKey(
        Committee,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="member_committees",
    )
    member = models.IntegerField(null=True, blank=True)

    class Meta:
        managed = False
        db_table = "member_committee"
        verbose_name = "Member Committee"
        verbose_name_plural = "مناديب اللجان"

    def __str__(self):
        return f"MemberCommittee {self.id}"  # Ensure this returns a string
