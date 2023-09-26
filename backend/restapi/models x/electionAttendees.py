# ElectionAttendees Model
from django.db import models
from django.utils import timezone
from django.core.validators import RegexValidator
from .modelsHelper import *

class ElectionAttendees(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='attendee_users')
    election = models.ForeignKey('Elections', on_delete=models.SET_NULL, null=True, blank=True, related_name='attendee_elections')
    committee = models.ForeignKey('ElectionCommittees', on_delete=models.SET_NULL, null=True, blank=True, related_name='attendee_election_committees')
    elector = models.ForeignKey('Electors', on_delete=models.SET_NULL, null=True, blank=True, related_name='electionAttendees')
    notes = models.TextField(blank=True, null=True)
    status = models.IntegerField(blank=True, null=True)

    # Tracking Information
    created_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='created_guarantee_users')
    updated_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='updated_guarantee_users')
    deleted_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='deleted_guarantee_users')
    created_date = models.DateTimeField(auto_now_add=True, null=False)
    updated_date = models.DateTimeField(auto_now=True, null=False)
    deleted_date = models.DateTimeField(auto_now=True, null=False)
    deleted = models.BooleanField(default=False, null=True)

    class Meta:
        # managed = False
        db_table = 'election_attendee'
        verbose_name = "Election Attendee"
        verbose_name_plural = "Election Attendees"
