
# class CampaignCommitteeAttendee(TrackModel):
#     user = models.ForeignKey('auths.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='campaign_committee_attendee_users')
#     campaign = models.ForeignKey('Campaign', on_delete=models.SET_NULL, null=True, blank=True, related_name='campaign_committee_attendee_campaigns')
#     committee = models.ForeignKey('committees.Committee', on_delete=models.SET_NULL, null=True, blank=True, related_name='election_committee_attendee_campaigns')

#     class Meta:
#         db_table = 'campaign_committee_attendee'
#         verbose_name = "Campaign Committee Attendee"
#         verbose_name_plural = "Campaign Committee Attendees"
#         default_permissions = []
#         permissions  = [
#             ("canViewCampaignCommitteeAttendee", "Can View Campaign Committee Attendee"),
#             ("canAddCampaignCommitteeAttendee", "Can Add Campaign Committee Attendee"),
#             ("canChangeCampaignCommitteeAttendee", "Can Change Campaign Committee Attendee"),
#             ("canDeleteCampaignCommitteeAttendee", "Can Delete Campaign Committee Attendee"),
#             ]


# class CampaignAttendee(TrackModel, DynamicSchemaModel):
#     user = models.ForeignKey(
#         "auths.User",
#         on_delete=models.SET_NULL,
#         null=True,
#         blank=True,
#         related_name="attendant_attendees",
#     )
#     election = models.ForeignKey(
#         "elections.Election",
#         on_delete=models.SET_NULL,
#         null=True,
#         blank=True,
#         related_name="election_attendees",
#     )
#     committee = models.ForeignKey(
#         "committees.Committee",
#         on_delete=models.SET_NULL,
#         null=True,
#         blank=True,
#         related_name="committee_attendees",
#     )
#     civil = models.ForeignKey(
#         Elector,
#         on_delete=models.SET_NULL,
#         null=True,
#         blank=True,
#         related_name="voter_attendees",
#     )
#     notes = models.TextField(blank=True, null=True)
#     status = models.IntegerField(blank=True, null=True)

#     class Meta:
#         db_table = "campaign_attendee"
#         verbose_name = "Campaign Attendee"
#         verbose_name_plural = "Campaign Attendees"
#         default_permissions = []
#         permissions = [
#             ("canViewCampaignAttendee", "Can View Campaign Attendee"),
#             ("canAddCampaignAttendee", "Can Add Campaign Attendee"),
#             ("canChangeCampaignAttendee", "Can Change Campaign Attendee"),
#             ("canDeleteCampaignAttendee", "Can Delete Campaign Attendee"),
#         ]
