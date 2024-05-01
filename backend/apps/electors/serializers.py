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
        (
            family,
            branches,
            areas,
            committees,
            primary_data,
            secondary_data,
            filter_fields,
            data_fields,
        ) = instance["instance"]

        # Ensure data_fields is a tuple, which is hashable and can be used safely
        data_fields = tuple(data_fields)  # Convert set to tuple

        query_set = self.get_aggregated_elector_data(
            family, branches, areas, committees, filter_fields
        )
        
        elector_data = self.get_annotated_elector_data(query_set, data_fields)
        count_aggregated_electors = self.count_aggregated_data(elector_data)




        # data_mappings = {
        #     "family_data": {"data": defaultdict(lambda: defaultdict(int)), "key_tuple": ("family",)},
        #     "branch_data": {"data": defaultdict(lambda: defaultdict(int)), "key_tuple": ("branch",)},
        #     "area_data": {"data": defaultdict(lambda: defaultdict(int)), "key_tuple": ("area",)},
        #     "committee_data": {"data": defaultdict(lambda: defaultdict(int)), "key_tuple": ("committee_area",)}
        # }

        # # Define the key_tuple outside the loop for efficiency (assuming it's constant)
        # key_tuple = data_mappings["family_data"]["key_tuple"]  # Or any other category's key_tuple (initially)

        # for item in elector_data:
        #     # Determine category based on a condition (replace with your logic)
        #     category = "branch_data"  # Example (replace with logic to choose category)
        #     category_data = data_mappings[category]["data"]
        #     category_key_tuple = data_mappings[category]["key_tuple"]

        #     # Use the appropriate key_tuple and data based on the chosen category
        #     self.update_data(category_data, tuple(item.get(field, "") for field in category_key_tuple), item)


        # Initialize containers
        data_mappings = {
            "family_data": defaultdict(lambda: defaultdict(int)),
            "branch_data": defaultdict(lambda: defaultdict(int)),
            "area_data": defaultdict(lambda: defaultdict(int)),
            "committee_data": defaultdict(lambda: defaultdict(int)),
        }
        

        
        for item in elector_data:
            family_key_tuple = item.get("family", "")
            branch_key_tuple = item.get("branch", "")
            area_key_tuple = item.get("area", "")
            committee_area_tuple = item.get("committee_area", "")
            self.update_data(data_mappings["family_data"], family_key_tuple, item)
            self.update_data(data_mappings["branch_data"], branch_key_tuple, item)
            self.update_data(data_mappings["area_data"], area_key_tuple, item)
            self.update_data(
                data_mappings["committee_data"], committee_area_tuple, item
            )

        primary_data_dict = data_mappings[primary_data]
        secondary_data_dict = data_mappings[secondary_data]
        
        print("secondary_data_dict: ", data_mappings[secondary_data])

        data_series = [
            {
                "name": key,
                "data": [data["total"] for data in secondary_data_dict.values()],
            }
            for key in primary_data_dict
        ]
        categories = list(secondary_data_dict.keys())

        data_series_by_gender = self.prepare_gender_data_series(secondary_data_dict)

        return {
            # "1": primary_data_dict,
            "2": data_mappings[secondary_data],
            "counter": count_aggregated_electors,
            "categories": categories,
            "dataSeries": data_series,
            "dataSeriesByGender": data_series_by_gender,
        }

    def get_aggregated_elector_data(
        self,
        family=None,
        branches=None,
        areas=None,
        committees=None,
        filter_fields=set()
    ):
        """Fetch and aggregate elector data based on dynamic filters."""
        queryset = Elector.objects.all()

        # Apply filters dynamically based on data_fields
        # what i want to do is not like this
        # if family, filter family, if branches, filter branches
        if "family" in filter_fields and family:
            queryset = queryset.filter(family__icontains=family)
        if "branches" in filter_fields and branches:
            queryset = queryset.filter(branch__in=branches)
        if "areas" in filter_fields and areas:
            queryset = queryset.filter(area__in=areas)
        if "committees" in filter_fields and committees:
            queryset = queryset.filter(committee_area__in=committees)

        # Define fields to group by dynamically based on provided data_fields
        # grouping_fields = ["family", "branch"]
        
        print("queryset: ", queryset)
        return queryset

    def get_annotated_elector_data(self, queryset, data_fields=set()):
        """Annotate and aggregate data based on the dynamic fields."""
        grouping_fields = list(data_fields)

        aggregated_data = (
            queryset.values(*grouping_fields)
            .annotate(
                total=Count("id"),
                female=Count(
                    Case(When(gender="2", then=1), output_field=IntegerField())
                ),
                male=Count(Case(When(gender="1", then=1), output_field=IntegerField())),
            )
            .order_by("-total")[:20]  # Adjust the slice as necessary
        )

        return aggregated_data

    def count_aggregated_data(self, elector_data):
        """Summarizes elector counts."""
        total = sum(item["total"] for item in elector_data)
        female = sum(item["female"] for item in elector_data)
        male = sum(item["male"] for item in elector_data)
        return {
            "total": total,
            "female": female,
            "male": male,
        }
        
    def update_data(self, data_dict, key, data):
        if key not in data_dict:
            data_dict[key] = {
                "total": 0,
                "female": 0,
                "male": 0,
            }  # Properly initialize the dictionary
        data_dict[key]["total"] += data.get("total", 0)
        data_dict[key]["female"] += data.get("female", 0)
        data_dict[key]["male"] += data.get("male", 0)

    def prepare_gender_data_series(self, secondary_data_dict):
        """Prepare gender-specific data series, ensuring each entry corresponds to a category."""
        series_female = []
        series_male = []

        # Iterate over each category in the dictionary
        for category, stats in secondary_data_dict.items():
            # Append female and male counts directly
            series_female.append(stats.get("female", 0))
            series_male.append(stats.get("male", 0))

        return [
            {"name": "إناث", "data": series_female},
            {"name": "ذكور", "data": series_male},
        ]
