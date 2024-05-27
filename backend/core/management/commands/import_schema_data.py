from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import datetime
from apps.schemas.areas.models import Area
from apps.schemas.committees.models import CommitteeSite, Committee
from apps.schemas.electors.models import Elector
from django.db import connection

from .utils import read_excel_file, check_required_columns, import_objects_from_df

# Define a naive datetime object
naive_datetime = datetime(2022, 1, 1, 12, 0, 0)

# Convert naive datetime to timezone-aware datetime
aware_datetime = timezone.make_aware(naive_datetime)


class Command(BaseCommand):
    help = "Imports or updates data from an Excel file into the database based on the specified schema"

    def add_arguments(self, parser):
        parser.add_argument(
            "--schema", type=str, help="Specify the schema name", required=False
        )

    def handle(self, *args, **options):
        schema_name = options.get("schema")

        # Try to set the database schema
        if schema_name:
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
                            AND table_name = 'committee_site'
                        );
                    """
                    )
                    table_exists = cursor.fetchone()[0]
                    if not table_exists:
                        self.stdout.write(
                            self.style.WARNING(
                                f"Table 'committee_site' does not exist in schema '{schema_name}'\n"
                            )
                        )
                        schema_name = None  # Fallback to default schema
                    else:
                        self.stdout.write(
                            self.style.SUCCESS(
                                f"Table 'committee_site' exists in schema '{schema_name}'\n"
                            )
                        )
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f"Failed to set schema '{schema_name}': {e}\n")
                )
                schema_name = None

        # Define the file path
        file_path = "core/management/data/na_5_2024.xlsx"

        datas = {
            # "Area": {
            #     "model": Area,
            #     "work_sheet": "area",
            #     "required_data": ["id", "name", "governorate", "code", "tags"],
            # },
            # "CommitteeSite": {
            #     "model": CommitteeSite,
            #     "work_sheet": "committee_site",
            #     "required_data": [
            #         "id",
            #         "serial",
            #         "name",
            #         "circle",
            #         "area_name",
            #         "gender",
            #         "description",
            #         "address",
            #         "voter_count",
            #         "committee_count",
            #         "area_id",
            #     ],
            # },
            # "Committee": {
            #     "model": Committee,
            #     "work_sheet": "committee",
            #     "required_data": [
            #         "id",
            #         "area_name",
            #         "letters",
            #         "committee_site_id",
            #         "type",
            #     ],
            # },
          
            "Elector": {
                "model": Elector,
                "work_sheet": "elector",
                "required_data": [
                    "id",
                    "full_name",
                    "first_name",
                    "second_name",
                    "third_name",
                    "fourth_name",
                    "fifth_name",
                    "sixth_name",
                    "seventh_name",
                    "eighth_name",
                    "ninth_name",
                    "tenth_name",
                    "eleventh_name",
                    "twelveth_name",
                    "last_name",
                    "family",
                    "branch",
                    "sect",
                    "gender",
                    "age",
                    "circle",
                    "job",
                    "block",
                    "street",
                    "lane",
                    "house",
                    "committee_area",
                    "committee_name",
                    "letter",
                    "code_number",
                    "status_code",
                    
                    # #
                    # ForiegnKey
                    "area_id",
                    "committee_id",
                ],
            },
       
        }

        for key, data in datas.items():
            model = data["model"]
            work_sheet = data["work_sheet"]
            required_data = data["required_data"]

            df = read_excel_file(file_path, work_sheet, required_data, self.stdout)
            if df is None or not check_required_columns(df, required_data, self.stdout):
                continue

            created_count, updated_count = import_objects_from_df(
                df, model, self.stdout, schema_name
            )

            # Print summary
            self.stdout.write(
                self.style.SUCCESS(f"Import completed for {work_sheet}. Summary:")
            )
            self.stdout.write(self.style.SUCCESS(f"Created: {created_count} {key}"))
            self.stdout.write(self.style.SUCCESS(f"Updated: {updated_count} {key}"))
