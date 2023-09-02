import os
import django
import random

# Set the Django settings module
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from restapi.models import ElectionCandidates, Campaigns, CampaignMembers

def set_random_status(obj):
    obj.status = random.randint(1, 5)
    obj.save()

# Get all objects from the tables
election_candidates = ElectionCandidates.objects.all()
campaigns = Campaigns.objects.all()
campaign_members = CampaignMembers.objects.all()

# Iterate through ElectionCandidates and update the status field
for candidate in election_candidates:
    set_random_status(candidate)

# Iterate through Campaigns and update the status field
for campaign in campaigns:
    set_random_status(campaign)

# Iterate through CampaignMembers and update the status field
for member in campaign_members:
    set_random_status(member)
