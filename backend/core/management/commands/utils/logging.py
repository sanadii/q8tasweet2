# utils/logging.py

def log_reading_file(command, election, file_path, work_sheet):
    command.stdout.write(f"Starting import process for {work_sheet} in election: {election}")
    command.stdout.write(f"Reading Excel file from: {file_path}")

def log_imported_fields(command, df):
    command.stdout.write(f"DataFrame read successfully with columns: {df.columns.tolist()}")
    command.stdout.write(f"Columns in the DataFrame: {df.columns.tolist()}\n")

def log_import_summary(command, work_sheet, created_count, updated_count):
    command.stdout.write(command.style.SUCCESS(f"Import completed for {work_sheet}. Summary:"))
    command.stdout.write(command.style.SUCCESS(f"Created: {created_count} {work_sheet}"))
    command.stdout.write(command.style.SUCCESS(f"Updated: {updated_count} {work_sheet}"))

def log_error(command, message):
    command.stdout.write(command.style.ERROR(message))
