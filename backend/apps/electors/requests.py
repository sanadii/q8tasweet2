from django.db.models import Count, Case, When, IntegerField, Sum, Q
from apps.electors.models import Elector
from apps.committees.models import (
    Committee,
    CommitteeSite,
)  # Import models if not yet imported
from django.http import JsonResponse


def get_aggregated_data(model, group_by_field=None):
    """
    Helper function to aggregate data by a given field or overall if no field is provided,
    returning organized data including top 25 categories and counts for total, female, and male.
    """
    if group_by_field:
        # Aggregating data by group field and ordering by total count in descending order
        queryset = (
            model.objects.values(group_by_field)
            .annotate(
                total=Count("id"),
                female=Count(
                    Case(When(gender="2", then=1), output_field=IntegerField())
                ),
                male=Count(Case(When(gender="1", then=1), output_field=IntegerField())),
            )
            .order_by("-total")[:25]
        )  # Only take the top 25
    else:
        # Aggregate total counts across all instances if no group field provided
        aggregated_data = model.objects.aggregate(
            total=Count("id"),
            female=Count(Case(When(gender="2", then=1), output_field=IntegerField())),
            male=Count(Case(When(gender="1", then=1), output_field=IntegerField())),
        )
        return aggregated_data  # Returns a single dictionary with aggregated counts

    # Preparing the structured response for grouped data
    categories = [entry[group_by_field] for entry in queryset]
    dataSeries = [entry["total"] for entry in queryset]
    seriesFemale = [entry["female"] for entry in queryset]
    seriesMale = [entry["male"] for entry in queryset]

    return {
        "categories": categories,
        "dataSeries": [{"name": "الناخبين", "data": dataSeries}],
        "dataSeriesByGender": [
            {"name": "إناث", "data": seriesFemale},
            {"name": "ذكور", "data": seriesMale},
        ],
    }


def get_aggregated_committee_data():
    """
    Aggregate data for committees including the total count, and counts by gender if applicable.
    """
    committees = Committee.objects.annotate(
        total=Count("id"),
        female=Count(
            Case(When(committee_site__gender="2", then=1), output_field=IntegerField())
        ),
        male=Count(
            Case(When(committee_site__gender="1", then=1), output_field=IntegerField())
        ),
    ).aggregate(
        total_committees=Count("total"),
        total_female=Sum("female"),
        total_male=Sum("male"),
    )
    return {
        "total": committees["total_committees"],
        "female": committees["total_female"],
        "male": committees["total_male"],
    }


# def get_aggregated_data_by_family_area(families=None, areas=None, family=None):
#     """
#     Aggregate data for electors filtering by families and areas.
#     """
#     queryset = Elector.objects.all()

#     if families:
#         queryset = queryset.filter(family__in=families)
#     if areas:
#         queryset = queryset.filter(area__in=areas)

#     if family:
#         queryset = Elector.objects.filter(family=family) if family else Elector.objects.all()

#     result = queryset.values("family", "area").annotate(
#         total=Count("id"),
#         female=Count(Case(When(gender="2", then=1), output_field=IntegerField())),
#         male=Count(Case(When(gender="1", then=1), output_field=IntegerField()))
#     ).order_by("family", "area")

#     return result


def get_aggregated_family_data():
    families = (
        Elector.objects.values("family")
        .annotate(
            total=Count("id"),
            female=Count(Case(When(gender="2", then=1), output_field=IntegerField())),
            male=Count(Case(When(gender="1", then=1), output_field=IntegerField())),
        )
        .order_by("family")
    )

    family_data = {}
    for family in families:
        area_data = (
            Elector.objects.filter(family=family["family"])
            .values("area")
            .annotate(
                total=Count("id"),
                female=Count(
                    Case(When(gender="2", then=1), output_field=IntegerField())
                ),
                male=Count(Case(When(gender="1", then=1), output_field=IntegerField())),
            )
            .order_by("area")
        )

        family_data[family["family"]] = {
            "total": family["total"],
            "female": family["female"],
            "male": family["male"],
            "areas": {area["area"]: area for area in area_data},
        }

    return family_data


def count_electors_by_family(request):
    """
    API view to fetch elector statistics by categories.
    """
    families = (
        request.GET.get("families", "").split(",")
        if request.GET.get("families")
        else []
    )
    areas = request.GET.get("areas", "").split(",") if request.GET.get("areas") else []

    electors_by_categories = get_aggregated_data_by_family_area(
        families=families, areas=areas
    )
    structured_data = restructure_elector_data(electors_by_categories)
    return structured_data


def count_electors_by_family(request):
    """
    API view to fetch elector statistics by categories.
    """
    families = (
        request.GET.get("families", "").split(",")
        if request.GET.get("families")
        else []
    )
    areas = request.GET.get("areas", "").split(",") if request.GET.get("areas") else []

    electors_by_categories = get_aggregated_data_by_family_area(
        families=families, areas=areas
    )
    structured_data = restructure_elector_data(electors_by_categories)
    return structured_data


def count_total_areas():
    """
    Count the total number of areas from the CommitteeSite Model !!!
    """
    total_areas = CommitteeSite.objects.values("area_name").distinct().count()
    return total_areas


def count_election_statistics():
    """
    Aggregate election statistics across various dimensions.
    """
    return {
        "electors": get_aggregated_data(Elector),
        "committeeSites": get_aggregated_data(CommitteeSite),
        "committees": get_aggregated_committee_data(),
        "areas": count_total_areas(),
    }


def count_electors_by_family():
    """Count electors grouped by family name within the current schema."""
    return get_aggregated_data(Elector, "family")


def count_electors_by_area():
    """Count electors grouped by area name within the current schema."""
    return get_aggregated_data(Elector, "area")


def count_electors_by_committee():
    """Count electors grouped by committee area name within the current schema."""
    return get_aggregated_data(Elector, "committee__area_name")


def count_electors_by_gender():
    """Count electors grouped by gender within the current schema."""
    return [
        {
            "category": "Female" if gender["gender"] == "2" else "Male",
            "total": gender["total"],
            "female": gender["total"] if gender["gender"] == "2" else 0,
            "male": gender["total"] if gender["gender"] == "1" else 0,
        }
        for gender in Elector.objects.values("gender")
        .annotate(total=Count("id"))
        .order_by("gender")
    ]

    # election_data = {
    #     "total": Elector.objects.count(),
    #     "male": Elector.objects.filter(gender="1").count(),
    #     "female": Elector.objects.filter(gender="2").count(),
    # }

    # area_data = {"count": CommitteeSite.objects.values("area").distinct().count()}

    # committee_data = {
    #     "total": Committee.objects.count(),
    #     "male": Committee.objects.filter(committee_site__gender="1").count(),
    #     "female": Committee.objects.filter(committee_site__gender="2").count(),
    # }


# def calculate_electors_in_categories(elector_data):
#     """
#     Placeholder function to calculate aggregated elector data.
#     You may define your own logic here as needed.
#     """
#     # Implement your aggregation logic based on the elector_data
#     return {}


def calculate_electors_in_categories(elector_data):
    """
    Restructure the list of electors data into the desired nested dictionary format.
    """
    total_electors = 0  # Initialize total electors count
    total_female = 0  # Initialize total female electors count
    total_male = 0  # Initialize total male electors count

    for item in elector_data:

        # Update total electors count
        total_electors += item["total"]

        # Update female and male electors count
        total_female += item["female"]
        total_male += item["male"]

    return {
        "total": total_electors,
        "female": total_female,
        "male": total_male,
    }


# #
# #
# getElector By Category
# #
# #


def count_electors_by_category(request):
    """
    Fetches and counts elector data by family and area while providing overall election data.
    """
    families = (
        request.GET.get("families", "").split(",")
        if request.GET.get("families")
        else None
    )
    areas = (
        request.GET.get("areas", "").split(",")
        if request.GET.get("areas")
        else None
    )
    
    num_areas = len(areas) if areas else 0

    electors_by_categories = get_aggregated_data_by_family_area(families, areas)
    electors_by_family = restructure_data_by_family_area(electors_by_categories)

    return electors_by_family


def get_aggregated_data_by_family_area(families=None, areas=None, family=None):
    """
    Aggregate data for electors filtering by families and areas.
    """
    queryset = Elector.objects.all()

    if families:
        queryset = queryset.filter(family__in=families)
    if areas:
        queryset = queryset.filter(area__in=areas)

    # Family/FamilyDivision
    if family:
        queryset = queryset.filter(family__in=family)

    result = (
        queryset.values("family", "area")
        .annotate(
            total=Count("id"),
            female=Count(Case(When(gender="2", then=1), output_field=IntegerField())),
            male=Count(Case(When(gender="1", then=1), output_field=IntegerField())),
        )
        .order_by("family", "area")
    )

    return result


# #
# #
# #
# #
def restructure_data_by_family_area(elector_data):
    """
    Restructure the list of electors data into the desired nested dictionary format,
    enhancing the breakdown by family within areas similar to the areaFamilyDataSeries.
    """
    # Initialize dictionaries to store data
    family_data = {}
    area_data = {}
    family_area_data = {}
    area_family_data = {}

    # Iterate over the elector data
    for item in elector_data:
        family = item["family"]
        area = item["area"]
        total = item["total"]

        # Update family data
        if family not in family_data:
            family_data[family] = {"total": []}
        family_data[family]["total"].append(total)

        # Update area data
        if area not in area_data:
            area_data[area] = {"total": []}
        area_data[area]["total"].append(total)

        # # Update family-area data
        # family_area_key = (family, area)
        # if family_area_key not in family_area_data:
        #     family_area_data[family_area_key] = {"total": []}
        # family_area_data[family_area_key]["total"].append(total)

        # Update area-family data
        if family not in family_area_data:
            family_area_data[family] = {"total": []}
        family_area_data[family]["total"].append(total)

        # Update area-family data
        if area not in area_family_data:
            area_family_data[area] = {"total": []}
        area_family_data[area]["total"].append(total)

    # Create series for family and area categories
    family_categories = list(family_data.keys())
    area_categories = list(area_data.keys())

    # Create series for familyDataSeries
    family_data_series = [
        {"name": family, "data": family_data[family]["total"]}
        for family in family_categories
    ]

    # Create series for areaDataSeries
    area_data_series = [
        {"name": area, "data": area_data[area]["total"]} for area in area_categories
    ]

    # Create series for familyAreaDataSeries
    family_area_data_series = [
        {"name": area, "data": area_family_data[area]["total"]}
        for area in area_categories
    ]

    # Create series for areaFamilyDataSeries
    area_family_data_series = [
        {"name": family, "data": family_area_data[family]["total"]}
        for family in family_data
    ]

    aggregated_electors = calculate_electors_in_categories(elector_data)

    return {
        "familyAreaDetailed": {
            "categories": family_categories,
            "dataSeries": family_area_data_series,
        },
        "areaFamilyDetailed": {
            "categories": area_categories,
            "dataSeries": area_family_data_series,
        },
        # "familyDataSeries": family_data_series,
        # "areaDataSeries": area_data_series,
        "aggregatedElectors": aggregated_electors,
    }

