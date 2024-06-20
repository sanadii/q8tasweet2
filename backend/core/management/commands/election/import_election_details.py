import pandas as pd
from apps.elections.models import Election
from ..utils.helper import read_excel_file, check_required_columns, import_objects_from_df
from ..utils.logging import log_reading_file, log_imported_fields, log_import_summary

def import_election_details(election, file_path, command):
    
    work_sheet = "election"

    # Log beginning of functions
    log_reading_file(command, election, file_path, work_sheet)

    required_data = [
        "category_id", "sub_category_id", "due_date", "slug", 
        "election_method", "is_detailed_results", "is_sorting_results",
        "elect_votes", "elect_seats",
        "attendee_count", "attendee_male_count", "attendee_female_count",
        "elector_count", "elector_female_count", "elector_male_count", 
        "status", "priority"
    ]

    df = read_excel_file(file_path, work_sheet, required_data, command)
    if df is None or not check_required_columns(df, required_data, command):
        command.stdout.write(command.style.ERROR(
            f"Missing required columns in DataFrame. Required: {required_data}, Found: {df.columns.tolist() if df is not None else 'None'}"
        ))
        return

    log_imported_fields(command, df)

    missing_columns = get_missing_columns(df, required_data)
    if missing_columns:
        command.stdout.write(command.style.ERROR(f"Missing columns in DataFrame: {missing_columns}\n"))
        return

    # Handle the creation or update of the election object
    row = df.iloc[0]
    election_obj, created = Election.objects.get_or_create(slug=row["slug"], defaults={
        "category_id": row["category_id"],
        "sub_category_id": row["sub_category_id"],
        "due_date": row["due_date"],
        "election_method": row["election_method"],
        "is_detailed_results": row["is_detailed_results"],
        "is_sorting_results": row["is_sorting_results"],
        "elect_votes": row["elect_votes"],
        "elect_seats": row["elect_seats"],
        "attendee_count": row["attendee_count"],
        "attendee_male_count": row["attendee_male_count"],
        "attendee_female_count": row["attendee_female_count"],
        "elector_count": row["elector_count"],
        "elector_female_count": row["elector_female_count"],
        "elector_male_count": row["elector_male_count"],
        "status": row["status"],
        "priority": row["priority"]
    })

    if not created:
        # Update the existing election object
        for field in required_data:
            setattr(election_obj, field, row[field])
        election_obj.save()
        command.stdout.write(command.style.SUCCESS(f"Updated existing election: {election_obj}"))
    else:
        command.stdout.write(command.style.SUCCESS(f"Created new election: {election_obj}"))

    log_import_summary(command, work_sheet, int(created), int(not created))

    return election_obj


def get_missing_columns(df, required_data):
    return [col for col in required_data if col not in df.columns]
