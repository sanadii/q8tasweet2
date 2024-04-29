
class ElectorDataByCategory(BaseSerializer):
    def to_representation(self, instance):
        # Unpack instance for easy access
        family, branches, areas, committees, primary, secondary = instance['instance']

        # Fetch data
        elector_data = self.get_aggregated_data(family, branches, areas, committees)
        count_aggregated_electors = self.count_aggregated_data(elector_data)

        # Structure data
        data_series, categories = self.prepare_data_series(elector_data, main)

        # Prepare gender data series
        series_female, series_male = self.prepare_gender_data_series(elector_data)

        return {
            "counter": count_aggregated_electors,
            "categories": categories,
            "dataSeries": data_series,
            "dataSeriesByGender": [
                {"name": "إناث", "data": series_female},
                {"name": "ذكور", "data": series_male},
            ],
        }

    def get_aggregated_data(self, family, branches, areas, committees):
        """ Fetch and aggregate elector data based on filters. """
        queryset = Elector.objects.all()
        filters = {
            'family__icontains': family,
            'branch__in': branches,
            'area__in': areas,
            'committee_area__in': committees
        }
        queryset = queryset.filter(**{k: v for k, v in filters.items() if v})

        # Define fields dynamically based on provided filters
        grouping_fields = ['family', 'branch', 'area', 'committee_area']
        grouping_fields = [field for field in grouping_fields if filters.get(field + '__in') or filters.get(field + '__icontains')]

        # Annotate and aggregate data
        return (
            queryset.values(*grouping_fields)
            .annotate(
                total=Count("id"),
                female=Count(Case(When(gender="2", then=1), output_field=IntegerField())),
                male=Count(Case(When(gender="1", then=1), output_field=IntegerField())),
            )
            .order_by("-total")[:20]
        )

    def count_aggregated_data(self, elector_data):
        """ Summarizes elector counts. """
        return {
            "total": sum(item["total"] for item in elector_data),
            "female": sum(item["female"] for item in elector_data),
            "male": sum(item["male"] for item in elector_data),
        }

    def prepare_data_series(self, elector_data, main):
        """ Build data series based on the main category type. """
        data_dict = defaultdict(list)
        for item in elector_data:
            data_dict[item[main]].append(item["total"])

        data_series = [{"name": k, "data": v} for k, v in data_dict.items()]
        categories = list(data_dict.keys())
        return data_series, categories

    def prepare_gender_data_series(self, elector_data):
        """ Prepare gender-specific data series. """
        series_female = [item["female"] for item in elector_data]
        series_male = [item["male"] for item in elector_data]
        return series_female, series_male



class ElectorDataByCategory(BaseSerializer):
    def to_representation(self, instance):
        # Unpack instance for easy access
        family, branches, areas, committees, main = instance['instance']

        # Fetch data
        elector_data = self.get_aggregated_data(family, branches, areas, committees)
        count_aggregated_electors = self.count_aggregated_data(elector_data)

        # Structure data
        data_series, categories = self.prepare_data_series(elector_data, main)

        # Prepare gender data series
        series_female, series_male = self.prepare_gender_data_series(elector_data)

        return {
            "counter": count_aggregated_electors,
            "categories": categories,
            "dataSeries": data_series,
            "dataSeriesByGender": [
                {"name": "إناث", "data": series_female},
                {"name": "ذكور", "data": series_male},
            ],
        }

    def get_aggregated_data(self, family, branches, areas, committees):
        """ Fetch and aggregate elector data based on filters. """
        queryset = Elector.objects.all()
        filters = {
            'family__icontains': family,
            'branch__in': branches,
            'area__in': areas,
            'committee_area__in': committees
        }
        queryset = queryset.filter(**{k: v for k, v in filters.items() if v})

        # Define fields dynamically based on provided filters
        grouping_fields = ['family', 'branch', 'area', 'committee_area']
        grouping_fields = [field for field in grouping_fields if filters.get(field + '__in') or filters.get(field + '__icontains')]

        # Annotate and aggregate data
        return (
            queryset.values(*grouping_fields)
            .annotate(
                total=Count("id"),
                female=Count(Case(When(gender="2", then=1), output_field=IntegerField())),
                male=Count(Case(When(gender="1", then=1), output_field=IntegerField())),
            )
            .order_by("-total")[:20]
        )

    def count_aggregated_data(self, elector_data):
        """ Summarizes elector counts. """
        return {
            "total": sum(item["total"] for item in elector_data),
            "female": sum(item["female"] for item in elector_data),
            "male": sum(item["male"] for item in elector_data),
        }

    def prepare_data_series(self, elector_data, main):
        """ Build data series based on the main category type. """
        data_dict = defaultdict(list)
        for item in elector_data:
            data_dict[item[main]].append(item["total"])

        data_series = [{"name": k, "data": v} for k, v in data_dict.items()]
        categories = list(data_dict.keys())
        return data_series, categories

    def prepare_gender_data_series(self, elector_data):
        """ Prepare gender-specific data series. """
        series_female = [item["female"] for item in elector_data]
        series_male = [item["male"] for item in elector_data]
        return series_female, series_male

