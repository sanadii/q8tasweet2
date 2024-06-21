# from apps.elections.models import Election
import json
import csv

from django.core.exceptions import ValidationError
from django.db.models import Sum
from django.http import JsonResponse
from django.http.response import JsonResponse
from django.shortcuts import render
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.views import View

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
from apps.elections.models import (
    Election,
    ElectionCategory,
)

from apps.elections.candidates.models import (
    ElectionCandidate,
    ElectionParty,
    ElectionPartyCandidate,
)

# Schema
from apps.schemas.committees.models import Committee
from apps.schemas.committee_results.models import (
    CommitteeResultCandidate,
    CommitteeResultParty,
    CommitteeResultPartyCandidate,
)

from apps.schemas.committees.serializers import CommitteeSerializer
from apps.schemas.committee_results.serializers import CommitteeResultCandidateSerializer

# from apps.schemas.committees.models import Committee, CommitteeGroup

from apps.elections.serializers import (
    ElectionSerializer,
    CategoriesSerializer,
    SubCategoriesSerializer,
)

from apps.elections.candidates.serializers import (
    ElectionCandidateSerializer,
    ElectionPartySerializer,
    ElectionPartyCandidateSerializer,
)


# Utils
from utils.views_helper import CustomPagination

# from apps.elections.utils import get_election_committee_results


# Election Committees
class GetCommittees(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        committees_data = Committee.objects.all()
        data_serializer = CommitteeSerializer(committees_data, many=True)

        return Response({"data": data_serializer.data, "counts": 1, "code": 200})


class AddCommittee(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CommitteeSerializer(
            data=request.data, context={"request": request}
        )

        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response(
                {"data": serializer.data, "count": 1, "code": status.HTTP_201_CREATED}
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UpdateCommittee(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, id):
        try:
            committee = Committee.objects.get(id=id)
        except Committee.DoesNotExist:
            return Response(
                {"error": "Committee not found"}, status=status.HTTP_404_NOT_FOUND
            )

        serializer = CommitteeSerializer(committee, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"data": serializer.data, "count": 1, "code": status.HTTP_200_OK}
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeleteCommittee(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, id):
        try:
            committee = Committee.objects.get(id=id)
            committee.delete()
            return Response(
                {
                    "data": "Committee is deleted successfully",
                    "count": 1,
                    "code": status.HTTP_200_OK,
                }
            )
        except Committee.DoesNotExist:
            return Response(
                {"error": "Committee not found"}, status=status.HTTP_404_NOT_FOUND
            )


class UpdateElectionResults(APIView):
    permission_classes = [
        IsAuthenticated
    ]  # Assuming only authenticated users can update

    def patch(self, request, id):
        # Initialize the output dictionary
        schema = request.data.get("election_slug", "")
        is_detailed_results = request.data.get("is_detailed_results", "")
        election_method = request.data.get("election_method", "")
        committee_id = id
        output = {"0": {}} if committee_id == 0 else {}

        if election_method in ["candidateOnly", "partyCandidateOriented"]:
            participant_model = ElectionCandidate
            committeeResultModel = CommitteeResultCandidate
            participant_id = "election_candidate"

        # # elif result_type == "parties":
        # #     participant_model = ElectionParty
        # #     committeeResultModel = PartyCommitteeResult
        # #     participant_id = "election_party_id"

        # # elif result_type == "partyCandidates":
        # #     participant_model = ElectionPartyCandidate
        # #     committeeResultModel = PartyCandidateCommitteeResult
        # #     participant_id = "election_party_candidate_id"

        if not is_detailed_results:
            # update participant (Candidate, Party, PartyCandidate) Total Votes
            update_participant_total_votes(request, participant_model, output)
            count = len(output["0"])

        # For detailed results
        if is_detailed_results:
            # Update Committee Results
            update_committee_results(
                request,
                schema,
                committeeResultModel,
                participant_id,
                output,
                committee_id,
            )

            update_participant_committee_aggregated_votes(
                request,
                schema,
                committeeResultModel,
                participant_model,
                committee_id,
                participant_id,
            )
            count = sum(len(candidates) for candidates in output.values())

        # Return the response
        return Response(
            {
                "data": output,
                "election_method": election_method,
                "is_detailed_results": is_detailed_results,
                "count": count,
                "code": 200,
            }
        )


def update_participant_total_votes(request, participant_model, output):
    for candidate_id, votes in request.data.get("data", {}).items():
        try:
            candidate = participant_model.objects.get(id=candidate_id)
            # Update the votes, ensuring that votes is an integer
            candidate.votes = int(votes)
            candidate.save()
            # Add the candidate's votes to the output under committee "0"
            output["0"][str(candidate_id)] = int(votes)
        except participant_model.DoesNotExist:
            # Handle the case where the participant_model does not exist
            return Response(
                {
                    "message": f"Candidate with id {candidate_id} does not exist.",
                    "code": 404,
                },
                status=404,
            )
        except ValueError:
            # Handle the case where votes is not a valid integer
            return Response(
                {
                    "message": f"Invalid votes value for candidate {candidate_id}.",
                    "code": 400,
                },
                status=400,
            )

def update_committee_results(
    request, schema, committeeResultModel, participant_id, output, committee_id
):
    with schema_context(schema):
        # For all other ids, perform the usual update_or_create operation
        for candidate_id, votes in request.data.get("data", {}).items():
            kwargs = {
                "committee_id": committee_id,
                participant_id: candidate_id,  # Use the dynamic participant_id
            }
            defaults = {"votes": votes}
            obj, created = committeeResultModel.objects.update_or_create(
                **kwargs, defaults=defaults
            )

            # Add the candidate's votes to the output
            committee_id_str = str(obj.committee_id)
            if committee_id_str not in output:
                output[committee_id_str] = {}
            output[committee_id_str][str(candidate_id)] = votes

        results = committeeResultModel.objects.filter(committee=committee_id)
        # Update the output with the actual results
        for result in results:
            committee_id_str = str(result.committee_id)
            candidate_id_str = str(getattr(result, participant_id))
            if committee_id_str not in output:
                output[committee_id_str] = {}
            output[committee_id_str][candidate_id_str] = result.votes


def update_participant_committee_aggregated_votes(
    request,
    schema,
    committeeResultModel,
    participant_model,
    committee_id,
    participant_id,
):
    with schema_context(schema):
        # Step 1: Retrieve all committeeResultModel instances
        committee_results = committeeResultModel.objects.all()

        # Step 2: Aggregate the votes for each participant_id
        aggregated_votes = committee_results.values(participant_id).annotate(
            total_votes=Sum("votes")
        )

        # Step 3: Update the corresponding participant_model instance with the aggregated vote count
        for result in aggregated_votes:
            try:
                participant_instance = participant_model.objects.get(
                    id=result[participant_id]
                )
                participant_instance.votes = result["total_votes"]
                participant_instance.save()
            except participant_model.DoesNotExist:
                print(f"Participant with id {result[participant_id]} does not exist.")
            except Exception as e:
                print(
                    f"An error occurred while updating votes for participant {result[participant_id]}: {e}"
                )

    print("update_participant_committee_aggregated_votes completed")



# def update_committee_results(
#     request, schema, committeeResultModel, participant_id, output, committee_id
# ):
#     with schema_context(schema):
#         # For all other ids, perform the usual update_or_create operation
#         for candidate_id, votes in request.data.get("data", {}).items():
#             kwargs = {
#                 "committee_id": committee_id,
#                 participant_id: candidate_id,  # Use the dynamic participant_id
#             }
#             defaults = {"votes": votes, "updated_by": request.user}
#             obj, created = committeeResultModel.objects.update_or_create(
#                 **kwargs, defaults=defaults
#             )

#             # Add the candidate's votes to the output
#             committee_id_str = str(obj.committee_id)
#             if committee_id_str not in output:
#                 output[committee_id_str] = {}
#             output[committee_id_str][str(candidate_id)] = votes

#         results = committeeResultModel.objects.filter(committee=committee_id)
#         # Update the output with the actual results
#         for result in results:
#             committee_id_str = str(result.committee_id)
#             candidate_id_str = str(getattr(result, participant_id))
#             if committee_id_str not in output:
#                 output[committee_id_str] = {}
#             output[committee_id_str][candidate_id_str] = result.votes


# def update_participant_committee_aggregated_votes(
#     request,
#     schema,
#     committeeResultModel,
#     participant_model,
#     committee_id,
#     participant_id,
# ):
#     with schema_context(schema):
#         # Step 1: Retrieve all committeeResultModel instances
#         committee_results = committeeResultModel.objects.all()

#         # Step 2: Aggregate the votes for each participant_id
#         aggregated_votes = committee_results.values(participant_id).annotate(
#             total_votes=Sum("votes")
#         )

#         # Step 3: Update the corresponding participant_model instance with the aggregated vote count
#         for result in aggregated_votes:
#             try:
#                 participant_instance = participant_model.objects.get(
#                     id=result[participant_id]
#                 )
#                 participant_instance.votes = result["total_votes"]
#                 participant_instance.save()
#             except participant_model.DoesNotExist:
#                 print(f"Participant with id {result[participant_id]} does not exist.")
#             except Exception as e:
#                 print(
#                     f"An error occurred while updating votes for participant {result[participant_id]}: {e}"
#                 )

#     print("update_participant_committee_aggregated_votes completed")
