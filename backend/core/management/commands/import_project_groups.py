import pandas as pd
from django.core.management.base import BaseCommand
from django.db import connection
from apps.auths.models import Group
from django.db.models import ImageField, CharField, ForeignKey, DateField
from django.utils import timezone
from datetime import datetime

# Define a naive datetime object
naive_datetime = datetime(2022, 1, 1, 12, 0, 0)

# Convert naive datetime to timezone-aware datetime
aware_datetime = timezone.make_aware(naive_datetime)


class Command(BaseCommand):
    help = "Imports or updates users from an Excel file into the database based on the specified schema"

    def handle(self, *args, **options):

        # Define the file path
        file_path = "core/management/data/settings.xlsx"
        work_sheet = "groups"
        required_data = [
            "id",
            "name",
            "category",
            "codename",
        ]

        # Read data from Excel file
        try:
            df = pd.read_excel(file_path, sheet_name=work_sheet)
            df = df[required_data]

        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Failed to read Excel file: {e}"))
            return

        # Check if all required columns are present
        required_columns = required_data
        if not all(column in df.columns for column in required_columns):
            missing_columns = ", ".join(
                column for column in required_columns if column not in df.columns
            )
            self.stdout.write(
                self.style.ERROR(
                    f"Missing required columns in the Excel file: {missing_columns}"
                )
            )
            return

        # Initialize counters
        created_count = 0
        updated_count = 0

        # Iterate over each row in the DataFrame
        for index, row in df.iterrows():
            try:
                # Extract the 'id' separately if it's always present
                user_id = row["id"]
                # Prepare defaults excluding 'id'
                defaults = {col: row[col] for col in df.columns if col != "id"}

                for field in Group._meta.fields:
                    # Check and handle ImageField dynamically
                    if isinstance(field, ImageField) and field.name in defaults:
                        field_value = defaults.get(field.name)
                        if pd.isna(field_value) or field_value == "":
                            defaults[field.name] = None  # Set field to None if empty

                    # Check and handle CharField with max_length
                    if (
                        isinstance(field, CharField)
                        and field.max_length
                        and field.name in defaults
                    ):
                        field_value = defaults.get(field.name)
                        if field_value and len(str(field_value)) > field.max_length:
                            defaults[field.name] = str(field_value)[
                                : field.max_length
                            ]  # Truncate the value if too long

                    # Inside the loop where you handle ForeignKey fields
                    if isinstance(field, ForeignKey):
                        field_name = (
                            field.name + "_id"
                        )  # Get the name of the corresponding foreign key ID field
                        field_value = defaults.get(field_name)
                        if pd.isna(field_value) or field_value == "":
                            defaults[field.name] = (
                                None  # Set the ForeignKey field to None if its corresponding ID field is empty
                            )
                        else:
                            try:
                                # Fetch the Group instance based on the provided ID
                                user_instance = Group.objects.get(id=field_value)
                                defaults[field.name] = user_instance
                            except Group.DoesNotExist:
                                # Handle the case where the group with the provided ID doesn't exist
                                # You can log a warning or handle this according to your application's logic
                                self.stdout.write(
                                    self.style.WARNING(
                                        f"Group with ID {field_value} does not exist."
                                    )
                                )
                                defaults[field.name] = (
                                    None  # Assign None if group doesn't exist
                                )
                        # Remove the corresponding ID field from defaults since it's handled
                        defaults.pop(field_name, None)

                    # Inside the loop where you handle DateField fields
                    # Inside the loop where you handle DateField fields
                    if isinstance(field, DateField):
                        field_value = defaults.get(field.name)
                        if pd.isna(field_value) or field_value == "":
                            defaults[field.name] = None  # Set the DateField to None if it's empty
                        else:
                            try:
                                # Remove timezone information from the date string
                                # field_value_without_timezone = field_value.split('+')[0]
                                # # Attempt to convert the field value to a date
                                # field_date = pd.to_datetime(field_value_without_timezone)
                                defaults[field.name] = field_value  # Extract the date part
                            except ValueError:
                                # Handle the case where the value cannot be converted to a date
                                # You can log a warning or handle this according to your application's logic
                                self.stdout.write(self.style.WARNING(f"Invalid date format for field {field.name}: {field_value}"))
                                defaults[field.name] = None  # Assign None if the value is invalid

                # Create or update group object
                user_obj, created = Group.objects.update_or_create(
                    id=user_id, defaults=defaults
                )
                if created:
                    created_count += 1
                else:
                    updated_count += 1

            except Group.DoesNotExist:
                self.stdout.write(
                    self.style.ERROR(f"Group with ID {user_id} not found.")
                )
            except Exception as e:
                self.stdout.write(
                    self.style.WARNING(
                        f"Error occurred while importing or updating group: {e}"
                    )
                )

        # Print summary
        self.stdout.write(self.style.SUCCESS(f"Import completed. Summary:"))
        self.stdout.write(self.style.SUCCESS(f"Created: {created_count} users"))
        self.stdout.write(
            self.style.SUCCESS(f"Updated: {updated_count} users due to updates")
        )
