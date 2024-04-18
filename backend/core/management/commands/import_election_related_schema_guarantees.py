from django.core.management.base import BaseCommand
from apps.schemas.guarantees.models import CampaignGuarantee, Elector, CampaignGuaranteeGroup
from django.db import connection
from .utils import read_excel_file, check_required_columns, import_objects_from_df
import pandas as pd

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
            for table_name in ['campaign_guarantee', 'elector', 'campaign_guarantee_group']:
                with connection.cursor() as cursor:
                    cursor.execute(
                        f"""
                        SELECT EXISTS (
                            SELECT FROM information_schema.tables 
                            WHERE table_schema = '{schema_name}' 
                            AND table_name = '{table_name}'
                        );
                    """
                    )
                    table_exists = cursor.fetchone()[0]
                    if not table_exists:
                        self.stdout.write(
                            self.style.WARNING(
                                f"Table '{table_name}' does not exist in schema '{schema_name}'\n"
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
            "CampaignGuaranteeGroup": {
                "model": CampaignGuaranteeGroup,
                "work_sheet": "guarantee_groups",  # Adjusted to match the available sheet name
                "required_data": ["id", "name"],
            },
            "Elector": {
                "model": Elector,
                "work_sheet": "electors",  # Adjusted to match the available sheet name
                "required_data": [
                    'id', 
                    'full_name', 'first_name', 'second_name', 'third_name', 'fourth_name',
                    'fifth_name', 'sixth_name', 'last_name', 'family', 'branch',  'gender',
                    'member_id', 'guarantee_group_id',
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

            created_count, updated_count, processed_objects = import_objects_from_df(df, model, self.stdout, schema_name)

            self.stdout.write(
                self.style.SUCCESS(f"{model.__name__} creation summary:")
            )
            self.stdout.write(self.style.SUCCESS(f"Created: {created_count} {model.__name__}"))
            self.stdout.write(self.style.SUCCESS(f"Updated: {updated_count} {model.__name__}"))

        # Now process CampaignGuarantee from electors worksheet
        self.stdout.write(f"Processing CampaignGuarantee from electors worksheet")
        work_sheet = "electors"
        required_data = [
            'member_id', 'id', 'phone', 'notes', 'status', 'guarantee_group_id',
        ]

        df = read_excel_file(file_path, work_sheet, required_data, self.stdout)
        self.stdout.write(f"DataFrame read successfully with columns: {df.columns.tolist() if df is not None else 'None'}")

        if df is None or not check_required_columns(df, required_data, self.stdout):
            self.stdout.write(self.style.ERROR(f"Missing required columns in DataFrame. Required: {required_data}, Found: {df.columns.tolist() if df is not None else 'None'}"))
            return

        # Filter the DataFrame to include only rows with a non-empty 'member_id' and 'guarantee_group_id' fields
        df = df.dropna(subset=['member_id', 'guarantee_group_id'])

        created_count = 0
        updated_count = 0

        # Ensure the schema is set correctly
        with connection.cursor() as cursor:
            cursor.execute(f"SET search_path TO {schema_name}")
            cursor.execute("SHOW search_path")
            search_path = cursor.fetchone()
            self.stdout.write(f"Current search path before processing CampaignGuarantee: {search_path}\n")

        # Create CampaignGuarantee objects
        for index, row in df.iterrows():
            try:
                self.stdout.write(f"Processing row: {row.to_dict()}")
                elector = Elector.objects.get(id=row['id'])
                self.stdout.write(f"Found Elector with id: {row['id']}")
                guarantee_group = CampaignGuaranteeGroup.objects.get(id=row['guarantee_group_id'])

                # Ensure phone is an 8-character string
                phone = str(int(row['phone'])) if pd.notna(row['phone']) else None
                if phone and len(phone) > 8:
                    phone = phone[:8]

                campaign_guarantee, created = CampaignGuarantee.objects.update_or_create(
                    member=row['member_id'],
                    elector=elector,
                    defaults={
                        'notes': row['notes'] if pd.notna(row['notes']) else None,
                        'status': row['status'] if pd.notna(row['status']) else None,
                        'phone': phone,
                        'guarantee_group': guarantee_group,
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
            except CampaignGuaranteeGroup.DoesNotExist:
                self.stdout.write(
                    self.style.ERROR(f"CampaignGuaranteeGroup with id {row['guarantee_group_id']} does not exist.")
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
