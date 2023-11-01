from django.core.management.base import BaseCommand
from django.apps import apps
from django.db import models

class Command(BaseCommand):
    help = 'Updates null "deleted" fields to False'

    def handle(self, *args, **options):
        for model in apps.get_models():
            # Check if the model has a 'deleted' field
            if 'deleted' in [field.name for field in model._meta.fields]:
                # Get the field object for 'deleted'
                deleted_field = model._meta.get_field('deleted')
                
                # Check if 'deleted' is a BooleanField and allows null values
                if isinstance(deleted_field, models.BooleanField) and deleted_field.null:
                    # Update all instances where 'deleted' is null, setting it to False
                    updated_count = model.objects.filter(deleted__isnull=True).update(deleted=False)
                    self.stdout.write(self.style.SUCCESS(f'Successfully updated {updated_count} instances of {model.__name__}.deleted'))

