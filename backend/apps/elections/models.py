# Election Model
import os
from django.db import models
from django.db import connections
from django.db.models.signals import post_save, post_delete
from django_extensions.db.fields import AutoSlugField, SlugField
from django.dispatch import receiver
from django.db.models import Sum
from django.contrib.auth import get_user_model

from django.utils.text import slugify
import uuid

from apps.settings.models import TrackModel, TaskModel

from utils.models_helper import ElectionTypeOptions, ElectionResultsOptions, GenderOptions
from utils.models_permission_manager import ModelsPermissionManager, CustomPermissionManager
from django.db import models
from apps.areas.models import Area
# from django.contrib.postgres.fields import ArrayField

User = get_user_model()

class Election(TrackModel, TaskModel):
    # Election Essential Information
    slug = models.SlugField(unique=True, null=True, blank=True)
    due_date = models.DateField(null=True, blank=True)
    category = models.ForeignKey('ElectionCategory', on_delete=models.SET_NULL, null=True, blank=True, related_name='category_elections')
    sub_category = models.ForeignKey('ElectionCategory', on_delete=models.SET_NULL, null=True, blank=True, related_name='subcategory_elections')

    election_method = models.CharField(
        max_length=50,
        choices=ElectionTypeOptions.choices,
        blank=True,
        null=True,
        verbose_name="Election Type"
    )
    
    election_result = models.TextField(
        max_length=150,
        # choices=ElectionResultsOptions.choices,
        blank=True,
        null=True,
        verbose_name="Election Result Type"
    )


    elect_votes = models.PositiveIntegerField(blank=True, null=True)
    elect_seats = models.PositiveIntegerField(blank=True, null=True)

    # Calculations // TODO: Can be calculated on campaign creation
    first_winner_votes = models.PositiveIntegerField(blank=True, null=True)
    last_winner_votes = models.PositiveIntegerField(blank=True, null=True)

    # TODO: create ElectionSummary Model for both voters & attendees
    # Voter // This can go to another table TODO: Move to another table called ElectionVoters or ElectionNumbers
    voters = models.PositiveIntegerField(blank=True, null=True)
    voters_males = models.PositiveIntegerField(blank=True, null=True)
    voters_females = models.PositiveIntegerField(blank=True, null=True)

    # Attendees
    attendees = models.PositiveIntegerField(blank=True, null=True)
    attendees_males = models.PositiveIntegerField(blank=True, null=True)
    attendees_females = models.PositiveIntegerField(blank=True, null=True)
    
    # Database
    has_database = models.BooleanField(default=False, verbose_name="Has Specific Database")

    class Meta:
        # managed = False
        db_table = "election"
        verbose_name = "Election"
        verbose_name_plural = "Elections"
        default_permissions = []
        permissions  = [
            ("canViewElection", "Can View Election"),
            ("canAddElection", "Can Add Election"),
            ("canChangeElection", "Can Change Election"),
            ("canDeleteElection", "Can Delete Election"),
            ]

    def __str__(self):
        return f"{self.sub_category.name} - {self.due_date.year if self.due_date else 'لم يحدد بعد'}"
    
    def connect_to_database(self):
        if self.has_data_base:
            # Assume the database name is the same as the slug of the election
            db_name = f"{self.slug}.sqlite3"
            db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'databases', db_name)

            connection_alias = f"{self.slug}_connection"
            connections.databases[connection_alias] = {
                'ENGINE': 'django.db.backends.sqlite3',
                'NAME': db_path,
            }
            return connection_alias
        return None

    def get_extra_info_from_database(self):
        if self.has_data_base:
            connection_alias = self.connect_to_database()
            if connection_alias:
                with connections[connection_alias].cursor() as cursor:
                    # Example query to retrieve extra information
                    cursor.execute("SELECT * FROM extra_info_table;")
                    extra_info = cursor.fetchall()
                    return extra_info
        return None

    def create(self, *args, **kwargs):
        self.slug = slugify(f"{self.sub_category.slug}-{self.due_date.year if self.due_date else 'tba'}")
        super().save(*args, **kwargs)

    def save(self, *args, **kwargs):
        # If the object is being created (doesn't have an ID yet), set the slug
        if not self.id and not self.slug:
            # Set the slug based on the sub_category slug and the due_date
            self.slug = slugify(f"{self.sub_category.slug}{self.due_date.year if self.due_date else 'Tba'}")
        
        super(Election, self).save(*args, **kwargs)  # Call the "real" save() method



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
    position = models.IntegerField(null=True, blank=True)
    result = models.CharField(max_length=25, null=True, blank=True)
    votes = models.PositiveIntegerField(default=0, null=True, blank=True)
    notes = models.TextField(blank=True, null=True)

    #  Saving sum of votes from ElectionCommitteeResult for each candidate
    def update_votes(self):
        total_votes = ElectionCommitteeResult.objects.filter(election_candidate=self).aggregate(total_votes=Sum('votes'))['total_votes']
        self.votes = total_votes if total_votes is not None else 0
        self.save()

    class Meta:
        db_table = "election_candidate"
        verbose_name = "Election Candidate"
        verbose_name_plural = "Election Candidates"
        default_permissions = []
        permissions  = [
            ("canViewElectionCandidate", "Can View Election Candidate"),
            ("canAddElectionCandidate", "Can Add Election Candidate"),
            ("canChangeElectionCandidate", "Can Change Election Candidate"),
            ("canDeleteElectionCandidate", "Can Delete Election Candidate"),
            ]

    def __str__(self):
        return str(self.candidate.name)

class ElectionParty(TrackModel):
    election = models.ForeignKey('Election', on_delete=models.SET_NULL, null=True, blank=True, related_name="party_elections")
    party = models.ForeignKey('candidates.Party', on_delete=models.SET_NULL, null=True, blank=True, related_name="election_parties")
    votes = models.PositiveIntegerField(default=0)
    notes = models.TextField(blank=True, null=True)

    #  Saving sum of votes from ElectionCommitteeResult for each party
    def update_votes(self):
        total_votes = ElectionCommitteeResult.objects.filter(election_party=self).aggregate(total_votes=Sum('votes'))['total_votes']
        self.votes = total_votes if total_votes is not None else 0
        self.save()

    class Meta:
        db_table = "election_party"
        verbose_name = "Election Party"
        verbose_name_plural = "Election Parties"
        default_permissions = []
        permissions  = []

    def __str__(self):
        return f"{self.party.name} in {self.election.title}"

class ElectionPartyCandidate(TrackModel):
    election_party = models.ForeignKey('ElectionParty', on_delete=models.SET_NULL, null=True, blank=True, related_name="party_candidate_elections")
    candidate = models.ForeignKey('candidates.Candidate', on_delete=models.SET_NULL, null=True, blank=True, related_name="election_party_candidates")
    votes = models.PositiveIntegerField(default=0)
    notes = models.TextField(blank=True, null=True)

    #  Saving sum of votes from ElectionCommitteeResult for each candidate
    def update_votes(self):
        total_votes = ElectionCommitteeResult.objects.filter(election_party_candidate=self).aggregate(total_votes=Sum('votes'))['total_votes']
        self.votes = total_votes if total_votes is not None else 0
        self.save()

    class Meta:
        db_table = "election_party_candidate"
        verbose_name = "Election Party Candidate"
        verbose_name_plural = "Election Parties Candidates"
        default_permissions = []
        permissions  = []

    def __str__(self):
        return f"{self.candidate.name} for {self.election_party.party.name} in {self.election_party.election.title}"


# class ElectionCommittee(TrackModel):
#     # Basic Information
#     election = models.ForeignKey('Election', on_delete=models.SET_NULL, null=True, blank=True, related_name='committee_elections')
#     name = models.CharField(max_length=255, blank=False, null=False)
#     gender = models.IntegerField(choices=GenderOptions.choices, null=True, blank=True)
#     location = models.TextField(blank=True, null=True)
#     sorter = models.OneToOneField(
#         User,
#         on_delete=models.SET_NULL,
#         null=True,
#         blank=True,
#         related_name='election_committee_sorter'  # Singular related name
#     )

#     class Meta:
#         db_table = "election_committee"
#         verbose_name = "Election Committe"
#         verbose_name_plural = "Election Committes"
#         default_permissions = []
#         permissions  = [
#             ("canViewElectionCommitte", "Can View Election Committe"),
#             ("canAddElectionCommitte", "Can Add Election Committe"),
#             ("canChangeElectionCommitte", "Can Change Election Committe"),
#             ("canDeleteElectionCommitte", "Can Delete Election Committe"),
#             ]
#     def __str__(self):
#         return self.name



class ElectionCommitteeGroup(TrackModel):
    id = models.AutoField(primary_key=True)
    election = models.ForeignKey('Election', on_delete=models.SET_NULL, null=True, blank=True, related_name='committee_group_elections')
    name = models.CharField(max_length=255)
    committee_no = models.IntegerField()
    circle = models.IntegerField()
    # Change area to a ForeignKey relation to the Area model
    area = models.ForeignKey(Area, on_delete=models.SET_NULL, null=True, blank=True, related_name='committee_areas')
    gender = models.IntegerField(choices=GenderOptions.choices, null=True, blank=True)
    description = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    voter_count = models.IntegerField()
    committee_count = models.IntegerField()
    total_voters = models.IntegerField()
    tags = models.CharField(max_length=255, blank=True)

    class Meta:
        db_table = "committee_group"
        verbose_name = "Committee Group"
        verbose_name_plural = "Committee Groups"
        default_permissions = []

    def __str__(self):
        return self.name

class ElectionCommittee(TrackModel):
    id = models.AutoField(primary_key=True)
    serial = models.IntegerField()
    letters = models.CharField(max_length=255)
    type = models.CharField(max_length=255)
    areas = models.CharField(max_length=255)
    committee_group = models.ForeignKey(ElectionCommitteeGroup, on_delete=models.SET_NULL, null=True, blank=True, related_name='committees')

    class Meta:
        db_table = "committee"
        verbose_name = "Committee Group"
        verbose_name_plural = "Committee Groups"
        default_permissions = []

    def __str__(self):
        return f"{self.areas} - {self.serial} - {self.letters}"

class BaseElectionSorting(models.Model):
    user = models.ForeignKey(
        'auths.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='%(class)s_users',
    )
    election_committee = models.ForeignKey(
        'elections.ElectionCommittee',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='%(class)s_election_committees',
    )
    votes = models.PositiveIntegerField(default=0)
    notes = models.TextField(blank=True, null=True)

    class Meta:
        abstract = True  # Prevents direct model creation
        permissions = [
            ("canViewElectionSorting", "Can View Election Sorting"),
            ("canAddElectionSorting", "Can Add Election Sorting"),
            ("canChangeElectionSorting", "Can Change Election Sorting"),
            ("canDeleteElectionSorting", "Can Delete Election Sorting"),
        ]

class ElectionSorting(BaseElectionSorting):
    election_candidate = models.ForeignKey('elections.ElectionCandidate', on_delete=models.SET_NULL, null=True, blank=True, related_name='election_candidate_sortings')

    class Meta(BaseElectionSorting.Meta):
        db_table = 'election_sorting'
        verbose_name = "Election Sorting"
        verbose_name_plural = "Election Sortings"

class ElectionPartySorting(BaseElectionSorting):
    election_party = models.ForeignKey('elections.ElectionParty', on_delete=models.SET_NULL, null=True, blank=True, related_name='election_party_sortings')

    class Meta(BaseElectionSorting.Meta):
        db_table = 'election_party_sorting'
        verbose_name = "Election Party Sorting"
        verbose_name_plural = "Election Party Sortings"

class ElectionPartyCandidateSorting(BaseElectionSorting):
    election_party_candidate = models.ForeignKey('elections.ElectionPartyCandidate', on_delete=models.SET_NULL, null=True, blank=True, related_name='election_party_candidate_sortings')

    class Meta(BaseElectionSorting.Meta):
        db_table = 'election_party_candidate_sorting'
        verbose_name = "Election Party Candidate Sorting"
        verbose_name_plural = "Election Party Candidate  Sortings"



class BaseElectionCommitteeResult(models.Model):
    election_committee = models.ForeignKey(
        ElectionCommittee,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='%(class)s_election_committees',
    )
    votes = models.PositiveIntegerField(default=0)
    notes = models.TextField(blank=True, null=True)

    class Meta:
        abstract = True  # Prevents direct model creation
        permissions = [
            ("canViewElectionCommitteeResult", "Can View Election Committee Result"),
            ("canAddElectionCommitteeResult", "Can Add Election Committee Result"),
            ("canChangeElectionCommitteeResult", "Can Change Election Committee Result"),
            ("canDeleteElectionCommitteeResult", "Can Delete Election Committee Result"),
        ]

class ElectionCommitteeResult(BaseElectionCommitteeResult, TrackModel):
    election_candidate = models.ForeignKey(
        'ElectionCandidate',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='committee_result_candidates'
        )

    class Meta:
        db_table = 'election_committee_result'
        verbose_name = "Election Committee Result"
        verbose_name_plural = "Election Committee Results"

class ElectionPartyCommitteeResult(BaseElectionCommitteeResult, TrackModel):
    election_party = models.ForeignKey(
        ElectionParty,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='party_committee_result_candidates'
    )

    class Meta:
        db_table = 'election_party_committee_result'
        verbose_name = "Election Party Committee Result"
        verbose_name_plural = "Election Party Committee Results"

class ElectionPartyCandidateCommitteeResult(BaseElectionCommitteeResult, TrackModel):
    election_party_candidate = models.ForeignKey(
        ElectionPartyCandidate,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='party_candidate_committee_result_candidates'
    )

    class Meta:
        db_table = 'election_party_candidate_committee_result'
        verbose_name = "Election Party Candidate Committee Result"
        verbose_name_plural = "Election Party Candidate Committee Results"

# class ElectionCommitteeSorter(TrackModel, TaskModel):
#     election_committee = models.ForeignKey('ElectionCommittee', on_delete=models.SET_NULL, null=True, blank=True, related_name='election_committee_sorter_committees')
#     user = models.ForeignKey('auths.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='election_committee_sorter_users')



#     class Meta:
#         # managed = False
#         db_table = "election_committee_sorter"
#         verbose_name = "Election Committee Sorter"
#         verbose_name_plural = "Election Committee Sorters"
#         default_permissions = []
#         permissions  = [
#             ("canViewElectionCommitteeSorter", "Can View Election Committee Sorter"),
#             ("canAddElectionCommitteeSorter", "Can Add Election Committee Sorter"),
#             ("canChangeElectionCommitteeSorter", "Can Change Election Committee Sorter"),
#             ("canDeleteElectionCommitteeSorter", "Can Delete Election Committee Sorter"),
#             ]

#     def __str__(self):
#         return f"{self.election.name}"
    
#     # def save(self, *args, **kwargs):
#     #     self.slug = slugify(f"{self.sub_category.slug}-{self.due_date.year if self.due_date else 'tba'}")
#     #     super().save(*args, **kwargs)


@receiver(post_save, sender=ElectionCommitteeResult)
def update_candidate_votes_on_save(sender, instance, **kwargs):
    if instance.election_candidate:  # <--- Handling potential None
        instance.election_candidate.update_votes()


@receiver(post_delete, sender=ElectionCommitteeResult)
def update_candidate_votes_on_delete(sender, instance, **kwargs):
    if instance.election_candidate:  # <--- Handling potential None
        instance.election_candidate.update_votes()

