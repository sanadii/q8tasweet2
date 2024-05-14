import pandas as pd
from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import datetime
from apps.elections.models import ElectionCategory, Election
from .utils import read_excel_file, check_required_columns, import_objects_from_df

# Define a naive datetime object
naive_datetime = datetime(2022, 1, 1, 12, 0, 0)

# Convert naive datetime to timezone-aware datetime
aware_datetime = timezone.make_aware(naive_datetime)


class Command(BaseCommand):
    help = "Imports or updates data from an Excel file into the database based on the specified schema"

    def handle(self, *args, **options):
        # Define the file path
        file_path = "core/management/data/electionCandidates.xlsx"

        datas = {
            "electionCategories": {
                "model": ElectionCategory,
                "work_sheet": "election_category",
                "required_data": ["id", "slug", "image", "name", "parent", "is_active"],
            },
            "elections": {
                "model": Election,
                "work_sheet": "elections",
                "required_data": [
                    "id",
                    "status",
                    "priority",
                    "slug",
                    "elect_votes",
                    "elect_seats",
                    # #Number Fields
                    "attendee_count",
                    "attendee_male_count",
                    "attendee_female_count",
                    "elector_count",
                    "elector_female_count",
                    "elector_male_count",
                    # # Fields with Ids
                    # "category_id",
                    # "created_by_id",
                    # "sub_category_id",
                    # #
                    # # Other Fields
                    "election_method",
                    "election_result",
                    "has_schema",
                    # 'deleted': row['deleted'],
                ],
            },
        }

        for key, data in datas.items():
            model = data["model"]
            work_sheet = data["work_sheet"]
            required_data = data["required_data"]

            df = read_excel_file(file_path, work_sheet, required_data, self.stdout)
            if df is None or not check_required_columns(df, required_data, self.stdout):
                continue

            created_count, updated_count = import_objects_from_df(
                df, model, self.stdout
            )

            # Print summary
            self.stdout.write(
                self.style.SUCCESS(f"Import completed for {work_sheet}. Summary:")
            )
            self.stdout.write(self.style.SUCCESS(f"Created: {created_count} {key}"))
            self.stdout.write(self.style.SUCCESS(f"Updated: {updated_count} {key}"))
