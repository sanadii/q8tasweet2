from apps.schemas.electors.models import Elector
from apps.schemas.electors.serializers import ElectorDataByCategory
from django.db.models import Count

def restructure_elector_by_all(request, election):
    """Restructures elector data into a nested dictionary format without applying filters."""
    
    is_elector_address = election.is_elector_address
    is_elector_committee = election.is_elector_committee
      
    instances = {
        # Single Field
        "electorsByAllFamilies": {
            "data_fields": ["family"],
        },
        "electorsByAllBranches": {
            "data_fields": ["branch"],
        },
    }
    
    if is_elector_address:
        instances.update({
            "electorsByAllAreas": {
                "data_fields": ["area"],
            },
            # Two Fields
            "electorsByAllFamilyAreas": {
                "data_fields": ["family", "area"],
            },
            "electorsByAllBranchAreas": {
                "data_fields": ["branch", "area"],
            },
        })

    if is_elector_committee:
        instances.update({
            "electorsByAllCommittees": {
                "data_fields": ["committee_area"],
            },
            "electorsByAllFamilyCommittees": {
                "data_fields": ["family", "committee_area"],
            },
            "electorsByAllBranchCommittees": {
                "data_fields": ["branch", "committee_area"],
            },
        })

    results = {}

    # Processing elector data
    for key, params in instances.items():
        results[key] = process_elector_data(params["data_fields"])

    all_families = fetch_all_families()
    results["family_options"] = all_families  # Add family names to the results

    return results


def fetch_all_families():
    """
    Fetches all unique family names from the Elector model along with their counts,
    ordered by the count in descending order.
    Returns each family as a dictionary with 'label' as 'familyName - count'
    and 'value' as just the 'familyName'.
    """
    queryset = Elector.objects.values('family').annotate(
        count=Count('family')  # Count the occurrences of each family
    ).order_by('-count')  # Order by count in descending order

    # Format the label to include both the family name and the count
    result = [
        {'label': f"{family['family']} - {family['count']}", 'value': family['family']}
        for family in queryset
    ]

    return result


def process_elector_data(data_fields):
    """Helper function to create a serializer instance and retrieve data without filters."""
    instance = {
        "instance": (
            None,  # No families
            None,  # No branches
            None,  # No areas
            None,  # No committees
            set(),  # No filter_fields
            data_fields,
        )
    }
    serializer = ElectorDataByCategory(instance)
    return serializer.to_representation(instance)

