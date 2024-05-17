import os
import uuid
from contextlib import contextmanager
from django.db import models
from django.db import connection, connections
from django.db.models import Sum
from django.db.models.signals import post_save, post_delete
from django.contrib.auth import get_user_model
from django.dispatch import receiver
from django_extensions.db.fields import AutoSlugField, SlugField
from django.utils.text import slugify

# Models
from apps.settings.models import TrackModel, TaskModel
from apps.areas.models import Area
from apps.elections.models import ElectionCandidate

# from django.contrib.postgres.fields import ArrayField

User = get_user_model()


GENDER_CHOICES = [
    ("1", "Male"),
    ("2", "Female"),
]


# class DynamicSchemaModel(models.Model):
#     class Meta:
#         abstract = True

#     _schema = None

#     def set_schema(self, schema):
#         self._schema = schema

#     def save(self, *args, **kwargs):
#         # Set the schema to be used for saving this instance
#         if self._schema:
#             with schema_context(self._schema):
#                 super().save(*args, **kwargs)
#         else:
#             super().save(*args, **kwargs)


class CommitteeSite(models.Model):
    serial = models.IntegerField(blank=True, null=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    circle = models.CharField(max_length=255, blank=True, null=True)

    area = models.ForeignKey(
        Area,
        on_delete=models.CASCADE,
        related_name="committee_site_areas",
    )
    area_name = models.CharField(max_length=255, blank=True, null=True)
    gender = models.IntegerField(choices=GENDER_CHOICES, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    voter_count = models.IntegerField(blank=True, null=True)
    committee_count = models.IntegerField(blank=True, null=True)
    tags = models.TextField(blank=True, null=True)
    election = models.IntegerField(null=True, blank=True)

    class Meta:
        managed = False
        db_table = "committee_site"
        verbose_name = "موقع اللجنة"
        verbose_name_plural = "مواقع اللجان"
        default_permissions = []

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)  # Ensures base class initialization
        schema_name = kwargs.get("schema_name", "public")
        self.set_schema(schema_name)  # Dynamically sets the schema if provided

    def __str__(self):
        return self.name

    def set_schema(self, schema):
        self._schema = schema

    # def get_election(self):
    #     from apps.elections.models import Election

    #     try:
    #         if self.election:
    #             return Election.objects.using("default").get(id=self.election)
    #     except Election.DoesNotExist:
    #         return None
    #     return None


class Committee(models.Model):
    area_name = models.TextField(blank=True, null=True)
    letters = models.TextField(blank=True, null=True)
    committee_site = models.ForeignKey(
        CommitteeSite,
        on_delete=models.CASCADE,
        related_name="committee_site_committees",
        blank=True, null=True
    )
    type = models.TextField(max_length=25, blank=True, null=True)
    main = models.BooleanField(default=False)

    class Meta:
        managed = False
        db_table = "committee"
        verbose_name = "اللجنة"
        verbose_name_plural = "اللجان"
        default_permissions = []

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)  # Ensures base class initialization
        schema_name = kwargs.get("schema_name", "public")
        self.set_schema(schema_name)  # Dynamically sets the schema if provided

    def __str__(self):
        return self.name

    def set_schema(self, schema):
        self._schema = schema


class BaseElectionCommitteeResult(models.Model):
    committee = models.ForeignKey(
        Committee,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="%(class)s_committees",
    )
    votes = models.PositiveIntegerField(default=0)
    notes = models.TextField(blank=True, null=True)

    class Meta:
        abstract = True
        permissions = [
            ("canViewElectionCommitteeResult", "Can View Election Committee Result"),
            ("canAddElectionCommitteeResult", "Can Add Election Committee Result"),
            (
                "canChangeElectionCommitteeResult",
                "Can Change Election Committee Result",
            ),
            (
                "canDeleteElectionCommitteeResult",
                "Can Delete Election Committee Result",
            ),
        ]


class CommitteeCandidateResult(BaseElectionCommitteeResult, TrackModel):
    election_candidate = models.ForeignKey(
        ElectionCandidate,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="committee_candidate_result_candidates",
    )

    class Meta:
        managed = False
        db_table = "committee_candidate_result"
        verbose_name = "Committee Candidate Result"
        verbose_name_plural = "Committee Candidate Results"


# class ElectionPartyCommitteeResult(BaseElectionCommitteeResult, TrackModel):
#     election_party = models.ForeignKey(
#         ElectionParty,
#         on_delete=models.SET_NULL,
#         null=True,
#         blank=True,
#         related_name="party_committee_result_candidates",
#     )

#     class Meta:
#         db_table = "election_party_committee_result"
#         verbose_name = "Election Party Committee Result"
#         verbose_name_plural = "Election Party Committee Results"


# class ElectionPartyCandidateCommitteeResult(BaseElectionCommitteeResult, TrackModel):
#     election_party_candidate = models.ForeignKey(
#         ElectionPartyCandidate,
#         on_delete=models.SET_NULL,
#         null=True,
#         blank=True,
#         related_name="party_candidate_committee_result_candidates",
#     )

#     class Meta:
#         db_table = "election_party_candidate_committee_result"
#         verbose_name = "Election Party Candidate Committee Result"
#         verbose_name_plural = "Election Party Candidate Committee Results"


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


# class ElectionCommitteeGroup(TrackModel):
#     id = models.AutoField(primary_key=True)
#     election = models.ForeignKey('Election', on_delete=models.SET_NULL, null=True, blank=True, related_name='committee_group_elections')
#     name = models.CharField(max_length=255)
#     committee_no = models.IntegerField()
#     circle = models.IntegerField()
#     # Change area to a ForeignKey relation to the Area model
#     area = models.ForeignKey(Area, on_delete=models.SET_NULL, null=True, blank=True, related_name='committee_areas')
#     gender = models.IntegerField(choices=GenderOptions.choices, null=True, blank=True)
#     description = models.CharField(max_length=255)
#     address = models.CharField(max_length=255)
#     voter_count = models.IntegerField()
#     committee_count = models.IntegerField()
#     total_voters = models.IntegerField()
#     tags = models.CharField(max_length=255, blank=True)

#     class Meta:
#         db_table = "committee_group"
#         verbose_name = "Committee Group"
#         verbose_name_plural = "Committee Groups"
#         default_permissions = []

#     def __str__(self):
#         return self.name

# class ElectionCommittee(TrackModel):
#     id = models.AutoField(primary_key=True)
#     serial = models.IntegerField()
#     letters = models.CharField(max_length=255)
#     type = models.CharField(max_length=255)
#     areas = models.CharField(max_length=255)
#     committee_group = models.ForeignKey(ElectionCommitteeGroup, on_delete=models.SET_NULL, null=True, blank=True, related_name='committees')

#     class Meta:
#         db_table = "committee"
#         verbose_name = "Committee Group"
#         verbose_name_plural = "Committee Groups"
#         default_permissions = []

#     def __str__(self):
#         return f"{self.areas} - {self.serial} - {self.letters}"

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
