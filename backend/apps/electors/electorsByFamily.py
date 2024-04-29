from django.db.models import Count, Case, When, IntegerField, Sum, Q
from apps.electors.models import Elector
from apps.electors.serializers import ElectorDataByCategory
from collections import defaultdict, Counter, OrderedDict
from rest_framework import serializers


# #
# Elector Family Branches
# #
def restructure_electors_by_family(family, branches, areas, committees):
    """Restructures elector data into a nested dictionary format using a DRY approach."""

    instances = {
        "electorsByFamilyAllBranches": {
            "family": family,
            "primary_data": "family_data",
            "secondary_data": "branch_data",
            "filter_key": {"family", "branch"},  # Corrected from 'branches' to 'branch'
        },
        # "electorsByFamilyAllAreas": {
        #     "family": family,
        #     "primary_data": "family_data",
        #     "secondary_data": "area_data",
        #     "filter_key": {"family", "area"},
        # },
        # "electorsByFamilyAllCommittees": {
        #     "family": family,
        #     "primary_data": "family_data",
        #     "secondary_data": "committee_data",
        #     "filter_key": {"family", "committee"},
        # },
        # "electorsByFamilyBranch": {
        #     "family": family,
        #     "branches": branches,
        #     "primary_data": "family_data",
        #     "secondary_data": "branch_data",
        #     "filter_key": {"family", "branch"},
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
            params["filter_key"],
        )

    results.update(
        {
            "familyBranches": fetch_selection_options(family, "branch"),
            "familyBranchesAreas": fetch_selection_options(family, "area", branches),
            "familyCommittees": fetch_selection_options(
                family, "committee_area", committees
            ),
        }
    )

    return results


def process_elector_data(
    family, branches, areas, committees, primary_data, secondary_data, filter
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
        )
    }
    serializer = ElectorDataByCategory(instance)
    return serializer.to_representation(instance)


def count_aggregated_data(elector_data):
    """Summarizes elector counts."""
    total = sum(item["total"] for item in elector_data)
    female = sum(item["female"] for item in elector_data)
    male = sum(item["male"] for item in elector_data)
    return {
        "total": total,
        "female": female,
        "male": male,
    }


def get_aggregated_data(family=None, branches=None, areas=None, committees=None):
    """Fetch and aggregate elector data based on filters."""
    queryset = Elector.objects.all()

    # Apply filters if they exist
    if family:
        queryset = queryset.filter(family__icontains=family)
    if branches:
        queryset = queryset.filter(branch__in=branches)
    if areas:
        queryset = queryset.filter(area__in=areas)
    if committees:
        queryset = queryset.filter(committee_area__in=committees)

    print("committees: ", committees)
    # Define fields to group by dynamically based on provided filters
    grouping_fields = ["family", "branch"]  # Adjust as needed
    if areas:  # Only include area in the output if it's a part of the filter
        grouping_fields.append("area")

    if committees:  # Only include area in the output if it's a part of the filter
        grouping_fields.append("committee_area")
    print("grouping_fields, ", grouping_fields)
    # Annotate and aggregate data based on the dynamic fields
    return (
        queryset.values(*grouping_fields)
        .annotate(
            total=Count("id"),
            female=Count(Case(When(gender="2", then=1), output_field=IntegerField())),
            male=Count(Case(When(gender="1", then=1), output_field=IntegerField())),
        )
        .order_by("-total")[:20]
    )


def update_data(data_dict, key, data):
    # Ensure each key initializes with a default dictionary if it doesn't exist
    if key not in data_dict:
        data_dict[key] = defaultdict(
            list
        )  # Initializes missing keys with a dictionary whose values are lists

    # Assuming 'data' is a dictionary with structure { 'total': x, 'female': y, 'male': z }
    data_dict[key]["total"].append(data["total"])
    data_dict[key]["female"].append(data["female"])
    data_dict[key]["male"].append(data["male"])


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


def update_data(data_dict, key, data):
    # Ensure each key initializes with a default dictionary if it doesn't exist
    if key not in data_dict:
        data_dict[key] = defaultdict(
            list
        )  # Initializes missing keys with a dictionary whose values are lists

    # Assuming 'data' is a dictionary with structure { 'total': x, 'female': y, 'male': z }
    data_dict[key]["total"].append(data["total"])
    data_dict[key]["female"].append(data["female"])
    data_dict[key]["male"].append(data["male"])


def get_aggregated_data_by_family_branch_area(family=None, branches=None, areas=None):
    """Fetch and aggregate elector data based on filters."""
    queryset = Elector.objects.all()

    # Apply filters if they exist
    if family:
        queryset = queryset.filter(family__icontains=family)
    if branches:
        queryset = queryset.filter(branch__in=branches)
    if areas:
        queryset = queryset.filter(area__in=areas)

    # Define fields to group by dynamically based on provided filters
    grouping_fields = ["family", "branch"]
    if areas:  # Only include area in the output if it's a part of the filter
        grouping_fields.append("area")

    # Annotate and aggregate data based on the dynamic fields
    return (
        queryset.values(*grouping_fields)
        .annotate(
            total=Count("id"),
            female=Count(Case(When(gender="2", then=1), output_field=IntegerField())),
            male=Count(Case(When(gender="1", then=1), output_field=IntegerField())),
        )
        .order_by("-total")[:20]
    )


def update_data_structure(data_dict, key, total, female, male):
    if key not in data_dict:
        data_dict[key] = {"total": [], "female": [], "male": []}
    data_dict[key]["total"].append(total)
    data_dict[key]["female"].append(female)
    data_dict[key]["male"].append(male)


def fetch_selection_options(family, field, branches=None):
    """Fetch options for dropdowns based on context (family or branches)."""
    queryset = Elector.objects
    if family:
        queryset = queryset.filter(family__icontains=family)
    if branches and field == "area":
        queryset = queryset.filter(branch__in=branches)
    return list(queryset.values_list(field, flat=True).distinct())
