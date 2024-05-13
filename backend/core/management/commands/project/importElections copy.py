import pandas as pd
from django.core.management.base import BaseCommand
from apps.elections.models import Election  # Assuming the Election model is in 'apps.elections.models'
from datetime import datetime

class Command(BaseCommand):
    help = 'Imports elections from an Excel file into the database'

    def handle(self, *args, **options):
        # Define the file path
        file_path = 'core/management/data/elections.xlsx'

        # Read data from Excel file
        df = pd.read_excel(file_path, sheet_name='elections')

        # Initialize counters
        created_count = 0
        updated_count = 0
        ignored_count = 0

        # Iterate over each row in the DataFrame
        for index, row in df.iterrows():
            # Assuming 'id' is a unique identifier for elections in the Excel file
            election_id = row['id']
            try:
                # Parse due_date string to datetime object
                due_date_str = str(row['due_date'])
                due_date_format = '%d-%b-%Y' if '/' in due_date_str else '%Y-%m-%d'
                due_date = datetime.strptime(due_date_str, due_date_format)

                created_at_str = str(row['due_date'])
                created_at_format = '%d-%b-%Y' if '/' in created_at_str else '%Y-%m-%d'
                created_at = datetime.strptime(created_at_str, created_at_format)

                updated_at_str = str(row['due_date'])
                updated_at_format = '%d-%b-%Y' if '/' in updated_at_str else '%Y-%m-%d'
                updated_at = datetime.strptime(updated_at_str, updated_at_format)



                # Create or update Election object
                election, created = Election.objects.update_or_create(
                    defaults={
                        'status': row['status'],
                        'priority': row['priority'],
                        'moderators': row['moderators'],
                        'slug': row['slug'],
                        'elect_votes': row['elect_votes'],
                        'elect_seats': row['elect_seats'],
                        'first_winner_votes': row['first_winner_votes'],
                        'last_winner_votes': row['last_winner_votes'],
                        'attendees': row['attendees'],
                        'attendees_males': row['attendees_males'],
                        'attendees_females': row['attendees_females'],
                        'category_id': row['category_id'],
                        'created_by_id': row['created_by_id'],
                        'deleted_by_id': row['deleted_by_id'],
                        'sub_category_id': row['sub_category_id'],
                        'updated_by_id': row['updated_by_id'],
                        'election_method': row['election_method'],
                        'election_result': row['election_result'],
                        'voters': row['voters'],
                        'voters_females': row['voters_females'],
                        'voters_males': row['voters_males'],
                        'has_database': row['has_database'],
                        

                        'deleted': row['deleted'],
                        
                        
                        # DateTime Validations
                        # 'due_date': due_date,
                        # 'created_at': created_at,
                        # 'updated_at': updated_at,
                        # 'deleted_at': row['deleted_at'],

                    },
                    id=election_id
                )

                if created:
                    created_count += 1
                    self.stdout.write(self.style.SUCCESS(f'Created new election: {election.id}'))
                else:
                    updated_count += 1
                    self.stdout.write(self.style.SUCCESS(f'Updated election: {election.id}'))

            except Exception as e:
                # Handle exceptions gracefully
                self.stdout.write(self.style.ERROR(f'Failed to import election: {election_id}. Error: {str(e)}'))
                ignored_count += 1
                continue

        # Print summary
        self.stdout.write(self.style.SUCCESS('Import completed. Summary:'))
        self.stdout.write(self.style.SUCCESS(f'Created: {created_count} elections'))
        self.stdout.write(self.style.SUCCESS(f'Updated: {updated_count} elections'))
        self.stdout.write(self.style.SUCCESS(f'Ignored: {ignored_count} entries due to errors'))
