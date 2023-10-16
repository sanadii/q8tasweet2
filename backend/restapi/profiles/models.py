# restapi/users/models.py
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.core.validators import RegexValidator, MaxValueValidator

from restapi.helper.models_helper import TrackModel, GenderOptions, GroupCategories, group_category_field, group_role_field
from restapi.helper.validators import today, civil_validator, phone_validator  

class UserProfile(TrackModel, AbstractBaseUser, PermissionsMixin):
    id = models.BigAutoField(primary_key=True)
    date_of_birth = models.DateField(null=True, blank=True, validators=[MaxValueValidator(limit_value=today)])
    description = models.TextField(_('description'), blank=True)

    # User Contact
    phone = models.CharField(max_length=8, blank=True, null=True, validators=[phone_validator])
    twitter = models.CharField(max_length=150, blank=True)  # New
    instagram = models.CharField(max_length=150, blank=True)  # New
    


    def __str__(self):
        return self.user.username
    class Meta:
        db_table = 'auth_user_profile'


class ElectionProfile(TrackModel, AbstractBaseUser, PermissionsMixin):
    election = models.OneToOneField('Election', on_delete=models.SET_NULL, null=True, blank=True, related_name="profile_elections")

    class Meta:
        db_table = 'election_profile'
        
class CandidateProfile(TrackModel, AbstractBaseUser, PermissionsMixin):
    candidate = models.OneToOneField('Candidate', on_delete=models.SET_NULL, null=True, blank=True, related_name="profile_candidates")

    description = models.CharField(max_length=255, blank=True, null=True)
    date_of_birth = models.DateField(null=True, blank=True, validators=[MaxValueValidator(limit_value=today)])

    # Contacts
    phone = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    twitter = models.CharField(max_length=255, blank=True, null=True)
    instagram = models.CharField(max_length=255, blank=True, null=True)

    # Education & Career
    education = models.CharField(max_length=255, blank=True, null=True)
    position = models.CharField(max_length=255, blank=True, null=True)
    party = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        db_table = 'candidate_profile'

