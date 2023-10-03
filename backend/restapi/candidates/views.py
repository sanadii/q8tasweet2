from django.http import JsonResponse
from django.http.response import JsonResponse
from django.db.models.query import QuerySet
from django.db.models import Sum
from django.db.models import Count
from django.contrib.auth import get_user_model
from django.shortcuts import render
from django.shortcuts import get_object_or_404

from http import HTTPStatus

from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination

from restapi.serializers import *
from restapi.models import *
import ast 
from datetime import datetime
from operator import itemgetter



def index(request):
    return render(request, 'index.html')

# Candidates: getCandidate, deleteCandidate, addCandidate, updateCandidate, CandidateCount
class CustomPagination(PageNumberPagination):
    page_size = 50

    def get_paginated_response(self, data):
        return Response({
            "count": self.page.paginator.count,
            "next": self.get_next_link(),
            "previous": self.get_previous_link(),
            "data": data,
        })



class GetCandidates(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, *args, **kwargs):
        candidates_data = Candidates.objects.all()
        paginator = CustomPagination()
        paginated_candidates = paginator.paginate_queryset(candidates_data, request)
        
        # Passing context with request to the serializer
        context = {"request": request}
        data_serializer = CandidatesSerializer(paginated_candidates, many=True, context=context)
        
        return paginator.get_paginated_response(data_serializer.data)

# class GetCandidateDetails(APIView):
#     def get(self, request, id):
#         candidate = get_object_or_404(Candidates, id=id)
#         context = {"request": request}

#         candidate_candidates = CandidateCandidates.objects.filter(candidate=candidate).prefetch_related('candidate').only('id')
#         candidate_committees = CandidateCommittees.objects.filter(candidate=candidate).select_related('candidate')

#         return Response({
#             "data": {
#                 "candidateDetails": self.get_candidate_data(candidate, context),
#                 "candidateCandidates": self.get_candidate_candidates(candidate_candidates, context),
#                 "candidateCommittees": self.get_candidate_committees(candidate_committees, context),
#                 "candidateCampaigns": self.get_candidate_campaigns(candidate, context),
#             },
#             "code": 200
#         })

#     def get_candidate_data(self, candidate, context):
#         return CandidatesSerializer(candidate, context=context).data

#     def get_candidate_candidates(self, candidate_candidates, context):
#         return CandidateCandidatesSerializer(candidate_candidates, many=True, context=context).data

#     def get_candidate_committees(self, candidate_committees, context):
#         return CandidateCommitteesSerializer(candidate_committees, many=True, context=context).data

#     def get_candidate_campaigns(self, candidate, context):
#         candidate_candidate_ids = CandidateCandidates.objects.filter(candidate=candidate).values_list('id', flat=True)
#         candidate_campaigns = Campaigns.objects.filter(candidate_candidate__in=candidate_candidate_ids)
#         return CampaignsSerializer(candidate_campaigns, many=True, context=context).data

class AddNewCandidate(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CandidatesSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({"data": serializer.data, "count": 0, "code": 200}, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UpdateCandidate(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, id):
        try:
            candidate = Candidates.objects.get(id=id)
        except Candidates.DoesNotExist:
            return Response({"error": "Candidate not found"}, status=404)
        
        serializer = CandidatesSerializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            serializer.save()
            return Response({"data": serializer.data, "count": 0, "code": 200})
        return Response(serializer.errors, status=400)

class DeleteCandidate(APIView):
    def delete(self, request, id):
        try:
            candidate = Candidates.objects.get(id=id)
            candidate.delete()
            return JsonResponse({"data": "Candidate deleted successfully", "count": 1, "code": 200}, safe=False)
        except Candidates.DoesNotExist:
            return JsonResponse({"data": "Candidate not found", "count": 0, "code": 404}, safe=False)
