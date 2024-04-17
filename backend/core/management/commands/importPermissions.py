from django.core.management.base import BaseCommand
import pandas as pd
from django.contrib.auth.models import Group, Permission

class Command(BaseCommand):
    help = 'Import group-permission linkages from an Excel file'

    def handle(self, *args, **options):
        # Path to the Excel file
        file_path = "core/management/data/elections.xlsx"
        df = pd.read_excel(file_path, sheet_name="permissions")

        # Iterate over each row in the DataFrame
        for index, row in df.iterrows():
            group_id = row['group_id']
            permission_id = row['permission_id']

            # Fetch the group and permission instances
            try:
                group = Group.objects.get(id=group_id)
                permission = Permission.objects.get(id=permission_id)
                
                # Add the permission to the group
                group.permissions.add(permission)
                self.stdout.write(self.style.SUCCESS(f'Added permission {permission} to group {group}'))
                
            except Group.DoesNotExist:
                self.stdout.write(self.style.ERROR(f'Group with id {group_id} does not exist'))
            except Permission.DoesNotExist:
                self.stdout.write(self.style.ERROR(f'Permission with id {permission_id} does not exist'))

        self.stdout.write(self.style.SUCCESS('Successfully imported group-permission linkages'))
