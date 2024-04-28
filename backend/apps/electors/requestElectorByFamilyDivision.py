from django.db.models import Count, Case, When, IntegerField, Sum, Q
from apps.electors.models import Elector
from apps.electors.serializers import ElectorDataByCategory
from collections import defaultdict, Counter, OrderedDict

# #
# Elector Family Branches
# #
def restructure_data_by_family_branch_area(family, branches, areas, committees):
    """Restructures elector data into a nested dictionary format."""

    instance_family_only = {"instance": (family, None, None, None, "families")}
    instance_family_all_committees = {"instance": (family, None, None, None, "familyAllCommittees")}
    
    family_branches_only = {"instance": (family, None, None, None, "families")}
    family_branches_areas = {"instance": (family, branches, areas, None, "branchAreas")}
    areas_family_branches = {"instance": (family, branches, areas, None, "areaBranches")}

    family_serializer = ElectorDataByCategory(instance_family_only)
    family_all_committees_serializer = ElectorDataByCategory(instance_family_all_committees)
    # familyByBranch
    # familyByArea
    # familyByCommittee  
    family_branch_serializer = ElectorDataByCategory(family_branches_only)
    family_branch_area_serializer = ElectorDataByCategory(family_branches_areas)
    area_family_branch_serializer = ElectorDataByCategory(areas_family_branches)
    
    
    
    electors_by_family = family_serializer.to_representation(instance_family_only)
    electors_by_family_all_committees = family_serializer.to_representation(instance_family_all_committees)
    
    
    electors_by_family_branch = family_branch_serializer.to_representation(family_branches_only)
    electors_by_family_branch_area = family_branch_area_serializer.to_representation(family_branches_areas)
    electors_by_area_family_branch = area_family_branch_serializer.to_representation(areas_family_branches)

    return {
        "electorsByFamily": electors_by_family,
        "electorsByFamilyAllCommittees": electors_by_family_all_committees,
        "electorsByFamilyBranch": electors_by_family_branch,
        "electorsByFamilyBranchArea": electors_by_family_branch_area,
        "electorsByAreaFamilyBranch": electors_by_area_family_branch,
        "familyBranches": fetch_selection_options(family, "branch"),
        "familyBranchesAreas": fetch_selection_options(family, "area", branches),
        "familyCommittees": fetch_selection_options(family, "committee_area", committees),
    }

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
