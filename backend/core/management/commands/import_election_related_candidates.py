from django.core.management.base import BaseCommand
from apps.elections.candidates.models import ElectionCandidate
from apps.candidates.models import Candidate
from .utils import read_excel_file, check_required_columns, import_objects_from_df

class Command(BaseCommand):
    help = "Imports or updates Candidate data from an Excel file and updates ElectionCandidate"

    def add_arguments(self, parser):
        parser.add_argument('election', type=str, help='Election identifier to construct the file path')

    def handle(self, *args, **options):
        election = options['election']
        file_path = f"core/management/data/{election}.xlsx"
        work_sheet = "candidates"
        required_data = [
            "id", "status", "priority", "name", "gender", "image", "tags", "slug", "denomination", 
            "family", "tribe", "position", "result", "votes"
        ]

        df = read_excel_file(file_path, work_sheet, required_data, self.stdout)
        if df is None or not check_required_columns(df, required_data, self.stdout):
            return

        created_count, updated_count, processed_candidates = import_objects_from_df(df, Candidate, self.stdout)

        self.stdout.write(self.style.SUCCESS(f"Import completed for {work_sheet}. Summary:"))
        self.stdout.write(self.style.SUCCESS(f"Created: {created_count} Candidates"))
        self.stdout.write(self.style.SUCCESS(f"Updated: {updated_count} Candidates"))

        # Now update ElectionCandidate model
        election_id = 23  # Static for now, you can modify as needed
        for _, row in df.iterrows():
            candidate = Candidate.objects.get(id=row["id"])
            election_candidate, created = ElectionCandidate.objects.update_or_create(
                candidate=candidate,
                election_id=election_id,
                defaults={
                    'position': row["position"],  # Use actual data from DataFrame
                    'result': row["result"],      # Use actual data from DataFrame
                    'votes': row["votes"],        # Use actual data from DataFrame
                    'note': row.get('note', '')   # Use actual data from DataFrame, or provide a default value
                }
            )
            action = "Created" if created else "Updated"
            self.stdout.write(self.style.SUCCESS(f"{action} ElectionCandidate for Candidate ID {candidate.id}"))

        self.stdout.write(self.style.SUCCESS("ElectionCandidate update completed."))
