from apps.schemas.electors.models import Elector
from apps.schemas.electors.serializers import ElectorDataByCategory
from rest_framework import serializers
from django.db import models
from django.db.models import F, Value, Count
from django.db.models.functions import Concat


def restructure_elector_by_all(request):
    """Restructures elector data into a nested dictionary format without applying filters."""
    
    # families = extract_query_params(request, "families")

    instances = {
        # Single Field
        "electorsByAllFamilies": {
            "data_fields": ["family"],
        },
        "electorsByAllBranches": {
            "data_fields": ["branch"],
        },
        "electorsByAllAreas": {
            "data_fields": ["area"],
        },
        "electorsByAllCommittees": {
            "data_fields": ["committee_area"],
        },
        # Two Fields
        "electorsByAllFamilyAreas": {
            "data_fields": ["family", "area"],
        },
        "electorsByAllFamilyCommittees": {
            "data_fields": ["family", "committee_area"],
        },
        "electorsByAllBranchAreas": {
            "data_fields": ["branch", "area"],
        },
        "electorsByAllBranchCommittees": {
            "data_fields": ["branch", "committee_area"],
        },
        # Test
        # "electorsByAllBranchCommittees": {
        #     "primary_data_fields": {"branch", "committee_area" },
        #     "secondary_data_fields": {"committee_area", "branch"},
        # },
    }
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


class ElectorDataSeriesByGenderSerializer(serializers.BaseSerializer):
    def to_representation(self, branch_data):
        family_branch_categories = list(branch_data.keys())

        # Calculate totals for each gender across all family branches
        seriesFemale = [
            sum(branch_data[div]["female"]) for div in family_branch_categories
        ]
        seriesMale = [sum(branch_data[div]["male"]) for div in family_branch_categories]

        return [
            {"name": "إناث", "data": seriesFemale},
            {"name": "ذكور", "data": seriesMale},
        ]


# Assuming usage somewhere in views or API endpoints
