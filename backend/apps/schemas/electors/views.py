from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.pagination import PageNumberPagination

# App Models
from apps.schemas.electors.models import Elector

# App Serializers
from apps.schemas.electors.serializers import ElectorSerializer

# App Utils
from utils.schema import schema_context
from utils.election import get_election_by_slug
from apps.schemas.electors.electorsByCategory import restructure_electors_by_category
from apps.schemas.electors.electorsByAll import restructure_elector_by_all
from apps.schemas.electors.electorsBySearch import restructure_electors_by_search
from apps.schemas.electors.electorRelatedElectors import (
    restructure_elector_related_electors,
)


class GetElectorsByAll(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        schema = request.GET.get("schema")
        election = get_election_by_slug(schema)     
        
        with schema_context(schema):
            if hasattr(request, "response"):
                return request.response

            electors_by_category = restructure_elector_by_all(request, election)
            if "error" in electors_by_category:
                return Response({"error": electors_by_category["error"]}, status=400)

        return Response({"data": electors_by_category}, status=200)


class GetElectorsByCategory(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        schema = request.GET.get("schema")
        election = get_election_by_slug(schema)     

        with schema_context(schema):
            if hasattr(request, "response"):
                return request.response

            electors_by_category = restructure_electors_by_category(request, election)
            if "error" in electors_by_category:
                return Response({"error": electors_by_category["error"]}, status=400)

        return Response({"data": electors_by_category}, status=200)


class GetElectorsBySearch(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        schema = request.data.get("schema")

        with schema_context(schema):
            electors = restructure_electors_by_search(request)
            serializer = ElectorSerializer(electors, many=True)
            print("electors: ", electors)

            return Response({"data": serializer.data}, status=200)


class GetElectorRelatedElectors(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        schema = request.data.get("schema")

        with schema_context(schema):
            electors = restructure_elector_related_electors(request)
            return Response({"data": electors}, status=200)


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

#         with schema_context(slug) as election:
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

#         with schema_context(slug):
#             if hasattr(request, "response"):
#                 return request.response

#             elector_by_category = count_electors_by_category(request)

#             response_data = elector_by_category

#         return Response({"data": response_data}, status=200)
