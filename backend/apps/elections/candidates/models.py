# Election Model
from django.db import models
from apps.settings.models import TrackModel, TaskModel
from utils.schema import schema_context
from django.db import transaction
from apps.elections.models import Election
from apps.candidates.models import Candidate, Party
#
# Election Participant (Candidate, Party, PartyCandidate) Model
#
class ElectionCandidate(TrackModel):
    election = models.ForeignKey(
        Election,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="candidate_elections",
    )
    candidate = models.ForeignKey(
        Candidate,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="election_candidates",
    )
    position = models.IntegerField(null=True, blank=True)
    result = models.CharField(max_length=25, null=True, blank=True)
    votes = models.PositiveIntegerField(default=0, null=True, blank=True)
    note = models.TextField(blank=True, null=True)

    class Meta:
        db_table = "election_candidate"
        verbose_name = "Election Candidate"
        verbose_name_plural = "Election Candidates"
        default_permissions = []
        permissions = [
            ("canViewElectionCandidate", "Can View Election Candidate"),
            ("canAddElectionCandidate", "Can Add Election Candidate"),
            ("canChangeElectionCandidate", "Can Change Election Candidate"),
            ("canDeleteElectionCandidate", "Can Delete Election Candidate"),
        ]

    def __str__(self):
        return str(self.candidate.name)

    def delete(self, *args, **kwargs):
        # from the election take the slug
        election = self.election
        if election and election.slug:
            slug = election.slug
            with schema_context(slug):
                with transaction.atomic():
                    # Delete related CommitteeResultCandidate entries
                    from apps.schemas.committee_results.models import CommitteeResultCandidate

                    related_entries = CommitteeResultCandidate.objects.filter(
                        election_candidate=self.id
                    )

                    # Print related entries before deletion
                    for entry in related_entries:
                        print(f"Deleting CommitteeResultCandidate: {entry}")

                    related_entries.delete()
            super(ElectionCandidate, self).delete(*args, **kwargs)
            return

        super(ElectionCandidate, self).delete(*args, **kwargs)


class ElectionParty(TrackModel):
    election = models.ForeignKey(
        Election,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="party_elections",
    )
    party = models.ForeignKey(
        Party,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="election_parties",
    )
    votes = models.PositiveIntegerField(default=0)
    notes = models.TextField(blank=True, null=True)

    #  Saving sum of votes from CommitteeResultCandidate for each party
    # def update_votes(self):
    #     total_votes = CommitteeResultCandidate.objects.filter(election_party=self).aggregate(total_votes=Sum('votes'))['total_votes']
    #     self.votes = total_votes if total_votes is not None else 0
    #     self.save()

    class Meta:
        db_table = "election_party"
        verbose_name = "Election Party"
        verbose_name_plural = "Election Parties"
        default_permissions = []
        permissions = []

    def __str__(self):
        return f"{self.party.name} in {self.election.title}"

    def delete(self, *args, **kwargs):
        request = kwargs.pop("request", None)
        if request:
            slug = request.resolver_match.kwargs.get("slug")
            if slug:
                with schema_context(slug):
                    with transaction.atomic():
                        # Delete related CommitteeResultCandidate entries
                        self.committee_candidate_results.all().delete()
                        super(ElectionCandidate, self).delete(*args, **kwargs)
                        return
        super(ElectionCandidate, self).delete(*args, **kwargs)


class ElectionPartyCandidate(TrackModel):
    election_party = models.ForeignKey(
        ElectionParty,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="election_party_elections",
    )
    election_candidate = models.ForeignKey(
        ElectionCandidate,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="election_candidate_elections",
    )
    votes = models.PositiveIntegerField(default=0)
    total_votes = models.PositiveIntegerField(default=0)
    notes = models.TextField(blank=True, null=True)

    #  Saving sum of votes from ElectionCommitteeResult for each candidate
    # def update_votes(self):
    #     total_votes = CommitteeResultCandidate.objects.filter(
    #         election_party_candidate=self
    #     ).aggregate(total_votes=Sum("votes"))["total_votes"]
    #     self.votes = total_votes if total_votes is not None else 0
    #     self.save()

    class Meta:
        db_table = "election_party_candidate"
        verbose_name = "Election Party Candidate"
        verbose_name_plural = "Election Parties Candidates"
        default_permissions = []
        permissions = []

    def __str__(self):
        return f"{self.candidate.name} for {self.election_party.party.name} in {self.election_party.election.title}"
