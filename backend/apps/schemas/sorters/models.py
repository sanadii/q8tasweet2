

# class CampaignCommitteeSorter(TrackModel):
#     user = models.ForeignKey('auths.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='campaign_committee_sorter_users')
#     campaign = models.ForeignKey('Campaign', on_delete=models.SET_NULL, null=True, blank=True, related_name='campaign_committee_sorter_campaigns')
#     committee = models.ForeignKey('committees.Committee', on_delete=models.SET_NULL, null=True, blank=True, related_name='election_committee_sorter_committees')

#     class Meta:
#         managed = False
#         db_table = 'campaign_committee_sorter'
#         verbose_name = "Campaign Committee Sorter"
#         verbose_name_plural = "Campaign Committee Sorters"



# class CampaignSorting(models.Model):
#     user = models.ForeignKey('auths.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='sorter_sortees')
#     election_candidate = models.ForeignKey('elections.ElectionCandidate', on_delete=models.SET_NULL, null=True, blank=True, related_name='election_candidate_sortings')
#     election_committee = models.ForeignKey('committees.Committee', on_delete=models.SET_NULL, null=True, blank=True, related_name='election_committee_sortees')
#     votes = models.PositiveIntegerField(default=0)
#     notes = models.TextField(blank=True, null=True)

#     class Meta:
#         managed = False
#         db_table = 'campaign_sorting'
#         verbose_name = "Campaign Sorting"
#         verbose_name_plural = "Campaign Sortings"


# class CampaignPartySorting(models.Model):
#     user = models.ForeignKey('auths.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='sorter_sortees')
#     election_party = models.ForeignKey('elections.ElectionParty', on_delete=models.SET_NULL, null=True, blank=True, related_name='election_party_sortings')
#     election_committee = models.ForeignKey('committees.Committee', on_delete=models.SET_NULL, null=True, blank=True, related_name='election_committee_sortees')
#     votes = models.PositiveIntegerField(default=0)
#     notes = models.TextField(blank=True, null=True)

#     class Meta:
#         managed = False
#         db_table = 'campaign_party_sorting'
#         verbose_name = "Campaign Party Sorting"
#         verbose_name_plural = "Campaign Party Sortings"

# class CampaignPartyCandidateSorting(models.Model):
#     user = models.ForeignKey('auths.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='sorter_sortees')
#     election_party_candidate = models.ForeignKey('elections.ElectionPartyCandidate', on_delete=models.SET_NULL, null=True, blank=True, related_name='election_party_candidate_sortings')
#     election_committee = models.ForeignKey('committees.Committee', on_delete=models.SET_NULL, null=True, blank=True, related_name='election_committee_sortees')
#     votes = models.PositiveIntegerField(default=0)
#     notes = models.TextField(blank=True, null=True)

#     class Meta:
#         managed = False
#         db_table = 'campaign_party_candidate_sorting'
#         verbose_name = "Campaign Party Candidate Sorting"
#         verbose_name_plural = "Campaign Party Candidate Sortings"
#         default_permissions = []
#         permissions  = []


# class BaseCampaignSorting(models.Model):
#     user = models.ForeignKey(
#         "auths.User",
#         on_delete=models.SET_NULL,
#         null=True,
#         blank=True,
#         related_name="%(class)s_users",
#     )
#     election_committee = models.ForeignKey(
#         "committees.Committee",
#         on_delete=models.SET_NULL,
#         null=True,
#         blank=True,
#         related_name="%(class)s_election_committees",
#     )
#     votes = models.PositiveIntegerField(default=0)
#     notes = models.TextField(blank=True, null=True)

#     class Meta:
#         managed = False


# class CampaignSorting(BaseCampaignSorting):
#     election_candidate = models.ForeignKey(
#         "elections.ElectionCandidate",
#         on_delete=models.SET_NULL,
#         null=True,
#         blank=True,
#         related_name="campaign_candidate_sortings",
#     )

#     class Meta(BaseCampaignSorting.Meta):
#         managed = False
#         db_table = "campaign_sorting"
#         verbose_name = "Campaign Sorting"
#         verbose_name_plural = "Campaign Sortings"


# class CampaignPartySorting(BaseCampaignSorting):
#     election_party = models.ForeignKey(
#         "elections.ElectionParty",
#         on_delete=models.SET_NULL,
#         null=True,
#         blank=True,
#         related_name="campaign_party_sortings",
#     )

#     class Meta(BaseCampaignSorting.Meta):
#         managed = False
#         db_table = "campaign_party_sorting"
#         verbose_name = "Campaign Party Sorting"
#         verbose_name_plural = "Campaign Party Sortings"


# class CampaignPartyCandidateSorting(BaseCampaignSorting):
#     election_party_candidate = models.ForeignKey(
#         "elections.ElectionPartyCandidate",
#         on_delete=models.SET_NULL,
#         null=True,
#         blank=True,
#         related_name="campaign_party_candidate_sortings",
#     )

#     class Meta(BaseCampaignSorting.Meta):
#         managed = False
#         db_table = "campaign_party_candidate_sorting"
#         verbose_name = "Campaign Party Candidate Sorting"
#         verbose_name_plural = "Campaign Party Candidate Sortings"
