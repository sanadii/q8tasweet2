# Categories Model
from django.db import models
from django.utils import timezone
from django.core.validators import RegexValidator
from .modelsHelper import *

class ElectionCommittees(models.Model):
    # Basic Information
    id = models.BigAutoField(primary_key=True)
    election = models.ForeignKey('Elections', on_delete=models.SET_NULL, null=True, blank=True, related_name='election_committees')
    name = models.CharField(max_length=255, blank=False, null=False)
    gender = models.IntegerField(choices=Gender.choices, default=Gender.UNDEFINED)
    location = models.TextField(blank=True, null=True)

    # Tracking Information
    created_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='created_committees')
    updated_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='updated_committees')
    deleted_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='deleted_committees')
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
