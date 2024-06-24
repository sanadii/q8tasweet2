import pandas as pd
from django.core.management.base import BaseCommand
from django.db import connection
from apps.schemas.electors.models import Elector
from apps.schemas.areas.models import Area
from apps.schemas.committees.models import Committee
from django.core.exceptions import ObjectDoesNotExist
from django.db.utils import ProgrammingError

class Command(BaseCommand):
    help = "Imports or updates Electors from an Excel file into the specified schema in the database"

    def add_arguments(self, parser):
        parser.add_argument('--schema', type=str, help='Specify the schema name')

    def handle(self, *args, **options):
        schema_name = 'national_assembly_5_2024'  # Add spaces around the schema name
        file_path = 'core/management/data/na_5_2024_committees.xlsx'
        sheet_tab = "eles"

        # Set the database schema
        with connection.cursor() as cursor:
            cursor.execute(f"SET search_path TO \"{schema_name}\"")  # Ensure schema name is quoted

        # Read data from Excel file
        try:
            df = pd.read_excel(file_path, sheet_name=sheet_tab)
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Failed to read Excel file: {e}"))
            return  # Exit command if file reading fails

        required_columns = [
            'id', 'full_name', 'first_name', 'second_name', 'third_name', 'fourth_name',
            'fifth_name', 'sixth_name', 'last_name', 'family', 'branch', 'sect', 'gender',
            'job', 'area', 'block', 'street', 'lane', 'house',
            'committee', 'committee_area', 'committee_name', 
            'letter', 'code_number',
            
            'member_id', 'guarantee_group_id',
            
            # to remove later
            # 'area_name' 
        ]
        if not set(required_columns).issubset(df.columns):
            missing_columns = set(required_columns) - set(df.columns)
            self.stdout.write(self.style.ERROR(f"Missing required columns: {', '.join(missing_columns)}"))
            return  # Exit command if required columns are missing

        created_count = 0
        updated_count = 0

        for index, row in df.iterrows():
            area_id = row.get('area')
            committee_id = row.get('committee')

            try:
                area_instance = Area.objects.get(id=area_id)
            except Area.DoesNotExist:
                self.stdout.write(self.style.WARNING(f"Area with ID {area_id} does not exist. Skipping elector."))
                continue
                        
            try:
                committee_instance = Committee.objects.get(id=committee_id)
            except Committee.DoesNotExist:
                self.stdout.write(self.style.WARNING(f"Committee with ID {committee_id} does not exist. Skipping elector."))
                continue

            defaults = {col: row[col] for col in required_columns if col != 'id' and col != 'committee' and col != 'area'}
            defaults['committee'] = committee_instance
            defaults['area'] = area_instance

            elector_obj, created = Elector.objects.update_or_create(
                id=row['id'], defaults=defaults
            )
            if created:
                created_count += 1
            else:
                updated_count += 1

        self.stdout.write(self.style.SUCCESS(f'Import completed. Summary:'))
        self.stdout.write(self.style.SUCCESS(f'Created: {created_count} electors'))
        self.stdout.write(self.style.SUCCESS(f'Updated: {updated_count} electors due to updates'))
