from django.core.management.base import BaseCommand
from django.core.management import call_command
import os

class Command(BaseCommand):
    help = "Call the importUsers command located in the startup directory"

    def handle(self, *args, **options):
        # Call the importUsers command directly
        # call_command('import_users')
        # call_command('import_groups')
        call_command('set_permissions')
        # call_command('import_election_candidates')
        
        
        # setup Schemas
        # call_command('setup_election_schemas')
        # call_command('import_schema_data --schema na_5_2024')

        self.stdout.write(self.style.SUCCESS("setup Q8tasweet command called successfully."))
