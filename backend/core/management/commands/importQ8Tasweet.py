from django.core.management.base import BaseCommand
from django.core.management import call_command
import os

class Command(BaseCommand):
    help = "Call the importUsers command located in the startup directory"

    def handle(self, *args, **options):
        # Call the importUsers command directly
        call_command('importUsers')
        self.stdout.write(self.style.SUCCESS("importUsers command called successfully."))
