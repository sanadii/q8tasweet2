import pandas as pd
from django.core.management.base import BaseCommand
from apps.candidates.models import Candidate  # Assuming the Candidate model is in 'apps.candidates.models'
from datetime import datetime

class Command(BaseCommand):
    help = 'Imports candidates from an Excel file into the database'

    def handle(self, *args, **options):
        # Define the file path
        file_path = 'core/management/data/elections.xlsx'

        # Read data from Excel file
        df = pd.read_excel(file_path, sheet_name='candidates')  # Assuming the sheet name is 'candidates'

        # Convert 'id' column to numeric data type
        df['id'] = pd.to_numeric(df['id'], errors='coerce')

        # Initialize counters
        created_count = 0
        updated_count = 0
        ignored_count = 0

        # Iterate over each row in the DataFrame
        for index, row in df.iterrows():
            # Assuming 'id' is a unique identifier for candidates in the Excel file
            candidate_id = row['id']
            try:
                # Parse created_at, updated_at, and deleted_at strings to datetime objects
                created_at = row['created_at']
                updated_at = row['updated_at']
                deleted_at = row['deleted_at']

                # Create or update Candidate object
                candidate, created = Candidate.objects.update_or_create(
                    defaults={
                        'created_at': created_at,
                        'updated_at': updated_at,
                        'deleted_at': deleted_at,
                        'deleted': row['deleted'],
                        'status': row['status'],
                        'priority': row['priority'],
                        'moderators': row['moderators'],
                        'name': row['name'],
                        'gender': row['gender'],
                        'image': row['image'],
                        'tags': row['tags'],
                        'created_by_id': row['created_by_id'],
                        'updated_by_id': row['updated_by_id'],
                        'slug': row['slug'],
                        'deleted_by_id': row['deleted_by_id'],
                        'denomination': row['denomination'],
                        'family': row['family'],
                        'tribe': row['tribe'],
                    },
                    id=candidate_id
                )

                if created:
                    created_count += 1
                    self.stdout.write(self.style.SUCCESS(f'Created new candidate: {candidate.id}'))
                else:
                    updated_count += 1
                    self.stdout.write(self.style.SUCCESS(f'Updated candidate: {candidate.id}'))

            except Exception as e:
                # Handle exceptions gracefully
                self.stdout.write(self.style.ERROR(f'Failed to import candidate: {candidate_id}. Error: {str(e)}'))
                ignored_count += 1
                continue

        # Print summary
        self.stdout.write(self.style.SUCCESS('Import completed. Summary:'))
        self.stdout.write(self.style.SUCCESS(f'Created: {created_count} candidates'))
        self.stdout.write(self.style.SUCCESS(f'Updated: {updated_count} candidates'))
        self.stdout.write(self.style.SUCCESS(f'Ignored: {ignored_count} entries due to errors'))
