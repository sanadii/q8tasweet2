from django.core.management.base import BaseCommand
from django.db import connection
from apps.areas.models import Area  # Import your models here
from apps.committees.models import CommitteeSite  # Import your models here

class Command(BaseCommand):
    help = 'Fetches Committee Sites and their corresponding Area names.'

    def handle(self, *args, **options):
        # Fetch all Committee Sites
        committee_sites = CommitteeSite.objects.all()
        self.stdout.write(self.style.SUCCESS('Fetching Committee Sites and their Areas...'))
        
        for site in committee_sites:
            # Fetch the corresponding Area using the area_id from CommitteeSite
            try:
                area = Area.objects.using('default').get(id=site.area_id)
                area_name = area.name
            except Area.DoesNotExist:
                area_name = "Area not found"

            self.stdout.write(self.style.SUCCESS(f"Committee Site {site.name} is linked to Area: {area_name}"))

