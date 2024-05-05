from django.db.models import Count, Case, When, IntegerField, Sum, Q
from apps.electors.models import Elector
from apps.electors.serializers import ElectorDataByCategory
from collections import defaultdict, Counter, OrderedDict

from rest_framework import serializers


# #
# Elector Family Branches
# #
def restructure_electors_by_category(family, branches, areas, committees):
    """Restructures elector data into a nested dictionary format."""

    # instance_family_all_committees = {"instance": (family, None, None, None, "familyAllCommittees")}
    # family_branches_only = {"instance": (family, None, None, None, "families")}


    # family_all_committees_serializer = ElectorDataByCategory(instance_family_all_committees)
    # family_branch_serializer = ElectorDataByCategory(family_branches_only)
       
    
    # electors_by_family_all_committees = family_serializer.to_representation(instance_family_all_committees)  
    # electors_by_family_branch = family_branch_serializer.to_representation(family_branches_only)
    
    
    
    # 
    # 
    # 
    
    instance_family_only = {"instance": (family, None, None, None, "family")}
    instance_family_all_branches = {"instance": (family, None, None, None, "familyBranches")}
    instance_family_all_areas = {"instance": (family, None, None, None, "familyAreas")}

    instance_family_branches_areas = {"instance": (family, branches, areas, None, "branchAreas")}
    instance_areas_family_branches = {"instance": (family, branches, areas, None, "areaBranches")}

    family_serializer = ElectorDataByCategory(instance_family_only)
    family_all_branches_serializer = ElectorDataByCategory(instance_family_all_branches)
    family_all_areas_serializer = ElectorDataByCategory(instance_family_all_areas)

    family_branch_area_serializer = ElectorDataByCategory(instance_family_branches_areas)
    area_family_branch_serializer = ElectorDataByCategory(instance_areas_family_branches)
    
    
    electors_by_family = family_serializer.to_representation(instance_family_only)
    electors_by_family_all_branches = family_all_branches_serializer.to_representation(instance_family_all_branches)
    electors_by_family_all_areas = family_all_areas_serializer.to_representation(instance_family_all_areas)

    electors_by_family_branch_area = family_branch_area_serializer.to_representation(instance_family_branches_areas)
    electors_by_area_family_branch = area_family_branch_serializer.to_representation(instance_areas_family_branches)

    return {
        # All
        "electorsByFamily": electors_by_family,
        "electorsByFamilyAllBranches": electors_by_family_all_branches,
        "electorsByFamilyAllAreas": electors_by_family_all_areas,

        
        "electorsByFamilyBranchArea": electors_by_family_branch_area,
        "electorsByAreaFamilyBranch": electors_by_area_family_branch,
        
        
        # "electorsByFamilyAllBranches": electors_by_family_all_committees,
        # "electorsByFamilyAllAreas": electors_by_family_all_committees,
        # "electorsByFamilyAllCommittees": electors_by_family_all_committees,
        # "electorsByFamilyBranch": electors_by_family_branch,

        "familyBranches": fetch_selection_options(family, "branch"),
        "familyBranchesAreas": fetch_selection_options(family, "area", branches),
        "familyCommittees": fetch_selection_options(family, "committee_area", committees),
    }


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
        seriesMale = [
            sum(branch_data[div]["male"]) for div in family_branch_categories
        ]

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
