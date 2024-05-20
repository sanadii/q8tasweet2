# from apps.elections.models import Election
import json
import csv
from django.db import connection
from django.db.models import Sum
from django.http import JsonResponse
from django.http.response import JsonResponse
from django.shortcuts import render
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.core.exceptions import ValidationError
from django.views import View

from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination

# Campaign App
# from apps.campaigns.models import Campaign, CampaignMember
# from apps.campaigns.serializers import CampaignSerializer, CampaignMemberSerializer

# Election App
from apps.elections.models import (
    Election,
    ElectionCategory,
    ElectionCandidate,
    ElectionParty,
    ElectionPartyCandidate,
)

from psycopg2 import OperationalError, ProgrammingError

from apps.areas.models import Area
from apps.committees.models import CommitteeSite, Committee

# Schema Serializers
from apps.areas.serializers import AreaSerializer
from apps.committees.serializers import CommitteeSerializer, CommitteeSiteSerializer
from django.apps import apps

# Schema Models

# from apps.committees.models import Committee, CommitteeGroup

from apps.elections.serializers import (
    ElectionSerializer,
    CategoriesSerializer,
    SubCategoriesSerializer,
    ElectionCandidateSerializer,
    ElectionPartySerializer,
    ElectionPartyCandidateSerializer,
    # CommitteeResultSerializer,
)


# Utils
from utils.views_helper import CustomPagination
from utils.schema import schema_context

# from apps.elections.utils import get_election_committee_results


def index(request):
    return render(request, "index.html")


# Election: getElection, deleteElection, addElection, updateElection
# View: Public / Admin
class GetElections(APIView):
    """
    Instantiates and returns the list of permissions that this view requires.
    Views: Index / Public / Admin
    """

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        view = self.request.query_params.get("view", None)
        if view in ["index", "public"]:
            return [AllowAny()]
        elif view == "admin":
            return [IsAuthenticated()]
        return [AllowAny()]

    def get(self, request, *args, **kwargs):
        view = request.query_params.get("view", None)
        now = timezone.now()

        try:
            if view == "index":
                elections_data = Election.objects.filter(status=6, is_deleted=0)
                response_data = self.handle_index_view(elections_data, now)

            elif view == "public":
                elections_data = Election.objects.filter(status=6, is_deleted=0).order_by(
                    "-due_date"
                )
                response_data = self.handle_public_view(elections_data)

            elif view == "admin":
                elections_data = Election.objects.all().order_by("-due_date")
                response_data = self.handle_admin_view(elections_data)

            else:
                raise ValidationError("Invalid view parameter")

            return Response({"data": response_data, "code": 200})

        except ValidationError as e:
            return Response({"message": str(e)})

    def handle_index_view(self, queryset, now):
        electionFuture = queryset.filter(due_date__gt=now).order_by("due_date")[:10]
        electionRecent = queryset.filter(due_date__lte=now).order_by("-due_date")[:12]
        context = {"request": self.request}
        return {
            "futureElections": ElectionSerializer(
                electionFuture, many=True, context=context
            ).data,
            "recentElections": ElectionSerializer(
                electionRecent, many=True, context=context
            ).data,
        }

    def handle_public_view(self, queryset):
        paginator = CustomPagination()
        paginated_elections = paginator.paginate_queryset(queryset, self.request)
        context = {"request": self.request}
        return {
            "elections": ElectionSerializer(
                paginated_elections, many=True, context=context
            ).data
        }

    def handle_admin_view(self, queryset):
        paginator = CustomPagination()
        paginated_elections = paginator.paginate_queryset(queryset, self.request)
        context = {"request": self.request}
        return {
            "elections": ElectionSerializer(
                paginated_elections, many=True, context=context
            ).data
        }


class GetElectionDetails(APIView):
    def get_permissions(self):
        """ Dynamically set permissions based on the 'view' query parameter. """
        if self.request.query_params.get("view") == "public":
            return [AllowAny()]
        return [IsAuthenticated()]

    def get(self, request, slug):
        election = get_object_or_404(Election, slug=slug)
        
        context = {"request": request}

        # Optimize queries by prefetching and selecting necessary fields
        election_candidates = ElectionCandidate.objects.filter(election=election).prefetch_related('candidate').only('id')
        election_parties = ElectionParty.objects.filter(election=election)
        election_party_candidates = ElectionPartyCandidate.objects.filter(
            election_party__in=election_parties).select_related('candidate', 'election_party')

        response_data = {
            # "electionSchema": schemaserializer(election, context=context).data,
            "electionDetails": ElectionSerializer(election, context=context).data,
            "electionCandidates": ElectionCandidateSerializer(
                election_candidates, many=True, context=context
            ).data,
            "electionParties": ElectionPartySerializer(
                election_parties, many=True, context=context
            ).data,
            "electionPartyCandidates": ElectionPartyCandidateSerializer(
                election_party_candidates, many=True, context=context
            ).data,
        }

        get_schema_details_and_content(context, slug, response_data)

        return Response({"data": response_data, "code": 200})


# Fetching model verbose_name_plural
model_verbose_names = {
    model._meta.db_table: model._meta.verbose_name_plural for model in apps.get_models()
}



def get_schema_details_and_content(context, slug, response_data):
    with schema_context(slug) as election:
        if isinstance(election, Response):
            return election

        try:
            schema_name = slug.replace("-", "_")
            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    SELECT schemaname, tablename
                    FROM pg_catalog.pg_tables
                    WHERE schemaname = %s
                """,
                    [schema_name],
                )
                schema_tables = [
                    {
                        "schema": row[0],
                        "table": row[1],
                        "name": model_verbose_names.get(row[1], None),
                    }
                    for row in cursor.fetchall()
                ]

            response_data["schemaDetails"] = {
                "schemaName": schema_name,
                "schemaTables": schema_tables,
            }

        except (OperationalError, ProgrammingError) as e:
            response_data["schemaDetailsError"] = str(e)

        try:
            election_committee_sites = CommitteeSite.objects.prefetch_related('committee_site_committees').all()
            if election_committee_sites.exists():
                committees_data = CommitteeSiteSerializer(
                    election_committee_sites, many=True, context=context
                ).data
                response_data["election_committee_sites"] = committees_data
        except Exception as e:
            response_data["committeeDataError"] = str(e)

        try:
            election_committee_areas = Area.objects.all()
            if election_committee_areas.exists():
                areas_data = AreaSerializer(
                    election_committee_areas, many=True, context=context
                ).data
                response_data["election_areas"] = areas_data
        except Exception as e:
            response_data["areaDataError"] = str(e)

    return Response(response_data)


# class GetElectionDetails(APIView):

#     def get_permissions(self):
#         """
#         Instantiates and returns the list of permissions that this view requires.
#         """
#         view = self.request.query_params.get("view", None)
#         if view == "public":
#             return [AllowAny()]
#         return [IsAuthenticated()]

#     def get(self, request, slug):
#         election = get_object_or_404(Election, slug=slug)
#         context = {"request": request}

#         election_candidates = (
#             ElectionCandidate.objects.filter(election=election)
#             .prefetch_related("candidate")
#             .only("id")
#         )
#         election_parties = ElectionParty.objects.filter(election=election)
#         election_party_candidates = ElectionPartyCandidate.objects.filter(
#             election_party__in=election_parties
#         ).select_related("candidate", "election_party", "election_party__election")

#         # Use the schema context manager
#         with schema_context(slug):
#             election_committees = Committee.objects.all()

#             # Serialize data outside the context manager
#             committees_data = CommitteeSerializer(election_committees, many=True, context=context).data


#         response_data = {
#             "electionDetails": ElectionSerializer(election, context=context).data,
#             "electionCandidates": ElectionCandidateSerializer(
#                 election_candidates, many=True, context=context
#             ).data,
#             "electionParties": ElectionPartySerializer(
#                 election_parties, many=True, context=context
#             ).data,
#             "electionPartyCandidates": ElectionPartyCandidateSerializer(
#                 election_party_candidates, many=True, context=context
#             ).data,
#             "electionCommittees": committees_data,
#         }

#         # Include electionCampaigns only if view is not public
#         # if view != "public":
#         #     response_data["electionCampaigns"] = self.get_election_campaigns(
#         #         election, context
#         #     )
#         #     response_data["electionSorters"] = self.get_election_campaign_sorters(
#         #         election, context
#         #     )

#         return Response({"data": response_data, "code": 200})

#     # def get_election_campaigns(self, election, context):
#     #     election_candidate_ids = ElectionCandidate.objects.filter(
#     #         election=election
#     #     ).values_list("id", flat=True)
#     #     election_campaigns = Campaign.objects.filter(
#     #         election_candidate__in=election_candidate_ids
#     #     )
#     #     return CampaignSerializer(election_campaigns, many=True, context=context).data

#     # def get_election_campaign_sorters(self, election, context):
#     #     election_campaigns = Campaign.objects.filter(
#     #         election_candidate__election=election
#     #     )
#     #     election_campaign_sorters = CampaignMember.objects.filter(
#     #         campaign__in=election_campaigns, role=36  # Filter by role 36
#     #     )
#     #     return CampaignMemberSerializer(
#     #         election_campaign_sorters, many=True, context=context
#     #     ).data


class AddElection(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ElectionSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"data": serializer.data, "count": 1, "code": 200},
                status=status.HTTP_201_CREATED,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UpdateElection(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, id):
        try:
            election = Election.objects.get(id=id)
        except Election.DoesNotExist:
            return Response({"error": "Election not found"}, status=404)

        serializer = ElectionSerializer(
            election, data=request.data, context={"request": request}, partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response({"data": serializer.data, "count": 0, "code": 200})

        return Response(serializer.errors, status=400)


class DeleteElection(APIView):
    def delete(self, request, id):
        try:
            election = Election.objects.get(id=id)
            election.delete()
            return JsonResponse(
                {"data": "Election is deleted successfully", "count": 1, "code": 200},
                safe=False,
            )
        except Election.DoesNotExist:
            return JsonResponse(
                {"data": "Election not found", "count": 0, "code": 404}, safe=False
            )


class UploadElectionData(View):
    def post(self, request):
        file = request.FILES["file"]
        reader = csv.reader(file.read().decode("utf-8").splitlines())
        for row in reader:
            # Assuming the CSV file has name and year columns
            Election.objects.create(name=row[0], year=row[1])
        return JsonResponse({"status": "success"})

    def get(self, request):
        # Handle GET request if necessary, or remove this method
        return JsonResponse({"status": "error"}, status=400)


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


class GetPublicElections(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        elections_data = Election.objects.all()
        data_serializer = ElectionSerializer(elections_data, many=True)

        # Fetch categories with parent equal to NULL
        category_options = ElectionCategory.objects.filter(parent__isnull=True)

        # Initialize count dictionary
        counts = {
            "All Election": Election.objects.count(),
            "Category": {category.name: 0 for category in category_options},
        }

        # Count total for each category
        for category in category_options:
            counts["Category"][category.name] = Election.objects.filter(
                category=category
            ).count()

        return Response({"data": data_serializer.data, "counts": counts, "code": 200})


class GetPublicElectionDetails(APIView):
    permission_classes = [AllowAny]

    def get(self, request, id):
        try:
            # 1. Fetch election data
            election_data = self.get_election_data(id)

            # 2. Fetch candidates for this election
            election_candidates = self.get_election_candidates(id)

            # # 3. Fetch committees related to this election
            # election_committees = self.get_election_committees(id)

            # # 4. Fetch committee results for this election
            # committee_results = self.get_election_committee_results(election_committees)

            # # 5. Fetch campaigns for this election
            # campaigns = self.get_campaigns_for_election(id)

            # Return the structured data
            return Response(
                {
                    "data": {
                        "electionDetails": election_data,
                        "electionCandidates": election_candidates,
                        # "electionCommittees": election_committees,
                        # "electionResults": committee_results,
                        # "electionCampaigns": campaigns,
                    },
                    "code": 200,
                }
            )

        except Election.DoesNotExist:
            return JsonResponse({"error": "Election not found"}, status=404)

    def get_election_data(self, id):
        election = Election.objects.get(id=id)
        election_serializer = ElectionSerializer(election)
        return election_serializer.data

    def get_election_candidates(self, id):
        # Fetch the election candidates
        election_candidate = ElectionCandidate.objects.filter(election=id)
        candidate_serializer = ElectionCandidateSerializer(
            election_candidate, many=True
        )
        election_candidates = candidate_serializer.data

        # Aggregate votes for each candidate across all committees
        # for candidate in election_candidates:
        #     total_votes = (
        #         CommitteeResult.objects.filter(
        #             election_candidate=candidate["id"]
        #         ).aggregate(total_votes=Sum("votes"))["total_votes"]
        #         or 0
        #     )
        #     candidate["votes"] = total_votes

        # Sort the candidates by their total votes
        # election_candidates.sort(key=lambda x: x["votes"])

        # Determine the number of seats from the election data
        # election = Election.objects.get(id=id)
        # number_of_seats = election.seats or 0

        # # Update the candidates" position and winner status
        # for idx, candidate in enumerate(election_candidates, start=1):
        #     candidate["position"] = str(idx)

        #     # Check if the candidate is a winner
        #     candidate["is_winner"] = idx <= number_of_seats

        return election_candidates

    # def get_election_committees(self, id):
    #     election_committees = Committee.objects.filter(election=id)
    #     committees_serializer = CommitteeSerializer(
    #         election_committees, many=True
    #     )
    #     return committees_serializer.data

    # # Showing Candidate results in all Committees
    # def get_election_committee_results(self, committees):
    #     transformed_results = {}

    #     for committee in committees:
    #         committee_id = committee["id"]
    #         committee_results = CommitteeResult.objects.filter(election_committee=committee_id)
    #         results_serializer = CommitteeResultSerializer(committee_results, many=True)

    #         for result in results_serializer.data:
    #             candidate_id = result["election_candidate"]
    #             votes = result["votes"]

    #             # Initialize if candidate not yet in the results
    #             if candidate_id not in transformed_results:
    #                 transformed_results[candidate_id] = {}

    #             # Store votes for the current committee
    #             transformed_results[candidate_id][committee_id] = votes

    #     return transformed_results

    # Showing Committee Results for All Candidate
    # def get_election_committee_results(self, committees):
    #     transformed_results = {}

    #     # Get a list of all candidate IDs
    #     all_candidates = ElectionCandidate.objects.all()
    #     all_candidate_ids = [str(candidate.id) for candidate in all_candidates]

    #     # Create a dictionary to store total votes for each candidate
    #     total_votes_per_candidate = {
    #         candidate_id: 0 for candidate_id in all_candidate_ids
    #     }

    #     for committee in committees:
    #         committee_id = str(committee["id"])
    #         # committee_results = CommitteeResult.objects.filter(
    #         #     election_committee=committee_id
    #         # )
    #         # results_serializer = CommitteeResultSerializer(
    #         #     committee_results, many=True
    #         # )

    #         # Initialize the committee in the results with default votes for each candidate
    #         transformed_results[committee_id] = {
    #             candidate_id: 0 for candidate_id in all_candidate_ids
    #         }

    #         # for result in results_serializer.data:
    #         #     candidate_id = str(result["election_candidate"])
    #         #     votes = result["votes"]

    #         #     # Update votes for the current candidate in the current committee
    #         #     transformed_results[committee_id][candidate_id] = votes

    #         #     # Update total votes for the candidate
    #         #     total_votes_per_candidate[candidate_id] += votes

    #     # Sort candidates based on total votes
    #     sorted_candidates_by_votes = sorted(
    #         total_votes_per_candidate, key=total_votes_per_candidate.get
    #     )

    #     # Reconstruct the results based on sorted candidate order
    #     sorted_transformed_results = {}
    #     for committee_id, results in transformed_results.items():
    #         sorted_transformed_results[committee_id] = {
    #             candidate_id: results[candidate_id]
    #             for candidate_id in sorted_candidates_by_votes
    #         }

    #     return sorted_transformed_results

    # def get_campaigns_for_election(self, id):
    #     election_candidate_ids = ElectionCandidate.objects.filter(
    #         election=id
    #     ).values_list("id", flat=True)
    #     campaign = Campaign.objects.filter(
    #         election_candidate__in=election_candidate_ids
    #     )
    #     campaign_serializer = CampaignSerializer(campaign, many=True)
    #     return campaign_serializer.data


class GetCategories(APIView):
    def get(self, request):
        categories = ElectionCategory.objects.filter(parent=None).exclude(id=0)
        subcategories = ElectionCategory.objects.exclude(parent=None).exclude(id=0)
        categories_serializer = CategoriesSerializer(categories, many=True)
        subcategories_serializer = SubCategoriesSerializer(subcategories, many=True)
        return Response(
            {
                "data": {
                    "categories": categories_serializer.data,
                    "subCategories": subcategories_serializer.data,
                },
                "code": 200,
            }
        )


class UpdateCategory(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, id):
        try:
            category = ElectionCategory.objects.get(id=id)
        except ElectionCategory.DoesNotExist:
            return Response({"error": "Category not found"}, status=404)

        # Extract the desired fields from the request data
        name = request.data.get("name")
        image = request.data.get("image")
        parent = request.data.get("parent")

        updated_by = request.user

        # Update the category object with the new values
        category.name = name if name else category.name
        if image:
            category.image = image
        if parent:
            category.parent = Category.objects.get(id=parent)

        # System
        category.updated_by = updated_by

        category.save()

        # Prepare the updated category data for response
        updated_category_data = self.prepare_updated_category_data(category)

        return Response({"data": updated_category_data, "count": 0, "code": 200})

    def prepare_updated_category_data(self, category):
        updated_category_data = {
            "id": category.id,
            "name": category.name,
            "image": category.image.url if category.image else None,
            "parent": category.parent.id if category.parent else None,
            "updatedBy": category.updated_by.username,
        }
        return updated_category_data
