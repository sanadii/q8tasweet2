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
        data_fields = tuple(data_fields)

        query_set = self.get_aggregated_elector_data(
            family, branches, areas, committees, filter_fields
        )

        elector_data = self.get_annotated_elector_data(query_set, data_fields)

        data_mappings = self.initialize_data_mappings(primary_data, secondary_data)

        # Initialize containers
        # data_mappings = {
        #     "family_data": defaultdict(lambda: defaultdict(int)),
        #     "branch_data": defaultdict(lambda: defaultdict(int)),
        #     "area_data": defaultdict(lambda: defaultdict(int)),
        #     "committee_data": defaultdict(lambda: defaultdict(int)),
        #     "branch_area_data": defaultdict(lambda: defaultdict(int)),
        #     "area_branch_data": defaultdict(lambda: defaultdict(int)),
        #     "branch_area_data": defaultdict(lambda: defaultdict(int)),
        #     "area_branch_data": defaultdict(lambda: defaultdict(int)),
        #     "branch_committee_data": defaultdict(lambda: defaultdict(int)),
        #     "committee_branch_data": defaultdict(lambda: defaultdict(int)),
        # }

        # Update data for each category using a hashable type for keys
        self.update_elector_data(
            elector_data, data_mappings, data_fields, primary_data, secondary_data
        )
        primary_data_dict = data_mappings[primary_data]
        secondary_data_dict = data_mappings[secondary_data]

        # prepare data for response
        count_aggregated_electors = self.prepare_elector_data_counter(elector_data)
        data_series = self.prepare_elector_data_series(
            primary_data_dict, secondary_data_dict, secondary_data
        )
        categories = self.prepare_elector_data_categories(
            primary_data_dict, secondary_data_dict, secondary_data
        )
        data_series_by_gender = self.prepare_elector_data_gender_series(
            secondary_data_dict, secondary_data
        )

        return {
            "data_mappings": data_mappings,
            "primary_data_dict": primary_data_dict,
            "secondary_data_dict": secondary_data_dict,
            "counter": count_aggregated_electors,
            "categories": categories[:20],
            "dataSeries": data_series[:20],
            "dataSeriesByGender": data_series_by_gender[:20],
        }

    def get_aggregated_elector_data(
        self,
        family=None,
        branches=None,
        areas=None,
        committees=None,
        filter_fields=set(),
    ):
        """Fetch and aggregate elector data based on dynamic filters."""
        queryset = Elector.objects.all()

        # Apply filters dynamically based on data_fields
        if "family" in filter_fields and family:
            queryset = queryset.filter(family__icontains=family)
        if "branches" in filter_fields and branches:
            queryset = queryset.filter(branch__in=branches)
        if "areas" in filter_fields and areas:
            queryset = queryset.filter(area__in=areas)
        if "committees" in filter_fields and committees:
            queryset = queryset.filter(committee_area__in=committees)

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
            .order_by("-total")  # Adjust the slice as necessary
        )

        return aggregated_data

    def initialize_data_mappings(
        self,
        primary_data,
        secondary_data,
    ):
        data_types = set()
        data_types.add(primary_data)
        data_types.add(secondary_data)

        return {
            data_type: defaultdict(lambda: defaultdict(int)) for data_type in data_types
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

    def update_elector_data(
        self, elector_data, data_mappings, data_fields, primary_data, secondary_data
    ):

        for item in elector_data:
            for field in data_fields:
                if field == "committee_area":
                    category = "committee_data"
                else:
                    category = f"{field}_data"  # Properly append '_data' to match keys in data_mappings

                # Check if the category key exists in data_mappings to prevent KeyError
                if category in data_mappings:
                    self.update_data(
                        data_mappings[category],
                        item.get(field, ""),  # Corrected to use 'field' directly
                        item,
                    )
                else:
                    print(f"Warning: {category} not found in data_mappings.")

    def update_data(self, data_dict, key, data):
        if key not in data_dict:
            data_dict[key] = {"total": 0, "female": 0, "male": 0}
        data_dict[key]["total"] += data["total"]
        data_dict[key]["female"] += data["female"]
        data_dict[key]["male"] += data["male"]

    def prepare_elector_data_counter(self, elector_data):
        """Summarizes elector counts."""
        total = sum(item["total"] for item in elector_data)
        female = sum(item["female"] for item in elector_data)
        male = sum(item["male"] for item in elector_data)
        return {
            "total": total,
            "female": female,
            "male": male,
        }

    def prepare_elector_data_series(
        self, primary_data_dict, secondary_data_dict, secondary_data
    ):
        data_series = []

        if secondary_data in [
            "branch_area_data",
            "area_branch_data",
            "committee_branch_data",
            "branch_committee_data",
        ]:
            # Iterate through each area in the secondary data, assuming it's structured with areas as keys
            for area, families_data in secondary_data_dict.items():
                area_series = {"name": area, "data": []}

                # Assuming families_data is a list of dictionaries with each family's data
                for family_data in families_data:
                    # Append each family's data as a separate dictionary within the 'data' list
                    area_series["data"].append(family_data["total"])

                data_series.append(area_series)
        else:
            # For single field data
            for key in primary_data_dict:
                data_series.append(
                    {
                        "name": key,
                        "data": [
                            data["total"] for data in secondary_data_dict.values()
                        ],
                    }
                )

        return data_series

    def prepare_elector_data_categories(
        self, primary_data_dict, secondary_data_dict, secondary_data
    ):
        if secondary_data in [
            "branch_area_data",
            "area_branch_data",
            "committee_branch_data",
            "branch_committee_data",
        ]:
            categories = list(primary_data_dict.keys())
        else:
            categories = list(secondary_data_dict.keys())

        return categories

    def prepare_elector_data_gender_series(self, secondary_data_dict, secondary_data):
        """Prepare gender-specific data series, ensuring each entry corresponds to a category."""
        series_female = []
        series_male = []

        if secondary_data in [
            "branch_area_data",
            "area_branch_data",
            "committee_branch_data",
            "branch_committee_data",
        ]:
            return [
                {"name": "إناث", "data": 0},
                {"name": "ذكور", "data": 0},
            ]
        else:
            # Iterate over each category in the dictionary
            for category, stats in secondary_data_dict.items():
                # Append female and male counts directly
                series_female.append(stats.get("female", 0))
                series_male.append(stats.get("male", 0))

            return [
                {"name": "إناث", "data": series_female},
                {"name": "ذكور", "data": series_male},
            ]