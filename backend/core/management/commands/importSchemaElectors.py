import pandas as pd
from django.core.management.base import BaseCommand
from django.db import connection
from apps.electors.models import Elector


class Command(BaseCommand):
    help = "Imports or updates Electors from an Excel file into the database based on the specified schema"

    def add_arguments(self, parser):
        parser.add_argument("--schema", type=str, help="national_assembly_5_2024")

    def handle(self, *args, **options):
        schema_name = "national_assembly_5_2024"  # Add spaces around the schema name

        # Set the database schema
        with connection.cursor() as cursor:
            cursor.execute(f"SET search_path TO {schema_name}")

        # Define the file path
        file_path = "core/management/data/na_5_2024_electors.xlsx"
        required_data = [
            'id', 'full_name',
            'first_name', 'second_name', 'third_name', 'fourth_name',
            'fifth_name', 'sixth_name', 'seventh_name', 'eighth_name',
            'ninth_name', 'tenth_name', 'eleventh_name', 'twelveth_name',
            'last_name', 'tribe', 'family', 'sect',
            'gender', 'circle', 'job',
            # 'birth_date', 
            'address', 'area', 'block', 'street','lane', 'house',
            'committee', 'committee_area', 'committee_name', 'letter',
            'code_number',
            # Previous Votes
            # 'vote_22', 'vote_23', 'vote_24'
            ]


        # Read data from Excel file
        try:
            df = pd.read_excel(file_path, sheet_name="Electors")
            df = df[required_data]

        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Failed to read Excel file: {e}"))
            return

        # Check if all required columns are present
        required_columns = required_data
        if not all(column in df.columns for column in required_columns):
            missing_columns = ", ".join(
                column for column in required_columns if column not in df.columns
            )
            self.stdout.write(
                self.style.ERROR(
                    f"Missing required columns in the Excel file: {missing_columns}"
                )
            )
            return

        # Initialize counters
        created_count = 0
        updated_count = 0

        # Iterate over each row in the DataFrame
        for index, row in df.iterrows():
            try:
                # Create or update Elector object
                defaults = {col: row[col] for col in required_columns if col != "id"}
                elector_obj, created = Elector.objects.update_or_create(
                    id=row["id"], defaults=defaults
                )
                if created:
                    created_count += 1
                else:
                    updated_count += 1
            except Exception as e:
                self.stdout.write(
                    self.style.WARNING(
                        f"Error occurred while importing or updating elector: {e}"
                    )
                )

        # Print summary
        self.stdout.write(self.style.SUCCESS(f"Import completed. Summary:"))
        self.stdout.write(self.style.SUCCESS(f"Created: {created_count} electors"))
        self.stdout.write(
            self.style.SUCCESS(f"Updated: {updated_count} electors due to updates")
        )
