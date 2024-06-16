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
            "family", "tribe"
        ]

        df = read_excel_file(file_path, work_sheet, required_data, self.stdout)
        if df is None or not check_required_columns(df, required_data, self.stdout):
            return

        created_count, updated_count, processed_candidates = import_objects_from_df(df, Candidate, self.stdout)

        self.stdout.write(self.style.SUCCESS(f"Import completed for {work_sheet}. Summary:"))
        self.stdout.write(self.style.SUCCESS(f"Created: {created_count} Candidates"))
        self.stdout.write(self.style.SUCCESS(f"Updated: {updated_count} Candidates"))

        # Now update ElectionCandidate model
        election_id = 8  # Static for now, you can modify as needed
        election_created_count = 0
        election_updated_count = 0
        for candidate in processed_candidates:
            election_candidate, created = ElectionCandidate.objects.update_or_create(
                candidate=candidate,
                election_id=election_id,
                defaults={
                    'position': None,  # Replace with actual data if available
                    'result': None,    # Replace with actual data if available
                    'votes': 0,        # Replace with actual data if available
                    'notes': ''         # Replace with actual data if available
                }
            )
            if created:
                election_created_count += 1
            else:
                election_updated_count += 1

        self.stdout.write(self.style.SUCCESS(f"ElectionCandidate creation completed. Summary:"))
        self.stdout.write(self.style.SUCCESS(f"Created: {election_created_count} ElectionCandidates"))
        self.stdout.write(self.style.SUCCESS(f"Updated: {election_updated_count} ElectionCandidates"))

        self.stdout.write(self.style.SUCCESS("ElectionCandidate update completed."))
