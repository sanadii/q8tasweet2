from django.db.models import Count, Case, When, IntegerField, Sum, Q
from apps.electors.models import Elector
from apps.electors.serializers import ElectorDataByCategory
from collections import defaultdict, Counter, OrderedDict
from rest_framework import serializers


# Things to do
# 5. Optimize Database Queries
# Your fetch_selection_options function could be optimized by reducing database hits. If these data are not frequently updated, consider caching the results to avoid repeated database queries.


# #
# Elector Family Branches
# #


def restructure_electors_by_family(request):
    """Restructures elector data into a nested dictionary format using a DRY approach."""

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
        "electorsByFamilyBranchArea": {
            "primary_data": "branch_data",
            "secondary_data": "area_data",
            "filter_fields": {"family", "branches", "areas"},
            "data_fields": {"family", "branch", "area"},
        },
        "electorsByFamilyBranchCommitee": {
            "primary_data": "family_data",
            "secondary_data": "committee_data",
            "filter_fields": {"family", "branches", "committees"},
            "data_fields": {"family", "branch", "committee_area"},
        },
        "electorsByFamilyAreaBranch": {
            "primary_data": "area_data",
            "secondary_data": "branch_data",
            "filter_fields": {"family", "branches", "areas"},
            "data_fields": {"family", "branch", "area"},
        },
        "electorsByFamilyCommitteeBranch": {
            "primary_data": "committee_data",
            "secondary_data": "branch_data",
            "filter_fields": {"family", "branches", "committee"},
            "data_fields": {"family", "branch", "committee_area"},
        },
    }

    results = {}
    for key, instance in instances.items():
        params = prepare_parameters(request, instance["data_fields"])
        results[key] = process_elector_data(
            params,
            instance["primary_data"],
            instance["secondary_data"],
            instance["filter_fields"],
            instance["data_fields"],
        )

    results.update(
        {
            "familyBranches": fetch_selection_options(params.get("family"), "branch"),
            "familyBranchesAreas": fetch_selection_options(
                params.get("family"), "area", params.get("branches")
            ),
            "familyCommittees": fetch_selection_options(
                params.get("family"), "committee_area", params.get("committees")
            ),
        }
    )

    return results


def extract_query_params(request, param):
    value = request.GET.get(param, "")
    return value.split(",") if value else None


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


def process_elector_data(
    params, primary_data, secondary_data, filter_fields, data_fields
):
    """Helper function to create a serializer instance and retrieve data."""
    instance = {
        "instance": (
            params.get("family"),
            params.get("branches"),
            params.get("areas"),
            params.get("committees"),
            primary_data,
            secondary_data,
            filter_fields,
            data_fields,
        )
    }
    serializer = ElectorDataByCategory(instance)
    return serializer.to_representation(instance)


def fetch_selection_options(family, field, branches=None):
    """Fetch options for dropdowns based on context (family or branches)."""
    queryset = Elector.objects
    if family:
        queryset = queryset.filter(family__icontains=family)
    if branches:
        queryset = queryset.filter(branch__in=branches)
    return list(queryset.values_list(field, flat=True).distinct())


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
