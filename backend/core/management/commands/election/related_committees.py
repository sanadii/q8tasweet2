import pandas as pd
from django.utils import timezone
from datetime import datetime
from django.db import connection
from apps.schemas.areas.models import Area
from apps.schemas.committees.models import CommitteeSite, Committee
from apps.schemas.electors.models import Elector
from ..utils.helper import read_excel_file, check_required_columns, import_objects_from_df
from ..utils.logging import log_import_summary

def set_database_schema(schema_name, command):
    try:
        with connection.cursor() as cursor:
            cursor.execute(f"SET search_path TO {schema_name}")
        with connection.cursor() as cursor:
            cursor.execute("SHOW search_path")
            search_path = cursor.fetchone()
            command.stdout.write(f"Current search path: {search_path}\n")
        verify_table_exists(schema_name, command)
    except Exception as e:
        command.stdout.write(
            command.style.ERROR(f"Failed to set schema '{schema_name}': {e}\n")
        )
        schema_name = None
    return schema_name

def verify_table_exists(schema_name, command):
    with connection.cursor() as cursor:
        cursor.execute(
            f"""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = '{schema_name}' 
                AND table_name = 'committee_site'
            );
        """
        )
        table_exists = cursor.fetchone()[0]
        if not table_exists:
            command.stdout.write(
                command.style.WARNING(
                    f"Table 'committee_site' does not exist in schema '{schema_name}'\n"
                )
            )
            schema_name = None  # Fallback to default schema
        else:
            command.stdout.write(
                command.style.SUCCESS(
                    f"Table 'committee_site' exists in schema '{schema_name}'\n"
                )
            )

def process_worksheet(file_path, work_sheet, required_data, model, schema_name, command):
    # Add dynamic fields to the model
    with connection.schema_editor() as schema_editor:
        model_instance = model()
        model_instance.add_dynamic_fields(
            None, schema_editor
        )  # Add the dynamic fields

    df = read_excel_file(file_path, work_sheet, required_data, command)
    if df is None or not check_required_columns(df, required_data, command):
        return

    created_count, updated_count, _ = import_objects_from_df(
        df, model, command, schema_name
    )

    # Print summary
    log_import_summary(command, work_sheet, created_count, updated_count)

def import_election_related_committees(file_name, command):
    schema_name = file_name.replace("-", "_")

    # Set the database schema
    schema_name = set_database_schema(schema_name, command)

    # Define the file path dynamically
    file_path = f"core/management/data/{file_name}.xlsx"

    datas = {
        "Area": {
            "model": Area,
            "work_sheet": "areas",
            "required_data": ["id", "name", "governorate", "code", "tags"],
        },
        "CommitteeSite": {
            "model": CommitteeSite,
            "work_sheet": "committee_sites",
            "required_data": [
                "id",
                "name",
                "gender",
                "description",
                "address",
                "area_id",
            ],
        },
        "Committee": {
            "model": Committee,
            "work_sheet": "committees",
            "required_data": [
                "id",
                "committee_site_id",
                "type",
            ],
        },
    }

    for key, data in datas.items():
        process_worksheet(file_path, data["work_sheet"], data["required_data"], data["model"], schema_name, command)
