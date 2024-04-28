from django.db.models import Count, Case, When, IntegerField, Sum, Q
from apps.electors.models import Elector
from apps.committees.models import (
    Committee,
    CommitteeSite,
)  # Import models if not yet imported
from django.http import JsonResponse


# #
# #
# Elector Family Branches
# #
# #
def get_electors_by_family_branches(request):
    """
    Fetches and counts elector data by family and family branches while providing overall election data.
    """
    family = request.GET.get("family") if request.GET.get("family") else None

    branches = (
        request.GET.get("branches", "").split(",")
        if request.GET.get("branches")
        else None
    )
    areas = (
        request.GET.get("areas", "").split(",") if request.GET.get("areas") else None
    )

    electors_by_family = restructure_data_by_family_branch_area(family, branches, areas)

    return electors_by_family


def restructure_data_by_family_branch_area(family, branches, areas):
    """
    Restructures elector data into a nested dictionary format.

    Args:
        elector_data (list): List of dictionaries containing elector data.

    Returns:
        dict: Nested dictionary with aggregated data by family and family branch.
    """

    elector_data = get_aggregated_data_by_family_branch_area(family, branches, areas)

    family_data = {}
    family_branch_data = {}
    area_data = {}
    family_branches_area_data = {}
    area_family_branches_data = {}

    # Iterate over the elector data
    for item in elector_data:
        family = item["family"]
        family_branch = item["branch"]
        total = item["total"]
        female = item["female"]
        male = item["male"]

        # Update family data
        if family not in family_data:
            family_data[family] = {"total": []}
        family_data[family]["total"].append(total)

        # Update family_branch data
        if family_branch not in family_branch_data:
            family_branch_data[family_branch] = {
                "total": [],
                "female": [],
                "male": [],
            }
        family_branch_data[family_branch]["total"].append(total)
        family_branch_data[family_branch]["female"].append(female)
        family_branch_data[family_branch]["male"].append(male)

    # Create series for family and family_branch categories
    family_categories = list(family_data.keys())
    family_branch_categories = list(family_branch_data.keys())

    all_family_branches = (
        list(
            Elector.objects.filter(family__icontains=family)
            .values_list("branch", flat=True)
            .distinct()
        )
        if family
        else list(Elector.objects.values_list("family_branch", flat=True).distinct())
    )

    seriesFemale = [
        sum(family_branch_data[div]["female"]) for div in family_branch_categories
    ]
    seriesMale = [
        sum(family_branch_data[div]["male"]) for div in family_branch_categories
    ]

    # Include dataSeriesByGender directly in the response structure
    family_branch_family_data_series = [
        {
            "name": family,
            "data": family_data[family]["total"],
        }
        for family in family_categories
    ]

    # Call calculate_electors_in_categories to get overall elector data (unmodified)
    aggregated_electors = calculate_electors_in_categories(elector_data)
    """
    Calculates and summarizes elector counts.

    Args:
        elector_data (list): List of dictionaries containing elector data.

    Returns:
        dict: Dictionary containing total electors, females, and males.
    """

    return {
        "electorsByFamilyBranches": {
            "categories": family_branch_categories,
            "dataSeries": family_branch_family_data_series,
            "dataSeriesByGender": [
                {"name": "إناث", "data": seriesFemale},
                {"name": "ذكور", "data": seriesMale},
            ],
        },
        "aggregatedElectors": aggregated_electors,
        "familyBranches": all_family_branches,
    }


def get_aggregated_data_by_family_branch_area(family=None, branches=None, areas=None):
    """
    Fetches and aggregates elector data based on provided filters.

    Args:
        family (str, optional): Family to filter by. Defaults to None.
        family_branches (list, optional): List of family branches to filter by. Defaults to None.
        areas (list, optional): List of areas to filter by. Defaults to None.

    Returns:
        dict: Dictionary containing aggregated elector data.
    """
    queryset = Elector.objects.all()
    if family:
        queryset = queryset.filter(family__icontains=family)

    if branches:
        queryset = queryset.filter(branch__in=branches)

    if areas:
        queryset = queryset.filter(areas__in=areas)

    result = (
        queryset.values("family", "branch")
        # queryset.values("family", "branch", "area")
        .annotate(
            total=Count("id"),
            female=Count(Case(When(gender="2", then=1), output_field=IntegerField())),
            male=Count(Case(When(gender="1", then=1), output_field=IntegerField())),
        ).order_by("-total")[
            :20
        ]  # Limit to first 25 entries
    )
    return result


def calculate_electors_in_categories(elector_data):
    """
    Calculate and summarize elector counts.
    """
    total_electors = sum(item["total"] for item in elector_data)
    total_female = sum(item["female"] for item in elector_data)
    total_male = sum(item["male"] for item in elector_data)
    return {
        "total": total_electors,
        "female": total_female,
        "male": total_male,
    }
