from apps.schemas.electors.models import Elector
from apps.schemas.electors.serializers import ElectorSerializer
from rest_framework import serializers
from django.db import models
from django.db.models import F, Value, Count, Q
from django.db.models.functions import Concat

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Elector
from .serializers import ElectorSerializer  # Assuming you have an ElectorSerializer

from django.shortcuts import get_object_or_404

from utils.normalize_arabic import normalize_arabic

def restructure_electors_by_search(request):
    search_type = request.data.get("search_type", "")
    query = Q()

    # Elector Search
    if search_type == "simple":
        fields = ["full_name", "family"]
        foriegn_fields = ["area"]
    elif search_type == "advanced":
        fields = [
            "first_name",
            "second_name",
            "third_name",
            # "fourth_name",
            # "branch", "family",
            # "block", "street", "house", "age",
            # "previously_voted", "currently_votted"
        ]
        foriegn_fields = ["area"]
    elif search_type == "searchById":
        fields = ["id"]
        foriegn_fields = ["id"]
    elif search_type == "searchByName":
        fields = ["full_name"]
        foriegn_fields = ["id"]
    else:
        fields = []

    for field in fields:
        value = str(request.data.get(field, ""))
        if value:
            normalized_value = normalize_arabic(value)
            query &= Q(**{f"{field}__icontains": normalized_value})

    for field in foriegn_fields:
        value = str(request.data.get(field, ""))
        if value:
            normalized_value = normalize_arabic(value)
            query &= Q(**{f"{field}": normalized_value})

    electors = Elector.objects.filter(query)
    return electors


# def restructure_electors_by_search(request):
#     simple_search = request.data.get("simple_search", {})

#     query = Q()

#     if 'name' in simple_search and simple_search['name']:
#         query &= Q(full_name__icontains=simple_search['name'])

#     if 'family' in simple_search and simple_search['family']:
#         query &= Q(family__icontains=simple_search['family'])

#     if 'area' in simple_search and simple_search['area']:
#         area_value = str(simple_search['area'])  # Convert area to string
#         query &= Q(area=area_value)  # Filter directly on the area field


#     electors = Elector.objects.filter(query)
#     return electors


# class GetElectorsBySearch(APIView):
#     def get(self, request):
#         query = request.GET.get("searchInput", "").strip()
#         # return Response({
#         #     'msg':"Api Called...",
#         #     "data":query
#         # })
#         if query.isdigit():
#             electors = Elector.objects.filter(civil=query)
#             if not electors.exists():
#                 raise Http404({"detail": "Name was not found.", "code": 404})
#         else:
#             all_Electors = Elector.objects.all()
#             if len(query) >= 3:
#                 electors = [
#                     elector
#                     for elector in all_electors
#                     if query.lower() in elector.full_name.lower()
#                 ]
#             else:
#                 electors = all_electors

#         paginator = StandardResultsSetPagination()
#         result_page = paginator.paginate_queryset(electors, request)
#         serialized = ElectorsSerializer(result_page, many=True)
#         response_data = {
#             "data": {
#                 "electors": serialized.data,
#                 "count": paginator.page.paginator.count,
#                 "nextPageUrl": paginator.get_next_link(),
#                 "previousPageUrl": paginator.get_previous_link(),
#             }
#         }

#         return Response(response_data)
