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
        #     "family_data": {"data": defaultdict(lambda: defaultdict(int)), "key_tuple": ("family", "")},
        #     "branch_data": {"data": defaultdict(lambda: defaultdict(int)), "key_tuple": ("branch", "")},
        #     "area_data": {"data": defaultdict(lambda: defaultdict(int)), "key_tuple": ("area", "")},
        #     "committee_data": {"data": defaultdict(lambda: defaultdict(int)), "key_tuple": ("committee_area", "")},
        # }

        # print("I want to print the_great_key_tuple:")
        # for item in elector_data:
        #     for category, settings in data_mappings.items():
        #         # Construct the key tuple from the item based on the fields specified in the key_tuple
        #         key_tuple = (item.get("family", ""))
        #         self.update_data(data_mappings["area_data"], key_tuple, item)

        #         self.update_data(settings['data'], key_tuple, item)

        # for item in elector_data:
        #     self.update_data(data_mappings["family_data"], item.get("family", ""), item)
        #     self.update_data(data_mappings["branch_data"], item.get("branch", ""), item)
        #     self.update_data(data_mappings["area_data"], item.get("area", "branch"), item)
        #     self.update_data(data_mappings["committee_data"], item.get("committee_area", ""), item)
        #     # self.update_data_with_two_fields(data_mappings["branch_area_data"], item.get("branch", ""), item.get("area", ""), item)
        #     # self.update_data_with_two_fields(data_mappings["area_branch_data"], item.get("area", ""), item.get("branch", ""), item)

        # combined_data_mappings = {
        #     "branch_area_data": defaultdict(lambda: defaultdict(int)),
        #     "area_branch_data": defaultdict(lambda: defaultdict(int)),
        # }

        # inner_defaultdict = defaultdict(lambda: defaultdict(int))
        # data_mappings = {
        #     "family_data": {"data": defaultdict(lambda: defaultdict(int)), "fields": ("family",)},
        #     "branch_data": {"data": defaultdict(lambda: defaultdict(int)), "fields": ("branch",)},
        #     "area_data": {"data": defaultdict(lambda: defaultdict(int)), "fields": ("area",)},
        #     "committee_data": {"data": defaultdict(lambda: defaultdict(int)), "fields": ("committee_area",)},
        #     # "branch_area_data": {"data": defaultdict(lambda: defaultdict(int)), "fields": ("branch", "area")},
        #     # "area_branch_data": {"data": defaultdict(lambda: defaultdict(int)), "fields": ("area", "branch")},
        # }

        # # Update data for each category using a hashable type for keys
        # for item in elector_data:
        #     for category, settings in data_mappings.items():
        #         field_names = settings["fields"]
        #         print ("field_names: ", field_names)
        #         key_tuple = tuple(item.get(field, "") for field in field_names)

        #         # if category in ["branch_area_data", "area_branch_data"]:
        #         #     # Dynamic key creation and update for complex field relationships
        #         #     self.update_data_with_two_fields(settings["data"], key_tuple, item)
        #         # else:
        #             # Simple key creation and update for single-dimensional data mappings
        #         self.update_data(settings["data"], key_tuple[0], item)  # Pass only the first element since key_tuple will only have one element

        #
        #
        #
        data_mappings = {
            "family_data": defaultdict(lambda: defaultdict(int)),
            "branch_data": defaultdict(lambda: defaultdict(int)),
            "area_data": defaultdict(lambda: defaultdict(int)),
            "committee_data": defaultdict(lambda: defaultdict(int)),
            "branch_area_data": defaultdict(lambda: defaultdict(int)),
            "area_branch_data": defaultdict(lambda: defaultdict(int)),
        }

        for item in elector_data:
            self.update_data(data_mappings["family_data"], item.get("family", ""), item)
            self.update_data(data_mappings["branch_data"], item.get("branch", ""), item)
            self.update_data(data_mappings["area_data"], item.get("area", "branch"), item)
            self.update_data(data_mappings["committee_data"], item.get("committee_area", ""), item)
            
            
            self.update_data_with_two_fields(data_mappings["branch_area_data"],
                                             item.get("branch", ""),
                                             item.get("area", ""),
                                             item
                                             )
            self.update_data_with_two_fields(data_mappings["area_branch_data"],
                                             item.get("area", ""),
                                             item.get("branch", ""),
                                             item
                                             )
            
        #     # "branch_area_data": {"data": defaultdict(lambda: defaultdict(int)), "fields": ("branch", "area")},
        #     # "area_branch_data": {"data": defaultdict(lambda: defaultdict(int)), "fields": ("area", "branch")},

        primary_data_dict = data_mappings[primary_data]
        secondary_data_dict = data_mappings[secondary_data]

        data_series = self.get_elector_data_series(
            secondary_data_dict, primary_data_dict
        )
        categories = list(secondary_data_dict.keys())

        # data_series_by_gender = self.prepare_gender_data_series(secondary_data_dict)

        return {
            # "data": serializable_data_mappings,
            "primary_data_dict": primary_data_dict,
            "secondary_data_dict": secondary_data_dict,
            # "data_mappings": data_mappings,
            # "elector_data": elector_data,
            "counter": count_aggregated_electors,
            "categories": categories,
            "dataSeries": data_series,
            # "dataSeriesByGender": data_series_by_gender,
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

    def update_data_with_two_fields(self, data_dict, parent_field, child_field, data):
        # Create a unique key based on parent_field and child_field


        # Ensure parent_field exists in the dictionary
        if parent_field not in data_dict:
            data_dict[parent_field] = {}

        # Ensure child_field exists under the parent_field, with a dictionary for counts
        if child_field not in data_dict[parent_field]:
            data_dict[parent_field][child_field] = {"total": 0, "female": 0, "male": 0}

        # Update counts for the specific child field
        data_dict[parent_field][child_field]["total"] += data["total"]
        data_dict[parent_field][child_field]["female"] += data["female"]
        data_dict[parent_field][child_field]["male"] += data["male"]

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

    def get_elector_data_series(self, primary_data_dict, secondary_data_dict):
        data_series = [
            {
                "name": key,
                "data": [data["total"] for data in primary_data_dict.values()],
            }
            for key in primary_data_dict
        ]
        return data_series

    # def get_elector_data_series(self, primary_data_dict, secondary_data_dict):
    #     data_series = []
    #     # Loop through each key in the primary data dictionary's 'data' section
    #     for key in primary_data_dict['data']:
    #         # Ensure that we are accessing the 'data' portion of the secondary dictionary
    #         # and that we are checking if the key exists in the secondary data dict 'data'
    #         if key in secondary_data_dict['data']:
    #             category_data = secondary_data_dict['data'][key]
    #             total_list = []
    #             # Now check if category_data is a dictionary and contains sub-dictionaries
    #             if isinstance(category_data, dict):
    #                 for region, data in category_data.items():
    #                     # Ensure that data is a dictionary before trying to use 'get'
    #                     if isinstance(data, dict):
    #                         total_list.append(data.get("total", 0))
    #                     else:
    #                         # If data is not a dictionary, handle the case (maybe log or error handle)
    #                         print(f"Expected a dictionary for data in region {region}, but got {type(data)}")
    #             else:
    #                 # If category_data is not a dictionary, handle this case appropriately
    #                 print(f"Expected a dictionary for category data under key {key}, but got {type(category_data)}")

    #             data_series.append({
    #                 "name": key,
    #                 "data": total_list
    #             })
    #         else:
    #             # Handle the case where the key does not exist in secondary_data_dict['data']
    #             print(f"Key {key} not found in secondary data dictionary")

    #     return data_series
