import pandas as pd
from django.core.management.base import BaseCommand
from django.db import transaction
from apps.candidates.models import Candidate
from apps.elections.models import Election, ElectionCandidate

class Command(BaseCommand):
    help = 'Imports election candidates from an Excel file into the database'

    def add_election_candidate(self, row, election):
        try:
            with transaction.atomic():
                candidate, _ = Candidate.objects.get_or_create(
                    id=row['id'],
                    defaults={
                        'name': row['name'],
                        'family': row.get('family', ''),
                        'tribe': row.get('tribe', ''),
                        'denomination': row.get('denomination', ''),
                        # Assuming 'image' column is optional, provide a default if it doesn't exist
                        'image': row.get('image', '')
                    }
                )
                
                # Check if position and votes are NaN and set to None if they are
                position = None if pd.isna(row['position']) else int(row['position'])
                votes = None if pd.isna(row['votes']) else int(row['votes'])

                election_candidate, created = ElectionCandidate.objects.update_or_create(
                    election=election,
                    candidate=candidate,
                    defaults={
                        'position': position,
                        'result': row.get('result', ''),
                        'votes': votes
                    }
                )

                return created
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error adding/updating candidate {row['name']}: {e}"))
            return False

    def handle(self, *args, **options):
        file_path = 'core/management/data/electionCandidateSample.xlsx'
        df = pd.read_excel(file_path)

        try:
            election = Election.objects.get(id=124)
        except Election.DoesNotExist:
            self.stdout.write(self.style.ERROR('Election with ID 124 does not exist.'))
            return

        created_count = updated_count = ignored_count = 0

        for _, row in df.iterrows():
            if self.add_election_candidate(row, election):
                created_count += 1
            else:
                updated_count += 1

        self.stdout.write(self.style.SUCCESS(f'Import completed. {created_count} created, {updated_count} updated.'))
