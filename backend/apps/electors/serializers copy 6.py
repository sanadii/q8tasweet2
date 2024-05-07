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
    """
    Custom serializer to represent elector data categorized by various fields such as family,
    branches, area, and committees.

    This serializer aggregates and annotates data based on dynamic input fields, allowing
    for flexible and efficient data retrieval and representation for reporting or analysis purposes.
    """

    def to_representation(self, instance):
        """
        Converts the query set provided by `instance` into a Python dictionary of data ready for serialization.

        Args:
            instance (dict): A dictionary containing key elements needed to drive the query and processing.
                Expected keys are:
                - instance: tuple containing (families, branches, area, committees, filter_fields, data_fields)

        Returns:
            dict: A dictionary representing the structured data after processing and aggregation,
                  suitable for JSON serialization and further frontend utilization.

        Raises:
            ValueError: If required keys are missing from the instance dictionary.
        """

        # Extract necessary fields from the instance dictionary with validation
        (families, branches, area, committees, filter_fields, data_fields) = instance[
            "instance"
        ]

        # Ensure data_fields is a tuple, which is hashable and can be used safely
        data_fields = tuple(data_fields)

        # Fetch aggregated data based on the filters and fields specified
        query_set = self.get_aggregated_elector_data(
            families, branches, area, committees, filter_fields, data_fields
        )
        elector_data = self.get_annotated_elector_data(query_set, data_fields)

        # Prepare data mappings for categorized data representation and create dictionary
        data_mappings = self.initialize_data_mappings(data_fields)
        self.update_data_mapping(elector_data, data_mappings, data_fields)

        # # for data_field in data_fields:
        # #     f{field("_data_dict")} = data_mappings[f"{data_field}_data]
        # primary_data_dict, secondary_data_dictor, teriary_data_dictor = data_mappings["primary_data"]
        # if data_fields == 2:
        #     secondary_data_dictor = data_mappings["primary_data"]

        # if data_fields == 3:
        #     teriary_data_dictor = data_mappings["primary_data"]

        data_dicts = {}
        for index, field in enumerate(data_fields, start=1):
            dict_name = f"{field}_data"
            data_dicts[f"{index}ary_data_dict"] = data_mappings[dict_name]

        # Prepare data for response including aggregated counters and categorized series
        count_aggregated_electors = self.prepare_elector_data_counter(elector_data)
        categories = self.prepare_elector_data_categories(
            data_dicts["1ary_data_dict"], data_fields
        )
        data_series = self.prepare_elector_data_series(
            data_dicts["1ary_data_dict"], data_fields
        )

        # data_series_by_gender = self.prepare_elector_data_gender_series(
        #     primary_data_dict, data_fields
        # )

        serializer_result = {
            # "query_set": query_set,
            # "elector_data": elector_data,
            "data_mappings": data_mappings,
            "primary_data_dict": data_dicts["1ary_data_dict"],
            "counter": count_aggregated_electors,
            "categories": categories[:20],
            "dataSeries": data_series[:20],
            # "dataSeriesByGender": data_series_by_gender[:20],
        }
        
        # if len(data_fields) >= 2:
        #     # secondary_categories = self.prepare_elector_data_categories(data_dicts['2ary_data_dict'], data_fields)
        #     # secondary_data_series = self.prepare_elector_data_series(data_dicts['2ary_data_dict'], data_fields)

        #     # Append or merge secondary data
        #     # serializer_result['secondary_categories'] = secondary_categories[:20]
        #     # serializer_result['secondary_dataSeries'] = secondary_data_series[:20]
        #     serializer_result['secondary_data_dict'] = data_dicts["2ary_data_dict"]

        # Handle tertiary data if applicable
        # if len(data_fields) == 3:
        #     tertiary_categories = self.prepare_elector_data_categories(data_dicts['3ary_data_dict'], data_fields)
        #     tertiary_data_series = self.prepare_elector_data_series(data_dicts['3ary_data_dict'], data_fields)

        #     # Append or merge tertiary data
        #     serializer_result['tertiary_categories'] = tertiary_categories[:20]
        #     serializer_result['tertiary_dataSeries'] = tertiary_data_series[:20]

        return serializer_result

    def get_aggregated_elector_data(
        self,
        families=None,
        branches=None,
        area=None,
        committees=None,
        filter_fields=set(),
        data_fields=set(),
    ):
        """Fetch and aggregate elector data based on dynamic filters."""
        queryset = Elector.objects.all()

        if "" in filter_fields and families:
            queryset = queryset.filter(family__in=families)

        # Apply filters dynamically based on data_fields
        if "" in filter_fields:
            queryset = queryset
        if "branches" in filter_fields and branches:
            queryset = queryset.filter(branch__in=branches)
        if "area" in filter_fields and area:
            queryset = queryset.filter(area__in=area)
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
            .order_by("-total")[:20]  # Adjust the slice as necessary
        )

        return aggregated_data

    def initialize_data_mappings(self, data_fields):
        data_mappings = defaultdict(lambda: defaultdict(list))
        for data_field in data_fields:
            key_name = f"{data_field}_data"
            data_mappings[key_name]
        return data_mappings

    def update_data_mapping(self, elector_data, data_mappings, data_fields):
        
        for data_field in data_fields:
            for item in elector_data:
                key = f"{data_field}_data"
                if key in data_mappings:
                    if len(data_fields) == 1:
                        # Handling single field data
                        self.update_data_with_single_field(
                            data_mappings[key],  # Accessing the correct dictionary
                            item.get(
                                data_fields[0], ""
                            ),  # Getting the value for the single field
                            item,
                        )

                    print("data_fields: ", len(data_fields))

                    # Handling single field data
                    if len(data_fields) == 2:
                        if f"{data_field}_data" == f"{data_fields[0]}_data":
                            primary_field = data_fields[0]
                            secondary_field = data_fields[1]
                        else:
                            primary_field = data_fields[1]
                            secondary_field = data_fields[0]

                        # Check if the current key exists in data mappings
                        if key in data_mappings:
                            if len(data_fields) == 2:
                                # Using two fields, order depends on reverse_order
                                self.update_data_with_two_fields(
                                    data_mappings[key],
                                    item.get(primary_field, ""),
                                    item.get(secondary_field, ""),
                                    item
                                )
                        else:
                            print(f"Warning: {key} not found in data_mappings. Check initialization.")

                        
                        
                    if len(data_fields) == 3:
                        self.update_data_with_three_fields(
                            data_mappings[key],
                            item.get(data_fields[0], ""),
                            item.get(data_fields[1], ""),
                            item,
                        )
                else:
                    print(
                        f"Warning: {key} not found in data_mappings. Check initialization."
                    )


    def update_data_with_single_field(self, data_dict, key, item):
        # Initialize the entry list if key does not exist
        if key not in data_dict:
            data_dict[key] = {"total": 0, "female": 0, "male": 0}

        # Update counts for the single entry
        data_dict[key]["total"] += item.get("total", 0)
        data_dict[key]["female"] += item.get("female", 0)
        data_dict[key]["male"] += item.get("male", 0)

    def update_data_with_two_fields(self, data_dict, primary_key, secondary_key, item):
        if primary_key not in data_dict:
            data_dict[primary_key] = {}

        if secondary_key not in data_dict[primary_key]:
            data_dict[primary_key][secondary_key] = {"total": 0, "female": 0, "male": 0}

        data_dict[primary_key][secondary_key]["total"] += item.get("total", 0)
        data_dict[primary_key][secondary_key]["female"] += item.get("female", 0)
        data_dict[primary_key][secondary_key]["male"] += item.get("male", 0)


    def update_data_with_three_fields(self, data_dict, parent_key, child_key, item):
        if parent_key not in data_dict:
            data_dict[parent_key] = []

        # Find or create the child entry
        child_entry = next(
            (entry for entry in data_dict[parent_key] if entry["name"] == child_key),
            None,
        )
        if not child_entry:
            child_entry = {"name": child_key, "total": 0, "female": 0, "male": 0}
            data_dict[parent_key].append(child_entry)

        # Update counts for the specific child entry
        child_entry["total"] += item.get("total", 0)
        child_entry["female"] += item.get("female", 0)
        child_entry["male"] += item.get("male", 0)

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

    def prepare_elector_data_categories(self, primary_data_dict, data_fields):
        """
        Extracts category names from the primary data dictionary. Assumes each key in the dictionary
        is a category name.
        """
        # Directly return the list of keys, which are the category names
        category_list = list(primary_data_dict.keys())


        return category_list

    def prepare_elector_data_series(self, primary_data_dict, data_fields):
        data_series = []

        # For single field data
        if len(data_fields) == 1:
            # The field specifies which data to extract (e.g., 'total', 'female', 'male')
            data_series_name = data_fields[0]
            series_data = []  # To hold all data points for the series

            for key, data in primary_data_dict.items():
                # Extract the specific data based on the field from each entry
                data_point = data.get(
                    "total", 0
                )  # Default to 0 if field is not present
                series_data.append(
                    data_point
                )  # Append data point to the series data list

            # Append the constructed series data to data_series
            data_series.append(
                {
                    "name": data_series_name,  # Name the series based on the field
                    "data": series_data,  # The compiled list of data points
                }
            )

        if len(data_fields) == 2:
            # Iterate through each area in the secondary data, assuming it's structured with area as keys
            for area, families_data in primary_data_dict.items():
                area_series = {"name": area, "data": []}

                # Assuming families_data is a list of dictionaries with each family's data
                for family_data in families_data:
                    # Append each family's data as a separate dictionary within the 'data' list
                    area_series["data"].append(family_data["total"])

                data_series.append(area_series)

        return data_series


    def prepare_elector_data_gender_series(self, primary_data_dict, data_fields):
        """Prepare gender-specific data series, ensuring each entry corresponds to a category."""
        series_female = []
        series_male = []

        if len(data_fields) == 2:
            # Iterate over each category in the dictionary
            for category, stats in primary_data_dict.items():
                # Append female and male counts directly
                total_female = sum(entry.get("female", 0) for entry in stats)
                total_male = sum(entry.get("male", 0) for entry in stats)
                series_female.append({"name": category, "data": total_female})
                series_male.append({"name": category, "data": total_male})

        elif len(data_fields) == 3:
            # Here we assume that the data structure is nested and categorized by a secondary key
            for category, subcategories in primary_data_dict.items():
                total_female = 0
                total_male = 0
                for subcategory in subcategories:
                    total_female += subcategory.get("female", 0)
                    total_male += subcategory.get("male", 0)
                series_female.append({"name": category, "data": total_female})
                series_male.append({"name": category, "data": total_male})

        return [
            {
                "name": "إناث",
                "data": [entry["data"] for entry in series_female],
            },  # Female data series
            {
                "name": "ذكور",
                "data": [entry["data"] for entry in series_male],
            },  # Male data series
        ]
