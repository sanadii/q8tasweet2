import pandas as pd
from django.db import connection
from apps.schemas.guarantees.models import CampaignGuaranteeGroup, CampaignGuarantee
from apps.schemas.electors.models import Elector
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
    if 'member' not in df.columns:
        df['member'] = member

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

def process_guarantees(file_path, schema_name, member, command):
    work_sheet = "electors"
    required_data = ['id', 'phone', 'notes', 'status', 'guarantee_group_id']

    df = read_excel_file(file_path, work_sheet, required_data, command)
    if df is None or not check_required_columns(df, required_data, command):
        return

    # Filter the DataFrame to include only rows with a non-empty 'guarantee_group_id' field
    df = df.dropna(subset=['guarantee_group_id'])

    created_count = 0
    updated_count = 0

    with connection.cursor() as cursor:
        cursor.execute(f"SET search_path TO {schema_name}")
        cursor.execute("SHOW search_path")
        search_path = cursor.fetchone()
        command.stdout.write(f"Current search path before processing CampaignGuarantee: {search_path}\n")

    for index, row in df.iterrows():
        try:
            elector = Elector.objects.get(id=row['id'])
            guarantee_group = CampaignGuaranteeGroup.objects.get(id=row['guarantee_group_id'])

            # Ensure phone is an 8-character string
            phone = str(int(row['phone'])) if pd.notna(row['phone']) else None
            if phone and len(phone) > 8:
                phone = phone[:8]

            campaign_guarantee, created = CampaignGuarantee.objects.update_or_create(
                member=member,
                elector=elector,
                defaults={
                    'notes': row['notes'] if pd.notna(row['notes']) else None,
                    'status': row['status'] if pd.notna(row['status']) else None,
                    'phone': phone,
                    'guarantee_group': guarantee_group,
                }
            )
            if created:
                created_count += 1
            else:
                updated_count += 1
        except Elector.DoesNotExist:
            command.stdout.write(command.style.ERROR(f"Elector with id {row['id']} does not exist."))
        except CampaignGuaranteeGroup.DoesNotExist:
            command.stdout.write(command.style.ERROR(f"CampaignGuaranteeGroup with id {row['guarantee_group_id']} does not exist."))
        except Exception as e:
            command.stdout.write(command.style.ERROR(f"An error occurred while processing row {row['id']}: {e}"))

    log_import_summary(command, "CampaignGuarantee", created_count, updated_count)

def import_election_related_guarantees(file_name, file_path, first_member, command):
    schema_name = file_name.replace("-", "_")
    command.stdout.write(f"Starting import process for election: {file_name}")

    if not set_database_schema(schema_name, command):
        return [], []

    command.stdout.write(f"Reading Excel file from: {file_path}")

    # Process CampaignGuaranteeGroup
    data_guarantee_group = {
        "model": CampaignGuaranteeGroup,
        "work_sheet": "guarantee_groups",
        "required_data": ["id", "name"],
    }
    process_worksheet(file_path, data_guarantee_group["work_sheet"], data_guarantee_group["required_data"], data_guarantee_group["model"], schema_name, first_member.id, command)

    # Process Elector and CampaignGuarantee
    data_elector = {
        "model": Elector,
        "work_sheet": "electors",
        "required_data": [
            'id',
            'full_name', 'first_name', 'second_name', 'third_name', 'fourth_name',
            'fifth_name', 'sixth_name', 'last_name', 'family', 'branch', 'gender'
        ],
    }
    process_worksheet(file_path, data_elector["work_sheet"], data_elector["required_data"], data_elector["model"], schema_name, first_member.id, command)

    # Process CampaignGuarantee
    process_guarantees(file_path, schema_name, first_member.id, command)

    campaign_guarantee_groups = CampaignGuaranteeGroup.objects.filter(member=first_member.id)
    campaign_guarantees = CampaignGuarantee.objects.filter(member=first_member.id)
    
    return list(campaign_guarantee_groups), list(campaign_guarantees)
