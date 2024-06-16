import pandas as pd
from django.core.management.base import BaseCommand
from django.db import connection
from django.db.utils import ProgrammingError
from apps.schemas.committees.models import CommitteeSite
from apps.schemas.areas.models import Area
from django.core.exceptions import ObjectDoesNotExist

class Command(BaseCommand):
    help = 'Imports or updates committee areas from an Excel file into the database based on the specified schema'

    def add_arguments(self, parser):
        parser.add_argument('--schema', type=str, help='national_assembly_5_2024')

    def handle(self, *args, **options):
        schema_name = 'national_assembly_5_2024'  # Add spaces around the schema name
        file_path = 'core/management/data/na_5_2024_committees.xlsx'
        sheet = 'committee_sites'
        required_data = ['id', 'serial', 'name', 'circle',  'area_name', 'gender', 'description',
                         'address', 'voter_count', 'committee_count',
                         
                        # there is an issue with area and needed to add 
                        # db_column='area', in committee_site model area field 
                        'area',
                        #  there is an issue with tags
                        #  'tags'
                         ]

        
        # Set the database schema
        with connection.cursor() as cursor:
            try:
                cursor.execute(f'SET search_path TO {schema_name}')
            except ProgrammingError as e:
                self.stdout.write(self.style.ERROR(f"Failed to set schema: {e}"))
                return


        # Read data from Excel file
        try:
            df = pd.read_excel(file_path, sheet_name=sheet)
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
                # First, retrieve the ElectionCommittee instance by committee ID
                area_instance = Area.objects.get(id=row['area'])

                # Prepare the defaults dictionary, excluding 'id' and 'committee_site'
                defaults = {col: row[col] for col in required_columns if col != 'id' and col != 'area'}
                defaults['area'] = area_instance

                # Create or update the ElectionCommitte
                committee_obj, created = CommitteeSite.objects.update_or_create(
                    id=row['id'],
                    defaults=defaults
                )
                if created:
                    created_count += 1
                else:
                    updated_count += 1
            except ObjectDoesNotExist:
                self.stdout.write(self.style.WARNING(f"Committee with ID {row['area']} does not exist."))
            except Exception as e:
                self.stdout.write(self.style.WARNING(f"Error occurred while importing or updating committee areas: {e}"))


        # Print summary
        self.stdout.write(self.style.SUCCESS(f'Import completed. Summary:'))
        self.stdout.write(self.style.SUCCESS(f'Created: {created_count} committee sites'))
        self.stdout.write(self.style.SUCCESS(f'Updated: {updated_count} committee sites due to updates'))

