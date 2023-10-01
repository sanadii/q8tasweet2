# Elections Model
from django.db import models
from restapi.modelsHelper import TrackModel, ElectionTypeOptions, ElectionResultsOptions, StatusOptions, PriorityOptions, GenderOptions
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.db.models import Sum

class Elections(TrackModel):
    # Basic Information
    duedate = models.DateField(null=True, blank=True)
    category = models.ForeignKey('Categories', on_delete=models.SET_NULL, null=True, blank=True, related_name='category_elections')
    sub_category = models.ForeignKey('Categories', on_delete=models.SET_NULL, null=True, blank=True, related_name='subcategory_elections')
    # tags = models.ForeignKey('Categories', on_delete=models.SET_NULL, null=True, blank=True, related_name='tags_elections')
    # tags = models.ManyToManyField('Categories', related_name='elections')

    # Election Options and Details
    type = models.IntegerField(choices=ElectionTypeOptions.choices, blank=True, null=True)
    result = models.IntegerField(choices=ElectionResultsOptions.choices, blank=True, null=True)
    votes = models.PositiveIntegerField(blank=True, null=True)
    seats = models.PositiveIntegerField(blank=True, null=True)

    # Electors
    electors = models.PositiveIntegerField(blank=True, null=True)
    electors_males = models.PositiveIntegerField(blank=True, null=True)
    electors_females = models.PositiveIntegerField(blank=True, null=True)

    # Attendees
    attendees = models.PositiveIntegerField(blank=True, null=True)
    attendees_males = models.PositiveIntegerField(blank=True, null=True)
    attendees_females = models.PositiveIntegerField(blank=True, null=True)

    # Administration
    moderators = models.CharField(max_length=255, blank=True, null=True)
    status = models.IntegerField(choices=StatusOptions.choices, blank=True, null=True)
    priority = models.IntegerField(choices=PriorityOptions.choices, blank=True, null=True)

    class Meta:
        # managed = False
        db_table = "election"
        verbose_name = "Election"
        verbose_name_plural = "Elections"

    def __str__(self):
        return f"{self.sub_category.name} - {self.duedate.year if self.duedate else 'No Date'}"

    def get_dynamic_name(self):
        return f"{self.sub_category.name} - {self.duedate.year if self.duedate else 'No Date'}"


class ElectionCandidates(TrackModel):
    election = models.ForeignKey('Elections', on_delete=models.SET_NULL, null=True, blank=True)
    candidate = models.ForeignKey('Candidates', on_delete=models.SET_NULL, null=True, blank=True)
    votes = models.PositiveIntegerField(default=0)

    # Administration
    moderators = models.CharField(max_length=255, blank=True, null=True)
    status = models.IntegerField(choices=StatusOptions.choices, blank=True, null=True)
    priority = models.IntegerField(choices=PriorityOptions.choices, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)

    def update_votes(self):
        self.votes = self.committee_result_candidates.aggregate(Sum('votes'))['votes__sum'] or 0
        self.save()

    class Meta:
        db_table = "election_candidate"
        verbose_name = "Election Candidate"
        verbose_name_plural = "Election Candidates"

    def __str__(self):
        return str(self.candidate.name)

class ElectionCommittees(TrackModel):
    # Basic Information
    election = models.ForeignKey('Elections', on_delete=models.SET_NULL, null=True, blank=True, related_name='committee_elections')
    name = models.CharField(max_length=255, blank=False, null=False)
    gender = models.IntegerField(choices=GenderOptions.choices, null=True, blank=True)
    location = models.TextField(blank=True, null=True)

    class Meta:
        db_table = "election_committee"
        verbose_name = "Election Committe"
        verbose_name_plural = "Election Committes"

    def __str__(self):
        return self.name

class ElectionCommitteeResults(TrackModel):
    # Basic Information
    election_committee = models.ForeignKey('ElectionCommittees', on_delete=models.SET_NULL, null=True, blank=True, related_name='committee_result_elections')
    election_candidate = models.ForeignKey('ElectionCandidates', on_delete=models.SET_NULL, null=True, blank=True, related_name='committee_result_candidates')
    votes = models.IntegerField(blank=True, null=True)

    class Meta:
        db_table = "election_committee_result"
        verbose_name = "Committe Result"
        verbose_name_plural = "Committe Results"

    def __str__(self):
        return f"{self.election_committee.name} - {self.election_candidate.candidate.name} - Votes: {self.votes}"

@receiver(post_save, sender=ElectionCommitteeResults)
def update_candidate_votes_on_save(sender, instance, **kwargs):
    if instance.election_candidate:  # <--- Handling potential None
        instance.election_candidate.update_votes()


@receiver(post_delete, sender=ElectionCommitteeResults)
def update_candidate_votes_on_delete(sender, instance, **kwargs):
    if instance.election_candidate:  # <--- Handling potential None
        instance.election_candidate.update_votes()
