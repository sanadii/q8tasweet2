
from django.db import models
from django.contrib.auth import get_user_model

# Models
from apps.schemas.areas.models import Area
from utils.model_options import GenderOptions
from apps.schemas.schemaModels import DynamicSchemaModel

User = get_user_model()
     
class CommitteeSite(DynamicSchemaModel):
    serial = models.IntegerField(blank=True, null=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    circle = models.CharField(max_length=255, blank=True, null=True)
    area = models.ForeignKey(
        Area,
        on_delete=models.CASCADE,
        related_name="committee_site_areas",
        null=True,
        blank=True,
    )
    area_name = models.CharField(max_length=255, blank=True, null=True)
    gender = models.IntegerField(choices=GenderOptions.choices, null=True, blank=True)
    description = models.TextField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    # elector_count = models.IntegerField(blank=True, null=True)
    tags = models.TextField(blank=True, null=True)
    election = models.IntegerField(null=True, blank=True)

    class Meta:
        managed = False
        db_table = "committee_site"
        verbose_name = "موقع اللجنة"
        verbose_name_plural = "مواقع اللجان"
        default_permissions = []

    def __str__(self):
        return f"CommitteeSite {self.id}"

    def get_dynamic_fields(self):
        fields = {}
        if self.election_category == 3000:
            fields['test_site'] = models.IntegerField(blank=True, null=True)
        return fields


class Committee(DynamicSchemaModel):
    area_name = models.TextField(blank=True, null=True)
    letters = models.TextField(blank=True, null=True)
    committee_site = models.ForeignKey(
        CommitteeSite, 
        related_name="committee_site_committees",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    type = models.TextField(max_length=25, blank=True, null=True)

    class Meta:
        managed = False
        db_table = "committee"
        verbose_name = "اللجنة"
        verbose_name_plural = "اللجان"
        default_permissions = []

    def __str__(self):
        return f"Committee {self.id}"

    def get_dynamic_fields(self):
        fields = {}
        if self.election_category == 3000:
            fields['testing'] = models.IntegerField(blank=True, null=True)
        return fields










# class BaseElectionSorting(models.Model):
#     user = models.ForeignKey(
#         'auths.User',
#         on_delete=models.SET_NULL,
#         null=True,
#         blank=True,
#         related_name='%(class)s_users',
#     )
#     election_committee = models.ForeignKey(
#         'elections.ElectionCommittee',
#         on_delete=models.SET_NULL,
#         null=True,
#         blank=True,
#         related_name='%(class)s_election_committees',
#     )
#     votes = models.PositiveIntegerField(default=0)
#     notes = models.TextField(blank=True, null=True)

#     class Meta:
#         abstract = True  # Prevents direct model creation
#         permissions = [
#             ("canViewElectionSorting", "Can View Election Sorting"),
#             ("canAddElectionSorting", "Can Add Election Sorting"),
#             ("canChangeElectionSorting", "Can Change Election Sorting"),
#             ("canDeleteElectionSorting", "Can Delete Election Sorting"),
#         ]

# class ElectionSorting(BaseElectionSorting):
#     election_candidate = models.ForeignKey('elections.ElectionCandidate', on_delete=models.SET_NULL, null=True, blank=True, related_name='election_candidate_sortings')

#     class Meta(BaseElectionSorting.Meta):
#         db_table = 'election_sorting'
#         verbose_name = "Election Sorting"
#         verbose_name_plural = "Election Sortings"

# class ElectionPartySorting(BaseElectionSorting):
#     election_party = models.ForeignKey('elections.ElectionParty', on_delete=models.SET_NULL, null=True, blank=True, related_name='election_party_sortings')

#     class Meta(BaseElectionSorting.Meta):
#         db_table = 'election_party_sorting'
#         verbose_name = "Election Party Sorting"
#         verbose_name_plural = "Election Party Sortings"

# class ElectionPartyCandidateSorting(BaseElectionSorting):
#     election_party_candidate = models.ForeignKey('elections.ElectionPartyCandidate', on_delete=models.SET_NULL, null=True, blank=True, related_name='election_party_candidate_sortings')

#     class Meta(BaseElectionSorting.Meta):
#         db_table = 'election_party_candidate_sorting'
#         verbose_name = "Election Party Candidate Sorting"
#         verbose_name_plural = "Election Party Candidate  Sortings"



# class ElectionCommitteeSorter(TrackModel, TaskModel):
#     election_committee = models.ForeignKey('ElectionCommittee', on_delete=models.SET_NULL, null=True, blank=True, related_name='election_committee_sorter_committees')
#     user = models.ForeignKey('auths.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='election_committee_sorter_users')


#     class Meta:
#         # managed = False
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

#     # def save(self, *args, **kwargs):
#     #     self.slug = slugify(f"{self.sub_category.slug}-{self.due_date.year if self.due_date else 'tba'}")
#     #     super().save(*args, **kwargs)


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
