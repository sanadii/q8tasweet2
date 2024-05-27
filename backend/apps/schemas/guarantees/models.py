# campaigns/models
from django.db import models
from django_extensions.db.fields import AutoSlugField
from django.utils.text import slugify
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType


# Apps
from apps.schemas.schemaModels import DynamicSchemaModel
from apps.settings.models import TrackModel, TaskModel
from apps.schemas.electors.models import Elector
from utils.model_options import GuaranteeStatusOptions


class CampaignGuaranteeGroup(DynamicSchemaModel):
    id = models.AutoField(primary_key=True)  # Explicitly add the id field
    name = models.CharField(max_length=150, blank=True)
    member = models.IntegerField(null=True, blank=True)
    phone = models.CharField(max_length=8, blank=True, null=True)
    note = models.CharField(max_length=250, blank=True)

    class Meta:
        db_table = "campaign_guarantee_group"
        verbose_name = "Campaign Guarantee Group"
        verbose_name_plural = "المجاميع"
        default_permissions = []
        permissions = [
            ("canViewCampaignGuaranteeGroup", "Can View Campaign Guarantee Group"),
            ("canAddCampaignGuaranteeGroup", "Can Add Campaign Guarantee Group"),
            ("canChangeCampaignGuaranteeGroup", "Can Change Campaign Guarantee Group"),
            ("canDeleteCampaignGuaranteeGroup", "Can Delete Campaign GuaranteeGroup"),
        ]


class CampaignGuarantee(DynamicSchemaModel):
    id = models.AutoField(primary_key=True)  # Explicitly add the id field
    campaign = models.IntegerField(null=True, blank=True)
    member = models.IntegerField(null=True, blank=True)
    member2 = models.IntegerField(null=True, blank=True)
    # elector = models.ForeignKey(
    #     Elector,
    #     on_delete=models.SET_NULL,
    #     null=True,
    #     blank=True,
    #     related_name="campaign_guarantee_electors",
    # )
    elector = models.ForeignKey(
        Elector,
        related_name="campaign_guarantee_electors",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )

    phone = models.CharField(max_length=8, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    status = models.IntegerField(
        choices=GuaranteeStatusOptions.choices, blank=True, null=True
    )
    guarantee_group = models.ForeignKey(
        CampaignGuaranteeGroup,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="campaign_elector_guarantee_groups",
    )

    # guarantee_groups = models.ManyToManyField(
    #     "CampaignGuaranteeGroup", blank=True, related_name="campaign_guarantees"
    # )

    class Meta:
        db_table = "campaign_guarantee"
        verbose_name = "Campaign Guarantee"
        verbose_name_plural = "المضامين"
        default_permissions = []
        permissions = [
            ("canViewCampaignGuarantee", "Can View Campaign Guarantee"),
            ("canAddCampaignGuarantee", "Can Add Campaign Guarantee"),
            ("canChangeCampaignGuarantee", "Can Change Campaign Guarantee"),
            ("canDeleteCampaignGuarantee", "Can Delete Campaign Guarantee"),
        ]
