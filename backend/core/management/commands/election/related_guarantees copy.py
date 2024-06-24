import pandas as pd
from django.db import connection
from apps.schemas.guarantees.models import CampaignGuaranteeGroup
from ..utils.helper import read_excel_file, check_required_columns, import_objects_from_df
from ..utils.logging import log_import_summary, log_reading_file, log_imported_fields, log_error
from ..utils.schema import set_database_schema

def process_worksheet(file_path, work_sheet, required_data, model, schema_name, member, command):
    # Add dynamic fields to the model
    with connection.schema_editor() as schema_editor:
        model_instance = model()
        model_instance.add_dynamic_fields(None, schema_editor)

    df = read_excel_file(file_path, work_sheet, required_data, command)
    command.stdout.write(f"DataFrame read successfully with columns: {df.columns.tolist() if df is not None else 'None'}")

    if df is None or not check_required_columns(df, required_data, command):
        command.stdout.write(command.style.ERROR(f"Missing required columns in DataFrame. Required: {required_data}, Found: {df.columns.tolist() if df is not None else 'None'}"))
        return

    # Add member to DataFrame
    df['member'] = member.id

    # Print columns for debugging
    command.stdout.write(f"Columns in the DataFrame after adding member: {df.columns.tolist()}\n")

    # Check if required columns exist
    missing_columns = [col for col in required_data if col not in df.columns]
    if missing_columns:
        command.stdout.write(command.style.ERROR(f"Missing columns in DataFrame: {missing_columns}\n"))
        return

    created_count, updated_count, processed_objects = import_objects_from_df(df, model, command, schema_name)
    command.stdout.write(command.style.SUCCESS(f"{model.__name__} creation summary:"))
    command.stdout.write(command.style.SUCCESS(f"Created: {created_count} {model.__name__}"))
    command.stdout.write(command.style.SUCCESS(f"Updated: {updated_count} {model.__name__}"))

def import_election_related_guarantees(file_name, file_path, first_member, command):
    schema_name = file_name.replace("-", "_")
    command.stdout.write(f"Starting import process for election: {file_name}")

    if not set_database_schema(schema_name, command):
        return []

    command.stdout.write(f"Reading Excel file from: {file_path}")

    data = {
        "model": CampaignGuaranteeGroup,
        "work_sheet": "guarantee_groups",
        "required_data": ["id", "name"],
    }

    process_worksheet(file_path, data["work_sheet"], data["required_data"], data["model"], schema_name, first_member, command)

    campaign_guarantee_groups = CampaignGuaranteeGroup.objects.filter(member=first_member.id)

    return list(campaign_guarantee_groups)
