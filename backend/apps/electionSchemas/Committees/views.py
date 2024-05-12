# from apps.elections.models import Election
from django.http import JsonResponse
from django.http.response import JsonResponse
from django.db.models import Sum
from django.shortcuts import render
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.core.exceptions import ValidationError
import json
import csv
from django.views import View

from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination

# Campaign App
from apps.campaigns.models import Campaign, CampaignMember
from apps.campaigns.serializers import CampaignSerializer, CampaignMemberSerializer


# Election Committees
class GetCommittees(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        committees_data = Committee.objects.all()
        data_serializer = CommitteeSerializer(committees_data, many=True)

        return Response({"data": data_serializer.data, "counts": 1, "code": 200})

class AddNewCommittee(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CommitteeSerializer(data=request.data, context={'request': request})

        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response({"data": serializer.data, "count": 1, "code": status.HTTP_201_CREATED})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UpdateCommittee(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, id):
        try:
            committee = Committee.objects.get(id=id)
        except Committee.DoesNotExist:
            return Response({"error": "Committee not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = CommitteeSerializer(committee, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"data": serializer.data, "count": 1, "code": status.HTTP_200_OK})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DeleteCommittee(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, id):
        try:
            committee = Committee.objects.get(id=id)
            committee.delete()
            return Response({"data": "Committee deleted successfully", "count": 1, "code": status.HTTP_200_OK})
        except Committee.DoesNotExist:
            return Response({"error": "Committee not found"}, status=status.HTTP_404_NOT_FOUND)



class UpdateElectionResults(APIView):
    permission_classes = [IsAuthenticated]  # Assuming only authenticated users can update

    def patch(self, request, id):
        # Initialize the output dictionary
        result_type = request.data.get("result_type", "")
        if result_type == "candidates":
            resultModel = ElectionCandidate
            committeeResultModel = CommitteeResult
            item_id = "election_candidate_id"

        elif result_type == "parties":
            resultModel = ElectionParty
            committeeResultModel = ElectionPartyCommitteeResult
            item_id = "election_party_id"

        elif result_type == "partyCandidates":
            resultModel = ElectionPartyCandidate
            committeeResultModel = ElectionPartyCandidateCommitteeResult
            item_id = "election_party_candidate_id"

        output = {"0": {}} if id == 0 else {}

        # If id is 0, update the ElectionCandidate votes
        if id == 0:
            for candidate_id, votes in request.data.get("data", {}).items():
                try:
                    candidate = resultModel.objects.get(id=candidate_id)
                    # Update the votes, ensuring that votes is an integer
                    candidate.votes = int(votes)
                    candidate.save()
                    # Add the candidate's votes to the output under committee "0"
                    output["0"][str(candidate_id)] = int(votes)
                except resultModel.DoesNotExist:
                    # Handle the case where the resultModel does not exist
                    return Response({"message": f"Candidate with id {candidate_id} does not exist.", "code": 404}, status=404)
                except ValueError:
                    # Handle the case where votes is not a valid integer
                    return Response({"message": f"Invalid votes value for candidate {candidate_id}.", "code": 400}, status=400)
            # Return a success response with the consistent structure
            return Response({"data": output, "result_type": result_type, "count": len(output["0"]), "code": 200})

        # For all other ids, perform the usual update_or_create operation
        for candidate_id, votes in request.data.get("data", {}).items():
            kwargs = {
                "election_committee": id,
                item_id: candidate_id,  # Use the dynamic item_id
            }
            defaults = {
                "votes": votes,
                "updated_by": request.user
            }
            obj, created = committeeResultModel.objects.update_or_create(**kwargs, defaults=defaults)

            # Add the candidate's votes to the output
            committee_id_str = str(obj.election_committee)
            if committee_id_str not in output:
                output[committee_id_str] = {}
            output[committee_id_str][str(candidate_id)] = votes

        # Once the patch operation is done, fetch all relevant results if not id == 0
        if id != 0:
            results = committeeResultModel.objects.filter(election_committee=id)
            # Update the output with the actual results
            for result in results:
                committee_id_str = str(result.election_committee.id)
                candidate_id_str = str(getattr(result, item_id))
                output[committee_id_str][candidate_id_str] = result.votes

        # If "output" is the main key in the response
        return Response({"data": output, "result_type": result_type, "count": sum(len(candidates) for candidates in output.values()), "code": 200})
