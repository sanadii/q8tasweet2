from django.core.management.base import BaseCommand
from backend.core.management.startup import groups_data

class Command(BaseCommand):
    help = 'Set Group Data'

    def handle(self, *args, **options):
        groups_data.set_groups()  # Assuming the function is named set_permissions
        self.stdout.write(self.style.SUCCESS('Groups set successfully!'))
    