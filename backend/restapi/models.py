from django.db import models
from django.utils import timezone
from django.core.validators import RegexValidator
from .model_helpers import *

# MODELS with line numbers
# Line 18 -  # class ProjectInfo
# Line 25 -  # class Categories
# Line 50 -  # class Elections
# Line 90 -  # class Candidates
# Line 131 - # class ElectionCandidates
# Line 160 - # class ElectionCommittees
# Line 179 - # class Campaigns
# Line 217 - # class CampaignMembers
# Line 242 - # class Electors
# Line 286 - # class CampaignGuarantees
# Line 307 - # class ElectionAttendees
# Line 331 - # class Areas
# Line 354 - # class Tags
# Line 376 - # class Committees
# Line 383 - # class Sorting

def get_default_created_date():
    return timezone.now().isoformat()


# Project Information
class ProjectInfo(models.Model):
    id = models.BigAutoField(primary_key=True)
    data = models.JSONField()

    def __str__(self):
        return str(self.id)

class Categories(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255, null=True, blank=True)
    parent = models.ForeignKey("self", on_delete=models.CASCADE, null=True, blank=True)
    image = models.ImageField(upload_to="categories/", null=True, blank=True)
    slug = models.SlugField(unique=True, null=True, blank=True)
    description = models.TextField(max_length=255, null=True, blank=True)
    is_active = models.BooleanField(default=True)

    # Tracking Information
    created_by = models.ForeignKey('users.User', on_delete=models.SET_DEFAULT, default=1, related_name='created_categories')
    updated_by = models.ForeignKey('users.User', on_delete=models.SET_DEFAULT, default=1, related_name='updated_categories')
    deleted_by = models.ForeignKey('users.User', on_delete=models.SET_DEFAULT, default=1, related_name='deleted_categories')
    created_date = models.DateTimeField(auto_now_add=True, null=False)
    updated_date = models.DateTimeField(auto_now=True, null=False)
    deleted_date = models.DateTimeField(auto_now=True, null=False)
    deleted = models.BooleanField(default=False, null=True)

    class Meta:
        db_table = "category"
        verbose_name = "Category"
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name


# Database
class Elections(models.Model):
    # Basic Information
    id = models.BigAutoField(primary_key=True)
    image = models.ImageField(upload_to="elections/", blank=True, null=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    duedate = models.DateField(null=True, blank=True)
    description = models.TextField(max_length=255, null=True, blank=True)

    # Taxonomies (Categories and Tags)
    category = models.ForeignKey(Categories, on_delete=models.SET_NULL, null=True, blank=True, related_name='elections_category')
    sub_category = models.ForeignKey(Categories, on_delete=models.SET_NULL, null=True, blank=True, related_name='elections_sub_category')
    tags = models.CharField(max_length=255, blank=True, null=True)
    
    # Election Options and Details
    type = models.CharField(max_length=255, blank=True, null=True)
    result = models.CharField(max_length=255, blank=True, null=True)
    votes = models.IntegerField(blank=True, null=True)
    seats = models.IntegerField(blank=True, null=True)
    electors = models.CharField(max_length=255, blank=True, null=True)
    attendees = models.CharField(max_length=255, blank=True, null=True)
    # committees = models.CharField(max_length=255, blank=True, null=True)

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
        return self.name


class Candidates(models.Model):
    # Basic Information
    id = models.BigAutoField(primary_key=True)
    image = models.ImageField(upload_to="users/", blank=True, null=True)
    name = models.CharField(max_length=255, blank=False, null=False)
    gender = models.IntegerField(choices=Gender.choices, default=Gender.UNDEFINED)

    description = models.CharField(max_length=255, blank=True, null=True)
    birthdate = models.DateField(blank=True, null=True)

    # Contacts
    phone = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    twitter = models.CharField(max_length=255, blank=True, null=True)
    instagram = models.CharField(max_length=255, blank=True, null=True)

    # Education & Career
    education = models.CharField(max_length=255, blank=True, null=True)
    position = models.CharField(max_length=255, blank=True, null=True)
    party = models.CharField(max_length=100, blank=True, null=True)

    # Taxonomies (Categories and Tags)
    tags = models.CharField(max_length=255, blank=True, null=True)

    # Administration
    moderators = models.CharField(max_length=255, blank=True, null=True)
    status = models.IntegerField(blank=True, null=True)
    priority = models.IntegerField(blank=True, null=True)

    # Tracking Information
    created_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='created_candidates')
    updated_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='updated_candidates')
    deleted_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='deleted_candidates')
    created_date = models.DateTimeField(auto_now_add=True, null=False)
    updated_date = models.DateTimeField(auto_now=True, null=False)
    deleted_date = models.DateTimeField(auto_now=True, null=False)
    deleted = models.BooleanField(default=False, null=True)

    class Meta:
        db_table = "candidate"
        verbose_name = "Candidate"
        verbose_name_plural = "Candidates"

    def __str__(self):
        return self.name
    
class ElectionCandidates(models.Model):
    id = models.BigAutoField(primary_key=True)
    election = models.ForeignKey(Elections, on_delete=models.SET_NULL, null=True, blank=True, default=1)
    candidate = models.ForeignKey(Candidates, on_delete=models.SET_NULL, null=True, blank=True, default=1)

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
    created_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='created_election_candidates')
    updated_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='updated_election_candidates')
    deleted_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='deleted_election_candidates')
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

class ElectionCommitteeResults(models.Model):
    # Basic Information
    id = models.BigAutoField(primary_key=True)
    election_committee = models.ForeignKey(ElectionCommittees, on_delete=models.SET_NULL, null=True, blank=True)
    election_candidate = models.ForeignKey(ElectionCandidates, on_delete=models.SET_NULL, null=True, blank=True)
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

class Campaigns(models.Model):
    # Basic Information
    id = models.BigAutoField(primary_key=True)
    election_candidate = models.ForeignKey(ElectionCandidates, on_delete=models.SET_NULL, null=True, blank=True)
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
    events = models.PositiveIntegerField(blank=True, null=True)
    attendees = models.PositiveIntegerField(blank=True, null=True)
    media_coverage = models.PositiveIntegerField(blank=True, null=True)
    results = models.IntegerField(blank=True, null=True)


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


civil_validator = RegexValidator(regex=r'^\d{12}$', message="Civil must be exactly 12 digits.")
mobile_validator = RegexValidator(regex=r'^\d{8}$', message="Mobile must be exactly 8 digits.")

class CampaignMembers(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='campaign_members')
    campaign = models.ForeignKey('Campaigns', on_delete=models.SET_NULL, null=True, blank=True, related_name='campaign_members')
    rank = models.IntegerField(choices=Rank.choices, blank=True, null=True)
    supervisor = models.ForeignKey('CampaignMembers', on_delete=models.SET_NULL, null=True, blank=True, related_name='supervised_members')
    committee = models.ForeignKey('ElectionCommittees', on_delete=models.SET_NULL, null=True, blank=True, related_name='members')
    civil = models.CharField(max_length=12, blank=True, null=True, validators=[civil_validator])
    mobile = models.CharField(max_length=8, blank=True, null=True, validators=[mobile_validator])
    notes = models.TextField(blank=True, null=True)
    status = models.IntegerField(blank=True, null=True)

    # Tracking Information
    created_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='created_campaign_members')
    updated_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='updated_campaign_members')
    deleted_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='deleted_campaign_members')
    created_date = models.DateTimeField(auto_now_add=True, null=False)
    updated_date = models.DateTimeField(auto_now=True, null=False)
    deleted_date = models.DateTimeField(auto_now=True, null=False)
    deleted = models.BooleanField(default=False, null=True)
   
    class Meta:
        # managed = False
        db_table = 'campaign_member'
        verbose_name = "Campaign Member"
        verbose_name_plural = "Campaign Members"

class Electors(models.Model):
    civil = models.BigAutoField(primary_key=True)
    
    # Name fields
    full_name = models.CharField(max_length=255, blank=True, null=True)
    family_name = models.CharField(max_length=255, blank=True, null=True)

    # name_1 = models.CharField(max_length=255, blank=True, null=True)
    # name_2 = models.CharField(max_length=255, blank=True, null=True)
    # name_3 = models.CharField(max_length=255, blank=True, null=True)
    # name_4 = models.CharField(max_length=255, blank=True, null=True)
    # name_5 = models.CharField(max_length=255, blank=True, null=True)
    # name_6 = models.CharField(max_length=255, blank=True, null=True)
    # name_7 = models.CharField(max_length=255, blank=True, null=True)
    # name_8 = models.CharField(max_length=255, blank=True, null=True)
    # name_9 = models.CharField(max_length=255, blank=True, null=True)
    # name_10 = models.CharField(max_length=255, blank=True, null=True)
    
    # # Last name fields
    # last_1 = models.CharField(max_length=255, blank=True, null=True)
    # last_2 = models.CharField(max_length=255, blank=True, null=True)
    # last_3 = models.CharField(max_length=255, blank=True, null=True)
    # last_4 = models.CharField(max_length=255, blank=True, null=True)
    # last_name = models.CharField(max_length=255, blank=True, null=True)
    
    gender = models.IntegerField(choices=Gender.choices, default=Gender.UNDEFINED)
    serial_number = models.CharField(max_length=255, blank=True, null=True)
    membership_no = models.CharField(max_length=255, blank=True, null=True)
    box_no = models.CharField(max_length=255, blank=True, null=True)
    enrollment_date = models.DateField(blank=True, null=True)
    relationship = models.CharField(max_length=255, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)

    # def full_name(self):
    #     names = [self.name_1, self.name_2, self.name_3, self.name_4, self.last_name,] # Include all name fields
    #     # Filter out None values and join to form the full name
    #     return ' '.join([name for name in names if name is not None])

    # def all_names(self):
    #     names = [self.name_1, self.name_2, self.name_3, self.name_4, self.name_5, self.name_6, self.name_7, self.name_8, self.name_9, self.name_10, self.last_1, self.last_2, self.last_3, self.last_4, self.last_name,] # Include all name fields
    #     # Filter out None values and join to form the full name
    #     return ' '.join([name for name in names if name is not None])


    class Meta:
        # managed = False
        db_table = 'electors'
        verbose_name = "Elector"
        verbose_name_plural = "Electors"



class CampaignGuarantees(models.Model):
    id = models.BigAutoField(primary_key=True)
    campaign = models.ForeignKey('Campaigns', on_delete=models.SET_NULL, null=True, blank=True, related_name='guarantee_campaigns')
    member = models.ForeignKey('CampaignMembers', on_delete=models.SET_NULL, null=True, blank=True, related_name='guarantee_members')
    civil = models.ForeignKey('Electors', on_delete=models.SET_NULL, null=True, blank=True, related_name='campaign_guarantees')
    mobile = models.CharField(max_length=8, blank=True, null=True)  # or any other field type suitable for your requirements
    notes = models.TextField(blank=True, null=True)
    status = models.IntegerField(choices=GuaranteeStatus.choices, default=GuaranteeStatus.NEW)

    # Tracking Information
    created_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='created_guarantee_members')
    updated_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='updated_guarantee_members')
    deleted_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='deleted_guarantee_members')
    created_date = models.DateTimeField(auto_now_add=True, null=False)
    updated_date = models.DateTimeField(auto_now=True, null=False)
    deleted_date = models.DateTimeField(auto_now=True, null=False)
    deleted = models.BooleanField(default=False, null=True)

    class Meta:
        # managed = False
        db_table = 'campaign_guarantee'
        verbose_name = "Campaign Guarantee"
        verbose_name_plural = "Campaign Guarantees"

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

# Categories

class Areas(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255, null=True, blank=True)
    parent = models.ForeignKey("self", on_delete=models.CASCADE, null=True, blank=True)
    image = models.ImageField(upload_to="categories/", null=True, blank=True)
    slug = models.SlugField(unique=True, null=True, blank=True)
    description = models.TextField(max_length=255, null=True, blank=True)
    is_active = models.BooleanField(default=True)

    # Tracking Information
    created_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='created_areas')
    updated_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='updated_areas')
    deleted_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='deleted_areas')
    created_date = models.DateTimeField(auto_now_add=True, null=False)
    updated_date = models.DateTimeField(auto_now=True, null=False)
    deleted_date = models.DateTimeField(auto_now=True, null=False)
    deleted = models.BooleanField(default=False, null=True)

    class Meta:
        db_table = "area"
        verbose_name = "Area"
        verbose_name_plural = "Areas"

    def __str__(self):
        return self.name
    
# Categories
class Tags(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255, null=True, blank=True)
    slug = models.SlugField(unique=True, null=True, blank=True)

    # Tracking Information
    created_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='created_tags')
    updated_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='updated_tags')
    deleted_by = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='deleted_tags')
    created_date = models.DateTimeField(auto_now_add=True, null=False)
    updated_date = models.DateTimeField(auto_now=True, null=False)
    deleted_date = models.DateTimeField(auto_now=True, null=False)
    deleted = models.BooleanField(default=False, null=True)

    class Meta:
        db_table = "Tags"
        verbose_name = "Tag"
        verbose_name_plural = "Tags"

    def __str__(self):
        return self.name


# voting_system:, voter_turnout, result, winning_candidate, campaign_budget, voting_committees, registration_deadline, special_instructions:

# def elections(instance, filename):
#     return 'elections/{filename}'.format(filename=filename)

# class Sorting(models.Model):
#     id = models.BigAutoField(primary_key=True)
#     name = models.CharField(max_length=255, blank=True, null=True)
#     deleted = models.IntegerField(blank=True, null=True)
#     created_by = models.IntegerField(blank=True, null=True)
#     created_date = models.DateTimeField(blank=True, null=True)
#     updated_by = models.IntegerField(blank=True, null=True)
#     updated_date = models.DateTimeField(blank=True, null=True)

#     class Meta:
#         # managed = False
#         db_table = 'sorting'
