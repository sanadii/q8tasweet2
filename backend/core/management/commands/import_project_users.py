from django.core.management.base import BaseCommand
from apps.auths.models import User
from .utils import read_excel_file, check_required_columns, import_objects_from_df

class Command(BaseCommand):
    help = "Imports or updates users from an Excel file into the database based on the specified schema"

    def handle(self, *args, **options):
        # Define the file path
        file_path = "core/management/data/settings.xlsx"
        work_sheet = "users"
        required_data = [
            "id", "first_name", "last_name", "username", "email", "password",
            "is_superuser", "is_staff", "is_active",
            "description", "twitter", "instagram",
            ## Images
            "image",
            "background",
            ## Numbers
            "civil",
            "phone",
            "gender",
        ]

        df = read_excel_file(file_path, work_sheet, required_data, self.stdout)
        if df is None or not check_required_columns(df, required_data, self.stdout):
            return

        created_count, updated_count, processed_candidates = import_objects_from_df(df, User, self.stdout)

        # Print summary
        self.stdout.write(self.style.SUCCESS(f"Import completed. Summary:"))
        self.stdout.write(self.style.SUCCESS(f"Created: {created_count} users"))
        self.stdout.write(self.style.SUCCESS(f"Updated: {updated_count} users due to updates"))
