from django.core.management.base import BaseCommand
from management.data import election_categories

class Command(BaseCommand):
    help = 'Set Election Categories Data'

    def handle(self, *args, **options):
        election_categories.set_election_categories()
        self.stdout.write(self.style.SUCCESS('Election Categories set successfully!'))
    