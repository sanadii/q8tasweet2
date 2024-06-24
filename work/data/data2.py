import os
import django
import random
import datetime
from django.db import models

# Set the Django settings module
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from restapi.models import Campaigns

def create_random_campaigns():
    for _ in range(100):
        campaign_name = "Campaign " + str(random.randint(1, 100))
        campaign_description = "This is a random campaign."
        campaign_start_date = datetime.datetime.now()
        campaign_end_date = campaign_start_date + datetime.timedelta(days=random.randint(7, 30))
        campaign_budget = random.randint(1000, 100000)
        campaign_status = random.choice(["Active", "Inactive"])
        social_media_handles = "@random_social_media"
        campaign_website = "https://example.com/campaign"

        outreach_events = random.randint(1, 10)
        attendees = random.randint(50, 500)
        media_coverage = random.randint(100, 1000)
        campaign_results = "These are the campaign results."

        campaign = Campaigns.objects.create(
            campaign_name=campaign_name,
            campaign_description=campaign_description,
            campaign_start_date=campaign_start_date,
            campaign_end_date=campaign_end_date,
            campaign_budget=campaign_budget,
            campaign_status=campaign_status,
            social_media_handles=social_media_handles,
            campaign_website=campaign_website,
            outreach_events=outreach_events,
            attendees=attendees,
            media_coverage=media_coverage,
            campaign_results=campaign_results,
        )

if __name__ == "__main__":
    create_random_campaigns()
