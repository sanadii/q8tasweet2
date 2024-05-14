
from django.db.models import ImageField, CharField, ForeignKey, DateField
import pandas as pd
from django.core.management.base import BaseCommand
from django.db import connection
from apps.auths.models import User
from django.utils import timezone
from datetime import datetime

def import_objects_from_df(df, model_name, stdout):
    created_count = 0
    updated_count = 0

    for _, row in df.iterrows():
        try:
            object_id, defaults = process_row_fields(row, model_name, stdout)
            obj, created = model_name.objects.update_or_create(id=object_id, defaults=defaults)
            if created:
                created_count += 1
            else:
                updated_count += 1
        except model_name.DoesNotExist:
            stdout.write(stdout.style.ERROR(f"{model_name} with ID {object_id} not found."))
        except Exception as e:
            stdout.write(stdout.style.WARNING(f"Error occurred while importing or updating user: {e}"))

    return created_count, updated_count

def read_excel_file(file_path, work_sheet, required_data, stdout):
    try:
        df = pd.read_excel(file_path, sheet_name=work_sheet)
        df = df[required_data]
        return df
    except Exception as e:
        stdout.write(stdout.style.ERROR(f"Failed to read Excel file: {e}"))
        return None

def check_required_columns(df, required_data, stdout):
    if not all(column in df.columns for column in required_data):
        missing_columns = ", ".join(
            column for column in required_data if column not in df.columns
        )
        stdout.write(stdout.style.ERROR(f"Missing required columns in the Excel file: {missing_columns}"))
        return False
    return True

def process_row_fields(row, model_name, stdout):
    # Extract the 'id' separately if it's always present
    user_id = row["id"]
    # Prepare defaults excluding 'id'
    defaults = {col: row[col] for col in row.index if col != "id"}

    for field in model_name._meta.fields:
        # Check and handle ImageField dynamically
        if isinstance(field, ImageField) and field.name in defaults:
            field_value = defaults.get(field.name)
            if pd.isna(field_value) or field_value == "":
                defaults[field.name] = None  # Set field to None if empty

        # Check and handle CharField with max_length
        if isinstance(field, CharField) and field.max_length and field.name in defaults:
            field_value = defaults.get(field.name)
            if field_value and len(str(field_value)) > field.max_length:
                defaults[field.name] = str(field_value)[:field.max_length]  # Truncate the value if too long

        # Handle ForeignKey fields
        if isinstance(field, ForeignKey):
            field_name = field.name + "_id"  # Get the name of the corresponding foreign key ID field
            field_value = defaults.get(field_name)
            if pd.isna(field_value) or field_value == "":
                defaults[field.name] = None  # Set the ForeignKey field to None if its corresponding ID field is empty
            else:
                try:
                    # Fetch the model_name instance based on the provided ID
                    user_instance = model_name.objects.get(id=field_value)
                    defaults[field.name] = user_instance
                except model_name.DoesNotExist:
                    # Handle the case where the user with the provided ID doesn't exist
                    stdout.write(stdout.style.WARNING(f"{model_name} with ID {field_value} does not exist."))
                    defaults[field.name] = None  # Assign None if user doesn't exist
            # Remove the corresponding ID field from defaults since it's handled
            defaults.pop(field_name, None)

        # Handle DateField fields
        if isinstance(field, DateField):
            field_value = defaults.get(field.name)
            if pd.isna(field_value) or field_value == "":
                defaults[field.name] = None  # Set the DateField to None if it's empty
            else:
                try:
                    defaults[field.name] = field_value  # Extract the date part
                except ValueError:
                    # Handle the case where the value cannot be converted to a date
                    stdout.write(stdout.style.WARNING(f"Invalid date format for field {field.name}: {field_value}"))
                    defaults[field.name] = None  # Assign None if the value is invalid

    return user_id, defaults
