from django.core.management.base import BaseCommand
from datetime import datetime
from django.utils import timezone
from apps.candidates.models import Candidate

class Command(BaseCommand):
    help = "Imports or updates Candidate data from an Excel file"

    def handle(self, *args, **options):
        file_path = "core/management/data/electionCandidates.xlsx"
        work_sheet = "candidates"
        required_data = [
            "id", "status", "priority", "name", "gender", "image", "tags", "slug", "denomination", 
            "family", "tribe", "is_deleted",
            # "created_by_id", "updated_by_id", "deleted_by_id", 
            # "created_at", "updated_at", "deleted_at"
        ]

        df = read_excel_file(file_path, work_sheet, required_data, self.stdout)
        if df is None or not check_required_columns(df, required_data, self.stdout):
            return

        created_count, updated_count = import_objects_from_df(df, Candidate, self.stdout)

        self.stdout.write(self.style.SUCCESS(f"Import completed for {work_sheet}. Summary:"))
        self.stdout.write(self.style.SUCCESS(f"Created: {created_count} Candidate"))
        self.stdout.write(self.style.SUCCESS(f"Updated: {updated_count} Candidate"))
