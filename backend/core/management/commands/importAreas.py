# import_areas.py

import pandas as pd
from django.core.management.base import BaseCommand
from apps.areas.models import Area

class Command(BaseCommand):
    help = 'Imports areas from an Excel file into the database'

    def handle(self, *args, **options):
        # Define the file path
        file_path = 'core/management/data/areasAll.xlsx'

        # Read data from Excel file
        df = pd.read_excel(file_path, sheet_name='Areas')

        # Initialize counters
        created_count = 0
        updated_count = 0
        ignored_count = 0

        # Iterate over each row in the DataFrame
        for index, row in df.iterrows():
            # Check for NaN values in 'governorate' column
            if pd.isna(row['governorate']):
                self.stdout.write(self.style.WARNING(f"Ignoring row {index + 2}: 'governorate' value is NaN."))
                ignored_count += 1
                continue

            # Create or update Area object
            area_obj, created = Area.objects.update_or_create(
                id=row['id'],
                defaults={
                    'name': row['name'],
                    'code': row['code'],
                    'governorate': row['governorate']
                }
            )

            if created:
                created_count += 1
            else:
                updated_count += 1

        # Print summary
        self.stdout.write(self.style.SUCCESS(f'Import completed. Summary:'))
        self.stdout.write(self.style.SUCCESS(f'Created: {created_count} areas'))
        self.stdout.write(self.style.SUCCESS(f'Updated: {updated_count} areas'))
        self.stdout.write(self.style.SUCCESS(f'Ignored: {ignored_count} rows due to missing data"'))
