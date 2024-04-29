# Campaign Serializers
from rest_framework import serializers
from apps.electors.models import Elector

from apps.committees.serializers import CommitteeSerializer
from django.db.models import Count, Case, When, IntegerField, Sum, Q
from apps.electors.models import Elector
from collections import defaultdict, Counter, OrderedDict


class ElectorSerializer(serializers.ModelSerializer):
    committee = serializers.PrimaryKeyRelatedField(read_only=True, allow_null=True)

    class Meta:
        model = Elector
        fields = "__all__"


class ElectorDataByCategory(serializers.BaseSerializer):
    def to_representation(self, instance):
        # Unpack data for easier access and manipulation
        family, branches, areas, committees, main = instance["instance"]

        elector_data = get_aggregated_data(family, branches, areas, committees)
        count_aggregated_electors = count_aggregated_data(elector_data)

        # Initialize containers
        family_data = defaultdict(list)
        branch_data = defaultdict(list)
        area_data = defaultdict(list)
        committee_data = defaultdict(list)

        # Update data for family, branch, and area (combined logic)
        for item in elector_data:
            update_data(family_data, item.get("family", ""), item)
            update_data(branch_data, item.get("branch", ""), item)
            update_data(area_data, item.get("area", ""), item)
            update_data(committee_data, item.get("committee_area", ""), item)
                
        # Build category names and corresponding series data
        categories = []  # Initialize categories to ensure it's always defined
        if main == "families":
            dataSeries = [
                {"name": title, "data": family_data[title]["total"]}
                for title in family_data
            ]
            categories = list(branch_data.keys())
           
        if main == "familieAreas":
            dataSeries = [
                {"name": title, "data": family_data[title]["total"]}
                for title in family_data
            ]
            categories = list(area_data.keys())
                       
        elif main == "branchAreas":
            dataSeries = [
                {"name": title, "data": branch_data[title]["total"]}
                for title in branch_data
            ]
            categories = list(area_data.keys())

        elif main == "areaBranches":
            dataSeries = [
                {"name": title, "data": area_data[title]["total"]}
                for title in area_data
            ]
            categories = list(branch_data.keys())
     
        else:
            dataSeries = []  # Define dataSeries as empty if none of the conditions met


        # Gender data compilation across all categories
        seriesFemale = [
            sum(branch_data[div]["female"]) for div in branch_data
        ]
        seriesMale = [
            sum(branch_data[div]["male"]) for div in branch_data
        ]

        return {
            "counter": count_aggregated_electors,
            "categories": categories,
            "dataSeries": dataSeries,
            "dataSeriesByGender": [
                {"name": "إناث", "data": seriesFemale},
                {"name": "ذكور", "data": seriesMale},
            ],
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


# class FamilyBranchSerializer(serializers.Serializer):
#     family = serializers.CharField()
#     total = serializers.IntegerField()
#     female = serializers.IntegerField()
#     male = serializers.IntegerField()


# class ElectorAggregatedSerializer(serializers.ModelSerializer):
#     dataSeriesByGender = serializers.SerializerMethodField()
#     familyBranches = serializers.SerializerMethodField()

#     class Meta:
#         model = Elector
#         fields = ("dataSeriesByGender", "familyBranches")

#     def get_dataSeriesByGender(self, obj):
#         queryset = Elector.objects.filter(
#             family=obj.family
#         )  # Ensure obj is a valid queryset
#         females = queryset.filter(gender="2").count()
#         males = queryset.filter(gender="1").count()
#         return [
#             {"name": "إناث", "data": [females]},
#             {"name": "ذكور", "data": [males]},
#         ]

#     def get_familyBranches(self, obj):
#         branches = (
#             Elector.objects.filter(family=obj.family)
#             .values_list("branch", flat=True)
#             .distinct()
#         )
#         return list(branches)


# # Ensure your view is passing the correct data to the serializer:
