from django.db import models

# Models
from apps.schemas.committees.models import Committee
from apps.schemas.schemaModels import DynamicSchemaModel

class CommitteeResultCandidate(DynamicSchemaModel):
    election_candidate = models.IntegerField(null=True, blank=True)
    committee = models.ForeignKey(
        Committee,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="committee_result_candidates",
    )
    votes = models.PositiveIntegerField(default=0)
    notes = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = "committee_result_candidate"
        verbose_name = "Committee Result Candidate"
        verbose_name_plural = "نتائج اللجان"


class CommitteeResultParty(DynamicSchemaModel):
    election_party = models.IntegerField(null=True, blank=True)
    committee = models.ForeignKey(
        Committee,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="committee_result_parties",
    )
    votes = models.PositiveIntegerField(default=0)
    notes = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = "committee_result_party"
        verbose_name = "Committee Result Party"
        verbose_name_plural = "Committee Result Parties"


class CommitteeResultPartyCandidate(DynamicSchemaModel):
    election_party_candidate = models.IntegerField(null=True, blank=True)
    committee = models.ForeignKey(
        Committee,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="committee_result_party_candidates",
    )
    votes = models.PositiveIntegerField(default=0)
    notes = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = "committee_result_party_candidate"
        verbose_name = "Committee Result Party Candidate"
        verbose_name_plural = "Committee Result Party Candidates"
