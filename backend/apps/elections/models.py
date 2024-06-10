# Election Model
import os
import uuid
from django.db import models
from django.db import connections
from django.db.models import Sum
from django.db.models.signals import post_save, post_delete
from django.contrib.auth import get_user_model
from django.dispatch import receiver
from django_extensions.db.fields import AutoSlugField, SlugField
from django.utils.text import slugify

from apps.settings.models import TrackModel, TaskModel
from apps.schemas.areas.models import Area

from utils.model_options import (
    ElectionMethodOptions,
    GenderOptions,
)
from utils.models_permission_manager import (
    ModelsPermissionManager,
    CustomPermissionManager,
)
from utils.schema import schema_context
# from django.contrib.postgres.fields import ArrayField
from django.db import transaction

User = get_user_model()


class Election(TrackModel, TaskModel):
    # Election Essential Information
    slug = models.SlugField(unique=True, null=True, blank=True)
    due_date = models.DateField(null=True, blank=True)
    category = models.ForeignKey(
        "ElectionCategory",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="category_elections",
    )
    sub_category = models.ForeignKey(
        "ElectionCategory",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="subcategory_elections",
    )

    election_method = models.CharField(
        max_length=50,
        choices=ElectionMethodOptions.choices,
        blank=True,
        null=True,
        verbose_name="Election Type",
    )

    # election_result = models.TextField(
    #     max_length=150,
    #     choices=ElectionResultsOptions.choices,
    #     blank=True,
    #     null=True,
    #     verbose_name="Election Result Type"
    # )
    is_detailed_results = models.BooleanField(
        default=False, verbose_name="Is result in details (with committees)"
    )
    is_sorting_results = models.BooleanField(
        default=False, verbose_name="Is Sorting Results?"
    )
    
    is_elector_address = models.BooleanField(
        default=False, verbose_name="Is elector address avaiable?"
    )
    is_elector_committee = models.BooleanField(
        default=False, verbose_name="Is elector committee avaiable?"
    )

    elect_votes = models.PositiveIntegerField(blank=True, null=True)
    elect_seats = models.PositiveIntegerField(blank=True, null=True)

    # # Calculations // TODO: Can be calculated on campaign creation
    # first_winner_votes = models.PositiveIntegerField(blank=True, null=True)
    # last_winner_votes = models.PositiveIntegerField(blank=True, null=True)

    # TODO: create ElectionSummary Model for both voters & attendees
    # Voter // This can go to another table TODO: Move to another table called ElectionVoters or ElectionNumbers
    elector_count = models.PositiveIntegerField(
        default=0
    )  # Always set a value, no nulls
    elector_male_count = models.PositiveIntegerField(
        default=0
    )  # Always set a value, no nulls
    elector_female_count = models.PositiveIntegerField(
        default=0
    )  # Always set a value, no nulls

    # Attendees
    attendee_count = models.PositiveIntegerField(
        default=0
    )  # Always set a value, no nulls
    attendee_male_count = models.PositiveIntegerField(
        default=0
    )  # Always set a value, no nulls
    attendee_female_count = models.PositiveIntegerField(
        default=0
    )  # Always set a value, no nulls

    # Database
    has_schema = models.BooleanField(
        default=False, verbose_name="Has Specific Database"
    )

    class Meta:
        # managed = False
        db_table = "election"
        verbose_name = "Election"
        verbose_name_plural = "Elections"
        default_permissions = []
        permissions = [
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
            db_path = os.path.join(
                os.path.dirname(os.path.abspath(__file__)), "databases", db_name
            )

            connection_alias = f"{self.slug}_connection"
            connections.databases[connection_alias] = {
                "ENGINE": "django.db.backends.sqlite3",
                "NAME": db_path,
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
        self.slug = slugify(
            f"{self.sub_category.slug}-{self.due_date.year if self.due_date else 'tba'}"
        )
        super().save(*args, **kwargs)

    def save(self, *args, **kwargs):
        # If the object is being created (doesn't have an ID yet), set the slug
        if not self.id and not self.slug:
            # Set the slug based on the sub_category slug and the due_date
            self.slug = slugify(
                f"{self.sub_category.slug}{self.due_date.year if self.due_date else 'Tba'}"
            )

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

