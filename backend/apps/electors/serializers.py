# Campaign Serializers
from rest_framework import serializers

from django.db.models import Count, Case, When, IntegerField
from collections import defaultdict

from apps.electors.models import Elector
from apps.areas.models import Area

class ElectorSerializer(serializers.ModelSerializer):
    area_name = serializers.SerializerMethodField()
    committee_site_name = serializers.SerializerMethodField()
    committee_type = serializers.SerializerMethodField()

    class Meta:
        model = Elector
        fields = [
            "id",
            "full_name",
            "family",
            "branch",
            "sect",
            "gender",
            "age",
            "area",
            "block",
            "street",
            "lane",
            "house",
            "area_name",
            "area",
            
            "letter",
            "committee",
            "committee_type",
            "committee_site_name",
            "code_number",
        ]

    def get_area_name(self, obj):
        return obj.area.name if obj.area else None

    def get_committee_site_name(self, obj):
        if obj.committee:
            if obj.committee.committee_site:
                return obj.committee.committee_site.name
        return None

    def get_committee_type(self, obj):
        if obj.committee:
            return obj.committee.type
        return None
    
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
        """

        # Extract necessary fields from the instance dictionary with validation
        (families, branches, area, committees, filter_fields, data_fields) = instance[
            "instance"
        ]

        #
        # The next update
        # (kwargs_data, filter_fields, data_fields) = instance[
        #     "instance"
        # ]
        # families, branches, area, committees = kwargs_data
        #

        # Ensure data_fields is a tuple, which is hashable and can be used safely
        data_fields = tuple(data_fields)

        # Fetch aggregated data based on the filters and fields specified
        query_set = self.get_aggregated_elector_data(
            families, branches, area, committees, filter_fields
        )

        # Create elector_data from query set
        elector_data = self.get_annotated_elector_data(query_set, data_fields)
        # committee_data = self.get_annotated_elector_data(query_set, data_fields)

        # Prepare data mappings for categorized data representation and update it
        data_mappings = self.initialize_data_mappings(data_fields)
        self.update_data_mapping(elector_data, data_mappings, data_fields)

        # Create Dictionary from the data mapping
        data_dicts = {}
        for index, field in enumerate(data_fields, start=1):
            dict_name = f"{field}_data"
            data_dicts[f"{index}ary_data_dict"] = data_mappings[dict_name]

        # Prepare data for response including aggregated counters, categories, dataSeries and dataSeriesByGender
        # count_aggregated_electors = self.prepare_elector_data_counter(elector_data)

        count_aggregated_electors = self.prepare_elector_data_counter(
            query_set, elector_data
        )

        categories = self.prepare_elector_data_categories(
            data_dicts["1ary_data_dict"], data_fields
        )
        data_series = self.prepare_elector_data_series(
            data_dicts["1ary_data_dict"], data_fields
        )

        data_series_by_gender = self.prepare_elector_data_gender_series(
            data_dicts["1ary_data_dict"], data_fields
        )

        serializer_result = {
            # "committee_data": committee_data,
            "elector_data": elector_data,
            "data_mappings": data_mappings,
            # "primary_data_dict": data_dicts["1ary_data_dict"],
            "counter": count_aggregated_electors,
            "categories": categories[:20],
            "dataSeries": data_series[:20],
            "dataSeriesByGender": data_series_by_gender[:20],
        }

        if len(data_fields) == 2:
            secondary_categories = self.prepare_elector_data_categories(
                data_dicts["2ary_data_dict"], data_fields
            )
            secondary_data_series = self.prepare_elector_data_series(
                data_dicts["2ary_data_dict"], data_fields
            )
            data_series_by_gender = self.prepare_elector_data_gender_series(
                data_dicts["2ary_data_dict"], data_fields
            )

            # Append or merge secondary data
            serializer_result["reverse"] = {
                "counter": count_aggregated_electors,
                "categories": secondary_categories[:20],
                "data_series": secondary_data_series[:20],
                "data_series_by_gender": data_series_by_gender[:20],
            }

            # serializer_result['secondary_data_dict'] = data_dicts["2ary_data_dict"]

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
    ):
        """Fetch and aggregate elector data based on dynamic filters."""
        queryset = Elector.objects.all()

        if "" in filter_fields and families:
            queryset = queryset.filter(family__in=families)

        # Apply filters dynamically based on data_fields
        if "families" in filter_fields:
            queryset = queryset.filter(family__in=families)
        if "branches" in filter_fields and branches:
            queryset = queryset.filter(branch__in=branches)
        if "areas" in filter_fields and area:
            queryset = queryset.filter(area__in=area)  # Change here to fetch area name instead of ID
        if "committees" in filter_fields and committees:
            queryset = queryset.filter(committee_area__in=committees)
        return queryset


    def get_annotated_elector_data(self, queryset, data_fields=set()):
        """Annotate and aggregate data based on the dynamic fields."""
        grouping_fields = list(data_fields)

        # Perform aggregation
        aggregated_data = (
            queryset
            .values(*grouping_fields)
            .annotate(
                total=Count("id"),
                female=Count(
                    Case(When(gender="2", then=1), output_field=IntegerField())
                ),
                male=Count(Case(When(gender="1", then=1), output_field=IntegerField())),
            )
            .order_by("-total")[:20]  # Adjust the slice as necessary
        )

        # Include 'area__name' in the values if 'area' is in data_fields
        if "area" in data_fields:
            # Extract area IDs
            area_ids = [entry["area"] for entry in aggregated_data]
            # Fetch area names corresponding to IDs
            area_names = {area.id: area.name for area in Area.objects.filter(id__in=area_ids)}
            # Replace area IDs with names in the result
            for entry in aggregated_data:
                entry["area"] = area_names.get(entry["area"], None)
        return aggregated_data


    # def get_annotated_elector_data(self, queryset, data_fields=set()):
    #     """Annotate and aggregate data based on the dynamic fields."""
    #     grouping_fields = list(data_fields)

    #     aggregated_data = (
    #         queryset.values(*grouping_fields)
    #         .annotate(
    #             total=Count("id"),
    #             female=Count(
    #                 Case(When(gender="2", then=1), output_field=IntegerField())
    #             ),
    #             male=Count(Case(When(gender="1", then=1), output_field=IntegerField())),
    #         )
    #         .order_by("-total")[:20]  # Adjust the slice as necessary
    #     )
    #     print("aggregated_data: ", aggregated_data)

    #     return aggregated_data

    # def get_annotated_committee_data(self, queryset, data_fields):
    #     """Annotate and aggregate data based on the dynamic fields."""
    #     grouping_fields = list(data_fields)
    #     print("grouping_fields", grouping_fields)
    #     aggregated_data = (
    #         queryset.values(*grouping_fields)
    #         .annotate(
    #             total=Count("id"),
    #             female=Count(
    #                 Case(When(gender="2", then=1), output_field=IntegerField())
    #             ),
    #             male=Count(Case(When(gender="1", then=1), output_field=IntegerField())),
    #         )
    #         .order_by("-total")[:20]  # Adjust the slice as necessary
    #     )

    #     return aggregated_data

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
                            data_mappings[key], item.get(data_fields[0], ""), item
                        )

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
                                    item,
                                )
                        else:
                            print(
                                f"Warning: {key} not found in data_mappings. Check initialization."
                            )

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

    # def update_data_with_two_fields(self, data_dict, primary_key, secondary_key, item):
    def update_data_with_two_fields(self, data_dict, parent_key, child_key, item):
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

    # not yet working
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

    def prepare_elector_data_counter(self, queryset, elector_data):
        # Existing summary logic...
        gender_counter = {
            "total": sum(item["total"] for item in elector_data),
            "female": sum(item["female"] for item in elector_data),
            "male": sum(item["male"] for item in elector_data),
        }

        # Ensure proper filtering for areas and committees
        filtered_queryset = queryset.exclude(area__isnull=True)

        # Count distinct areas
        area_count = filtered_queryset.values("area").distinct().count()

        # You need to adjust these lines to correctly reference the gender from the related model
        # Assuming CommitteeSite is the correct model where gender is defined and related through 'committee'
        # Make sure the 'committee__committee_site' chain accurately reflects your model relationships
        male_committee_area_count = (
            queryset.filter(committee__committee_site__gender=1)
            .values("committee_area")
            .distinct()
            .count()
        )
        female_committee_area_count = (
            queryset.filter(committee__committee_site__gender=2)
            .values("committee_area")
            .distinct()
            .count()
        )

        # Assuming 'committee' field in your queryset correctly points to the Committee model
        committee_count = filtered_queryset.values("committee").distinct().count()
        male_committee_count = (
            filtered_queryset.filter(committee__committee_site__gender=1)
            .values("committee")
            .distinct()
            .count()
        )
        female_committee_count = (
            filtered_queryset.filter(committee__committee_site__gender=2)
            .values("committee")
            .distinct()
            .count()
        )

        return {
            "gender_count": gender_counter,
            "area_count": area_count,
            "committee_site_count": {
                "total": area_count,  # Assuming you mean the number of committee sites here
                "male": male_committee_area_count,
                "female": female_committee_area_count,
            },
            "committee_count": {
                "total": committee_count,
                "male": male_committee_count,
                "female": female_committee_count,
            },
        }

    def prepare_elector_data_categories(self, primary_data_dict, data_fields):
        """
        Extracts category names from the primary data dictionary. Assumes each key in the dictionary
        is a category name.
        """
        # Directly return the list of keys, which are the category names
        if len(data_fields) == 1:
            category_list = list(primary_data_dict.keys())

        # Initialize an empty set to store unique category names
        if len(data_fields) > 1:
            category_names = set()
            for entry_list in primary_data_dict.values():
                category_names.update(entry["name"] for entry in entry_list)

            category_list = list(category_names)

        return category_list

    def prepare_elector_data_series(self, primary_data_dict, data_fields):
        data_series = []

        if len(data_fields) == 1:
            # Use list comprehension for more concise code
            for field in data_fields:
                series_data = [
                    data.get("total", 0) for key, data in primary_data_dict.items()
                ]
                data_series.append({"name": field, "data": series_data})

        elif len(data_fields) == 2:
            # Iterate through each primary key and aggregate sub-keys
            for key, sub_key_data in primary_data_dict.items():
                sub_series = {
                    "name": key,
                    "data": [sub_key.get("total", 0) for sub_key in sub_key_data],
                }
                data_series.append(sub_series)

        return data_series

    def prepare_elector_data_gender_series(self, primary_data_dict, data_fields):
        """Prepare gender-specific data series, ensuring each entry corresponds to a category."""
        # Initialize lists for storing gender-specific data
        series_female = []
        series_male = []

        if len(data_fields) == 1:
            # Handle single-field data (e.g., area only) using list comprehension for uniformity
            series_female = [data["female"] for key, data in primary_data_dict.items()]
            series_male = [data["male"] for key, data in primary_data_dict.items()]

        elif len(data_fields) == 2:
            # Initialize dictionaries to hold the summed totals by sub-category name
            sub_category_female_totals = {}
            sub_category_male_totals = {}

            # Aggregate counts by sub-category names
            for key, sub_key_data in primary_data_dict.items():
                for sub_key in sub_key_data:
                    sub_category_name = sub_key["name"]
                    sub_category_female_totals[sub_category_name] = (
                        sub_category_female_totals.get(sub_category_name, 0)
                        + sub_key["female"]
                    )
                    sub_category_male_totals[sub_category_name] = (
                        sub_category_male_totals.get(sub_category_name, 0)
                        + sub_key["male"]
                    )

            # Convert dictionaries to lists after summing is complete
            series_female = list(sub_category_female_totals.values())
            series_male = list(sub_category_male_totals.values())

        # Prepare the final data series structure for gender data
        data_series_by_gender = [
            {"name": "إناث", "data": series_female},
            {"name": "ذكور", "data": series_male},
        ]
        return data_series_by_gender
