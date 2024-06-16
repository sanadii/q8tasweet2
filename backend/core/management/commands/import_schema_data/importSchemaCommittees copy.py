import pandas as pd
from django.core.management.base import BaseCommand
from apps.electionData.models import ElectionCommittee, ElectionCommitte

class Command(BaseCommand):
    help = 'Imports committees and subsets from an Excel file into the database'

    def handle(self, *args, **options):
        # Define the file path
        file_path = 'core/management/data/national_assembly_5_2024.xlsx'

        # Read data from Excel file for committees
        df_committees = pd.read_excel(file_path, sheet_name='committees')
        # Read data from Excel file for committee subsets
        df_subsets = pd.read_excel(file_path, sheet_name='committees')

        # Initialize counters
        created_committees_count = 0
        updated_committees_count = 0
        ignored_committees_count = 0

        created_subsets_count = 0
        ignored_subsets_count = 0

        # Import Committees
        for index, row in df_committees.iterrows():
            try:
                committee = ElectionCommittee.objects.get(serial=row['serial'])
                # Update existing Committee
                committee.name = row['name']
                committee.circle = row['circle']
                # committee.area = row['area']
                # committee.area_name = row['area_name']
                # committee.gender = row['gender']
                # committee.description = row['description']
                # committee.address = row['address']
                # committee.voter_count = row['voter_count']
                # committee.committee_count = row['committee_count']
                # committee.total_voters = row['total_voters']
                # committee.tag = row['tags']
                committee.save()
                updated_committees_count += 1
            except ElectionCommittee.DoesNotExist:
                # Create new Committee
                committee = ElectionCommittee.objects.create(
                    serial=row['serial'],
                    name=row['name'],
                    circle=row['circle'],
                    area=row['area'],
                    area_name=row['area_name'],
                    gender=row['gender'],
                    description=row['description'],
                    address=row['address'],
                    voter_count=row['voter_count'],
                    committee_count=row['committee_count'],
                    total_voters=row['total_voters'],
                    tag=row['tags']
                )
                created_committees_count += 1
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"An error occurred while importing committee: {e}"))
                ignored_committees_count += 1

        # Import Committee Subsets
        # for index, row in df_subsets.iterrows():
        #     try:
        #         committee = ElectionCommittee.objects.get(serial=row['committee'])
        #         # Create Committee Subset
        #         subset = ElectionCommitte.objects.create(
        #             areas=row['areas'],
        #             letters=row['letters'],
        #             committee=committee,
        #             type=row['type'],
        #             main=row['main']
        #         )
        #         created_subsets_count += 1
        #     except ElectionCommittee.DoesNotExist:
        #         self.stdout.write(self.style.WARNING(f"Committee with serial '{row['committee']}' does not exist. Skipping subset import."))
        #         ignored_subsets_count += 1
        #     except Exception as e:
        #         self.stdout.write(self.style.ERROR(f"An error occurred while importing subset: {e}"))
        #         ignored_subsets_count += 1

        # Print summary for committees
        self.stdout.write(self.style.SUCCESS(f'Committees Import completed. Summary:'))
        self.stdout.write(self.style.SUCCESS(f'Created: {created_committees_count} committees'))
        self.stdout.write(self.style.SUCCESS(f'Updated: {updated_committees_count} committees'))
        self.stdout.write(self.style.SUCCESS(f'Ignored: {ignored_committees_count} committees due to errors'))

        # Print summary for subsets
        # self.stdout.write(self.style.SUCCESS(f'Subsets Import completed. Summary:'))
        # self.stdout.write(self.style.SUCCESS(f'Created: {created_subsets_count} subsets'))
        # self.stdout.write(self.style.SUCCESS(f'Ignored: {ignored_subsets_count} subsets due to errors'))
