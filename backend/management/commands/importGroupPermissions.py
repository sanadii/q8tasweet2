import pandas as pd
from django.core.management.base import BaseCommand
from django.contrib.auth.models import Permission, ContentType
from django.db.utils import IntegrityError

class Command(BaseCommand):
    help = "Imports permissions from an Excel file into the database"

    def handle(self, *args, **options):
        file_path = "core/management/data/elections.xlsx"
        df = pd.read_excel(file_path, sheet_name="permissions")

        created_count = 0
        updated_count = 0
        error_count = 0

        for index, row in df.iterrows():
            content_type_id = row['content_type_id']
            codename = row['codename']
            name = row['name']
            
            # Attempt to fetch the content type by ID
            try:
                content_type = ContentType.objects.get(id=content_type_id)
            except ContentType.DoesNotExist:
                self.stdout.write(self.style.ERROR(
                    f"ContentType with ID {content_type_id} does not exist. Row {index + 1} skipped."
                ))
                error_count += 1
                continue

            # Create or update the Permission
            permission, created = Permission.objects.update_or_create(
                codename=codename,
                defaults={
                    'name': name,
                    'content_type': content_type,
                },
            )

            if created:
                created_count += 1
                self.stdout.write(self.style.SUCCESS(f"Created permission: {permission.name}"))
            else:
                updated_count += 1
                self.stdout.write(self.style.SUCCESS(f"Updated permission: {permission.name}"))

        # Print summary
        self.stdout.write(self.style.SUCCESS(f"Permissions import completed: {created_count} created, {updated_count} updated, {error_count} errors."))
