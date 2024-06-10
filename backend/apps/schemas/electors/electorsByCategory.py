from apps.schemas.electors.models import Elector
from apps.schemas.electors.serializers import ElectorDataByCategory
from rest_framework import serializers
from django.db import models
from django.db.models import F, Value
from django.db.models.functions import Concat

# Things to do
# 5. Optimize Database Queries
# Your fetch_selection_options function could be optimized by reducing database hits. If these data are not frequently updated, consider caching the results to avoid repeated database queries.


# #
# Elector Family Branches
# #
def restructure_electors_by_category(request, election):
    """Restructures elector data into a nested dictionary format using a DRY approach."""

    families = extract_query_params(request, "families")
    branches = extract_query_params(request, "branches")
    areas = None
    committees = None

    instances = {
        #
        # Filter By Family
        #
        # Filter By One Field
        "electorsByFamily": {
            "filter_fields": {"families"},
            "data_fields": ["family"],
        },
        "electorsByBranch": {
            "filter_fields": {"branches"},
            "data_fields": {"branch"},
        },
        # Combined Filter
        # "electorsByBranchArea": {
        #     "filter_fields": {"branches", "areas", "families"},
        #     "data_fields": ["branch", "area", "family"],
        # },
        # "electorsByAreaBranch": {
        #     "filter_fields": ["branches", "areas", "families"],
        #     "data_fields": ["area", "branch", "family"],
        # },
        # # Committees
        # "electorsByBranchCommittee": {
        #     "filter_fields": {"families", "branches", "committees"},
        #     "data_fields": ["branch", "committee_area", "family"],
        # },
        # "electorsByCommitteeBranch": {
        #     "filter_fields": {"families", "branches", "committees"},
        #     "data_fields": ["committee_area", "branch", "family"],
        # },
    }

    results = {}
    results.update(
        {
            "branch_options": fetch_selection_options(families, "branch"),
        }
    )

    is_elector_address = election.is_elector_address
    is_elector_committee = election.is_elector_committee

    if is_elector_address:
        areas = extract_query_params(request, "areas")
        area_options = (fetch_selection_options(families, "area", branches=branches),)
        instances.update(
            {
                "electorsByArea": {
                    "filter_fields": {"areas"},
                    "data_fields": ["area"],
                },
                #
                # Filter By Two Field
                "electorsByFamilyArea": {
                    "filter_fields": {"families", "areas"},
                    "data_fields": ["family", "area"],
                },
                "electorsByBranchArea": {
                    "filter_fields": {"branches", "areas"},
                    "data_fields": {"branch", "area"},
                },
            }
        )
        results.update(
            {
                "area_options": area_options,
            }
        )

    if is_elector_committee:
        committees = extract_query_params(request, "committees")
        committee_options = (
            fetch_selection_options(families, "committee_area", committees=committees),
        )
        instances.update(
            {
                "electorsByCommittee": {
                    "filter_fields": {"committees"},
                    "data_fields": {"committee_area"},
                },
                # Filter By Two Field
                "electorsByFamilyCommittee": {
                    "filter_fields": {"families", "committees"},
                    "data_fields": ["family", "committee_area"],
                },
                "electorsByBranchCommittee": {
                    "filter_fields": {"branches", "committees"},
                    "data_fields": {"branch", "committee_area"},
                },
            }
        )
        results.update(
            {
                "committee_options": committee_options,
            }
        )

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


# def fetch_selection_options(families, field, branches=None, committees=None):
#     """Fetch options for dropdowns based on context (family, branches, or committees)."""
#     queryset = Elector.objects.all()
#     if field == "branch" and families:
#         queryset = queryset.filter(family__in=families)
#     elif field == "area" and branches:
#         queryset = queryset.filter(branch__in=branches)
#     elif field == "committee_area" and branches:
#         queryset = queryset.filter(committee_area__in=committees)

#     return list(queryset.values_list(field, flat=True).distinct())


def fetch_selection_options(families, field, branches=None, committees=None):
    """Fetch options for dropdowns based on context (family, branches, or committees)."""
    queryset = Elector.objects.all()

    if field == "branch" and families:
        queryset = queryset.filter(family__in=families)
        queryset = (
            queryset.annotate(
                label=Concat(
                    F("branch"),
                    Value(" - "),
                    F("family"),
                    output_field=models.CharField(),
                ),
                value=F("branch"),
            )
            .values("label", "value")
            .distinct()
        )
        return list(queryset)

    elif field == "area" and branches:
        queryset = queryset.filter(branch__in=branches)
        queryset = (
            queryset.annotate(label=F("area"), value=F("area"))
            .values("label", "value")
            .distinct()
        )
        return list(queryset)

    elif field == "committee_area" and branches:
        queryset = queryset.filter(committee_area__in=committees)
        queryset = (
            queryset.annotate(label=F("committee_area"), value=F("committee_area"))
            .values("label", "value")
            .distinct()
        )
        return list(queryset)

    elif field == "family":
        queryset = queryset.values_list("family", flat=True).distinct()
        return [{"label": family, "value": family} for family in queryset]

    # Add a fallback to ensure no non-serializable data is returned
    return []


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
