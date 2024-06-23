from django.core.management.base import BaseCommand
from datetime import datetime
from django.utils import timezone
from apps.elections.models import Election
from .utils.helper import read_excel_file, check_required_columns, import_objects_from_df

class Command(BaseCommand):
    help = "Imports or updates Election data from an Excel file"

    def handle(self, *args, **options):
        file_path = "core/management/data/electionCandidates.xlsx"
        work_sheet = "election"
        required_data = [
            "id", "status", "priority", "slug", "election_method", "is_detailed_results", 
            "is_sorting_results", "is_deleted", "has_schema", "elect_votes", "elect_seats", 
            "attendee_count", "attendee_male_count", "attendee_female_count", "elector_count", 
            "elector_female_count", "elector_male_count", "category_id", "sub_category_id", 
            "due_date",
            #  "created_by_id", "updated_by_id", "deleted_by_id",
            # "created_at", "updated_at", "deleted_at"
        ]

        df = read_excel_file(file_path, work_sheet, required_data, self)
        if df is None or not check_required_columns(df, required_data, self):
            return

        created_count, updated_count, nothing = import_objects_from_df(df, Election, self)

        self.stdout.write(self.style.SUCCESS(f"Import completed for {work_sheet}. Summary:"))
        self.stdout.write(self.style.SUCCESS(f"Created: {created_count} Election"))
        self.stdout.write(self.style.SUCCESS(f"Updated: {updated_count} Election"))
