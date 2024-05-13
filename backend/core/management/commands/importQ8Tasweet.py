import pandas as pd
from django.core.management.base import BaseCommand
from apps.elections.models import ElectionCategory

class Command(BaseCommand):
    help = 'Imports or updates election category from an Excel file into the default database'

    def handle(self, *args, **options):
        file_path = 'core/management/data/q8tasweet.xlsx'
        work_sheet = 'election_category'

        # Read data from Excel file
        try:
            df = pd.read_excel(file_path, sheet_name=work_sheet)
            # Convert NaN in 'parent' to None
            df['parent'] = df['parent'].apply(lambda x: None if pd.isna(x) else x)
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Failed to read Excel file: {e}"))
            return

        # Initialize counters
        created_count = 0
        updated_count = 0

        # Iterate over each row in the DataFrame
        for index, row in df.iterrows():
            try:
                # Extract the 'id' separately if it's always present
                elector_id = row['id']
                # Prepare defaults excluding 'id'
                defaults = {col: row[col] for col in df.columns if col != 'id'}

                # Handle 'parent' field which should be an instance of ElectionCategory
                if row['parent'] is not None:
                    defaults['parent'] = ElectionCategory.objects.get(id=row['parent'])

                # Create or update election_category object
                election_category_obj, created = ElectionCategory.objects.update_or_create(
                    id=elector_id,
                    defaults=defaults
                )
                if created:
                    created_count += 1
                else:
                    updated_count += 1
            except ElectionCategory.DoesNotExist:
                self.stdout.write(self.style.ERROR(f"Parent Election Category with ID {row['parent']} not found."))
            except Exception as e:
                self.stdout.write(self.style.WARNING(f"Error occurred while importing or updating election category: {e}"))

        # Print summary
        self.stdout.write(self.style.SUCCESS(f'Import completed. Summary:'))
        self.stdout.write(self.style.SUCCESS(f'Created: {created_count} election categories'))
        self.stdout.write(self.style.SUCCESS(f'Updated: {updated_count} election categories due to updates'))
