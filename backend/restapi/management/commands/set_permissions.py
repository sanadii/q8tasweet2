from django.core.management.base import BaseCommand
from restapi.management.data import permissions_data

class Command(BaseCommand):
    help = 'Set Group Permissions'
    
    def handle(self, *args, **kwargs):
        permissions_data.set_permissions()  # Assuming the function is named set_permissions
        self.stdout.write(self.style.SUCCESS('Permissions set successfully!'))
