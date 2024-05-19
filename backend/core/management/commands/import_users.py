import pandas as pd
from django.core.management.base import BaseCommand
from django.db import connection
from apps.auths.models import User
from django.db.models import ImageField, CharField, ForeignKey, DateField
from django.utils import timezone
from datetime import datetime

from .utils import read_excel_file, check_required_columns, import_objects_from_df
# Define a naive datetime object
naive_datetime = datetime(2022, 1, 1, 12, 0, 0)

# Convert naive datetime to timezone-aware datetime
aware_datetime = timezone.make_aware(naive_datetime)

class Command(BaseCommand):
    help = "Imports or updates users from an Excel file into the database based on the specified schema"

    def handle(self, *args, **options):
        # Define the file path
        file_path = "core/management/data/settings.xlsx"
        work_sheet = "users"
        required_data = [
            "id",
            "first_name",
            "last_name",
            "username",
            "email",
            "password",
            "is_superuser",
            "is_staff",
            "is_active",
            "description",
            "twitter",
            "instagram",
            "is_deleted",
            "token",
            ## Images
            "image",
            "background",
            ## Numbers
            "civil",
            "phone",
            "gender",
            # ForeignKeys
            "created_by_id",
            "updated_by_id",
            "deleted_by_id",
            # DateTime
            "token_expiry",
            "created_at",
            "updated_at",
            "deleted_at",
            "date_of_birth",
            "date_joined",
            "last_login",
        ]

        df = read_excel_file(file_path, work_sheet, required_data, self.stdout)
        if df is None or not check_required_columns(df, required_data, self.stdout):
            return

        created_count, updated_count = import_objects_from_df(df, User, self.stdout)

        # Print summary
        self.stdout.write(self.style.SUCCESS(f"Import completed. Summary:"))
        self.stdout.write(self.style.SUCCESS(f"Created: {created_count} users"))
        self.stdout.write(self.style.SUCCESS(f"Updated: {updated_count} users due to updates"))
