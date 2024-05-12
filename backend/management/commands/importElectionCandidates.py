import os
import pandas as pd
from django.core.management.base import BaseCommand
from apps.elections.models import ElectionCandidate, Election
from apps.candidates.models import Candidate
from django.db.utils import IntegrityError


class Command(BaseCommand):
    help = "Imports candidates from an Excel file into the database"

    def handle(self, *args, **options):
        file_path = "core/management/data/elections.xlsx"
        df = pd.read_excel(file_path, sheet_name="electionCandidates")

        # Convert 'id' column to numeric data type
        df["id"] = pd.to_numeric(df["id"], errors="coerce")

        # Initialize counters
        created_count = 0
        updated_count = 0
        ignored_count = 0

        # Iterate over each row in the DataFrame
        for index, row in df.iterrows():
            # Assuming 'id' is a unique identifier for election candidates in the Excel file
            election_candidate_id = row["id"]
            candidate_id = row["candidate"]
            election_id = row["election"]

            try:
                # Create or update Candidate object
                candidate, created = ElectionCandidate.objects.update_or_create(
                    defaults={
                        "election_id": election_id,
                        "candidate_id": candidate_id,
                        "position": row["position"],
                        "result": row["result"],
                        "votes": row["votes"],
                    },
                    id=election_candidate_id,
                )

                if created:
                    created_count += 1
                    self.stdout.write(
                        self.style.SUCCESS(f"Created new candidate: {candidate.id}")
                    )
                else:
                    updated_count += 1
                    self.stdout.write(
                        self.style.SUCCESS(f"Updated candidate: {candidate.id}")
                    )

            except IntegrityError as e:
                self.stdout.write(
                    self.style.WARNING(
                        f'Failed to import candidate with id {election_candidate_id}. Error: {str(e)}'
                    )
                )
                ignored_count += 1
                continue

        # Print summary
        self.stdout.write(self.style.SUCCESS("Import completed. Summary:"))
        self.stdout.write(self.style.SUCCESS(f"Created: {created_count} candidates"))
        self.stdout.write(self.style.SUCCESS(f"Updated: {updated_count} candidates"))
        self.stdout.write(
            self.style.SUCCESS(f"Ignored: {ignored_count} entries due to errors")
        )
