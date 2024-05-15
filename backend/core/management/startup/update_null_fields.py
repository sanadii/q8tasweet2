from django.core.management.base import BaseCommand
from django.apps import apps
from django.db import models

class Command(BaseCommand):
    help = 'Updates null "is_deleted" fields to False'

    def handle(self, *args, **options):
        print("Starting update_null_fields command...")
        # Rest of the code
        for model in apps.get_models():
            # Check if the model has a 'is_deleted' field
            if 'is_deleted' in [field.name for field in model._meta.fields]:
                # Get the field object for 'is_deleted'
                is_deleted_field = model._meta.get_field('is_deleted')
                
                # Check if 'is_deleted' is a BooleanField and allows null values
                if isinstance(is_deleted_field, models.BooleanField) and is_deleted_field.null:
                    # Update all instances where 'is_deleted' is null, setting it to False
                    updated_count = model.objects.filter(is_deleted__isnull=True).update(is_deleted=False)
                    self.stdout.write(self.style.SUCCESS(f'Successfully updated {updated_count} instances of {model.__name__}.is_deleted'))

        print("Finished update_null_fields command.")

