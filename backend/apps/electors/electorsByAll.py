from apps.electors.models import Elector
from apps.electors.serializers import ElectorDataByCategory
from rest_framework import serializers


def restructure_elector_by_all(request):
    """Restructures elector data into a nested dictionary format without applying filters."""
    instances = {
        "electorsByFamily": {
            "data_fields": ["family"],
        },
        "electorsByBranch": {
            "data_fields": ["branch", "family"],
        },
        "electorsByArea": {
            "data_fields": ["family", "area"],
        },
        "electorsByCommittee": {
            "data_fields": ["family", "committee_area"],
        },
        "electorsByAllFamilyArea": {
            "data_fields": ["family", "area"],
        },
        "electorsByAllFamilyCommittee": {
            "data_fields": ["family", "committee_area"],
        },
        "electorsByAllBranchArea": {
            "data_fields": ["family", "area"],
        },
        "electorsByAllBranchCommittee": {
            "data_fields": ["family", "committee_area"],
        },
    }
    results = {}

    # Processing elector data
    for key, params in instances.items():
        results[key] = process_elector_data(params["data_fields"])

    return results


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
