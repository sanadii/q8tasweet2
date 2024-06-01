# campaigns/models
from django.db import models
from django.contrib.auth.models import Group
from utils.model_options import GuaranteeStatusOptions
from utils.validators import civil_validator, phone_validator
from apps.settings.models import TrackModel, TaskModel


class CampaignMember(TrackModel):
    user = models.ForeignKey(
        "auths.User",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="campaign_users",
    )
    campaign = models.ForeignKey(
        "Campaign",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="campaign_members",
    )
    role = models.ForeignKey(
        Group,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="campaign_role_members",
    )
    supervisor = models.ForeignKey(
        "self",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="supervised_members",
    )
    # committee = models.ForeignKey(
    #     "committees.Committee",
    #     on_delete=models.SET_NULL,
    #     null=True,
    #     blank=True,
    #     related_name="campaign_committee_members",
    # )
    # civil = models.CharField(
    #     max_length=12, blank=True, null=True, validators=[civil_validator]
    # )
    phone = models.CharField(
        max_length=8, blank=True, null=True, validators=[phone_validator]
    )
    note = models.TextField(blank=True, null=True)
    status = models.IntegerField(
        choices=GuaranteeStatusOptions.choices, blank=True, null=True
    )

    class Meta:
        db_table = "campaign_member"
        verbose_name = "Campaign Member"
        verbose_name_plural = "Campaign Members"
        default_permissions = []
        permissions = [
            ("canViewCampaignMember", "Can View Campaign Member"),
            ("canAddCampaignMember", "Can Add Campaign Member"),
            ("canChangeCampaignMember", "Can Change Campaign Member"),
            ("canDeleteCampaignMember", "Can Delete Campaign Member"),
        ]

    def __str__(self):
        return f"CampaignMember {self.id}"  # Ensure this returns a string
