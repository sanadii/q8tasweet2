import os
from django.conf import settings
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.pagination import PageNumberPagination
from django.db.models import Count

# Models
from apps.electors.models import Elector

# Serializers
from apps.electors.serializers import (
    ElectorSerializer,
)

from django.db.models import Count, Case, When, IntegerField, Sum, Q
from django.contrib.postgres.aggregates import ArrayAgg
from django.db.models.query import QuerySet


# Utils
from utils.schema import schema_context
from .requests import (
    count_election_statistics,
    count_electors_by_family,
    count_electors_by_area,
    count_electors_by_committee,
    # Categories
    count_electors_by_family,
    count_electors_by_category,
    # Elector Family Division
)

from apps.electors.electorsByFamily import restructure_electors_by_family


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 100  # default number of items per page
    page_size_query_param = (
        "page_size"  # Allow client to override, using `?page_size=xxx`.
    )
    max_page_size = 1000  # Maximum limit allowed when using `?page_size=xxx`.


class GetAllElectors(APIView):
    def get(self, request):
        electors = Elector.objects.all()
        electors_serializer = ElectorSerializer(electors, many=True)
        return Response(
            {"data": {"allElectors": electors_serializer.data}, "code": 200}
        )


class GetElectors(APIView):
    def get(self, request):
        query = request.GET.get("searchInput", "").strip()
        # return Response({
        #     'msg':"Api Called...",
        #     "data":query
        # })
        if query.isdigit():
            electors = Elector.objects.filter(civil=query)
            if not electors.exists():
                raise Http404({"detail": "Name was not found.", "code": 404})
        else:
            all_Electors = Elector.objects.all()
            if len(query) >= 3:
                electors = [
                    elector
                    for elector in all_electors
                    if query.lower() in elector.full_name.lower()
                ]
            else:
                electors = all_electors

        paginator = StandardResultsSetPagination()
        result_page = paginator.paginate_queryset(electors, request)
        serialized = ElectorsSerializer(result_page, many=True)
        response_data = {
            "data": {
                "electors": serialized.data,
                "count": paginator.page.paginator.count,
                "nextPageUrl": paginator.get_next_link(),
                "previousPageUrl": paginator.get_previous_link(),
            }
        }

        return Response(response_data)


class GetElectorStatistics(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        slug = kwargs.get("slug")

        with schema_context(request, slug) as election:
            if hasattr(request, "response"):
                return request.response

            election_statistics = count_election_statistics()
            electors_by_family = count_electors_by_family()
            electors_by_area = count_electors_by_area()
            electors_by_committee = count_electors_by_committee()

        response_data = {
            "electionStatistics": election_statistics,
            "electorsByFamily": electors_by_family,
            "electorsByArea": electors_by_area,
            "electorsByCommittee": electors_by_committee,
        }

        return Response({"data": response_data}, status=200)


class GetElectorsByCategory(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        slug = kwargs.get("slug")

        with schema_context(request, slug):
            if hasattr(request, "response"):
                return request.response

            elector_by_category = count_electors_by_category(request)

            response_data = elector_by_category

        return Response({"data": response_data}, status=200)


# The code that isworking
class GetElectorFamilyDivisions(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        schema = request.GET.get("schema")
        with schema_context(request, schema):
            if hasattr(request, "response"):
                return request.response

            electors_by_family = restructure_electors_by_family(request)
            if "error" in electors_by_family:
                return Response({"error": electors_by_family["error"]}, status=400)

        return Response({"data": electors_by_family}, status=200)
