from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = 'Sets up the project by running set_groups, set_permissions, and set_categories'

    def handle(self, *args, **options):
        # Implement your logic here
        self.set_groups()
        self.set_permissions()
        self.set_categories()

    def set_groups(self):
        # Logic for set_groups
        pass

    def set_permissions(self):
        # Logic for set_permissions
        pass

    def set_categories(self):
        # Logic for set_categories
        pass
