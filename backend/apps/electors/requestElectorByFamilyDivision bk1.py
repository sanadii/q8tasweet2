from django.db.models import Count, Case, When, IntegerField, Sum, Q
from apps.electors.models import Elector
from apps.committees.models import (
    Committee,
    CommitteeSite,
)  # Import models if not yet imported
from django.http import JsonResponse


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
    electors = get_aggregated_data_by_family_branch_area(family)
    electors_by_family = restructure_data_by_family_branch_area(electors)

    return electors_by_family


def get_all_family_branches(family=None):
    """
    Fetch all unique family branches for a given family.
    """
    if family:
        return list(
            Elector.objects.filter(family__icontains=family)
            .values_list("family_branch", flat=True)
            .distinct()
        )
    else:
        return list(
            Elector.objects.values_list("family_branch", flat=True).distinct()
        )


def get_aggregated_data_by_family_branch_area(family=None):
    """
    Aggregate data for electors filtered by family, limiting to top 25 entries based on total count.
    """
    queryset = Elector.objects.all()
    if family:
        queryset = queryset.filter(family__icontains=family)

    result = (
        queryset.values("family", "branch")
        .annotate(
            total=Count("id"),
            female=Count(Case(When(gender="2", then=1), output_field=IntegerField())),
            male=Count(Case(When(gender="1", then=1), output_field=IntegerField())),
        )
        .order_by("-total")[:25]  # Limit to first 25 entries
    )
    return result


def get_all_family_branches():
    """
    Retrieve all unique family branches.
    """
    branches = Elector.objects.values_list("branch", flat=True).distinct()
    return list(branches)


def restructure_data_by_family_branch_area(elector_data):
    """
    Restructure the list of electors data into the desired nested dictionary format,
    including a breakdown by gender within familyBranch_FamilyDataSeries.
    """
    family_data = {}
    family_branch_data = {}

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

    return {
        "electorsByBranchFamily": {
            "categories": family_categories,
            "dataSeries": family_branch_family_data_series,
            "dataSeriesByGender": [
                {"name": "إناث", "data": seriesFemale},
                {"name": "ذكور", "data": seriesMale},
            ],
        },
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

    # # Prepare the gender data series
    # seriesFemale = [
    #     sum(family_branch_data[div]["female"]) for div in family_branch_categories
    # ]
    # seriesMale = [
    #     sum(family_branch_data[div]["male"]) for div in family_branch_categories
    # ]

    # # Call calculate_electors_in_categories to get overall elector data
    # aggregated_electors = calculate_electors_in_categories(elector_data)

    # return {
    #     "electorsByBranchFamily": {
    #         "categories": family_categories,
    #         "dataSeries": dataSeries,
    #         "dataSeriesByGender": [
    #             {"name": "إناث", "data": seriesFemale},
    #             {"name": "ذكور", "data": seriesMale},
    #         ],
    #     },
    #     "electorsByFamilyBranches": {
    #         "categories": family_branch_categories,
    #         "dataSeries": dataSeries,
    #     },
    #     "aggregatedElectors": aggregated_electors,
    #     "familyBranches": all_family_branches,
    # }
