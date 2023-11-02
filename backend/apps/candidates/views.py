from django.http import JsonResponse
from django.http.response import JsonResponse
from django.shortcuts import render
from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView

# Tasweet Apps
from apps.candidates.models import Candidate
from apps.candidates.serializers import CandidateSerializer

from apps.elections.models import ElectionCandidate
from apps.elections.serializers import ElectionCandidateSerializer
from helper.views_helper import CustomPagination

from rest_framework.parsers import MultiPartParser, FormParser


def index(request):
    return render(request, 'index.html')

class GetCandidates(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, *args, **kwargs):
        candidates_data = Candidate.objects.all()
        paginator = CustomPagination()
        paginated_candidates = paginator.paginate_queryset(candidates_data, request)
        
        # Passing context with request to the serializer
        context = {"request": request}
        data_serializer = CandidateSerializer(paginated_candidates, many=True, context=context)
        
        return paginator.get_paginated_response(data_serializer.data)

class GetCandidateDetails(APIView):
    def get(self, request, slug):
        candidate = get_object_or_404(Candidate, slug=slug)
    # def get(self, request, id):
    #     candidate = get_object_or_404(Candidate, id=id)
        context = {"request": request}

        return Response({
            "data": {
                "candidateDetails": self.get_candidate_data(candidate, context),
            },
            "code": 200
        })

    def get_candidate_data(self, candidate, context):
        return CandidateSerializer(candidate, context=context).data



class AddNewCandidate(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = CandidateSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            candidate = serializer.save()
            if 'image' in request.FILES:
                candidate.image = request.FILES['image']
                candidate.save()

            # Check if the 'election' field exists in the request data
            if 'election' in request.data:
                election_id = request.data['election']

                # Create an ElectionCandidate entry linking the candidate to the election
                election_candidate = ElectionCandidate.objects.create(
                    election_id=election_id,
                    candidate=candidate
                )

                # Serialize the election_candidate and add it to the response
                election_candidate_serializer = ElectionCandidateSerializer(election_candidate)
                response_data = {
                    "data": serializer.data,
                    "electionCandidate": election_candidate_serializer.data,
                    "count": 0,
                    "code": 200,
                }

                return Response(response_data, status=status.HTTP_201_CREATED)
            
            # If 'election' field is not provided, return a response without 'electionCandidate' field
            return Response({"data": serializer.data, "count": 0, "code": 200}, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UpdateCandidate(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def patch(self, request, id):
        try:
            candidate = Candidate.objects.get(id=id)
        except Candidate.DoesNotExist:
            return Response({"error": "Candidate not found"}, status=status.HTTP_404_NOT_FOUND)
        
        data = request.data.copy()
        if 'image' in request.FILES:
            candidate.image = request.FILES['image']
            candidate.save()
        elif 'image' in data and data['image'] in ['null', 'remove']:
            candidate.image = None
            candidate.save()

        serializer = CandidateSerializer(candidate, data=data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({"data": serializer.data, "count": 0, "code": 200})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeleteCandidate(APIView):
    def delete(self, request, id):
        try:
            candidate = Candidate.objects.get(id=id)
            candidate.delete()
            return JsonResponse({"data": "Candidate deleted successfully", "count": 1, "code": 200}, safe=False)
        except Candidate.DoesNotExist:
            return JsonResponse({"data": "Candidate not found", "count": 0, "code": 404}, safe=False)


# class GetCandidateDetails(APIView):
#     def get(self, request, id):
#         candidate = get_object_or_404(Candidate, id=id)
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
#         return CandidateSerializer(candidate, context=context).data

#     def get_candidate_candidates(self, candidate_candidates, context):
#         return CandidateCandidateSerializer(candidate_candidates, many=True, context=context).data

#     def get_candidate_committees(self, candidate_committees, context):
#         return CandidateCommitteesSerializer(candidate_committees, many=True, context=context).data

#     def get_candidate_campaigns(self, candidate, context):
#         candidate_candidate_ids = CandidateCandidates.objects.filter(candidate=candidate).values_list('id', flat=True)
#         candidate_campaigns = Campaign.objects.filter(candidate_candidate__in=candidate_candidate_ids)
#         return CampaignSerializer(candidate_campaigns, many=True, context=context).data
