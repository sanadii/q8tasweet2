from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import datetime
from apps.schemas.guarantees.models import CampaignGuarantee
from django.db import connection
from ..utils.helper import read_excel_file, check_required_columns, import_objects_from_df

# Define a naive datetime object
naive_datetime = datetime(2022, 1, 1, 12, 0, 0)

# Convert naive datetime to timezone-aware datetime
aware_datetime = timezone.make_aware(naive_datetime)

class Command(BaseCommand):
    help = "Imports or updates data from an Excel file into the database based on the specified schema"

    def add_arguments(self, parser):
        parser.add_argument(
            "election", type=str, help="Election identifier to construct the file path"
        )

    def handle(self, *args, **options):
        election = options.get("election")
        schema_name = election.replace("-", "_")

        # Try to set the database schema
        try:
            with connection.cursor() as cursor:
                cursor.execute(f"SET search_path TO {schema_name}")
            # Verify the schema context
            with connection.cursor() as cursor:
                cursor.execute("SHOW search_path")
                search_path = cursor.fetchone()
                self.stdout.write(f"Current search path: {search_path}\n")
            # Verify if the table exists in the schema
            with connection.cursor() as cursor:
                cursor.execute(
                    f"""
                    SELECT EXISTS (
                        SELECT FROM information_schema.tables 
                        WHERE table_schema = '{schema_name}' 
                        AND table_name = 'campaign_guarantee'
                    );
                """
                )
                table_exists = cursor.fetchone()[0]
                if not table_exists:
                    self.stdout.write(
                        self.style.WARNING(
                            f"Table 'campaign_guarantee' does not exist in schema '{schema_name}'\n"
                        )
                    )
                    schema_name = None  # Fallback to default schema
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f"Failed to set schema '{schema_name}': {e}\n")
            )
            schema_name = None

        # Define the file path dynamically
        file_path = f"core/management/data/{election}.xlsx"

        datas = {
            "CampaignGuarantee": {
                "model": CampaignGuarantee,
                "work_sheet": "electors",
                "required_data": [
                    "member",
                    "elector",
                    "phone",
                    "notes",
                    "status",
                ],
            },
        }

        for key, data in datas.items():
            model = data["model"]
            work_sheet = data["work_sheet"]
            required_data = data["required_data"]

            # Add dynamic fields to the model
            with connection.schema_editor() as schema_editor:
                model_instance = model()
                model_instance.add_dynamic_fields(
                    None, schema_editor
                )  # Add the dynamic fields

            df = read_excel_file(file_path, work_sheet, required_data, self.stdout)
            if df is None or not check_required_columns(df, required_data, self.stdout):
                continue

            # Print columns for debugging
            self.stdout.write(f"Columns in the DataFrame: {df.columns.tolist()}\n")

            # Check if 'elector' column exists
            missing_columns = [col for col in required_data if col not in df.columns]
            if missing_columns:
                self.stdout.write(self.style.ERROR(f"Missing columns in DataFrame: {missing_columns}\n"))
                continue

            # Filter the DataFrame to include only rows with a non-empty 'member' field
            df = df.dropna(subset=['member'])

            # If 'id' field is not present, create it using 'elector' value
            if 'id' not in df.columns:
                df['id'] = df['elector']

            created_count, updated_count, _ = import_objects_from_df(
                df, model, self.stdout, schema_name
            )

            # Print summary
            self.stdout.write(
                self.style.SUCCESS(f"Import completed for {work_sheet}. Summary:")
            )
            self.stdout.write(self.style.SUCCESS(f"Created: {created_count} {key}"))
            self.stdout.write(self.style.SUCCESS(f"Updated: {updated_count} {key}"))

            # Create CampaignGuarantee objects
            for index, row in df.iterrows():
                campaign_guarantee, created = CampaignGuarantee.objects.update_or_create(
                    member_id=row['member'],
                    elector_id=row['elector'],
                    defaults={
                        'notes': row['notes'],
                        'status': row['status'],
                        'phone': row['phone'],
                    }
                )
                if created:
                    created_count += 1
                else:
                    updated_count += 1

            self.stdout.write(
                self.style.SUCCESS(f"CampaignGuarantee creation summary:")
            )
            self.stdout.write(self.style.SUCCESS(f"Created: {created_count} CampaignGuarantee"))
            self.stdout.write(self.style.SUCCESS(f"Updated: {updated_count} CampaignGuarantee"))
