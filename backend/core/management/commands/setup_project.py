from django.core.management.base import BaseCommand
from django.core.management import call_command
import os

class Command(BaseCommand):
    help = "Call the importUsers command located in the startup directory"

    def handle(self, *args, **options):
        # Call the importUsers command directly
        # call_command('import_project_users')
        call_command('import_project_groups')
        call_command('import_project_permissions')


        # Elections
        call_command('import_project_election_categories')
        call_command('import_project_elections')

        # Participants
        call_command('import_project_candidates')
        call_command('import_project_parties')

        # # ElectionParticipants
        call_command('import_project_election_candidates')
        call_command('import_project_election_parties')
        call_command('import_project_election_party_candidates')

        call_command('reset_all_sequences')

        # setup Schemas
        # call_command('setup_election_schemas')
        # call_command('import_schema_data --schema na_5_2024')

        self.stdout.write(self.style.SUCCESS("setup Q8tasweet command called successfully."))
