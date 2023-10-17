# Category Model
from django.db import models
from restapi.helper.models_helper import TrackModel, TaskModel, GenderOptions
from restapi.helper.validators import today

class Candidate(TrackModel, TaskModel):
    # Basic Information
    name = models.CharField(max_length=255, blank=False, null=False)
    gender = models.IntegerField(choices=GenderOptions.choices, null=True, blank=True)
    image = models.ImageField(upload_to="candidates/", blank=True, null=True)
    tags = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        db_table = "candidate"
        verbose_name = "Candidate"
        verbose_name_plural = "Candidates"
        default_permissions = []
        permissions  = [
            ("canViewCandidate", "Can View Candidate"),
            ("canAddCandidate", "Can Add Candidate"),
            ("canChangeCandidate", "Can Change Candidate"),
            ("canDeleteCandidate", "Can Delete Candidate"),
            ]
        
    def __str__(self):
        return self.name
    