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

from apps.electors.electorsByCategory import restructure_electors_by_category
from apps.electors.electorsByAll import restructure_elector_by_all
from apps.electors.electorsBySearch import restructure_electors_by_search
from apps.electors.electorRelatedElectors import restructure_elector_related_electors
class GetElectorsByAll(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        schema = request.GET.get("schema")
        with schema_context(request, schema):
            if hasattr(request, "response"):
                return request.response

            electors_by_category = restructure_elector_by_all(request)
            if "error" in electors_by_category:
                return Response({"error": electors_by_category["error"]}, status=400)

        return Response({"data": electors_by_category}, status=200)


class GetElectorsByCategory(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        schema = request.GET.get("schema")
        with schema_context(request, schema):
            if hasattr(request, "response"):
                return request.response

            electors_by_category = restructure_electors_by_category(request)
            if "error" in electors_by_category:
                return Response({"error": electors_by_category["error"]}, status=400)

        return Response({"data": electors_by_category}, status=200)



class GetElectorsBySearch(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        schema = request.data.get("schema")

        with schema_context(request, schema):
            electors = restructure_electors_by_search(request)
            serializer = ElectorSerializer(electors, many=True)
            
            return Response({"data": serializer.data}, status=200)


class GetElectorRelatedElectors(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        schema = request.data.get("schema")

        with schema_context(request, schema):
            electors = restructure_elector_related_electors(request)
            serializer = ElectorSerializer(electors, many=True)
            
            return Response({"data": serializer.data}, status=200)







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


# class GetElectorStatistics(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request, *args, **kwargs):
#         slug = kwargs.get("slug")

#         with schema_context(request, slug) as election:
#             if hasattr(request, "response"):
#                 return request.response

#             election_statistics = count_election_statistics()
#             electors_by_family = count_electors_by_family()
#             electors_by_area = count_electors_by_area()
#             electors_by_committee = count_electors_by_committee()

#         response_data = {
#             "electionStatistics": election_statistics,
#             "electorsByFamily": electors_by_family,
#             # "electorsBYBranch": electors_by_branch,
#             "electorsByArea": electors_by_area,
#             "electorsByCommittee": electors_by_committee,
#             # "electors_by_family_area": eelectors_by_family_area,
#             # "electors_by_family_committee": electors_by_family_committee,
#             # "electors_by_branch_area": electors_by_branch_area,
#             # "electors_by_branch_committee": electors_by_branch_committee,
#         }

#         return Response({"data": response_data}, status=200)


# The code that isworking
# class GetElectorsByCategory(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request, *args, **kwargs):
#         slug = kwargs.get("slug")

#         with schema_context(request, slug):
#             if hasattr(request, "response"):
#                 return request.response

#             elector_by_category = count_electors_by_category(request)

#             response_data = elector_by_category

#         return Response({"data": response_data}, status=200)
