# Categories Model
from django.db import models
from django.utils import timezone
from .modelsHelper import *

class ElectionCommitteeResults(models.Model):
    # Basic Information
    id = models.BigAutoField(primary_key=True)
    election_committee = models.ForeignKey('ElectionCommittees', on_delete=models.SET_NULL, null=True, blank=True)
    election_candidate = models.ForeignKey('ElectionCandidates', on_delete=models.SET_NULL, null=True, blank=True)
    votes = models.IntegerField(blank=True, null=True)

    # Tracking Information
    created_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='created_committees_results')
    updated_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='updated_committees_results')
    deleted_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='deleted_committees_results')
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
