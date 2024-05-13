from django.core.management.base import BaseCommand
import json
import pandas as pd

# Define the paths to your files
json_file_path = 'core/management/data/committeeData.json'
csv_file_path = 'core/management/data/committeeData.csv'

class Command(BaseCommand):
    help = 'Converts JSON data to CSV'
    
    def handle(self, *args, **options):
        # Read the JSON file
        with open(json_file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)['data']  # Load data and extract the 'data' array

        # Convert to pandas DataFrame and write to CSV
        df = pd.DataFrame(data)
        df.to_csv(csv_file_path, index=False, encoding='utf-8-sig')

        self.stdout.write(self.style.SUCCESS("Successfully converted JSON to CSV using pandas."))
