# Elections Model

from django.db import models
from django.utils import timezone
from django.core.validators import RegexValidator
from .modelsHelper import *

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
    created_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='created_elections')
    updated_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='updated_elections')
    deleted_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='deleted_elections')
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
