import pandas as pd
from django.core.management.base import BaseCommand
from django.db import connection
from django.db.utils import ProgrammingError
from apps.electionSchemas.models import Committee, CommitteeSubset
from django.core.exceptions import ObjectDoesNotExist  # Import ObjectDoesNotExist for better error handling

# For Management Commands
# Ensure that your management command sets the schema for all operations within that command session. 
# It looks like you are on the right path with setting the search_path, but make sure that this is the very first operation before any queries run.

class Command(BaseCommand):
    help = 'Imports or updates committee subsets from an Excel file into a specified schema in the database'

    def add_arguments(self, parser):
        parser.add_argument('--schema', type=str, help='Specify the schema name')

    def handle(self, *args, **options):
        schema_name = 'national_assembly_5_2024'  # Add spaces around the schema name

        # Set the database schema (outside the try-except block)
        with connection.cursor() as cursor:
            try:
                cursor.execute(f'SET search_path TO {schema_name}')
            except ProgrammingError as e:
                self.stdout.write(self.style.ERROR(f"Failed to set schema: {e}"))
                return

        # Define the file path
        file_path = 'core/management/data/national_assembly_5_2024.xlsx'

        # Read data from Excel file
        try:
            df = pd.read_excel(file_path, sheet_name='committee_subsets')
            required_data = ['id', 'area_name', 'letters', 'committee', 'type']

            # Select only the required columns
            df = df[required_data]

        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Failed to read Excel file: {e}"))
            return

        # Check if all required columns are present
        if not all(column in df.columns for column in required_data):
            missing_columns = ", ".join(column for column in required_data if column not in df.columns)
            self.stdout.write(self.style.ERROR(f'Missing required columns in the Excel file: {missing_columns}'))
            return

        # Initialize counters
        created_count = 0
        updated_count = 0

        # Iterate over each row in the DataFrame
        for index, row in df.iterrows():
            try:
                # First, retrieve the ElectionCommittee instance by committee ID
                committee_instance = Committee.objects.get(id=row['committee'])

                # Prepare the defaults dictionary, excluding 'id' and 'committee'
                defaults = {col: row[col] for col in required_data if col != 'id' and col != 'committee'}
                defaults['committee'] = committee_instance

                # Create or update the ElectionCommitteeSubset
                committee_obj, created = CommitteeSubset.objects.update_or_create(
                    id=row['id'],
                    defaults=defaults
                )
                if created:
                    created_count += 1
                else:
                    updated_count += 1
            except ObjectDoesNotExist:
                self.stdout.write(self.style.WARNING(f"Committee with ID {row['committee']} does not exist."))
            except Exception as e:
                self.stdout.write(self.style.WARNING(f"Error occurred while importing or updating committee subset: {e}"))

        # Print summary
        self.stdout.write(self.style.SUCCESS(f'Import completed. Summary:'))
        self.stdout.write(self.style.SUCCESS(f'Created: {created_count} committees'))
        self.stdout.write(self.style.SUCCESS(f'Updated: {updated_count} committees due to updates'))
