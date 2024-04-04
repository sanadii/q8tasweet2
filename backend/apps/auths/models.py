# auth/models.py
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import AbstractUser, Group, Permission, BaseUserManager
from django.core.validators import MaxValueValidator

from apps.configs.models import TrackModel
from utils.models_helper import GenderOptions
from utils.validators import today, civil_validator, phone_validator  

class CustomAccountManager(BaseUserManager):
    def create_superuser(self, email, username, first_name, password, **other_fields):

        other_fields.setdefault('is_staff', True)
        other_fields.setdefault('is_superuser', True)
        other_fields.setdefault('is_active', True)

        if other_fields.get('is_staff') is not True:
            raise ValueError(
                'Superuser must be assigned to is_staff=True.')
        if other_fields.get('is_superuser') is not True:
            raise ValueError(
                'Superuser must be assigned to is_superuser=True.')

        return self.create_user(email, username, first_name, password, **other_fields)

    def create_user(self, email, username, first_name, password, **other_fields):

        if not email:
            raise ValueError(_('You must provide an email address'))

        email = self.normalize_email(email)
        user = self.model(email=email, username=username, first_name=first_name, **other_fields)
        user.set_password(password)
        user.save()
        return user


class User(TrackModel, AbstractUser):
    id = models.BigAutoField(primary_key=True)
    email = models.EmailField(_('email address'), unique=True)
    username = models.CharField(max_length=150, unique=True)
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)
    image = models.ImageField(upload_to='users/', null=True, blank=True)
    background = models.ImageField(upload_to='background/', null=True, blank=True)
    
    # User Information
    civil = models.CharField(max_length=12, null=True, blank=True, validators=[civil_validator])
    gender = models.IntegerField(choices=GenderOptions.choices, null=True, blank=True)
    date_of_birth = models.DateField(null=True, blank=True, validators=[MaxValueValidator(limit_value=today)])
    description = models.TextField(_('description'), blank=True)

    # User Contact
    phone = models.CharField(max_length=8, blank=True, null=True, validators=[phone_validator])
    twitter = models.CharField(max_length=150, blank=True)  # New
    instagram = models.CharField(max_length=150, blank=True)  # New

    token = models.CharField(max_length=150, blank=True)  # New 29/03/24
    token_expiry = models.DateTimeField(blank=True, null=True)
    
    # User Permissions
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    # updated_at = models.DateTimeField(default=timezone.now)

    objects = CustomAccountManager()

    # Specify the field for groups and permissions explicitly
    groups = models.ManyToManyField(
        Group,
        verbose_name=_('groups'),
        blank=True,
        help_text=_('The groups this user belongs to.'),
        related_name="user_set",
        related_query_name="user",
    )

    user_permissions = models.ManyToManyField(
        Permission,
        verbose_name=_('user permissions'),
        blank=True,
        help_text=_('Specific permissions for this user.'),
        related_name="user_set",
        related_query_name="user",
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name']

    def __str__(self):
        return self.username
    class Meta:
        db_table = 'auth_user'
        verbose_name = "User"
        verbose_name_plural = "User"
        default_permissions = []
        permissions  = [
            ("canViewUser", "Can View User"),
            ("canAddUser", "Can Add User"),
            ("canChangeUser", "Can Change User"),
            ("canDeleteUser", "Can Delete User"),
            ]

# class UserProfile(TrackModel, AbstractBaseUser, PermissionsMixin):
#     id = models.BigAutoField(primary_key=True)
#     date_of_birth = models.DateField(null=True, blank=True, validators=[MaxValueValidator(limit_value=today)])
#     description = models.TextField(_('description'), blank=True)

#     # User Contact
#     phone = models.CharField(max_length=8, blank=True, null=True, validators=[phone_validator])
#     twitter = models.CharField(max_length=150, blank=True)  # New
#     instagram = models.CharField(max_length=150, blank=True)  # New
    
#     def __str__(self):
#         return self.user.username
#     class Meta:
#         db_table = 'auth_user_profile'
#         verbose_name = "User Profile"
#         verbose_name_plural = "User Profiles"
#         default_permissions = []
#         permissions  = [
#             ("canViewUserProfile", "Can View User Profile"),
#             ("canAddUserProfile", "Can Add User Profile"),
#             ("canChangeUserProfile", "Can Change User Profile"),
#             ("canDeleteUserProfile", "Can Delete User Profile"),
#             ]

# Group Model
class GroupCategories(models.IntegerChoices):
    CORE = 1, 'إدارة الموقع'
    ELECTION = 2, 'الانتخابات'
    CAMPAIGN = 3, 'الحملات الانتخابية'
    PARTY = 4, 'القوائم'
    SUBSCRIBER = 5, 'المشتركين'
    CONTRIBUTOR = 6, 'المساهمين'

group_category_field = models.IntegerField(choices=GroupCategories.choices, default=GroupCategories.SUBSCRIBER)
group_display_name_field = models.CharField(max_length=255, null=True, blank=True)

Group.add_to_class('category', group_category_field)
Group.add_to_class('display_name', group_display_name_field)




