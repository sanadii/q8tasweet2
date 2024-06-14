from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import datetime
from apps.schemas.guarantees.models import CampaignGuarantee, Elector
from django.db import connection
from .utils import read_excel_file, check_required_columns
import pandas as pd

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

        self.stdout.write(f"Starting import process for election: {election}")

        # Try to set the database schema
        try:
            with connection.cursor() as cursor:
                self.stdout.write(f"Setting search path to schema: {schema_name}")
                cursor.execute(f"SET search_path TO {schema_name}")
            # Verify the schema context
            with connection.cursor() as cursor:
                cursor.execute("SHOW search_path")
                search_path = cursor.fetchone()
                self.stdout.write(f"Current search path: {search_path}\n")
            # Verify if the tables exist in the schema
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
                    return
                cursor.execute(
                    f"""
                    SELECT EXISTS (
                        SELECT FROM information_schema.tables 
                        WHERE table_schema = '{schema_name}' 
                        AND table_name = 'elector'
                    );
                """
                )
                elector_table_exists = cursor.fetchone()[0]
                if not elector_table_exists:
                    self.stdout.write(
                        self.style.WARNING(
                            f"Table 'elector' does not exist in schema '{schema_name}'\n"
                        )
                    )
                    return
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f"Failed to set schema '{schema_name}': {e}\n")
            )
            return

        # Define the file path dynamically
        file_path = f"core/management/data/{election}.xlsx"
        self.stdout.write(f"Reading Excel file from: {file_path}")

        datas = {
            "CampaignGuarantee": {
                "model": CampaignGuarantee,
                "work_sheet": "electors",
                "required_data": [
                    "member",
                    "id",  # This is the elector_id field in the database
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

            self.stdout.write(f"Processing worksheet: {work_sheet}")

            # Add dynamic fields to the model
            with connection.schema_editor() as schema_editor:
                model_instance = model()
                model_instance.add_dynamic_fields(
                    None, schema_editor
                )  # Add the dynamic fields

            df = read_excel_file(file_path, work_sheet, required_data, self.stdout)
            self.stdout.write(f"DataFrame read successfully with columns: {df.columns.tolist() if df is not None else 'None'}")

            if df is None or not check_required_columns(df, required_data, self.stdout):
                self.stdout.write(self.style.ERROR(f"Missing required columns in DataFrame. Required: {required_data}, Found: {df.columns.tolist() if df is not None else 'None'}"))
                continue

            # Print columns for debugging
            self.stdout.write(f"Columns in the DataFrame: {df.columns.tolist()}\n")

            # Check if required columns exist
            missing_columns = [col for col in required_data if col not in df.columns]
            if missing_columns:
                self.stdout.write(self.style.ERROR(f"Missing columns in DataFrame: {missing_columns}\n"))
                continue

            # Filter the DataFrame to include only rows with a non-empty 'member' field
            df = df.dropna(subset=['member'])

            created_count = 0
            updated_count = 0

            # Create CampaignGuarantee objects
            for index, row in df.iterrows():
                try:
                    self.stdout.write(f"Processing row: {row.to_dict()}")
                    # Ensure the Elector table exists in the current schema
                    with connection.cursor() as cursor:
                        cursor.execute(f"SET search_path TO {schema_name}")
                        cursor.execute("SELECT * FROM elector WHERE id = %s", [row['id']])
                        elector_data = cursor.fetchone()
                        self.stdout.write(f"Elector data found: {elector_data}")
                        if elector_data is None:
                            raise Elector.DoesNotExist(f"Elector with id {row['id']} does not exist.")

                    elector = Elector.objects.get(id=row['id'])
                    self.stdout.write(f"Found Elector with id: {row['id']}")
                    campaign_guarantee, created = CampaignGuarantee.objects.update_or_create(
                        member=row['member'],
                        elector=elector,  # Use 'elector' instance
                        defaults={
                            'notes': row['notes'] if pd.notna(row['notes']) else None,
                            'status': row['status'] if pd.notna(row['status']) else None,
                            'phone': row['phone'] if pd.notna(row['phone']) else None,
                        }
                    )
                    self.stdout.write(f"Created: {created}, CampaignGuarantee: {campaign_guarantee}")
                    if created:
                        created_count += 1
                    else:
                        updated_count += 1
                except Elector.DoesNotExist:
                    self.stdout.write(
                        self.style.ERROR(f"Elector with id {row['id']} does not exist.")
                    )
                except Exception as e:
                    self.stdout.write(
                        self.style.ERROR(f"An error occurred while processing row {row['id']}: {e}")
                    )

            self.stdout.write(
                self.style.SUCCESS(f"CampaignGuarantee creation summary:")
            )
            self.stdout.write(self.style.SUCCESS(f"Created: {created_count} CampaignGuarantee"))
            self.stdout.write(self.style.SUCCESS(f"Updated: {updated_count} CampaignGuarantee"))

        self.stdout.write(f"Finished import process for election: {election}")
