from apps.electors.models import Elector
from apps.electors.serializers import ElectorDataByCategory
from rest_framework import serializers

# Things to do
# 5. Optimize Database Queries
# Your fetch_selection_options function could be optimized by reducing database hits. If these data are not frequently updated, consider caching the results to avoid repeated database queries.


# #
# Elector Family Branches
# #
def restructure_electors_by_family(request):
    """Restructures elector data into a nested dictionary format using a DRY approach."""

    family = request.GET.get("family")
    branches = extract_query_params(request, "branches")
    areas = extract_query_params(request, "areas")
    committees = extract_query_params(request, "committees")

    instances = {
        "electorsByFamilyAllBranches": {
            "primary_data": "family_data",
            "secondary_data": "branch_data",
            "filter_fields": {"family"},
            "data_fields": {"family", "branch"},
        },
        "electorsByFamilyAllAreas": {
            "primary_data": "family_data",
            "secondary_data": "area_data",
            "filter_fields": {"family"},
            "data_fields": {"family", "area"},
        },
        "electorsByFamilyAllCommittees": {
            "primary_data": "family_data",
            "secondary_data": "committee_data",
            "filter_fields": {"family"},
            "data_fields": {"family", "committee_area"},
        },
        "electorsByFamilyBranch": {
            "primary_data": "family_data",
            "secondary_data": "branch_data",
            "filter_fields": {"family", "branches"},
            "data_fields": {"family", "branch"},
        },
        "electorsByFamilyArea": {
            "primary_data": "family_data",
            "secondary_data": "area_data",
            "filter_fields": {"family", "areas"},
            "data_fields": {"family", "area"},
        },
        "electorsByFamilyCommittee": {
            "primary_data": "family_data",
            "secondary_data": "committee_data",
            "filter_fields": {"family", "committees"},
            "data_fields": {"family", "committee_area"},
        },
        # "electorsByFamilyBranchArea": {
        #     "primary_data": "branch_data",
        #     "secondary_data": "branch_area_data",
        #     "filter_fields": {"family", "branches", "areas"},
        #     "data_fields": {"family", "branch", "area"},
        # },
        # "electorsByFamilyAreaBranch": {
        #     "primary_data": "area_data",
        #     "secondary_data": "area_branch_data",
        #     "filter_fields": {"family", "branches", "areas"},
        #     "data_fields": {"family", "branch", "area"},
        # },
        # "electorsByFamilyBranchCommittee": {
        #     "primary_data": "branch_data",
        #     "secondary_data": "committee_data",
        #     "filter_fields": {"family", "branches", "committees"},
        #     "data_fields": {"family", "branch", "committee_area"},
        # },
        # "electorsByFamilyCommitteeBranch": {
        #     "primary_data": "committee_data",
        #     "secondary_data": "branch_data",
        #     "filter_fields": {"family", "branches", "committees"},
        #     "data_fields": {"family", "branch", "committee_area"},
        # },
    }
    results = {}
    for key, params in instances.items():
        results[key] = process_elector_data(
            family,
            branches,
            areas,
            committees,
            params["primary_data"],
            params["secondary_data"],
            params["filter_fields"],
            params["data_fields"],
        )

    results.update(
        {
        "familyBranches": fetch_selection_options(family, "branch"),
        "familyAreas": fetch_selection_options(family, "area", branches=branches),
        "familyCommittees": fetch_selection_options(family, "committee_area", committees=committees),
        }
    )

    return results


def extract_query_params(request, param):
    value = request.GET.get(param, "")
    return value.split(",") if value else None


def process_elector_data(
    family,
    branches,
    areas,
    committees,
    primary_data,
    secondary_data,
    filter,
    data_fields,
):
    """Helper function to create a serializer instance and retrieve data."""
    instance = {
        "instance": (
            family,
            branches,
            areas,
            committees,
            primary_data,
            secondary_data,
            filter,
            data_fields,
        )
    }
    serializer = ElectorDataByCategory(instance)
    return serializer.to_representation(instance)

def extract_query_params(request, param):
    value = request.GET.get(param, "")
    return value.split(",") if value else None

def fetch_selection_options(family, field, branches=None, committees=None):
    """Fetch options for dropdowns based on context (family, branches, or committees)."""
    queryset = Elector.objects.all()
    if field == "branch" and family:
        queryset = queryset.filter(family__icontains=family)
    elif field == "area" and branches:
        queryset = queryset.filter(branch__in=branches)
    elif field == "committee_area" and branches:
        queryset = queryset.filter(committee_area__in=committees)

    return list(queryset.values_list(field, flat=True).distinct())


def prepare_parameters(request, filter_fields):
    """Extract parameters from the request based on required fields."""

    params = {}
    if "family" in filter_fields:
        params["family"] = request.GET.get("family")
    if "branches" in filter_fields:
        params["branches"] = extract_query_params(request, "branches")
    if "areas" in filter_fields:
        params["areas"] = extract_query_params(request, "areas")
    if "committees" in filter_fields:
        params["committees"] = extract_query_params(request, "committees")
    return params


# def process_elector_data(
#     params, primary_data, secondary_data, filter_fields, data_fields
# ):
#     """Helper function to create a serializer instance and retrieve data."""
#     instance = {
#         "instance": (
#             params.get("family"),
#             params.get("branches"),
#             params.get("areas"),
#             params.get("committees"),
#             primary_data,
#             secondary_data,
#             filter_fields,
#             data_fields,
#         )
#     }
#     serializer = ElectorDataByCategory(instance)
#     return serializer.to_representation(instance)


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