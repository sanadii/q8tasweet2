# from apps.elections.models import Election
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination

from utils.schema import schema_context

# Campaign App
# from apps.campaigns.models import Campaign, CampaignMember
# from apps.campaigns.serializers import CampaignSerializer, CampaignMemberSerializer

# Election App
from apps.elections.candidates.models import (
    ElectionCandidate,
    ElectionParty,
    ElectionPartyCandidate,
)

from apps.elections.candidates.serializers import (
    ElectionCandidateSerializer,
    ElectionPartySerializer,
    ElectionPartyCandidateSerializer,
)

# Utils
from utils.views_helper import CustomPagination

# Election Candidate
class AddNewElectionCandidate(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ElectionCandidateSerializer(
            data=request.data, context={"request": request}
        )

        if serializer.is_valid():
            serializer.save()
            return Response(
                {"data": serializer.data, "count": 1, "code": 200}, status=200
            )
        return Response(
            {"data": serializer.errors, "count": 0, "code": 400}, status=400
        )


class UpdateElectionCandidate(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, id):
        try:
            election_candidate = ElectionCandidate.objects.get(id=id)
        except ElectionCandidate.DoesNotExist:
            return Response(
                {"data": "Election candidate not found", "count": 0, "code": 404},
                status=404,
            )

        serializer = ElectionCandidateSerializer(
            instance=election_candidate,
            data=request.data,
            partial=True,
            context={"request": request},
        )

        if serializer.is_valid():
            serializer.save()
            return Response(
                {"data": serializer.data, "count": 1, "code": 200}, status=200
            )

        return Response(
            {"data": serializer.errors, "count": 0, "code": 400}, status=400
        )


class DeleteElectionCandidate(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, id):
        try:
            election_candidate = ElectionCandidate.objects.get(id=id)
            election_candidate.delete()
            return Response(
                {
                    "data": "Election candidate is deleted successfully",
                    "count": 1,
                    "code": 200,
                },
                status=200,
            )
        except ElectionCandidate.DoesNotExist:
            return Response(
                {"data": "Election candidate not found", "count": 0, "code": 404},
                status=404,
            )


class UpdateElectionCandidateVotes(APIView):
    def patch(self, request, *args, **kwargs):
        # Extract the payload from the request
        votes_data = request.data

        # This will hold any candidates that couldn't be found
        not_found_candidates = []
        # This will hold the candidates that have been updated
        updated_candidates = []

        for candidate_id, votes in votes_data.items():
            try:
                # Find the candidate by id
                candidate = ElectionCandidate.objects.get(id=candidate_id)
                # Update the votes
                candidate.votes = votes
                candidate.save()

                # Append the updated candidate's data
                updated_candidates.append(ElectionCandidateSerializer(candidate).data)
            except ElectionCandidate.DoesNotExist:
                # If candidate doesn't exist, add to the not_found list
                not_found_candidates.append(candidate_id)

        # If there were any not found candidates, return a 404
        if not_found_candidates:
            return Response(
                {
                    "status": "error",
                    "message": "Some candidates not found",
                    "not_found_candidates": not_found_candidates,
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        # If all candidates were found and updated, return a 200
        return Response(
            {
                "status": "success",
                "message": "Votes updated successfully",
                "data": updated_candidates,
                "count": 0,
                "code": status.HTTP_200_OK,
            },
            status=status.HTTP_200_OK,
        )


# Election Party
class AddElectionParty(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ElectionPartySerializer(
            data=request.data, context={"request": request}
        )

        if serializer.is_valid():
            serializer.save()
            return Response(
                {"data": serializer.data, "count": 1, "code": 200}, status=200
            )
        return Response(
            {"data": serializer.errors, "count": 0, "code": 400}, status=400
        )


class UpdateElectionParty(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, id):
        try:
            election_party = ElectionParty.objects.get(id=id)
        except ElectionParty.DoesNotExist:
            return Response(
                {"data": "Election party not found", "count": 0, "code": 404},
                status=404,
            )

        serializer = ElectionPartySerializer(
            instance=election_party,
            data=request.data,
            partial=True,
            context={"request": request},
        )

        if serializer.is_valid():
            serializer.save()
            return Response(
                {"data": serializer.data, "count": 1, "code": 200}, status=200
            )

        return Response(
            {"data": serializer.errors, "count": 0, "code": 400}, status=400
        )


class DeleteElectionParty(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, id):
        try:
            election_party = ElectionParty.objects.get(id=id)
            election_party.delete()
            return Response(
                {
                    "data": "Election party is deleted successfully",
                    "count": 1,
                    "code": 200,
                },
                status=200,
            )
        except ElectionParty.DoesNotExist:
            return Response(
                {"data": "Election party not found", "count": 0, "code": 404},
                status=404,
            )


class UpdateElectionPartyVotes(APIView):
    def patch(self, request, *args, **kwargs):
        # Extract the payload from the request
        votes_data = request.data

        # This will hold any parties that couldn't be found
        not_found_parties = []
        # This will hold the parties that have been updated
        updated_parties = []

        for party_id, votes in votes_data.items():
            try:
                # Find the party by id
                party = ElectionParty.objects.get(id=party_id)
                # Update the votes
                party.votes = votes
                party.save()

                # Append the updated party's data
                updated_parties.append(ElectionPartySerializer(party).data)
            except ElectionParty.DoesNotExist:
                # If party doesn't exist, add to the not_found list
                not_found_parties.append(party_id)

        # If there were any not found parties, return a 404
        if not_found_parties:
            return Response(
                {
                    "status": "error",
                    "message": "Some parties not found",
                    "not_found_parties": not_found_parties,
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        # If all parties were found and updated, return a 200
        return Response(
            {
                "status": "success",
                "message": "Votes updated successfully",
                "data": updated_parties,
                "count": 0,
                "code": status.HTTP_200_OK,
            },
            status=status.HTTP_200_OK,
        )


# Election Party Candidates
class AddElectionPartyCandidate(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ElectionPartyCandidateSerializer(
            data=request.data, context={"request": request}
        )

        if serializer.is_valid():
            serializer.save()
            return Response(
                {"data": serializer.data, "count": 1, "code": 200}, status=200
            )
        return Response(
            {"data": serializer.errors, "count": 0, "code": 400}, status=400
        )


class UpdateElectionPartyCandidate(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, id):
        try:
            election_party = ElectionPartyCandidate.objects.get(id=id)
        except ElectionPartyCandidate.DoesNotExist:
            return Response(
                {"data": "Election party not found", "count": 0, "code": 404},
                status=404,
            )

        serializer = ElectionPartyCandidateSerializer(
            instance=election_party,
            data=request.data,
            partial=True,
            context={"request": request},
        )

        if serializer.is_valid():
            serializer.save()
            return Response(
                {"data": serializer.data, "count": 1, "code": 200}, status=200
            )

        return Response(
            {"data": serializer.errors, "count": 0, "code": 400}, status=400
        )


class DeleteElectionPartyCandidate(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, id):
        try:
            election_party = ElectionPartyCandidate.objects.get(id=id)
            election_party.delete()
            return Response(
                {
                    "data": "Election party is deleted successfully",
                    "count": 1,
                    "code": 200,
                },
                status=200,
            )
        except ElectionPartyCandidate.DoesNotExist:
            return Response(
                {"data": "Election party not found", "count": 0, "code": 404},
                status=404,
            )