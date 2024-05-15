from django.core.management.base import BaseCommand
from django.core.management import call_command
import os

class Command(BaseCommand):
    help = "Call the importUsers command located in the startup directory"

    def handle(self, *args, **options):
        # Call the importUsers command directly
        # call_command('importUsers')
        # call_command('importGroups')
        # call_command('setPermissions')
        # call_command('importElectionCandidates')
        
        
        # setup Schemas
        call_command('setupElectionSchemas')
        call_command('importSchemaData --schema na_5_2024')

        self.stdout.write(self.style.SUCCESS("setup Q8tasweet command called successfully."))
