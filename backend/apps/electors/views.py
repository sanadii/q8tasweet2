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
from apps.committees.models import Committee

# Serializers
from apps.electors.serializers import ElectorSerializer
from apps.committees.serializers import CommitteeSerializer

# Utils
from utils.schema import schema_context
from .requests import (
    count_total_electors,
    count_electors_by_gender,
    count_electors_by_family,
    count_electors_by_area,
    count_electors_by_committee_subset,
)


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


class GetElectorStatistics(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        slug = kwargs.get("slug")

        with schema_context(request, slug) as election:
            if hasattr(request, "response"):
                return (
                    request.response
                )  # Return the error response set in context manager

            total_electors = count_total_electors()
            electors_by_gender = count_electors_by_gender()
            electors_by_family = count_electors_by_family()
            electors_by_area = count_electors_by_area()
            electors_by_committee_subset = count_electors_by_committee_subset()

        response_data = {
            "totalElectors": total_electors,
            "electorsByGender": electors_by_gender,
            "electorsByFamily": electors_by_family,
            "electorsByArea": electors_by_area,
            "electorsByCommitteeSubset": electors_by_committee_subset,
        }

        return Response({"data": response_data}, status=200)


# class GetElectorStatistics(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request, *args, **kwargs):
#         slug = kwargs.get("slug")
#         try:
#             election = Election.objects.get(slug=slug)
#         except Election.DoesNotExist:
#             return Response({"error": "Election not found"}, status=404)

#         context = {"request": request}

#         with schema_context("national_assembly_5_2024"):
#             election_committees = Committee.objects.all()
#             print("Committees found:", election_committees.count())
#             # Serialize the data inside the context manager
#             committees_data = CommitteeSerializer(
#                 election_committees, many=True, context=context
#             ).data

#         response_data = {
#             "data": {
#                 "electionCommittees": committees_data,
#             }
#         }

#         return Response(response_data, status=200)  # Simplify


# class GetElectorStatistics(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request, *args, **kwargs):
#         slug = kwargs.get("slug")

#         try:
#             election = Election.objects.get(slug=slug)
#         except Election.DoesNotExist:
#             return Response({"error": "Election not found"}, status=404)

#         # Define the database path based on the slug
#         db_path = os.path.join(settings.BASE_DIR, "database", f"{slug}.sqlite3")
#         if not os.path.exists(db_path):
#             return Response(
#                 {"error": "Database not found for the given slug"}, status=404
#             )

#         # Connect to the specific database
#         connection = setup_election_database_connection(slug)

#         # Execute the queries using functions from dataRequests
#         electorsByGender = count_electors_by_gender(connection)
#         electorsByFamily = count_electors_by_last_name(connection)
#         electorsByArea = count_electors_by_area(connection)

#         # election Committees
#         electionCommittees = get_election_committees(connection)

#         # Prepare the response data in a more structured format
#         response_data = {
#             "data": {
#                 "electionCommittees": electionCommittees,
#                 "electorsByGender": electorsByGender,
#                 "electorsByFamily": electorsByFamily,
#                 "electorsByArea": electorsByArea,
#             }
#         }

#         # Close the database connection
#         connection.close()

#         return Response(response_data)


# class GetElectors(APIView):
#     def get(self, request):
#         query = request.GET.get('searchInput', '').strip()
#         search_type = request.GET.get('searchType', '').lower()

#         if search_type == 'cid':
#             if not (query.isdigit() and len(query) == 12):  # Validate Civil ID
#                 return Response({"error": "Invalid Civil ID."}, status=400)
#             electors = Elector.objects.filter(civil=query)

#         elif search_type == 'name':
#             if len(query) < 3:  # Validate name length
#                 return Response({"error": "Name should be at least 3 characters long."}, status=400)
#             electors = Elector.objects.filter(
#                 Q(name_1__icontains=query) |
#                 Q(name_2__icontains=query) |
#                 Q(name_3__icontains=query) |
#                 Q(name_4__icontains=query) |
#                 Q(last_name__icontains=query)
#             )

#         elif search_type == 'detailed':
#             return Response({"error": "Detailed search is not yet implemented."}, status=501)

#         elif search_type == 'location':
#             return Response({"error": "Location search is not yet implemented."}, status=501)

#         else:
#             return Response({"error": "Invalid search type specified."}, status=400)

#         # Pagination
#         paginator = StandardResultsSetPagination()
#         result_page = paginator.paginate_queryset(electors, request)
#         serialized = ElectorsSerializer(result_page, many=True)
#         response_data = {
#             "data": {
#                 "electors": serialized.data,
#                 "count": paginator.page.paginator.count,
#                 "nextPageUrl": paginator.get_next_link(),
#                 "previousPageUrl": paginator.get_previous_link()
#             }
#         }

#         return Response(response_data)

# class GetElectors(APIView):
#     def get(self, request):
#         query = request.GET.get('searchInput', '').strip()
#         queries = Q()  # Start with an empty Q object to chain queries

#         # If query can be converted to a number, try to match it against the civil field
#         if query.isdigit():
#             queries |= Q(civil=query)

#         # If the query has sufficient length, try to match it against name fields
#         if len(query) >= 3:
#             for i in range(1, 11):
#                 queries |= Q(**{f"name_{i}__icontains": query})

#             for i in range(1, 5):
#                 queries |= Q(**{f"last_{i}__icontains": query})

#             queries |= Q(last_name__icontains=query)

#         electors = Elector.objects.filter(queries)

#         # Pagination
#         paginator = StandardResultsSetPagination()
#         result_page = paginator.paginate_queryset(electors, request)
#         serialized = ElectorsSerializer(result_page, many=True)
#         response_data = {
#             "data": {
#                 "electors": serialized.data,
#                 "count": paginator.page.paginator.count,
#                 "nextPageUrl": paginator.get_next_link(),
#                 "previousPageUrl": paginator.get_previous_link()
#             }
#         }

#         return Response(response_data)


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
