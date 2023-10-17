# Election Model
from django.db import models
from restapi.helper.models_helper import TrackModel, TaskModel, ElectionTypeOptions, ElectionResultsOptions, StatusOptions, PriorityOptions, GenderOptions
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.db.models import Sum
from restapi.helper.models_permission_manager import ModelsPermissionManager, CustomPermissionManager

class Election(TrackModel, TaskModel):
    # Basic Information
    due_date = models.DateField(null=True, blank=True)
    category = models.ForeignKey('Category', on_delete=models.SET_NULL, null=True, blank=True, related_name='category_elections')
    sub_category = models.ForeignKey('Category', on_delete=models.SET_NULL, null=True, blank=True, related_name='subcategory_elections')

    # Election Options and Details
    elect_type = models.IntegerField(choices=ElectionTypeOptions.choices, blank=True, null=True)
    elect_result = models.IntegerField(choices=ElectionResultsOptions.choices, blank=True, null=True)
    elect_votes = models.PositiveIntegerField(blank=True, null=True)
    elect_seats = models.PositiveIntegerField(blank=True, null=True)

    # Elector
    electors = models.PositiveIntegerField(blank=True, null=True)
    electors_males = models.PositiveIntegerField(blank=True, null=True)
    electors_females = models.PositiveIntegerField(blank=True, null=True)

    # Attendees
    attendees = models.PositiveIntegerField(blank=True, null=True)
    attendees_males = models.PositiveIntegerField(blank=True, null=True)
    attendees_females = models.PositiveIntegerField(blank=True, null=True)

    class Meta:
        # managed = False
        db_table = "election"
        verbose_name = "Election"
        verbose_name_plural = "Election"
        default_permissions = []
        permissions  = [
            ("canViewElection", "Can View Election"),
            ("canAddElection", "Can Add Election"),
            ("canChangeElection", "Can Change Election"),
            ("canDeleteElection", "Can Delete Election"),
            ]

    def __str__(self):
        return f"{self.sub_category.name} - {self.due_date.year if self.due_date else 'No Date'}"

    def get_dynamic_name(self):
        return f"{self.sub_category.name} - {self.due_date.year if self.due_date else 'No Date'}"


class ElectionCandidate(TrackModel):
    election = models.ForeignKey('Election', on_delete=models.SET_NULL, null=True, blank=True, related_name="candidate_elections")
    candidate = models.ForeignKey('Candidate', on_delete=models.SET_NULL, null=True, blank=True, related_name="election_candidates")
    votes = models.PositiveIntegerField(default=0)
    notes = models.TextField(blank=True, null=True)


    def update_votes(self):
        self.votes = self.committee_result_candidates.aggregate(Sum('votes'))['votes__sum'] or 0
        self.save()

    class Meta:
        db_table = "election_candidate"
        verbose_name = "Election Candidate"
        verbose_name_plural = "Election Candidate"
        default_permissions = []
        permissions  = [
            ("canViewElectionCandidate", "Can View Election Candidate"),
            ("canAddElectionCandidate", "Can Add Election Candidate"),
            ("canChangeElectionCandidate", "Can Change Election Candidate"),
            ("canDeleteElectionCandidate", "Can Delete Election Candidate"),
            ]

    def __str__(self):
        return str(self.candidate.name)

class ElectionCommittee(TrackModel):
    # Basic Information
    election = models.ForeignKey('Election', on_delete=models.SET_NULL, null=True, blank=True, related_name='committee_elections')
    name = models.CharField(max_length=255, blank=False, null=False)
    gender = models.IntegerField(choices=GenderOptions.choices, null=True, blank=True)
    location = models.TextField(blank=True, null=True)

    class Meta:
        db_table = "election_committee"
        verbose_name = "Election Committe"
        verbose_name_plural = "Election Committes"
        default_permissions = []
        permissions  = [
            ("canViewElectionCommitte", "Can View Election Committe"),
            ("canAddElectionCommitte", "Can Add Election Committe"),
            ("canChangeElectionCommitte", "Can Change Election Committe"),
            ("canDeleteElectionCommitte", "Can Delete Election Committe"),
            ]
    def __str__(self):
        return self.name

class ElectionCommitteeResult(TrackModel):
    # Basic Information
    election_committee = models.ForeignKey('ElectionCommittee', on_delete=models.SET_NULL, null=True, blank=True, related_name='committee_result_elections')
    election_candidate = models.ForeignKey('ElectionCandidate', on_delete=models.SET_NULL, null=True, blank=True, related_name='committee_result_candidates')
    votes = models.IntegerField(blank=True, null=True)

    class Meta:
        db_table = "election_committee_result"
        verbose_name = "Committe Result"
        verbose_name_plural = "Committe Results"
        default_permissions = []
        permissions  = [
            ("canViewCommitteeResult", "Can View Committee Result"),
            ("canAddCommitteeResult", "Can Add Committee Result"),
            ("canChangeCommitteeResult", "Can Change Committee Result"),
            ("canDeleteCommitteeResult", "Can Delete Committee Result"),
            ]
        
    def __str__(self):
        return f"{self.election_committee.name} - {self.election_candidate.candidate.name} - Votes: {self.votes}"

@receiver(post_save, sender=ElectionCommitteeResult)
def update_candidate_votes_on_save(sender, instance, **kwargs):
    if instance.election_candidate:  # <--- Handling potential None
        instance.election_candidate.update_votes()


@receiver(post_delete, sender=ElectionCommitteeResult)
def update_candidate_votes_on_delete(sender, instance, **kwargs):
    if instance.election_candidate:  # <--- Handling potential None
        instance.election_candidate.update_votes()
