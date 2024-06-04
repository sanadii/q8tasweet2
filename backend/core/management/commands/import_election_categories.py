from django.core.management.base import BaseCommand
from datetime import datetime
from django.utils import timezone
from apps.elections.models import ElectionCategory
from .utils import read_excel_file, check_required_columns, import_objects_from_df

class Command(BaseCommand):
    help = "Imports or updates ElectionCategory data from an Excel file"

    def handle(self, *args, **options):
        file_path = "core/management/data/electionCandidates.xlsx"
        work_sheet = "election_category"
        required_data = ["id", "slug", "image", "name", "parent_id", "is_active"]

        df = read_excel_file(file_path, work_sheet, required_data, self.stdout)
        if df is None or not check_required_columns(df, required_data, self.stdout):
            return

        created_count, updated_count = import_objects_from_df(df, ElectionCategory, self.stdout)

        self.stdout.write(self.style.SUCCESS(f"Import completed for {work_sheet}. Summary:"))
        self.stdout.write(self.style.SUCCESS(f"Created: {created_count} ElectionCategory"))
        self.stdout.write(self.style.SUCCESS(f"Updated: {updated_count} ElectionCategory"))
