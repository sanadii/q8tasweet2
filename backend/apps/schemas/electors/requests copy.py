from django.db.models import Count, Case, When, IntegerField, Sum, Q
from apps.schemas.electors.models import Elector
from apps.schemas.committees.models import (
    Committee,
    CommitteeSite,
)  # Import models if not yet imported
from django.http import JsonResponse


def get_aggregated_data(model, group_by_field=None):
    """
    Helper function to aggregate data by a given field or overall if no field is provided.
    """
    queryset = model.objects.all()
    if group_by_field:
        queryset = (
            queryset.values(group_by_field)
            .annotate(
                total=Count("id"),
                female=Count(
                    Case(When(gender="2", then=1), output_field=IntegerField())
                ),
                male=Count(Case(When(gender="1", then=1), output_field=IntegerField())),
            )
            .order_by("-total")
        )
    else:
        queryset = queryset.aggregate(
            total=Count("id"),
            female=Count(Case(When(gender="2", then=1), output_field=IntegerField())),
            male=Count(Case(When(gender="1", then=1), output_field=IntegerField())),
        )

    if group_by_field:
        return [
            {
                "category": entry[group_by_field],
                "total": entry["total"],
                "female": entry["female"],
                "male": entry["male"],
            }
            for entry in queryset
        ]
    else:
        return queryset


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


def get_aggregated_data_by_filters(families=None, areas=None):
    """
    Aggregate data for electors filtering by families and areas.
    """
    queryset = Elector.objects.all()

    if families:
        queryset = queryset.filter(last_name__in=families)
    if areas:
        queryset = queryset.filter(area__in=areas)

    result = (
        queryset.values("last_name", "area")
        .annotate(
            total=Count("id"),
            female=Count(Case(When(gender="2", then=1), output_field=IntegerField())),
            male=Count(Case(When(gender="1", then=1), output_field=IntegerField())),
        )
        .order_by("last_name", "area")
    )

    return list(result)

    return list(result)  # Make sure to convert QuerySet to list if returning directly


def get_aggregated_data_by_filters(families=None, areas=None):
    """
    Aggregate data for electors filtering by families and areas.
    """
    queryset = Elector.objects.all()

    if families:
        queryset = queryset.filter(last_name__in=families)
    if areas:
        queryset = queryset.filter(area__in=areas)

    result = (
        queryset.values("last_name", "area")
        .annotate(
            total=Count("id"),
            female=Count(Case(When(gender="2", then=1), output_field=IntegerField())),
            male=Count(Case(When(gender="1", then=1), output_field=IntegerField())),
        )
        .order_by("last_name", "area")
    )

    return result


def get_aggregated_family_data():
    families = (
        Elector.objects.values("last_name")
        .annotate(
            total=Count("id"),
            female=Count(Case(When(gender="2", then=1), output_field=IntegerField())),
            male=Count(Case(When(gender="1", then=1), output_field=IntegerField())),
        )
        .order_by("last_name")
    )

    family_data = {}
    for family in families:
        area_data = (
            Elector.objects.filter(last_name=family["last_name"])
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

        family_data[family["last_name"]] = {
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

    electors_by_categories = get_aggregated_data_by_filters(
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

    electors_by_categories = get_aggregated_data_by_filters(
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
    return get_aggregated_data(Elector, "last_name")


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
        request.GET.get("areas", "").split(",") if request.GET.get("areas") else None
    )
    num_areas = len(areas) if areas else 0

    electors_by_categories = get_aggregated_data_by_filters(families, areas)


    electors_by_family = restructure_elector_data(electors_by_categories)

    return electors_by_family


def restructure_elector_data(elector_data):
    """
    Restructure the list of electors data into the desired nested dictionary format.
    """
    # Initialize dictionaries to store data
    family_data = {}
    area_data = {}
    family_area_data = {}
    area_family_data = {}

    # Iterate over the elector data
    for item in elector_data:
        family = item["last_name"]
        area = item["area"]
        total = item["total"]
        male = item["male"]
        female = item["female"]

        # Update family data
        if family not in family_data:
            family_data[family] = {"total": [], "male": [], "female": []}
        family_data[family]["total"].append(total)
        family_data[family]["male"].append(male)
        family_data[family]["female"].append(female)

        # Update area data
        if area not in area_data:
            area_data[area] = {"total": 0, "male": 0, "female": 0}
        area_data[area]["total"] += total
        area_data[area]["male"] += male
        area_data[area]["female"] += female

        # Update family-area data
        family_area_key = f"{family}-{area}"
        if family_area_key not in family_area_data:
            family_area_data[family_area_key] = {"total": total, "male": male, "female": female}

        # Update area-family data
        if area not in area_family_data:
            area_family_data[area] = {"total": [], "male": [], "female": []}
        area_family_data[area]["total"].append(total)
        area_family_data[area]["male"].append(male)
        area_family_data[area]["female"].append(female)

    # Create series for family categories
    family_categories = list(family_data.keys())

    # Create series for area categories
    area_categories = list(area_data.keys())

    # Create series for familyDataSeries
    family_data_series = [{
        "name": family,
        "data": {
            "total": family_data[family]["total"],
            "male": family_data[family]["male"],
            "female": family_data[family]["female"]
        }
    } for family in family_categories]

    # Create series for areaDataSeries
    area_data_series = [{
        "name": area,
        "data": {
            "total": [area_data[area]["total"]],
            "male": [area_data[area]["male"]],
            "female": [area_data[area]["female"]]
        }
    } for area in area_categories]

    # Create series for familyAreaDataSeries
    family_area_data_series = [{
        "name": family,
        "data": {
            "total": sum(family_area_data[key]["total"] for key in family_area_data if key.startswith(f"{family}-")),
            "male": sum(family_area_data[key]["male"] for key in family_area_data if key.startswith(f"{family}-")),
            "female": sum(family_area_data[key]["female"] for key in family_area_data if key.startswith(f"{family}-"))
        }
    } for family in family_categories]

    # Create series for areaFamilyDataSeries
    area_family_data_series = [{
        "name": area,
        "data": {
            "total": area_family_data[area]["total"],
            "male": area_family_data[area]["male"],
            "female": area_family_data[area]["female"]
        }
    } for area in area_categories]

    aggregated_electors = calculate_electors_in_categories(elector_data)

    return {
        "familyCategories": family_categories,
        "areaCategories": area_categories,
        "familyDataSeries": family_data_series,
        "areaDataSeries": area_data_series,
        "familyAreaDataSeries": family_area_data_series,
        "areaFamilyDataSeries": area_family_data_series,
        "aggregatedElectors": aggregated_electors,
    }


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
