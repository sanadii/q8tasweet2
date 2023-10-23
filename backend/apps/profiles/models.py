# users/models.py
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.core.validators import RegexValidator, MaxValueValidator

from helper.models_helper import TrackModel, GenderOptions
from helper.validators import today, civil_validator, phone_validator  

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
        verbose_name = "User Profile"
        verbose_name_plural = "User Profiles"
        default_permissions = []
        permissions  = [
            ("canViewUserProfile", "Can View User Profile"),
            ("canAddUserProfile", "Can Add User Profile"),
            ("canChangeUserProfile", "Can Change User Profile"),
            ("canDeleteUserProfile", "Can Delete User Profile"),
            ]


class ElectionProfile(TrackModel, AbstractBaseUser, PermissionsMixin):
    election = models.OneToOneField('Election', on_delete=models.SET_NULL, null=True, blank=True, related_name="profile_elections")

    class Meta:
        db_table = 'election_profile'
        verbose_name = "Election Profile"
        verbose_name_plural = "Election Profiles"
        default_permissions = []
        permissions  = [
            ("canViewElectionProfile", "Can View Election Profile"),
            ("canAddElectionProfile", "Can Add Election Profile"),
            ("canChangeElectionProfile", "Can Change Election Profile"),
            ("canDeleteElectionProfile", "Can Delete Election Profile"),
            ]
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
        verbose_name = "Candidate Profile"
        verbose_name_plural = "Candidate Profiles"
        default_permissions = []
        permissions  = [
            ("canViewCandidateProfile", "Can View Candidate Profile"),
            ("canAddCandidateProfile", "Can Add Candidate Profile"),
            ("canChangeCandidateProfile", "Can Change Candidate Profile"),
            ("canDeleteCandidateProfile", "Can Delete Candidate Profile"),
            ]

