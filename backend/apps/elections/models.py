# Election Model
from django.db import models
from django.db.models.signals import post_save, post_delete
from django_extensions.db.fields import AutoSlugField, SlugField
from django.dispatch import receiver
from django.db.models import Sum

from django.utils.text import slugify
import uuid

from apps.configs.models import TrackModel, TaskModel

from helper.models_helper import ElectionTypeOptions, ElectionResultsOptions, GenderOptions
from helper.models_permission_manager import ModelsPermissionManager, CustomPermissionManager

class Election(TrackModel, TaskModel):
    # Election Essential Information
    slug = models.SlugField(unique=True, null=True, blank=True)
    due_date = models.DateField(null=True, blank=True)
    category = models.ForeignKey('ElectionCategory', on_delete=models.SET_NULL, null=True, blank=True, related_name='category_elections')
    sub_category = models.ForeignKey('ElectionCategory', on_delete=models.SET_NULL, null=True, blank=True, related_name='subcategory_elections')

    # Election Setting Options
    elect_type = models.IntegerField(choices=ElectionTypeOptions.choices, blank=True, null=True)
    elect_result = models.IntegerField(choices=ElectionResultsOptions.choices, blank=True, null=True)
    elect_votes = models.PositiveIntegerField(blank=True, null=True)
    elect_seats = models.PositiveIntegerField(blank=True, null=True)

    # Calculations // TODO: Can be calculated on campaign creation
    first_winner_votes = models.PositiveIntegerField(blank=True, null=True)
    last_winner_votes = models.PositiveIntegerField(blank=True, null=True)

    # TODO: create ElectionElector Model
    # Elector // This can go to another table TODO: Move to another table called ElectionElectors or ElectionNumbers
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
        return f"{self.sub_category.name} - {self.due_date.year if self.due_date else 'لم يحدد بعد'}"
    
    def save(self, *args, **kwargs):
        self.slug = slugify(f"{self.sub_category.slug}-{self.due_date.year if self.due_date else 'tba'}")
        super().save(*args, **kwargs)




# class ElectionProfile(TrackModel, AbstractBaseUser, PermissionsMixin):
#     election = models.OneToOneField('Election', on_delete=models.SET_NULL, null=True, blank=True, related_name="profile_elections")

#     class Meta:
#         db_table = 'election_profile'
#         verbose_name = "Election Profile"
#         verbose_name_plural = "Election Profiles"
#         default_permissions = []
#         permissions  = [
#             ("canViewElectionProfile", "Can View Election Profile"),
#             ("canAddElectionProfile", "Can Add Election Profile"),
#             ("canChangeElectionProfile", "Can Change Election Profile"),
#             ("canDeleteElectionProfile", "Can Delete Election Profile"),
#             ]

class ElectionCategory(models.Model):
    name = models.CharField(max_length=255, null=True, blank=True)
    slug = models.SlugField(unique=True, null=True)
    parent = models.ForeignKey("self", on_delete=models.CASCADE, null=True, blank=True)
    image = models.ImageField(upload_to="elections/", null=True, blank=True)
    description = models.TextField(max_length=255, null=True, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = "election_category"
        verbose_name = "Election Category"
        verbose_name_plural = "Election  Category"
        default_permissions = []

    def __str__(self):
        return self.name


class ElectionCandidate(TrackModel):
    election = models.ForeignKey('Election', on_delete=models.SET_NULL, null=True, blank=True, related_name="candidate_elections")
    candidate = models.ForeignKey('candidates.Candidate', on_delete=models.SET_NULL, null=True, blank=True, related_name="election_candidates")
    votes = models.PositiveIntegerField(default=0)
    notes = models.TextField(blank=True, null=True)

    #  Saving sum of votes from ElectionCommitteeResult for each candidate
    def update_votes(self):
        total_votes = ElectionCommitteeResult.objects.filter(election_candidate=self).aggregate(total_votes=Sum('votes'))['total_votes']
        self.votes = total_votes if total_votes is not None else 0
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

class ElectionCommitteeSorter(TrackModel, TaskModel):
    election_committee = models.ForeignKey('ElectionCommittee', on_delete=models.SET_NULL, null=True, blank=True, related_name='election_committee_sorter_committees')
    user = models.ForeignKey('auths.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='election_committee_sorter_users')



    class Meta:
        # managed = False
        db_table = "election_committee_sorter"
        verbose_name = "Election Committee Sorter"
        verbose_name_plural = "Election Committee Sorters"
        default_permissions = []
        permissions  = [
            ("canViewElectionCommitteeSorter", "Can View Election Committee Sorter"),
            ("canAddElectionCommitteeSorter", "Can Add Election Committee Sorter"),
            ("canChangeElectionCommitteeSorter", "Can Change Election Committee Sorter"),
            ("canDeleteElectionCommitteeSorter", "Can Delete Election Committee Sorter"),
            ]

    def __str__(self):
        return f"{self.election.name}"
    
    # def save(self, *args, **kwargs):
    #     self.slug = slugify(f"{self.sub_category.slug}-{self.due_date.year if self.due_date else 'tba'}")
    #     super().save(*args, **kwargs)


@receiver(post_save, sender=ElectionCommitteeResult)
def update_candidate_votes_on_save(sender, instance, **kwargs):
    if instance.election_candidate:  # <--- Handling potential None
        instance.election_candidate.update_votes()


@receiver(post_delete, sender=ElectionCommitteeResult)
def update_candidate_votes_on_delete(sender, instance, **kwargs):
    if instance.election_candidate:  # <--- Handling potential None
        instance.election_candidate.update_votes()

