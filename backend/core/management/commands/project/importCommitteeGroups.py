# import_committees.py

import pandas as pd
from django.core.management.base import BaseCommand
from apps.schemas.areas.models import Area
from apps.elections.models import Election, ElectionCommitteeGroup

class Command(BaseCommand):
    help = 'Imports committees from an Excel file into the database'

    def handle(self, *args, **options):
        # Define the file path
        file_path = 'core/management/data/areasAll.xlsx'

        # Read data from Excel file
        df = pd.read_excel(file_path, sheet_name='CommitteeGroups')

        # Initialize counters
        created_count = 0
        updated_count = 0
        ignored_count = 0

        # Iterate over each row in the DataFrame
        for index, row in df.iterrows():
            # Look up the Election object by election_id
            election_id = row['election_id']
            try:
                election_obj = Election.objects.get(id=election_id)
            except Election.DoesNotExist:
                self.stdout.write(self.style.WARNING(f"Election with ID '{election_id}' does not exist. Skipping committee import."))
                ignored_count += 1
                continue

            # Look up the CommitteeGroup's area by area ID
            area_id = row['area']
            try:
                area_obj = Area.objects.get(id=area_id)
            except Area.DoesNotExist:
                self.stdout.write(self.style.WARNING(f"Area with ID '{area_id}' does not exist. Skipping committee import."))
                ignored_count += 1
                continue

            # Create or update CommitteeGroup object
            committee_obj, created = ElectionCommitteeGroup.objects.update_or_create(
                id=row['id'],
                defaults={
                    'election': election_obj,  # Assign the Election object
                    'name': row['name'],
                    'committee_no': row['committee_no'],
                    'circle': row['circle'],
                    'area': area_obj,  # Assign the Area object
                    'gender': row['gender'],
                    'description': row['description'],
                    'address': row['address'],
                    'voter_count': row['voter_count'],
                    'committee_count': row['committee_count'],
                    'tags': row['tags'],
                    'total_voters': row.get('total_voters', 0)  # Provide a default value of 0 if total_voters is not present
                }
            )

            if created:
                created_count += 1
            else:
                updated_count += 1

        # Print summary
        self.stdout.write(self.style.SUCCESS(f'Import completed. Summary:'))
        self.stdout.write(self.style.SUCCESS(f'Created: {created_count} committees'))
        self.stdout.write(self.style.SUCCESS(f'Updated: {updated_count} committees'))
        self.stdout.write(self.style.SUCCESS(f'Ignored: {ignored_count} committees due to missing data'))
