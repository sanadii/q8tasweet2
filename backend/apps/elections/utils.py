from slugify import slugify
from django.apps import apps

# Campaign App
from apps.campaigns.models import Campaign, CampaignMember
from apps.campaigns.serializers import CampaignSerializer, CampaignMemberSerializer

# Election App
from apps.elections.models import (
    ElectionCandidate,
    ElectionParty,
    ElectionPartyCandidate,
)

from apps.committees.models import (
    Committee,
    CommitteeSubset,
    # CommitteeResult,
    # PartyCommitteeResult,
    # PartyCandidateCommitteeResult,
)

from apps.elections.serializers import (
    ElectionSerializer,
    CategoriesSerializer,
    SubCategoriesSerializer,
    ElectionCandidateSerializer,
    ElectionPartySerializer,
    ElectionPartyCandidateSerializer,
)

from apps.committees.serializers import (
    CommitteeSerializer,
    CommitteeSubsetSerializer,
    # CommitteeResultSerializer,
)



def generate_slug(value):
    """
    Generate a unique slug for a given value.
    """
    # Slugify the value
    Election = apps.get_model('elections', 'Election')

    slug = slugify(value, separator="-", lowercase=True, max_length=50)

    # Check if the slug already exists in the Election model
    existing_slugs = Election.objects.filter(slug__startswith=slug).values_list('slug', flat=True)

    if slug not in existing_slugs:
        return slug

    # If the slug already exists, append a number to make it unique
    counter = 1
    new_slug = f"{slug}-{counter}"
    while new_slug in existing_slugs:
        counter += 1
        new_slug = f"{slug}-{counter}"

    return new_slug

def get_election_committee_results(committees):
    transformed_results = {}

    # Get a list of all candidate IDs
    all_candidates = ElectionCandidate.objects.all()
    all_candidate_ids = [str(candidate.id) for candidate in all_candidates]

    # Create a dictionary to store total votes for each candidate
    total_votes_per_candidate = {candidate_id: 0 for candidate_id in all_candidate_ids}

    for committee in committees:
        committee_id = str(committee["id"])
        committee_results = ElectionCommitteeResult.objects.filter(election_committee=committee_id)
        results_serializer = ElectionCommitteeResultSerializer(committee_results, many=True)

        # Initialize the committee in the results with default votes for each candidate
        transformed_results[committee_id] = {candidate_id: 0 for candidate_id in all_candidate_ids}

        for result in results_serializer.data:
            candidate_id = str(result["election_candidate"])
            votes = result["votes"]

            # Update votes for the current candidate in the current committee
            transformed_results[committee_id][candidate_id] = votes

            # Update total votes for the candidate
            total_votes_per_candidate[candidate_id] += votes

    # Sort candidates based on total votes
    sorted_candidates_by_votes = sorted(total_votes_per_candidate, key=total_votes_per_candidate.get)

    # Reconstruct the results based on sorted candidate order
    sorted_transformed_results = {}
    for committee_id, results in transformed_results.items():
        sorted_transformed_results[committee_id] = {candidate_id: results[candidate_id] for candidate_id in sorted_candidates_by_votes}

    return sorted_transformed_results
