from django.core.management.base import BaseCommand
from django.core.management import call_command

class Command(BaseCommand):
    help = "Call the importUsers command located in the startup directory"

    def add_arguments(self, parser):
        parser.add_argument("election", type=str, help="Election identifier")

    def handle(self, *args, **options):
        election = options["election"]

        # Import Election
        # call_command("import_election_details", election)

        # Participants: Candidate, ElectionCandidate, Party, ElectionParty, ElectionPartyCandidate
        # call_command("import_election_related_candidates", election)
        # # call_command('import_election_related_parties')
        # # call_command('import_election_related_party_candidates')

        # # Schema: CommitteeSite, Committee, Elector
        # call_command("create_election_related_schema", election)
        # call_command("import_election_related_schema_data", election)


        # # # Import Users, Members,
        # call_command("import_election_related_members", election)
        
        # # Import Guarantees
        call_command("import_election_related_schema_guarantees", election)

        self.stdout.write(
            self.style.SUCCESS("setup Q8tasweet command called successfully.")
        )

