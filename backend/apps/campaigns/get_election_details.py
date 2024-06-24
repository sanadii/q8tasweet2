# from apps.campaigns.models import Campaign
from apps.elections.serializers import ElectionSerializer
from apps.elections.candidates.serializers import ElectionCandidateSerializer
from apps.elections.candidates.models import Election, ElectionCandidate, ElectionParty

def get_election_details(context, election, response_data):
    """
    Populate response_data with details of the current and previous elections.
    
    Parameters:
    - context: Serialization context.
    - election: Current election instance.
    - response_data: Dictionary to be updated with election details.
    """
    current_election = get_current_election(election, context)
    previous_election = get_previous_election(election)
    previous_election_data = None

    if previous_election:
        previous_election_data = get_election_data(previous_election, context, is_current=False)

    election_details_data = {
        "current_election": current_election,
        "previous_election": previous_election_data,
    }

    response_data.update(election_details_data)

def get_current_election(election, context):
    """
    Get details of the current election including candidates.

    Parameters:
    - election: Current election instance.
    - context: Serialization context.
    
    Returns:
    - Dictionary with election details and candidates.
    """
    current_election_data = get_election_data(election, context, is_current=True)
    return current_election_data

def get_previous_election(election):
    """
    Retrieve the previous election based on the sub_category and due_date.

    Parameters:
    - election: Current election instance.
    
    Returns:
    - Previous election instance or None if not found.
    """
    return (
        Election.objects.filter(
            sub_category=election.sub_category, due_date__lt=election.due_date
        )
        .order_by("-due_date")
        .first()
    )

def get_election_data(election, context, is_current):
    """
    Get details and candidates of a given election.

    Parameters:
    - election: Election instance.
    - context: Serialization context.
    - is_current: Boolean indicating if the election is current or previous.
    
    Returns:
    - Dictionary with election details and candidates.
    """
    candidates = ElectionCandidate.objects.filter(
        election=election
    ).select_related("election")

    candidates_data = [
        ElectionCandidateSerializer(candidate, context={**context, 'is_current': is_current}).data
        for candidate in candidates
    ]

    return {
        "election_details": ElectionSerializer(election, context=context).data,
        "election_candidates": candidates_data,
    }