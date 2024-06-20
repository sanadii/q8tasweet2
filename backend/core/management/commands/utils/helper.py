import pandas as pd
from django.db import models, connection
from contextlib import contextmanager
import random
import string
from django.utils import timezone
import numpy as np
from apps.auths.models import User

def isNaN(value):
    """Check if a value is NaN."""
    return value != value or (isinstance(value, float) and np.isnan(value))


def generate_random_slug(length=6):
    """Generate a random slug of specified length."""
    chars = string.ascii_letters + string.digits
    return ''.join(random.choice(chars) for _ in range(length))


def generate_unique_integer_id(model):
    """
    Generate a unique integer ID for the model.
    """
    latest_id = model.objects.aggregate(max_id=models.Max('id'))['max_id']
    return (latest_id or 0) + 1


@contextmanager
def set_search_path(schema_name):
    if schema_name:
        try:
            with connection.cursor() as cursor:
                cursor.execute(f"SET search_path TO '{schema_name}'")
            yield
        finally:
            with connection.cursor() as cursor:
                cursor.execute("SET search_path TO public")
    else:
        yield  # No-op if schema_name is None


def read_excel_file(file_path, work_sheet, required_data, command):
    try:
        # Open the Excel file and print the sheet names for debugging
        excel_file = pd.ExcelFile(file_path)
        command.stdout.write(f"Available sheets: {excel_file.sheet_names}\n")
        
        if work_sheet not in excel_file.sheet_names:
            raise ValueError(f"Worksheet named '{work_sheet}' not found")

        df = pd.read_excel(file_path, sheet_name=work_sheet)
        df = df[required_data]  # Only select the required columns
        df = df.replace({pd.NA: None})  # Replace NaN with None
        df = df.applymap(lambda x: None if pd.isna(x) else x)  # Ensure all nan values are replaced
        return df
    except Exception as e:
        command.stdout.write(f"Failed to read Excel file: {e}\n")
        return None



def check_required_columns(df, required_data, stdout):
    if not all(column in df.columns for column in required_data):
        missing_columns = ", ".join(
            column for column in required_data if column not in df.columns
        )
        stdout.write(f"Missing required columns in the Excel file: {missing_columns}\n")
        return False
    return True

def process_row_fields(row, model, stdout, schema_name):
    # Extract the 'id' separately if it's always present
    object_id = row.get("id")

    if pd.isna(object_id) or object_id == "":
        object_id = generate_unique_integer_id(model)

    # Prepare defaults excluding 'id'
    defaults = {col: row[col] for col in row.index if col != "id"}

    for field in model._meta.fields:
        
        if isinstance(field, models.SlugField):
            field_value = defaults.get(field.name)
            if isNaN(field_value) or field_value == "":
                defaults[field.name] = generate_random_slug()  # Generate a random slug if empty

            # if field_value == "":
            #     defaults[field.name] = generate_random_slug()  # Generate a random slug if empty
            
        # Check and handle ImageField dynamically
        if isinstance(field, models.ImageField) and field.name in defaults:
            field_value = defaults.get(field.name)
            if isNaN(field_value) or field_value == "":
                defaults[field.name] = None  # Set field to None if empty

        # Check and handle CharField with max_length
        if isinstance(field, models.CharField) and field.max_length and field.name in defaults:
            field_value = defaults.get(field.name)
            if field_value and len(str(field_value)) > field.max_length:
                defaults[field.name] = str(field_value)[:field.max_length]  # Truncate the value if too long

        # Handle ForeignKey fields
        if isinstance(field, models.ForeignKey):
            field_name = field.name + "_id"  # Get the name of the corresponding foreign key ID field
            field_value = defaults.get(field_name)
            stdout.write(f"Processing ForeignKey field: {field.name}, ID: {field_value}\n")
            if field_value == "":
                stdout.write(f"Setting {field.name} to None due to empty or invalid value.\n")
                defaults[field.name] = None  # Set the ForeignKey field to None if its corresponding ID field is empty
            else:
                try:
                    # Fetch the related instance based on the provided ID
                    related_model = field.related_model
                    stdout.write(f"Trying to fetch {related_model.__name__} with ID: {field_value}\n")
                    if schema_name:
                        with set_search_path(schema_name):
                            related_instance = related_model.objects.get(id=field_value)
                    else:
                        related_instance = related_model.objects.get(id=field_value)

                    defaults[field.name] = related_instance
                except related_model.DoesNotExist:
                    # Handle the case where the related object with the provided ID doesn't exist
                    stdout.write(f"{related_model.__name__} with ID {field_value} does not exist in schema '{schema_name}'.\n")
                    defaults[field.name] = None  # Assign None if related object doesn't exist
            # Remove the corresponding ID field from defaults since it's handled
            defaults.pop(field_name, None)

        # Handle DateField fields
        if isinstance(field, models.DateField):
            field_value = defaults.get(field.name)
            if field_value == "":
                defaults[field.name] = None  # Set the DateField to None if it's empty
            else:
                try:
                    defaults[field.name] = field_value  # Extract the date part
                except ValueError:
                    # Handle the case where the value cannot be converted to a date
                    stdout.write(f"Invalid date format for field {field.name}: {field_value}\n")
                    defaults[field.name] = None  # Assign None if the value is invalid



    # Ensure non-nullable fields have values
    if 'date_joined' in [f.name for f in model._meta.get_fields()] and ('date_joined' not in defaults or defaults['date_joined'] is None):
        defaults['date_joined'] = timezone.now()

    stdout.write(f"Defaults after processing: {defaults}\n")
    return object_id, defaults



def import_objects_from_df(df, model_name, command, schema_name=None):
    created_count = 0
    updated_count = 0
    processed_candidates = []

    model_instance = model_name()
    if hasattr(model_instance, 'add_dynamic_fields'):
        dynamic_fields = model_instance.get_dynamic_fields()
    else:
        dynamic_fields = {}

    # Prepare lists for ignored fields
    model_fields = set(f.name for f in model_name._meta.get_fields())
    ignored_in_db = set(df.columns) - model_fields
    ignored_in_excel = model_fields - set(df.columns)

    command.stdout.write(f"Ignored fields not found in DB: {', '.join(ignored_in_db)}\n")
    command.stdout.write(f"Ignored fields not found in Excel: {', '.join(ignored_in_excel)}\n")

    with set_search_path(schema_name):  # Ensure we are in the correct schema
        for _, row in df.iterrows():
            try:
                defaults = {col: (None if isNaN(row[col]) else row[col]) for col in row.index if col not in ["id", "username", "email"]}

                # Check if the model is User and handle it separately
                if model_name == User:
                    user = None
                    try:
                        user = model_name.objects.get(username=row["username"])
                        command.stdout.write(f"Found existing user with username: {row['username']}\n")
                    except model_name.DoesNotExist:
                        try:
                            user = model_name.objects.get(email=row["email"])
                            command.stdout.write(f"Found existing user with email: {row['email']}\n")
                        except model_name.DoesNotExist:
                            pass

                    if user:
                        # Update existing user
                        for attr, value in defaults.items():
                            setattr(user, attr, value)
                        user.save()
                        updated_count += 1
                        command.stdout.write(f"Updated user with username: {row['username']} or email: {row['email']}\n")
                    else:
                        # Create new user
                        defaults["username"] = row["username"]
                        defaults["email"] = row["email"]
                        user, created = model_name.objects.update_or_create(id=row["id"], defaults=defaults)
                        if created:
                            created_count += 1
                        command.stdout.write(f"Created new user with username: {row['username']} or email: {row['email']}\n")

                    processed_candidates.append(user)
                    continue  # Skip the rest of the loop for User model

                object_id, defaults = process_row_fields(row, model_name, command.stdout, schema_name)
                if object_id is None or defaults is None:
                    continue  # Skip this row if there was an issue processing it

                # Check if all required ForeignKey fields are not None
                for field in model_name._meta.get_fields():
                    if isinstance(field, models.ForeignKey) and defaults.get(field.name) is None and not field.null:
                        command.stdout.write(f"Skipping row with ID {object_id} due to null {field.name} which is not allowed.\n")
                        continue  # Skip this row if any required ForeignKey field is None

                # Ensure date_joined has a default value if it's not provided
                if 'date_joined' in [f.name for f in model_name._meta.get_fields()] and 'date_joined' not in defaults:
                    defaults['date_joined'] = timezone.now()

                command.stdout.write(f"Creating/Updating object with ID: {object_id}, Defaults: {defaults}\n")
                with set_search_path(schema_name):  # Ensure schema context during update/create
                    obj, created = model_name.objects.update_or_create(id=object_id, defaults=defaults)
                if created:
                    created_count += 1
                else:
                    updated_count += 1
                processed_candidates.append(obj)  # Track processed candidates
            except model_name.DoesNotExist:
                command.stdout.write(f"{model_name} with ID {object_id} not found.\n")
            except Exception as e:
                command.stdout.write(f"Error occurred while importing or updating {model_name.__name__}: {e}\n")

    return created_count, updated_count, processed_candidates
