from django.core.management.base import BaseCommand
from django.contrib.auth.models import Permission
from django.db import connection
from core.management.startup import permissions_data

class Command(BaseCommand):
    help = 'Set Group Permissions'
    
    def handle(self, *args, **kwargs):
        # Drop and recreate the auth_permission table
        # with connection.schema_editor() as schema_editor:
        #     schema_editor.execute("DROP TABLE IF EXISTS auth_permission;")
        #     schema_editor.create_model(Permission)
        
        # Set new permissions
        permissions_data.set_permissions()  # Assuming the function is named set_permissions
        self.stdout.write(self.style.SUCCESS('Permissions set successfully!'))
