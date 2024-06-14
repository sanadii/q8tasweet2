# core/management/commands/import_election_details.py

from django.core.management.base import BaseCommand
from apps.elections.models import Election
from .utils import read_excel_file, check_required_columns, import_objects_from_df

class Command(BaseCommand):
    help = "Imports or updates Election data from an Excel file"

    def add_arguments(self, parser):
        parser.add_argument('election', type=str, help='The election identifier to construct the file path')

    def handle(self, *args, **options):
        election = options['election']
        file_path = f"core/management/data/{election}.xlsx"
        work_sheet = "election"
        required_data = [
            "category_id", "sub_category_id", "due_date", "slug", 
            "election_method", "is_detailed_results", "is_sorting_results",
            "elect_votes", "elect_seats",
            "attendee_count", "attendee_male_count", "attendee_female_count",
            "elector_count", "elector_female_count", "elector_male_count", 
            "status", "priority", 
        ]

        df = read_excel_file(file_path, work_sheet, required_data, self.stdout)
        if df is None or not check_required_columns(df, required_data, self.stdout):
            return

        created_count, updated_count, created_objects = import_objects_from_df(df, Election, self.stdout)

        self.stdout.write(self.style.SUCCESS(f"Import completed for {work_sheet}. Summary:"))
        self.stdout.write(self.style.SUCCESS(f"Created: {created_count} Election"))
        self.stdout.write(self.style.SUCCESS(f"Updated: {updated_count} Election"))

        if created_objects:
            return created_objects[0].id
        else:
            return None
