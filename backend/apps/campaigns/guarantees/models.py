

# # # # # # # # # # # # # # # # #
# Models for Dynamic Schema # # #
# # # # # # # # # # # # # # # # #
# class CampaignGuarantee(TrackModel, DynamicSchemaModel):
#     campaign = models.ForeignKey(
#         "Campaign",
#         on_delete=models.SET_NULL,
#         null=True,
#         blank=True,
#         related_name="campaign_guarantees",
#     )
#     member = models.ForeignKey(
#         "CampaignMember",
#         on_delete=models.SET_NULL,
#         null=True,
#         blank=True,
#         related_name="campaign_guarantee_guarantors",
#     )
#     civil = models.ForeignKey(
#         Elector,
#         on_delete=models.SET_NULL,
#         null=True,
#         blank=True,
#         related_name="campaign_voter_guarantees",
#     )
#     phone = models.CharField(max_length=8, blank=True, null=True)
#     notes = models.TextField(blank=True, null=True)
#     status = models.IntegerField(
#         choices=GuaranteeStatusOptions.choices, blank=True, null=True
#     )
#     guarantee_groups = models.ManyToManyField(
#         "CampaignGuaranteeGroup", blank=True, related_name="campaign_guarantees"
#     )

#     class Meta:
#         db_table = "campaign_guarantee"
#         verbose_name = "Campaign Guarantee"
#         verbose_name_plural = "Campaign Guarantees"
#         default_permissions = []
#         permissions = [
#             ("canViewCampaignGuarantee", "Can View Campaign Guarantee"),
#             ("canAddCampaignGuarantee", "Can Add Campaign Guarantee"),
#             ("canChangeCampaignGuarantee", "Can Change Campaign Guarantee"),
#             ("canDeleteCampaignGuarantee", "Can Delete Campaign Guarantee"),
#         ]


# class CampaignGuaranteeGroup(TrackModel, DynamicSchemaModel):
#     name = models.CharField(max_length=150, blank=True)
#     member = models.ForeignKey(
#         "CampaignMember",
#         on_delete=models.SET_NULL,
#         null=True,
#         blank=True,
#         related_name="campaign_guarantee_group_members",
#     )
#     phone = models.CharField(
#         max_length=8, blank=True, null=True
#     )  # or any other field type suitable for your requirements
#     note = models.CharField(max_length=250, blank=True)

#     class Meta:
#         db_table = "campaign_guarantee_group"
#         verbose_name = "Campaign Guarantee Group"
#         verbose_name_plural = "Campaign Guarantee Groups"
#         default_permissions = []
#         permissions = [
#             ("canViewCampaignGuaranteeGroup", "Can View Campaign Guarantee Group"),
#             ("canAddCampaignGuaranteeGroup", "Can Add Campaign Guarantee Group"),
#             ("canChangeCampaignGuaranteeGroup", "Can Change Campaign Guarantee Group"),
#             ("canDeleteCampaignGuaranteeGroup", "Can Delete Campaign GuaranteeGroup"),
#         ]
