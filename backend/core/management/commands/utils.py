import pandas as pd
from django.db import models, connection
from contextlib import contextmanager
import random
import string

def generate_random_slug(length=6):
    """Generate a random slug of specified length."""
    chars = string.ascii_letters + string.digits
    return ''.join(random.choice(chars) for _ in range(length))


@contextmanager
def set_search_path(schema_name):
    if schema_name:
        try:
            with connection.cursor() as cursor:
                cursor.execute(f"SET search_path TO {schema_name}")
            yield
        finally:
            with connection.cursor() as cursor:
                cursor.execute("SET search_path TO public")
    else:
        yield  # No-op if schema_name is None

def read_excel_file(file_path, work_sheet, required_data, stdout):
    try:
        # Open the Excel file and print the sheet names for debugging
        excel_file = pd.ExcelFile(file_path)
        stdout.write(f"Available sheets: {excel_file.sheet_names}\n")
        
        if work_sheet not in excel_file.sheet_names:
            raise ValueError(f"Worksheet named '{work_sheet}' not found")

        df = pd.read_excel(file_path, sheet_name=work_sheet)
        df = df[required_data]
        return df
    except Exception as e:
        stdout.write(f"Failed to read Excel file: {e}\n")
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
    object_id = row["id"]
    # Prepare defaults excluding 'id'
    defaults = {col: row[col] for col in row.index if col != "id"}

    for field in model._meta.fields:
        # Check and handle ImageField dynamically
        if isinstance(field, models.ImageField) and field.name in defaults:
            field_value = defaults.get(field.name)
            if pd.isna(field_value) or field_value == "":
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
            if pd.isna(field_value) or field_value == "":
                defaults[field.name] = None  # Set the ForeignKey field to None if its corresponding ID field is empty
            else:
                try:
                    # Fetch the related instance based on the provided ID
                    related_model = field.related_model
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
            if pd.isna(field_value) or field_value == "":
                defaults[field.name] = None  # Set the DateField to None if it's empty
            else:
                try:
                    defaults[field.name] = field_value  # Extract the date part
                except ValueError:
                    # Handle the case where the value cannot be converted to a date
                    stdout.write(f"Invalid date format for field {field.name}: {field_value}\n")
                    defaults[field.name] = None  # Assign None if the value is invalid

        if isinstance(field, models.SlugField):
            field_value = defaults.get(field.name)
            if pd.isna(field_value) or field_value == "":
                defaults[field.name] = generate_random_slug()  # Generate a random slug if empty

    return object_id, defaults

def import_objects_from_df(df, model_name, stdout, schema_name=None):
    created_count = 0
    updated_count = 0

    with set_search_path(schema_name):  # Ensure we are in the correct schema
        for _, row in df.iterrows():
            try:
                object_id, defaults = process_row_fields(row, model_name, stdout, schema_name)
                with set_search_path(schema_name):  # Ensure schema context during update/create
                    obj, created = model_name.objects.update_or_create(id=object_id, defaults=defaults)
                if created:
                    created_count += 1
                else:
                    updated_count += 1
            except model_name.DoesNotExist:
                stdout.write(f"{model_name} with ID {object_id} not found.\n")
            except Exception as e:
                stdout.write(f"Error occurred while importing or updating {model_name.__name__}: {e}\n")

    return created_count, updated_count
