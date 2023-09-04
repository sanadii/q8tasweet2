import os
import django
import random
from datetime import timedelta
from django.db import models
from django.utils import timezone

# Set the Django settings module
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from restapi.models import Elections

def update_elections():
    # Remove entries with no titles
    Elections.objects.filter(title__isnull=True).delete()

    # Update existing elections with random datetime
    for election in Elections.objects.all():
        created_date = timezone.now() - timedelta(days=random.randint(0, 100))
        updated_date = timezone.now() - timedelta(days=random.randint(0, 100))

        if created_date > updated_date:
            created_date, updated_date = updated_date, created_date  # Ensure that created_date is earlier than updated_date

        election.created_date = created_date
        election.updated_date = updated_date
        election.save()

if __name__ == "__main__":
    update_elections()
