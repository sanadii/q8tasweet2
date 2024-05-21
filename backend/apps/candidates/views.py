from django.http import JsonResponse
from django.http.response import JsonResponse
from django.shortcuts import render
from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView

# Tasweet Apps
from apps.candidates.models import Candidate, Party
from apps.candidates.serializers import CandidateSerializer, PartySerializer

from apps.elections.candidates.models import(
    ElectionCandidate,
    ElectionParty,
    ElectionPartyCandidate,
    )
from apps.elections.candidates.serializers import (
    ElectionCandidateSerializer,
    ElectionPartySerializer,
    ElectionPartyCandidateSerializer,
)
from utils.views_helper import CustomPagination

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
            
        if 'electionParty' in request.data:
            try:
                election_party_id = int(request.data['electionParty'])
            except (ValueError, TypeError):
                return Response({"error": "Invalid 'electionParty' value. Must be an integer."}, 
                                status=status.HTTP_400_BAD_REQUEST)

            # Ensure election_party_id corresponds to a valid ElectionParty object
            if not ElectionParty.objects.filter(id=election_party_id).exists():
                return Response({"error": f"ElectionParty with id {election_party_id} does not exist."},
                                status=status.HTTP_404_NOT_FOUND)

            # Create an ElectionPartyCandidate entry linking the candidate to the election party
            election_party_candidate = ElectionPartyCandidate.objects.create(
                election_party_id=election_party_id,
                candidate=candidate
            )

            # Serialize the election_party_candidate and add it to the response
            election_party_candidate_serializer = ElectionPartyCandidateSerializer(election_party_candidate)
            response_data = {
                "data": serializer.data,
                "electionPartyCandidate": election_party_candidate_serializer.data,
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
            return JsonResponse({"data": "Candidate is deleted successfully", "count": 1, "code": 200}, safe=False)
        except Candidate.DoesNotExist:
            return JsonResponse({"data": "Candidate not found", "count": 0, "code": 404}, safe=False)


# Parties
class GetParties(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, *args, **kwargs):
        parties_data = Party.objects.all()
        paginator = CustomPagination()
        paginated_parties = paginator.paginate_queryset(parties_data, request)
        
        # Passing context with request to the serializer
        context = {"request": request}
        data_serializer = PartySerializer(paginated_parties, many=True, context=context)
        
        return paginator.get_paginated_response(data_serializer.data)

class GetPartyDetails(APIView):
    def get(self, request, slug):
        party = get_object_or_404(Party, slug=slug)
    # def get(self, request, id):
    #     party = get_object_or_404(Party, id=id)
        context = {"request": request}

        return Response({
            "data": {
                "partyDetails": self.get_party_data(party, context),
            },
            "code": 200
        })

    def get_party_data(self, party, context):
        return PartySerializer(party, context=context).data



class AddParty(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = PartySerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            party = serializer.save()
            if 'image' in request.FILES:
                party.image = request.FILES['image']
                party.save()

            # Check if the 'election' field exists in the request data
            if 'election' in request.data:
                election_id = request.data['election']

                # Create an ElectionParty entry linking the party to the election
                election_party = ElectionParty.objects.create(
                    election_id=election_id,
                    party=party
                )

                # Serialize the election_party and add it to the response
                election_party_serializer = ElectionPartySerializer(election_party)
                response_data = {
                    "data": serializer.data,
                    "electionParty": election_party_serializer.data,
                    "count": 0,
                    "code": 200,
                }

                return Response(response_data, status=status.HTTP_201_CREATED)
            
            # If 'election' field is not provided, return a response without 'electionParty' field
            return Response({"data": serializer.data, "count": 0, "code": 200}, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UpdateParty(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def patch(self, request, id):
        try:
            party = Party.objects.get(id=id)
        except Party.DoesNotExist:
            return Response({"error": "Party not found"}, status=status.HTTP_404_NOT_FOUND)
        
        data = request.data.copy()
        if 'image' in request.FILES:
            party.image = request.FILES['image']
            party.save()
        elif 'image' in data and data['image'] in ['null', 'remove']:
            party.image = None
            party.save()

        serializer = PartySerializer(party, data=data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({"data": serializer.data, "count": 0, "code": 200})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeleteParty(APIView):
    def delete(self, request, id):
        try:
            party = Party.objects.get(id=id)
            party.delete()
            return JsonResponse({"data": "Party is deleted successfully", "count": 1, "code": 200}, safe=False)
        except Party.DoesNotExist:
            return JsonResponse({"data": "Party not found", "count": 0, "code": 404}, safe=False)