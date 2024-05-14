from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import datetime
from apps.elections.models import ElectionCategory, Election, ElectionCandidate
from apps.candidates.models import Candidate

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
            "ElectionCategory": {
                "model": ElectionCategory,
                "work_sheet": "election_category",
                "required_data": ["id", "slug", "image", "name", "parent_id", "is_active"],
            },
            "Election": {
                "model": Election,
                "work_sheet": "election",
                "required_data": [
                    "id",
                    "status",
                    "priority",
                    "slug",
                    "election_method",
                    "election_result",
                    "has_schema",
                    "deleted",
                    # #Number Fields
                    "elect_votes",
                    "elect_seats",
                    "attendee_count",
                    "attendee_male_count",
                    "attendee_female_count",
                    "elector_count",
                    "elector_female_count",
                    "elector_male_count",
                    # #
                    # # ForeignKeys
                    "category_id",
                    "sub_category_id",
                    "created_by_id",
                    "updated_by_id",
                    "deleted_by_id",
                    # #
                    # # DateFields
                    "due_date",
                    "created_at",
                    "updated_at",
                    "deleted_at",
                ],
            },
            "Candidate": {
                "model": Candidate,
                "work_sheet": "candidate",
                "required_data": [
                    "id",
                    "status",
                    "priority",
                    "name",
                    "gender",
                    "image",
                    "tags",
                    "slug",
                    "denomination",
                    "family",
                    "tribe",
                    "deleted",
                    #
                    # ForeignKeys
                    "created_by_id",
                    "updated_by_id",
                    "deleted_by_id",
                    # #
                    # # DateFields
                    "created_at",
                    "updated_at",
                    "deleted_at",
                ],
            },
            "ElectionCandidate": {
                "model": ElectionCandidate,
                "work_sheet": "election_candidate_na_2014",
                "required_data": [
                    "id",
                    "election_id",
                    "candidate_id",
                    "position",
                    "result",
                    "votes",
                    "note",
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
