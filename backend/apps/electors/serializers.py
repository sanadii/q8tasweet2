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



# class ElectorDataByCategory(serializers.BaseSerializer):
#     def to_representation(self, instance):
#         (family, branches, areas, committees, filter_fields, data_fields) = instance["instance"]
#         data_fields = tuple(data_fields)
#         query_set = self.get_aggregated_elector_data(family, branches, areas, committees, filter_fields)
#         elector_data = self.get_annotated_elector_data(query_set, data_fields)
        
#         # Initialize data mappings including combinations of field keys
#         data_mappings = self.initialize_data_mappings(data_fields)

#         # Update data for each category using a hashable type for keys
#         self.update_data_mapping(elector_data, data_mappings, data_fields)

#         # Assuming data_fields has main_field and sub_field defined, extract them
#         main_field, sub_field, *extra = data_fields
#         attr_field = extra[0] if extra else None  # attr_field is None if not provided

#         # Retrieve individual and combined data dictionaries
#         primary_data_dict = data_mappings[f"{main_field}_data"]
#         secondary_data_dict = data_mappings[f"{sub_field}_data"]
#         tertiary_data_dict = data_mappings[f"{main_field}_{sub_field}_data"]  # Combined key

#         # prepare data for response
#         count_aggregated_electors = self.prepare_elector_data_counter(elector_data)
#         data_series = self.prepare_elector_data_series(primary_data_dict, secondary_data_dict)
#         categories = self.prepare_elector_data_categories(secondary_data_dict)

#         return {
#             "elector_data": elector_data,
#             "data_mappings": data_mappings,
#             "primary_data_dict": primary_data_dict,
#             "secondary_data_dict": secondary_data_dict,
#             "tertiary_data_dict": tertiary_data_dict,  # Include this in your output for debugging or further use
#             "counter": count_aggregated_electors,
#             "categories": categories[:20],
#             "dataSeries": data_series[:20],
#         }



class ElectorDataByCategory(serializers.BaseSerializer):
    def to_representation(self, instance):
        (family, branches, areas, committees, filter_fields, data_fields) = instance[
            "instance"
        ]

        # Ensure data_fields is a tuple, which is hashable and can be used safely
        data_fields = tuple(data_fields)  # Ensure it's hashable
        query_set = self.get_aggregated_elector_data(
            family, branches, areas, committees, filter_fields
        )
        
        elector_data = self.get_annotated_elector_data(query_set, data_fields)
        
        # Creating Data mapping
        data_mappings = self.initialize_data_mappings(data_fields)

        # Update data for each category using a hashable type for keys
        self.update_data_mapping(elector_data, data_mappings, data_fields)

        main_field, sub_field, *extra = data_fields
        attr_field = extra[0] if extra else None  # attr_field is None if not provided

        primary_data_dict = data_mappings[f"{main_field}_data"]
        secondary_data_dict = data_mappings[f"{sub_field}_data"]
        tertiary_data_dict = data_mappings[f"{main_field}_{sub_field}_data"]

        # prepare data for response
        count_aggregated_electors = self.prepare_elector_data_counter(elector_data)
        data_series = self.prepare_elector_data_series(
            primary_data_dict, secondary_data_dict
        )
        categories = self.prepare_elector_data_categories(secondary_data_dict)
        # data_series_by_gender = self.prepare_elector_data_gender_series(
        #     primary_data_dict, data_fields
        # )

        print("Number of entries in data_mappings:", len(data_mappings))

        return {
            # "query_set": query_set,
            "elector_data": elector_data,
            "data_mappings": data_mappings,
            "primary_data_dict": primary_data_dict,
            "secondary_data_dict": secondary_data_dict,
            "tertiary_data_dict ": tertiary_data_dict ,
            "counter": count_aggregated_electors,
            "categories": categories[:20],
            "dataSeries": data_series[:20],
            # "dataSeriesByGender": data_series_by_gender[:20],
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

    def initialize_data_mappings(self, data_fields):
        main_field, sub_field, *extra = data_fields

        data_mappings = defaultdict(lambda: defaultdict(lambda: defaultdict(int)))
        for field in data_fields:
            # Adding '_data' suffix to match your access pattern in update functions
            data_mappings[f"{field}_data"]
        
        
        return data_mappings






    def update_data_mapping(self, elector_data, data_mappings, data_fields):
        for item in elector_data:
            for field in data_fields:
                key = f"{field}_data"  # This matches the pattern in your initialization
                if key in data_mappings:
                    self.update_data(data_mappings[key], item.get(field, ""), item)
                else:
                    print(f"Warning: {key} not found in data_mappings. Check initialization.")
   
                    
    def update_data(self, data_dict, primary_key, secondary_key, data):
        # Initialize nested dictionary structure if not already present
        if primary_key not in data_dict:
            data_dict[primary_key] = {}
        if secondary_key not in data_dict[primary_key]:
            data_dict[primary_key][secondary_key] = {"total": 0, "female": 0, "male": 0}

        # Update data counts
        sub_dict = data_dict[primary_key][secondary_key]
        sub_dict["total"] += data.get("total", 0)
        sub_dict["female"] += data.get("female", 0)
        sub_dict["male"] += data.get("male", 0)
        
    def update_related_data(
        self, main_data_dict, main_key, sub_key, attribute_key, item
    ):
        if main_key not in main_data_dict:
            main_data_dict[main_key] = {}
        if sub_key not in main_data_dict[main_key]:
            main_data_dict[main_key][sub_key] = {"total": 0, "female": 0, "male": 0}

        # Update the subcategory under the main category
        sub_data_dict = main_data_dict[main_key][sub_key]
        sub_data_dict["total"] += item["total"]
        sub_data_dict["female"] += item["female"]
        sub_data_dict["male"] += item["male"]

        # Optionally handle additional attributes if required
        # Example: Updating a third dimension of data, such as an attribute specific to the item
        if attribute_key in item:
            # Here you would implement logic specific to handling this attribute
            pass

    def update_data(self, data_dict, key, data):
        if key not in data_dict:
            data_dict[key] = {"total": 0, "female": 0, "male": 0}
        data_dict[key]["total"] += data["total"]
        data_dict[key]["female"] += data["female"]
        data_dict[key]["male"] += data["male"]

    def update_data_with_related_fields(self, data_dict, parent_key, child_key, item):
        if parent_key not in data_dict:
            data_dict[parent_key] = {}
        if child_key not in data_dict[parent_key]:
            data_dict[parent_key][child_key] = {"total": 0, "female": 0, "male": 0}
        data_dict[parent_key][child_key]["total"] += item["total"]
        data_dict[parent_key][child_key]["female"] += item["female"]
        data_dict[parent_key][child_key]["male"] += item["male"]

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

    def prepare_elector_data_series(self, primary_data_dict, secondary_data_dict):
        data_series = []
        # For single field data
        for key in primary_data_dict:
            data_series.append(
                {
                    "name": key,
                    "data": [data["total"] for data in secondary_data_dict.values()][:20],
                }
            )

        return data_series

    def prepare_elector_data_categories(self, secondary_data_dict):
        categories = list(secondary_data_dict.keys())
        return categories

    def prepare_elector_data_gender_series(self, primary_data_dict, data_fields):
        """Prepare gender-specific data series, ensuring each entry corresponds to a category."""
        series_female = []
        series_male = []

        if len(data_fields) == 2:
            # Iterate over each category in the dictionary
            for category, stats in primary_data_dict.items():
                # Append female and male counts directly
                series_female.append(stats.get("female", 0))
                series_male.append(stats.get("male", 0))

            return [
                {"name": "إناث", "data": series_female},
                {"name": "ذكور", "data": series_male},
            ]
