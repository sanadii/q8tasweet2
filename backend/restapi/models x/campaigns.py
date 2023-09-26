# Categories Model
from django.db import models
from django.utils import timezone
from django.core.validators import RegexValidator
from .modelsHelper import *

class Campaigns(models.Model):
    # Basic Information
    id = models.BigAutoField(primary_key=True)
    election_candidate = models.ForeignKey('ElectionCandidates', on_delete=models.SET_NULL, null=True, blank=True)
    title = models.CharField(max_length=255, blank=False, null=False)
    description = models.TextField(blank=True, null=True)

    # logo = models.ImageField(upload_to="campaigns/", blank=True, null=True)
    banner = models.ImageField(upload_to="campaigns/", blank=True, null=True)
    # video = models.FileField(upload_to='campaign/videos/', blank=True, null=True)

    # Contacts
    twitter = models.CharField(max_length=120, blank=True, null=True)
    instagram = models.CharField(max_length=120, blank=True, null=True)
    website = models.URLField(max_length=120, blank=True, null=True)

    # Activities
    target_score = models.PositiveIntegerField(blank=True, null=True)
    results = models.IntegerField(blank=True, null=True)
    events = models.PositiveIntegerField(blank=True, null=True)
    media_coverage = models.PositiveIntegerField(blank=True, null=True)


    # Administration
    moderators = models.CharField(max_length=255, blank=True, null=True)
    status = models.IntegerField(blank=True, null=True)
    priority = models.IntegerField(blank=True, null=True)

    # Tracking Information
    created_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='created_campaigns')
    updated_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='updated_campaigns')
    deleted_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='deleted_campaigns')
    created_date = models.DateTimeField(auto_now_add=True, null=False)
    updated_date = models.DateTimeField(auto_now=True, null=False)
    deleted_date = models.DateTimeField(auto_now=True, null=False)
    deleted = models.BooleanField(default=False, null=True)

    class Meta:
        db_table = "campaign"
        verbose_name = "Campaign"
        verbose_name_plural = "Campaigns"

    def __str__(self):
        return f"{self.election_candidate.candidate.name} - {self.title}"  # Assuming the candidate's name is accessible through the relation
