from django.db import models


# Models
from apps.settings.models import TrackModel, TaskModel
from apps.committees.models import Committee


class BaseCommitteeResult(models.Model):
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


# Add this in the relevant view or serializer
from django.apps import apps


class CommitteeResultCandidate(BaseCommitteeResult, TrackModel):
    election_candidate = models.IntegerField(null=True, blank=True)

    class Meta:
        db_table = "committee_result_candidate"
        verbose_name = "Committee Result Candidate"
        verbose_name_plural = "Committee Result Candidates"


# def print_model_fields(model):
#     fields = model._meta.get_fields()
#     for field in fields:
#         print(field.name)

# print_model_fields(CommitteeResultCandidate)


class CommitteePartyResult(BaseCommitteeResult, TrackModel):
    # election_party = models.ForeignKey(
    #     ElectionParty,
    #     on_delete=models.SET_NULL,
    #     null=True,
    #     blank=True,
    #     related_name="party_result_parties",
    # )
    election_party = models.IntegerField(null=True, blank=True)

    class Meta:
        db_table = "committee_result_party"
        verbose_name = "Committee Result Party"
        verbose_name_plural = "Committee Result Parties"


class CommitteeResultPartyCandidate(BaseCommitteeResult, TrackModel):
    # election_party_candidate = models.ForeignKey(
    #     ElectionPartyCandidate,
    #     on_delete=models.SET_NULL,
    #     null=True,
    #     blank=True,
    #     related_name="party_candidate_result_candidates",
    # )

    election_party_candidate = models.IntegerField(null=True, blank=True)

    class Meta:
        db_table = "committee_result_party_candidate"
        verbose_name = "Committee Result Party Candidate"
        verbose_name_plural = "Committee Result Party Candidates"
