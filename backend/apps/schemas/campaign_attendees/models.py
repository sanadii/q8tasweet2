# schema/campaign_attendee/models
from django.db import models

# Apps
from apps.schemas.schemaModels import DynamicSchemaModel
from apps.schemas.electors.models import Elector
from apps.schemas.committees.models import Committee
from utils.model_options import GuaranteeStatusOptions


class CampaignAttendee(DynamicSchemaModel):
    member = models.IntegerField(null=True, blank=True)
    committee = models.ForeignKey(
        Committee,
        related_name="committee_attendees",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )

    elector = models.ForeignKey(
        Elector,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="elector_attendees",
    )
    notes = models.TextField(blank=True, null=True)
    status = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = "campaign_attendee"
        verbose_name = "Election Attendee"
        verbose_name_plural = "Election Attendees"


# class Attendee(DynamicSchemaModel):
#     user = models.ForeignKey(
#         "auths.User",
#         on_delete=models.SET_NULL,
#         null=True,
#         blank=True,
#         related_name="campaign_committee_attendee_users",
#     )
#     campaign = models.ForeignKey(
#         "Campaign",
#         on_delete=models.SET_NULL,
#         null=True,
#         blank=True,
#         related_name="campaign_committee_attendee_campaigns",
#     )
#     committee = models.ForeignKey(
#         "committees.Committee",
#         on_delete=models.SET_NULL,
#         null=True,
#         blank=True,
#         related_name="election_committee_attendee_campaigns",
#     )

#     class Meta:
#         db_table = "campaign_committee_attendee"
#         verbose_name = "Campaign Committee Attendee"
#         verbose_name_plural = "Campaign Committee Attendees"
#         default_permissions = []
#         permissions = [
#             (
#                 "canViewCampaignCommitteeAttendee",
#                 "Can View Campaign Committee Attendee",
#             ),
#             ("canAddCampaignCommitteeAttendee", "Can Add Campaign Committee Attendee"),
#             (
#                 "canChangeCampaignCommitteeAttendee",
#                 "Can Change Campaign Committee Attendee",
#             ),
#             (
#                 "canDeleteCampaignCommitteeAttendee",
#                 "Can Delete Campaign Committee Attendee",
#             ),
#         ]

