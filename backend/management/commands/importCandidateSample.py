import pandas as pd
from django.core.management.base import BaseCommand
from django.db.utils import IntegrityError
from apps.candidates.models import Candidate

class Command(BaseCommand):
    help = 'Imports candidates from an Excel file into the database'

    def handle(self, *args, **options):
        # Define the file path
        file_path = 'core/management/data/candidateSample.xlsx'

        # Read data from Excel file
        df = pd.read_excel(file_path)

        # Initialize counters
        created_count = 0
        updated_count = 0
        ignored_count = 0

        # Iterate over each row in the DataFrame
        for index, row in df.iterrows():
            candidate_id = row['id']
            try:
                # Try to update the candidate if it already exists
                candidate, created = Candidate.objects.update_or_create(
                    defaults={
                        'name': row['name'],
                        'gender': row['gender'],
                        'family': row['family'],
                        'tribe': row['tribe'],
                        'denomination': row['denomination'],
                        'image': row['image']
                    },
                    id=candidate_id
                )
                if created:
                    created_count += 1
                    self.stdout.write(self.style.SUCCESS(f'Created new candidate: {candidate.name}'))
                else:
                    updated_count += 1
                    self.stdout.write(self.style.SUCCESS(f'Updated candidate: {candidate.name}'))

            except IntegrityError as e:
                # If there is an IntegrityError, it likely means that there is a duplicate entry or other data issue
                self.stdout.write(self.style.WARNING(f'Failed to import candidate: {row["name"]}. Error: {str(e)}'))
                ignored_count += 1
                continue

        # Print summary
        self.stdout.write(self.style.SUCCESS('Import completed. Summary:'))
        self.stdout.write(self.style.SUCCESS(f'Created: {created_count} candidates'))
        self.stdout.write(self.style.SUCCESS(f'Updated: {updated_count} candidates'))
        self.stdout.write(self.style.SUCCESS(f'Ignored: {ignored_count} entries due to errors'))
