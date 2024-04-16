import os
import pandas as pd
import sqlite3
from django.core.management.base import BaseCommand
from django.conf import settings

class Command(BaseCommand):
    help = 'Import data from an Excel file into the specified SQLite database'

    def handle(self, *args, **options):
        slug = 'national-assembly-5-2024'
        # Adjusted file_path to reflect the new location
        file_path = os.path.join(
            settings.BASE_DIR,
            'apps', 'electionStatistics', 'management', 'data', 'nationalAssembly5-2024.xlsx'
        )

        # Path to the SQLite database
        db_path = os.path.join(settings.BASE_DIR, 'database', f'{slug}.sqlite3')

        # Check if the database exists
        if not os.path.exists(db_path):
            self.stdout.write(self.style.ERROR(f'Database file {db_path} does not exist.'))
            return

        # Load the Excel file
        df = pd.read_excel(file_path, dtype=str)

        # Establish a connection to the database
        try:
            conn = sqlite3.connect(db_path)
            # Insert data from DataFrame into the database table 'electors'
            # 'if_exists' parameter can be set to 'replace' or 'append'
            df.to_sql('electors', conn, if_exists='replace', index=False)
            conn.close()
            self.stdout.write(self.style.SUCCESS(f'Successfully imported data into {db_path}.'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'An error occurred: {str(e)}'))
            return
