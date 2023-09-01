import os
import django
import random
from django.utils import timezone

# Set the Django settings module
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from restapi.models import Candidates, Elections, Campaigns, ElectionCandidates

def create_random_election_candidate_relations():
    election_ids = Elections.objects.values_list('id', flat=True)
    candidate_ids = Candidates.objects.values_list('id', flat=True)
    campaign_ids = Campaigns.objects.values_list('id', flat=True)

    for _ in range(100):  # Replace 100 with the number of random relations you want to create
        election_id = random.choice(election_ids)
        candidate_id = random.choice(candidate_ids)
        campaign_id = random.choice(campaign_ids)

        votes = random.randint(0, 1000)
        position = f"Position {random.randint(1, 10)}"
        is_winner = random.choice([True, False])
        remarks = f"Remarks {random.randint(1, 5)}"
        status = f"Status {random.randint(1, 3)}"
        del_flag = random.randint(0, 1)
        created_by = random.randint(1, 10)
        updated_by = random.randint(1, 10)

        created_date = timezone.now()
        updated_date = timezone.now()

        ElectionCandidates.objects.create(
            election_id=election_id,
            candidate_id=candidate_id,
            campaign_id=campaign_id,
            votes=votes,
            position=position,
            is_winner=is_winner,
            remarks=remarks,
            status=status,
            del_flag=del_flag,
            created_by=created_by,
            created_date=created_date,
            updated_by=updated_by,
            updated_date=updated_date,
        )

# Call the function to create random ElectionCandidates relations
create_random_election_candidate_relations()
