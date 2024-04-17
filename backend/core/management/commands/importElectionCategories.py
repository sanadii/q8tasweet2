from django.core.management.base import BaseCommand
import pandas as pd
from apps.elections.models import ElectionCategory

class Command(BaseCommand):
    help = 'Import election categories from an Excel file'

    def handle(self, *args, **options):
        # Read the Excel file
        excel_file = 'core/management/data/electionCategories.xlsx'
        df = pd.read_excel(excel_file)

        # Replace NaN values in 'parent' column with None
        df['parent'] = df['parent'].fillna(pd.NA)

        # Iterate over each row and save the objects
        for _, row in df.iterrows():
            # Convert 'parent' and 'is_active' columns to appropriate data types
            parent_id = None if pd.isna(row['parent']) else int(row['parent'])
            is_active = True if row['is_active'] == 'TRUE' else False

            category_obj = ElectionCategory(
                id=int(row['id']),
                name=row['name'],
                slug=row['slug'],
                parent_id=parent_id,
                is_active=is_active
            )
            category_obj.save()

        self.stdout.write(self.style.SUCCESS('Successfully imported election categories'))
