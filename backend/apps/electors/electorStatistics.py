from apps.electors.models import Elector
from apps.electors.serializers import ElectorDataByCategory
from rest_framework import serializers

# Things to do
# 5. Optimize Database Queries
# Your fetch_selection_options function could be optimized by reducing database hits. If these data are not frequently updated, consider caching the results to avoid repeated database queries.


# #
# Elector Family Branches
# #
def restructure_elector_statistics(request):
    """Restructures elector data into a nested dictionary format using a DRY approach."""

    filter_fields: {""}

    instances = {
        # No Filter
        "electorsByFamily": {
            "data_fields": {"family"},
        },
        "electorsByBranch": {
            "data_fields": {"branch", "family"},
        },
        "electorsByArea": {
            "data_fields": {"family", "area"},
        },
        "electorsByCommittee": {
            "data_fields": {"family", "committee_area"},
        },
        
    }
    results = {}

    # Elector Data
    for key, params in instances.items():
        results[key] = process_elector_data(
            families,
            branches,
            areas,
            committees,
            params["filter_fields"],
            params["data_fields"],
        )

    # Field Options
    results.update(
        {
            "familyBranches": fetch_selection_options(families, "branch"),
            "familyAreas": fetch_selection_options(families, "area", branches=branches),
            "familyCommittees": fetch_selection_options(
                families, "committee_area", committees=committees
            ),
        }
    )

    return results


def extract_query_params(request, param):
    value = request.GET.get(param, "")
    return value.split(",") if value else None


def process_elector_data(
    families,
    branches,
    areas,
    committees,
    filter_fields,
    data_fields,
):
    """Helper function to create a serializer instance and retrieve data."""
    instance = {
        "instance": (
            families,
            branches,
            areas,
            committees,
            filter_fields,
            data_fields,
        )
    }
    serializer = ElectorDataByCategory(instance)
    return serializer.to_representation(instance)


def extract_query_params(request, param):
    value = request.GET.get(param, "")
    return value.split(",") if value else None


def fetch_selection_options(families, field, branches=None, committees=None):
    """Fetch options for dropdowns based on context (family, branches, or committees)."""
    queryset = Elector.objects.all()
    if field == "branch" and families:
        queryset = queryset.filter(family__in=families)
    elif field == "area" and branches:
        queryset = queryset.filter(branch__in=branches)
    elif field == "committee_area" and branches:
        queryset = queryset.filter(committee_area__in=committees)

    return list(queryset.values_list(field, flat=True).distinct())


def prepare_parameters(request, filter_fields):
    """Extract parameters from the request based on required fields."""

    params = {}
    if "families" in filter_fields:
        params["families"] = request.GET.get("families")
    if "branches" in filter_fields:
        params["branches"] = extract_query_params(request, "branches")
    if "areas" in filter_fields:
        params["areas"] = extract_query_params(request, "areas")
    if "committees" in filter_fields:
        params["committees"] = extract_query_params(request, "committees")
    return params


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
