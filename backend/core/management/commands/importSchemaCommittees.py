import pandas as pd
from django.core.management.base import BaseCommand
from django.db import connection
from apps.electionData.models import ElectionCommittee

class Command(BaseCommand):
    help = 'Imports or updates committees from an Excel file into the database based on the specified schema'

    def add_arguments(self, parser):
        parser.add_argument('--schema', type=str, help='Specify the schema name')

    def handle(self, *args, **options):
        schema_name = options.get('schema', 'public')  # Default to 'public' schema if not provided

        # Set the database schema
        with connection.cursor() as cursor:
            cursor.execute(f'SET search_path TO {schema_name}')

        # Define the file path
        file_path = 'core/management/data/national_assembly_5_2024.xlsx'
        required_data = ['id', 'serial', 'name', 'circle', 'area', 'gender', 'description', 'address', 'voter_count', 'committee_count', 'tag']

        # Read data from Excel file
        try:
            df = pd.read_excel(file_path, sheet_name='committees')
            # Select only the required columns
            df = df[required_data]

        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Failed to read Excel file: {e}"))
            return

        # Check if all required columns are present
        required_columns = required_data
        if not all(column in df.columns for column in required_columns):
            missing_columns = ", ".join(column for column in required_columns if column not in df.columns)
            self.stdout.write(self.style.ERROR(f'Missing required columns in the Excel file: {missing_columns}'))
            return

        # Initialize counters
        created_count = 0
        updated_count = 0

        # Iterate over each row in the DataFrame
        for index, row in df.iterrows():
            try:
                # Create or update Committee object
                defaults = {col: row[col] for col in required_columns if col != 'id'}
                committee_obj, created = ElectionCommittee.objects.update_or_create(
                    id=row['id'],
                    defaults=defaults
                )
                if created:
                    created_count += 1
                else:
                    updated_count += 1
            except Exception as e:
                self.stdout.write(self.style.WARNING(f"Error occurred while importing or updating committee: {e}"))

        # Print summary
        self.stdout.write(self.style.SUCCESS(f'Import completed. Summary:'))
        self.stdout.write(self.style.SUCCESS(f'Created: {created_count} committees'))
        self.stdout.write(self.style.SUCCESS(f'Updated: {updated_count} committees due to updates'))

