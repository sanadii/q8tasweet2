from django.db import models

# Models
from apps.settings.models import TrackModel, TaskModel
from apps.schemas.committees.models import Committee, CommitteeSite
from apps.schemas.schemaModels import DynamicSchemaModel

class CommitteeAgent(DynamicSchemaModel):
    committee_site = models.ForeignKey(
        CommitteeSite,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="%(class)s_committees",
    )
    member = models.IntegerField(null=True, blank=True)

    class Meta:
        managed = False
        db_table = "committee_agent"
        verbose_name = "Committee Agent"
        verbose_name_plural = "Committee Agent"


class CommitteeDelegate(DynamicSchemaModel):
    committee = models.ForeignKey(
        Committee,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="%(class)s_committees",
    )
    member = models.IntegerField(null=True, blank=True)

    class Meta:
        managed = False
        db_table = "committee_delegate"
        verbose_name = "Committee Delegate"
        verbose_name_plural = "Committee Delegates"

