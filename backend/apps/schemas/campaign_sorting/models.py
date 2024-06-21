# schema/campaign_attendee/models
from django.db import models

# Apps
from apps.schemas.schemaModels import DynamicSchemaModel
from apps.schemas.committees.models import Committee


# class CampaignCommitteeSorter(DynamicSchemaModel):
#     user = models.ForeignKey(
#         "auths.User",
#         on_delete=models.SET_NULL,
#         null=True,
#         blank=True,
#         related_name="campaign_committee_sorter_users",
#     )
#     campaign = models.ForeignKey(
#         "Campaign",
#         on_delete=models.SET_NULL,
#         null=True,
#         blank=True,
#         related_name="campaign_committee_sorter_campaigns",
#     )
#     committee = models.ForeignKey(
#         "committees.Committee",
#         on_delete=models.SET_NULL,
#         null=True,
#         blank=True,
#         related_name="election_committee_sorter_committees",
#     )

#     class Meta:
#         managed = False
#         db_table = "campaign_committee_sorter"
#         verbose_name = "Campaign Committee Sorter"
#         verbose_name_plural = "Campaign Committee Sorters"


# Campaign Sorting Starting here


class BaseCampaignSorting(models.Model):
    member = models.IntegerField(null=True, blank=True)
    committee = models.ForeignKey(
        Committee,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="campaign_sorting_committees",
    )
    votes = models.PositiveIntegerField(default=0)
    notes = models.TextField(blank=True, null=True)

    class Meta:
        abstract = True
        managed = False


class SortingCampaign(BaseCampaignSorting, DynamicSchemaModel):
    election_candidate = models.IntegerField(null=True, blank=True)

    class Meta:
        managed = False
        db_table = "sorting_campaign"
        verbose_name = "Sorting Campaign"
        verbose_name_plural = "فرز الحملة"


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


#  Election Sorting Starting here


class BaseElectionSorting(models.Model):
    # user = models.ForeignKey(
    #     "auths.User",
    #     on_delete=models.SET_NULL,
    #     null=True,
    #     blank=True,
    #     related_name="%(class)s_users",
    # )
    member = models.IntegerField(null=True, blank=True)
    committee = models.ForeignKey(
        Committee,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="election_sorting_committees",
    )
    votes = models.PositiveIntegerField(default=0)
    notes = models.TextField(blank=True, null=True)

    class Meta:
        abstract = True
        managed = False
        permissions = [
            ("canViewElectionSorting", "Can View Election Sorting"),
            ("canAddElectionSorting", "Can Add Election Sorting"),
            ("canChangeElectionSorting", "Can Change Election Sorting"),
            ("canDeleteElectionSorting", "Can Delete Election Sorting"),
        ]


class SortingElection(BaseElectionSorting, DynamicSchemaModel):
    election_candidate = models.IntegerField(null=True, blank=True)
    class Meta:
        managed = False
        db_table = "sorting_election"
        verbose_name = "Sorting Election"
        verbose_name_plural = "فرز الانتخابات"


# class ElectionPartySorting(BaseElectionSorting):
#     election_party = models.ForeignKey(
#         "elections.ElectionParty",
#         on_delete=models.SET_NULL,
#         null=True,
#         blank=True,
#         related_name="election_party_sortings",
#     )

#     class Meta(BaseElectionSorting.Meta):
#         managed = False
#         db_table = "election_party_sorting"
#         verbose_name = "Election Party Sorting"
#         verbose_name_plural = "Election Party Sortings"


# class ElectionPartyCandidateSorting(BaseElectionSorting):
#     election_party_candidate = models.ForeignKey(
#         "elections.ElectionPartyCandidate",
#         on_delete=models.SET_NULL,
#         null=True,
#         blank=True,
#         related_name="election_party_candidate_sortings",
#     )

#     class Meta(BaseElectionSorting.Meta):
#         managed = False
#         db_table = "election_party_candidate_sorting"
#         verbose_name = "Election Party Candidate Sorting"
#         verbose_name_plural = "Election Party Candidate  Sortings"


# class ElectionCommitteeSorter(TrackModel, TaskModel):
#     election_committee = models.ForeignKey('ElectionCommittee', on_delete=models.SET_NULL, null=True, blank=True, related_name='election_committee_sorter_committees')
#     user = models.ForeignKey('auths.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='election_committee_sorter_users')


#     class Meta:
#         managed = False
#         db_table = "election_committee_sorter"
#         verbose_name = "Election Committee Sorter"
#         verbose_name_plural = "Election Committee Sorters"
#         default_permissions = []
#         permissions  = [
#             ("canViewElectionCommitteeSorter", "Can View Election Committee Sorter"),
#             ("canAddElectionCommitteeSorter", "Can Add Election Committee Sorter"),
#             ("canChangeElectionCommitteeSorter", "Can Change Election Committee Sorter"),
#             ("canDeleteElectionCommitteeSorter", "Can Delete Election Committee Sorter"),
#             ]

#     def __str__(self):
#         return f"{self.election.name}"

# def save(self, *args, **kwargs):
#     self.slug = slugify(f"{self.sub_category.slug}-{self.due_date.year if self.due_date else 'tba'}")
#     super().save(*args, **kwargs)


# @receiver(post_save, sender=ElectionCommitteeResult)
# def update_candidate_votes_on_save(sender, instance, **kwargs):
#     if instance.election_candidate:  # <--- Handling potential None
#         instance.election_candidate.update_votes()


# @receiver(post_delete, sender=ElectionCommitteeResult)
# def update_candidate_votes_on_delete(sender, instance, **kwargs):
#     if instance.election_candidate:  # <--- Handling potential None
#         instance.election_candidate.update_votes()


# @contextmanager
# def schema_context(schema_name):
#     with connection.cursor() as cursor:
#         cursor.execute("SHOW search_path")
#         old_schema = cursor.fetchone()
#         if old_schema:
#             old_schema = old_schema[0]  # Ensure you get the string value of the search path
#         try:
#             cursor.execute(f"SET search_path TO {schema_name}")
#             yield
#         finally:
#             if old_schema:
#                 cursor.execute(f"SET search_path TO {old_schema}")

# # Usage
# with schema_context('dynamic_schema'):
#     committee = Committee(name="New Committee")
#     committee.save()
