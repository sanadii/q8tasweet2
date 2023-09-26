# Elections Model

from django.db import models
from django.utils import timezone
from django.core.validators import RegexValidator
from ..modelsHelper import *

class Elections(models.Model):
    # Basic Information
    id = models.BigAutoField(primary_key=True)
    category = models.ForeignKey('Categories', on_delete=models.SET_NULL, null=True, blank=True, related_name='category_elections')
    sub_category = models.ForeignKey('Categories', on_delete=models.SET_NULL, null=True, blank=True, related_name='subcategory_elections')
    duedate = models.DateField(null=True, blank=True)

    # Tags
    # tags = models.ForeignKey('Categories', on_delete=models.SET_NULL, null=True, blank=True, related_name='tags_elections')
    
    # Election Options and Details
    type = models.IntegerField(blank=True, null=True)
    result = models.IntegerField(blank=True, null=True)
    votes = models.IntegerField(blank=True, null=True)
    seats = models.IntegerField(blank=True, null=True)

    # Electors
    electors = models.CharField(max_length=7, blank=True, null=True)
    electors_males = models.CharField(max_length=7, blank=True, null=True)
    electors_females = models.CharField(max_length=7, blank=True, null=True)

    # Attendees
    attendees = models.CharField(max_length=7, blank=True, null=True)
    attendees_males = models.CharField(max_length=7, blank=True, null=True)
    attendees_females = models.CharField(max_length=7, blank=True, null=True)

    # Administration
    moderators = models.CharField(max_length=255, blank=True, null=True)
    status = models.IntegerField(blank=True, null=True)
    priority = models.IntegerField(blank=True, null=True)

    # Tracking Information
    created_by = models.ForeignKey('User', on_delete=models.SET_NULL, null=True, blank=True, related_name='created_elections')
    updated_by = models.ForeignKey('User', on_delete=models.SET_NULL, null=True, blank=True, related_name='updated_elections')
    deleted_by = models.ForeignKey('User', on_delete=models.SET_NULL, null=True, blank=True, related_name='deleted_elections')
    created_date = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_date = models.DateTimeField(auto_now=True, null=True, blank=True)
    deleted_date = models.DateTimeField(auto_now=True, null=True, blank=True)
    deleted = models.BooleanField(default=False, null=True, blank=True)

    class Meta:
        # managed = False
        db_table = "election"
        verbose_name = "Election"
        verbose_name_plural = "Elections"

    def __str__(self):
        return f"{self.sub_category.name} {self.duedate.year if self.duedate else ''}"

class ElectionCandidates(models.Model):
    id = models.BigAutoField(primary_key=True)
    election = models.ForeignKey('Elections', on_delete=models.SET_NULL, null=True, blank=True, default=1)
    candidate = models.ForeignKey('Candidates', on_delete=models.SET_NULL, null=True, blank=True, default=1)

    # results = models.IntegerField(blank=True, null=True)
    votes = models.IntegerField(blank=True, null=True)
    position = models.CharField(max_length=255, blank=True, null=True)
    is_winner = models.BooleanField(default=False)

    # Administration
    moderators = models.CharField(max_length=255, blank=True, null=True)
    status = models.IntegerField(blank=True, null=True)
    priority = models.IntegerField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=False)

    # Tracking Information
    created_by = models.ForeignKey('User', on_delete=models.SET_NULL, null=True, blank=True, related_name='created_election_candidates')
    updated_by = models.ForeignKey('User', on_delete=models.SET_NULL, null=True, blank=True, related_name='updated_election_candidates')
    deleted_by = models.ForeignKey('User', on_delete=models.SET_NULL, null=True, blank=True, related_name='deleted_election_candidates')
    created_date = models.DateTimeField(auto_now_add=True, null=False)
    updated_date = models.DateTimeField(auto_now=True, null=False)
    deleted_date = models.DateTimeField(auto_now=True, null=False)
    deleted = models.BooleanField(default=False, null=True)

    class Meta:
        db_table = "election_candidate"
        verbose_name = "Election Candidate"
        verbose_name_plural = "Election Candidates"

    def __str__(self):
        return str(self.candidate.name)

class ElectionCommittees(models.Model):
    # Basic Information
    id = models.BigAutoField(primary_key=True)
    election = models.ForeignKey('Elections', on_delete=models.SET_NULL, null=True, blank=True, related_name='election_committees')
    name = models.CharField(max_length=255, blank=False, null=False)
    gender = models.IntegerField(choices=Gender.choices, default=Gender.UNDEFINED)
    location = models.TextField(blank=True, null=True)

    # Tracking Information
    created_by = models.ForeignKey('User', on_delete=models.SET_NULL, null=True, blank=True, related_name='created_committees')
    updated_by = models.ForeignKey('User', on_delete=models.SET_NULL, null=True, blank=True, related_name='updated_committees')
    deleted_by = models.ForeignKey('User', on_delete=models.SET_NULL, null=True, blank=True, related_name='deleted_committees')
    created_date = models.DateTimeField(auto_now_add=True, null=False)
    updated_date = models.DateTimeField(auto_now=True, null=False)
    deleted_date = models.DateTimeField(auto_now=True, null=False)
    deleted = models.BooleanField(default=False)

    class Meta:
        db_table = "election_committee"
        verbose_name = "Election Committe"
        verbose_name_plural = "Election Committes"

    def __str__(self):
        return self.name

class ElectionCommitteeResults(models.Model):
    # Basic Information
    id = models.BigAutoField(primary_key=True)
    election_committee = models.ForeignKey('ElectionCommittees', on_delete=models.SET_NULL, null=True, blank=True)
    election_candidate = models.ForeignKey('ElectionCandidates', on_delete=models.SET_NULL, null=True, blank=True)
    votes = models.IntegerField(blank=True, null=True)

    # Tracking Information
    created_by = models.ForeignKey('User', on_delete=models.SET_NULL, null=True, blank=True, related_name='created_committees_results')
    updated_by = models.ForeignKey('User', on_delete=models.SET_NULL, null=True, blank=True, related_name='updated_committees_results')
    deleted_by = models.ForeignKey('User', on_delete=models.SET_NULL, null=True, blank=True, related_name='deleted_committees_results')
    created_date = models.DateTimeField(auto_now_add=True, null=False)
    updated_date = models.DateTimeField(auto_now=True, null=False)
    deleted_date = models.DateTimeField(auto_now=True, null=False)
    deleted = models.BooleanField(default=False)

    class Meta:
        db_table = "election_committee_result"
        verbose_name = "Committe Result"
        verbose_name_plural = "Committe Results"

    def __str__(self):
        return self.result
