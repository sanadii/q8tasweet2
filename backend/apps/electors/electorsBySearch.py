from apps.electors.models import Elector
from apps.electors.serializers import ElectorSerializer
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

def restructure_electors_by_search(request):
    simple_search = request.data.get("simple_search", {})

    query = Q()
    if 'name' in simple_search:
        query &= Q(full_name__icontains=simple_search['name'])
    # if 'gender' in simple_search:
    #     query &= Q(gender=simple_search['gender'])
    # if 'area' in simple_search:
    #     query &= Q(area=simple_search['area'])

    electors = Elector.objects.filter(query)
    return electors



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

