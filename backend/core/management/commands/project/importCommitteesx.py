import pandas as pd
from django.core.management.base import BaseCommand
from apps.elections.models import ElectionCommittee, ElectionCommitteeGroup

class Command(BaseCommand):
    help = 'Imports committees from an Excel file into the database'

    def handle(self, *args, **options):
        # Define the file path
        file_path = 'core/management/data/areasAll.xlsx'

        # Read data from Excel file
        df = pd.read_excel(file_path, sheet_name='Committees')

        # Initialize counters
        created_count = 0
        updated_count = 0
        ignored_count = 0

        # Iterate over each row in the DataFrame
        for index, row in df.iterrows():
            # Look up the CommitteeGroup by ID
            committee_group_id = row['committee_group']
            try:
                committee_group = ElectionCommitteeGroup.objects.get(id=committee_group_id)
            except ElectionCommitteeGroup.DoesNotExist:
                self.stdout.write(self.style.WARNING(f"CommitteeGroup with ID '{committee_group_id}' does not exist. Skipping committee import."))
                ignored_count += 1
                continue

            # Create or update Committee object
            committee_objs = ElectionCommittee.objects.filter(serial=row['serial'])

            if committee_objs.exists():
                # Update existing objects
                for committee_obj in committee_objs:
                    committee_obj.letters = row['letters']
                    committee_obj.areas = row['areas']
                    committee_obj.type = row['type']
                    committee_obj.committee_group = committee_group
                    committee_obj.save()
                updated_count += len(committee_objs)
            else:
                # Create new object
                committee_obj = ElectionCommittee.objects.create(
                    serial=row['serial'],
                    letters=row['letters'],
                    type=row['type'],
                    areas=row['areas'],
                    committee_group=committee_group
                )
                created_count += 1

   

        # Print summary
        self.stdout.write(self.style.SUCCESS(f'Import completed. Summary:'))
        self.stdout.write(self.style.SUCCESS(f'Created: {created_count} committees'))
        self.stdout.write(self.style.SUCCESS(f'Updated: {updated_count} committees'))
        self.stdout.write(self.style.SUCCESS(f'Ignored: {ignored_count} committees due to missing data'))
