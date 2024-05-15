import pandas as pd
from django.core.management.base import BaseCommand
from apps.elections.models import (
    Election,
)  # Assuming the Election model is in 'apps.elections.models'
from datetime import datetime


class Command(BaseCommand):
    help = "Imports elections from an Excel file into the database"

    def handle(self, *args, **options):
        file_path = "core/management/data/elections.xlsx"
        df = pd.read_excel(file_path, sheet_name="elections")

        # Initialize counters
        created_count = 0
        updated_count = 0
        ignored_count = 0

        # Iterate over each row in the DataFrame
        for index, row in df.iterrows():
            try:
                election_id = int(row['id'])  # Check if id is a valid number
            except ValueError:
                self.stdout.write(self.style.ERROR(f'Invalid id in row {index+1} (expected number, got "{row["id"]}")'))
                continue
            try:

                # Create or update Election object
                election, created = Election.objects.update_or_create(
                    defaults={
                        "status": row["status"],
                        "priority": row["priority"],
                        "moderators": row["moderators"],
                        "slug": row["slug"],
                        "elect_votes": row["elect_votes"],
                        "elect_seats": row["elect_seats"],
                        "first_winner_votes": row["first_winner_votes"],
                        "last_winner_votes": row["last_winner_votes"],
                        
                        # Number Fields
                        "attendees": row["attendees"],
                        "attendees_males": row["attendees_males"],
                        "attendees_females": row["attendees_females"],
                        "voters": row["voters"],
                        "voters_females": row["voters_females"],
                        "voters_males": row["voters_males"],
                        
                        # Fields with Ids
                        "category_id": row["category_id"],
                        'created_by_id': row.get('created_by_id'),
                        # 'deleted_by_id': row.get('deleted_by_id'),
                        # 'updated_by_id': row.get('updated_by_id'),
                        'sub_category_id': row.get('sub_category_id'),
                        # 
                        # Other Fields
                         'election_method': row['election_method'],
                        'election_result': row['election_result'],
                        'has_database': row['has_database'],
                        # 'is_deleted': row['is_deleted'],
                    },
                    id=election_id,
                )

                if created:
                    created_count += 1
                    self.stdout.write(
                        self.style.SUCCESS(f"Created new election: {election.id}")
                    )
                else:
                    updated_count += 1
                    self.stdout.write(
                        self.style.SUCCESS(f"Updated election: {election.id}")
                    )

            except Exception as e:
                # Handle exceptions gracefully
                self.stdout.write(
                    self.style.ERROR(
                        f"Failed to import election: {election_id}. Error: {str(e)}"
                    )
                )
                ignored_count += 1
                continue

        # Print summary
        self.stdout.write(self.style.SUCCESS("Import completed. Summary:"))
        self.stdout.write(self.style.SUCCESS(f"Created: {created_count} elections"))
        self.stdout.write(self.style.SUCCESS(f"Updated: {updated_count} elections"))
        self.stdout.write(
            self.style.SUCCESS(f"Ignored: {ignored_count} entries due to errors")
        )
