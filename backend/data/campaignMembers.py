import os
import django

# Set the Django settings module
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")  # Ensure this is the correct path
django.setup()

import random
from django.utils import timezone
from restapi.models import CampaignMembers, Campaigns
from users.models import User

def create_random_campaign_members(number_of_entries=100):
    users = User.objects.all()
    campaigns = Campaigns.objects.all()
    roles = ['candidate', 'supervisor', 'guarantor', 'attendant', 'sorter']
    statuses = ['Active', 'Inactive', 'Pending']

    for _ in range(number_of_entries):
        CampaignMembers.objects.create(
            user=random.choice(users),
            campaign=random.choice(campaigns),
            role=random.choice(roles),
            status=random.choice(statuses),
            rank=random.randint(1, 100),
            notes="Random notes here",
            created_by=random.choice(users),
            updated_by=random.choice(users),
            deleted_by=random.choice(users),
            deleted_date=timezone.now() if random.choice([True, False]) else None,
            deleted=random.choice([True, False])
        )

create_random_campaign_members(50)  # Creates 50 random entries
