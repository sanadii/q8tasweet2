# from apps.elections.models import Election
from django.http import JsonResponse
from django.http.response import JsonResponse
from django.db.models import Sum
from django.shortcuts import render
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.core.exceptions import ValidationError
import json

from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination

# Campaign App
from apps.campaigns.models import Campaign, CampaignMember
from apps.campaigns.serializers import CampaignSerializer, CampaignMemberSerializer

# Election App
from apps.elections.models import (
    Election,
    ElectionCategory,
    ElectionCandidate,
    ElectionParty,
    ElectionPartyCandidate,
    ElectionCommittee,
    ElectionCommitteeResult,
    ElectionPartyCommitteeResult,
    ElectionPartyCandidateCommitteeResult,
)

from apps.elections.serializers import (
    ElectionSerializer,
    CategoriesSerializer,
    SubCategoriesSerializer,
    ElectionCommitteeSerializer,
    ElectionCandidateSerializer,
    ElectionPartySerializer,
    ElectionPartyCandidateSerializer,
    ElectionCommitteeResultSerializer,
)

# Utils
from helper.views_helper import CustomPagination

from apps.elections.utils import ( get_election_committee_results )


def index(request):
    return render(request, "index.html")

# Election: getElection, deleteElection, addElection, updateElection
class CustomPagination(PageNumberPagination):
    page_size = 50

    def get_paginated_response(self, data):
        return Response({
            "count": self.page.paginator.count,
            "next": self.get_next_link(),
            "previous": self.get_previous_link(),
            "data": data,
        })

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
        view = self.request.query_params.get('view', None)
        if view in ['index', 'public']:
            return [AllowAny()]
        elif view == 'admin':
            return [IsAuthenticated()]
        return [AllowAny()]

    def get(self, request, *args, **kwargs):
        view = request.query_params.get('view', None)
        now = timezone.now()

        try:
            if view == 'index':
                elections_data = Election.objects.filter(status=6, deleted=0)
                response_data = self.handle_index_view(elections_data, now)

            elif view == 'public':
                elections_data = Election.objects.filter(status=6, deleted=0).order_by('-due_date')
                response_data = self.handle_public_view(elections_data)

            elif view == 'admin':
                elections_data = Election.objects.all().order_by('-due_date')
                response_data = self.handle_admin_view(elections_data)

            else:
                raise ValidationError("Invalid view parameter")

            return Response({'data': response_data, 'code': 200})

        except ValidationError as e:
            return Response({"message": str(e)})

    def handle_index_view(self, queryset, now):
        electionFuture = queryset.filter(due_date__gt=now).order_by('due_date')[:10]
        electionRecent = queryset.filter(due_date__lte=now).order_by('-due_date')[:12]
        context = {"request": self.request}
        return {
            'futureElections': ElectionSerializer(electionFuture, many=True, context=context).data,
            'recentElections': ElectionSerializer(electionRecent, many=True, context=context).data
        }

    def handle_public_view(self, queryset):
        paginator = CustomPagination()
        paginated_elections = paginator.paginate_queryset(queryset, self.request)
        context = {"request": self.request}
        return {
            'elections': ElectionSerializer(paginated_elections, many=True, context=context).data
        }

    def handle_admin_view(self, queryset):
        paginator = CustomPagination()
        paginated_elections = paginator.paginate_queryset(queryset, self.request)
        context = {"request": self.request}
        return {
            'elections': ElectionSerializer(paginated_elections, many=True, context=context).data
        }




class GetElectionDetails(APIView):
    
    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        view = self.request.query_params.get('view', None)
        if view == 'public':
            return [AllowAny()]
        return [IsAuthenticated()]


    def get(self, request, slug):
        view = request.query_params.get('view', None)
        election = get_object_or_404(Election, slug=slug)
        context = {"request": request}

        election_candidates = ElectionCandidate.objects.filter(election=election).prefetch_related('candidate').only('id')
        election_parties = ElectionParty.objects.filter(election=election)
        election_party_candidates = ElectionPartyCandidate.objects.filter(
            election_party__in=election_parties
        ).select_related('candidate', 'election_party', 'election_party__election')


        election_committees = ElectionCommittee.objects.filter(election=election).select_related('election')

        response_data = {
            "electionDetails": ElectionSerializer(election, context=context).data,
            "electionCandidates": ElectionCandidateSerializer(election_candidates, many=True, context=context).data,
            "electionParties": ElectionPartySerializer(election_parties, many=True, context=context).data,
            "electionPartyCandidates": ElectionPartyCandidateSerializer(election_party_candidates, many=True, context=context).data,
            "electionCommittees": ElectionCommitteeSerializer(election_committees, many=True, context=context).data,
        }

        # Include electionCampaigns only if view is not public
        if view != 'public':
            response_data["electionCampaigns"] = self.get_election_campaigns(election, context)
            response_data["electionSorters"] = self.get_election_campaign_sorters(election, context)

        return Response({
            "data": response_data,
            "code": 200
        })


    def get_election_campaigns(self, election, context):
        election_candidate_ids = ElectionCandidate.objects.filter(election=election).values_list('id', flat=True)
        election_campaigns = Campaign.objects.filter(election_candidate__in=election_candidate_ids)
        return CampaignSerializer(election_campaigns, many=True, context=context).data
    
    def get_election_campaign_sorters(self, election, context):
        election_campaigns = Campaign.objects.filter(election_candidate__election=election)
        election_campaign_sorters = CampaignMember.objects.filter(
            campaign__in=election_campaigns, role=36  # Filter by role 36
        )
        return CampaignMemberSerializer(election_campaign_sorters, many=True, context=context).data


class AddElection(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ElectionSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({"data": serializer.data, "count": 1, "code": 200}, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UpdateElection(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, id):
        try:
            election = Election.objects.get(id=id)
        except Election.DoesNotExist:
            return Response({"error": "Election not found"}, status=404)

        serializer = ElectionSerializer(election, data=request.data, context={'request': request}, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response({"data": serializer.data, "count": 0, "code": 200})
        
        return Response(serializer.errors, status=400)


class DeleteElection(APIView):
    def delete(self, request, id):
        try:
            election = Election.objects.get(id=id)
            election.delete()
            return JsonResponse({"data": "Election deleted successfully", "count": 1, "code": 200}, safe=False)
        except Election.DoesNotExist:
            return JsonResponse({"data": "Election not found", "count": 0, "code": 404}, safe=False)


# Election Candidate
class AddNewElectionCandidate(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ElectionCandidateSerializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            serializer.save()
            return Response({"data": serializer.data, "count": 1, "code": 200}, status=200)
        return Response({"data": serializer.errors, "count": 0, "code": 400}, status=400)

class UpdateElectionCandidate(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, id):
        try:
            election_candidate = ElectionCandidate.objects.get(id=id)
        except ElectionCandidate.DoesNotExist:
            return Response({"data": "Election candidate not found", "count": 0, "code": 404}, status=404)
        
        serializer = ElectionCandidateSerializer(instance=election_candidate, data=request.data, partial=True, context={'request': request})
        
        if serializer.is_valid():
            serializer.save()
            return Response({"data": serializer.data, "count": 1, "code": 200}, status=200)
        
        return Response({"data": serializer.errors, "count": 0, "code": 400}, status=400)

class DeleteElectionCandidate(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, id):
        try:
            election_candidate = ElectionCandidate.objects.get(id=id)
            election_candidate.delete()
            return Response({"data": "Election candidate deleted successfully", "count": 1, "code": 200}, status=200)
        except ElectionCandidate.DoesNotExist:
            return Response({"data": "Election candidate not found", "count": 0, "code": 404}, status=404)

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
            return Response({
                'status': 'error',
                'message': 'Some candidates not found',
                'not_found_candidates': not_found_candidates
            }, status=status.HTTP_404_NOT_FOUND)
        
        # If all candidates were found and updated, return a 200
        return Response({
            'status': 'success',
            'message': 'Votes updated successfully',
            'data': updated_candidates,
            "count": 0,
            "code": status.HTTP_200_OK
        }, status=status.HTTP_200_OK)



# Election Party
class AddElectionParty(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ElectionPartySerializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            serializer.save()
            return Response({"data": serializer.data, "count": 1, "code": 200}, status=200)
        return Response({"data": serializer.errors, "count": 0, "code": 400}, status=400)

class UpdateElectionParty(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, id):
        try:
            election_party = ElectionParty.objects.get(id=id)
        except ElectionParty.DoesNotExist:
            return Response({"data": "Election party not found", "count": 0, "code": 404}, status=404)
        
        serializer = ElectionPartySerializer(instance=election_party, data=request.data, partial=True, context={'request': request})
        
        if serializer.is_valid():
            serializer.save()
            return Response({"data": serializer.data, "count": 1, "code": 200}, status=200)
        
        return Response({"data": serializer.errors, "count": 0, "code": 400}, status=400)

class DeleteElectionParty(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, id):
        try:
            election_party = ElectionParty.objects.get(id=id)
            election_party.delete()
            return Response({"data": "Election party deleted successfully", "count": 1, "code": 200}, status=200)
        except ElectionParty.DoesNotExist:
            return Response({"data": "Election party not found", "count": 0, "code": 404}, status=404)
        

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
            return Response({
                'status': 'error',
                'message': 'Some parties not found',
                'not_found_parties': not_found_parties
            }, status=status.HTTP_404_NOT_FOUND)
        
        # If all parties were found and updated, return a 200
        return Response({
            'status': 'success',
            'message': 'Votes updated successfully',
            'data': updated_parties,
            "count": 0,
            "code": status.HTTP_200_OK
        }, status=status.HTTP_200_OK)


# Election Party Candidates
class AddElectionPartyCandidate(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ElectionPartyCandidateSerializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            serializer.save()
            return Response({"data": serializer.data, "count": 1, "code": 200}, status=200)
        return Response({"data": serializer.errors, "count": 0, "code": 400}, status=400)

class UpdateElectionPartyCandidate(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, id):
        try:
            election_party = ElectionPartyCandidate.objects.get(id=id)
        except ElectionPartyCandidate.DoesNotExist:
            return Response({"data": "Election party not found", "count": 0, "code": 404}, status=404)
        
        serializer = ElectionPartyCandidateSerializer(instance=election_party, data=request.data, partial=True, context={'request': request})
        
        if serializer.is_valid():
            serializer.save()
            return Response({"data": serializer.data, "count": 1, "code": 200}, status=200)
        
        return Response({"data": serializer.errors, "count": 0, "code": 400}, status=400)

class DeleteElectionPartyCandidate(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, id):
        try:
            election_party = ElectionPartyCandidate.objects.get(id=id)
            election_party.delete()
            return Response({"data": "Election party deleted successfully", "count": 1, "code": 200}, status=200)
        except ElectionPartyCandidate.DoesNotExist:
            return Response({"data": "Election party not found", "count": 0, "code": 404}, status=404)
        


# Election Committees
class GetCommittees(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        committees_data = ElectionCommittee.objects.all()
        data_serializer = ElectionCommitteeSerializer(committees_data, many=True)

        return Response({"data": data_serializer.data, "counts": 1, "code": 200})

class AddNewElectionCommittee(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ElectionCommitteeSerializer(data=request.data, context={'request': request})

        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response({"data": serializer.data, "count": 1, "code": status.HTTP_201_CREATED})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UpdateElectionCommittee(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, id):
        try:
            committee = ElectionCommittee.objects.get(id=id)
        except ElectionCommittee.DoesNotExist:
            return Response({"error": "Committee not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ElectionCommitteeSerializer(committee, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"data": serializer.data, "count": 1, "code": status.HTTP_200_OK})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DeleteElectionCommittee(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, id):
        try:
            committee = ElectionCommittee.objects.get(id=id)
            committee.delete()
            return Response({"data": "Committee deleted successfully", "count": 1, "code": status.HTTP_200_OK})
        except ElectionCommittee.DoesNotExist:
            return Response({"error": "Committee not found"}, status=status.HTTP_404_NOT_FOUND)



class UpdateElectionResults(APIView):
    permission_classes = [IsAuthenticated]  # Assuming only authenticated users can update

    def patch(self, request, id):
        # Initialize the output dictionary
        result_type = request.data.get("result_type", "")
        if result_type == "candidates":
            resultModel = ElectionCandidate
            committeeResultModel = ElectionCommitteeResult
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
                "election_committee_id": id,
                item_id: candidate_id,  # Use the dynamic item_id
            }
            defaults = {
                "votes": votes,
                "updated_by": request.user
            }
            obj, created = committeeResultModel.objects.update_or_create(**kwargs, defaults=defaults)

            # Add the candidate's votes to the output
            committee_id_str = str(obj.election_committee_id)
            if committee_id_str not in output:
                output[committee_id_str] = {}
            output[committee_id_str][str(candidate_id)] = votes

        # Once the patch operation is done, fetch all relevant results if not id == 0
        if id != 0:
            results = committeeResultModel.objects.filter(election_committee_id=id)
            # Update the output with the actual results
            for result in results:
                committee_id_str = str(result.election_committee.id)
                candidate_id_str = str(getattr(result, item_id))
                output[committee_id_str][candidate_id_str] = result.votes

        # If "output" is the main key in the response
        return Response({"data": output, "result_type": result_type, "count": sum(len(candidates) for candidates in output.values()), "code": 200})


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
            counts["Category"][category.name] = Election.objects.filter(category=category).count()

        return Response({"data": data_serializer.data, "counts": counts, "code": 200})


class GetPublicElectionDetails(APIView):
    permission_classes = [AllowAny]
    def get(self, request, id):
        try:
            # 1. Fetch election data
            election_data = self.get_election_data(id)
            
            # 2. Fetch candidates for this election
            election_candidates = self.get_election_candidates(id)
            
            # 3. Fetch committees related to this election
            election_committees = self.get_election_committees(id)
            
            # 4. Fetch committee results for this election
            committee_results = self.get_election_committee_results(election_committees)

            # 5. Fetch campaigns for this election
            campaigns = self.get_campaigns_for_election(id)

            # Return the structured data
            return Response({
                "data": {
                    "electionDetails": election_data,
                    "electionCandidates": election_candidates,
                    "electionCommittees": election_committees,
                    "electionResults": committee_results,
                    "electionCampaigns": campaigns,

                },
                "code": 200
            })

        except Election.DoesNotExist:
            return JsonResponse({"error": "Election not found"}, status=404)

    def get_election_data(self, id):
        election = Election.objects.get(id=id)
        election_serializer = ElectionSerializer(election)
        return election_serializer.data

    def get_election_candidates(self, id):
        # Fetch the election candidates
        election_candidate = ElectionCandidate.objects.filter(election=id)
        candidate_serializer = ElectionCandidateSerializer(election_candidate, many=True)
        election_candidates = candidate_serializer.data
        
        # Aggregate votes for each candidate across all committees
        for candidate in election_candidates:
            total_votes = ElectionCommitteeResult.objects.filter(election_candidate=candidate["id"]).aggregate(total_votes=Sum("votes"))["total_votes"] or 0
            candidate["votes"] = total_votes

        # Sort the candidates by their total votes
        election_candidates.sort(key=lambda x: x["votes"])

        # Determine the number of seats from the election data
        # election = Election.objects.get(id=id)
        # number_of_seats = election.seats or 0

        # # Update the candidates" position and winner status
        # for idx, candidate in enumerate(election_candidates, start=1):
        #     candidate["position"] = str(idx)
            
        #     # Check if the candidate is a winner
        #     candidate["is_winner"] = idx <= number_of_seats


        return election_candidates

    def get_election_committees(self, id):
        election_committees = ElectionCommittee.objects.filter(election=id)
        committees_serializer = ElectionCommitteeSerializer(election_committees, many=True)
        return committees_serializer.data

    # # Showing Candidate results in all Committees
    # def get_election_committee_results(self, committees):
    #     transformed_results = {}

    #     for committee in committees:
    #         committee_id = committee["id"]
    #         committee_results = ElectionCommitteeResult.objects.filter(election_committee=committee_id)
    #         results_serializer = ElectionCommitteeResultSerializer(committee_results, many=True)

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
    def get_election_committee_results(self, committees):
        transformed_results = {}

        # Get a list of all candidate IDs
        all_candidates = ElectionCandidate.objects.all()
        all_candidate_ids = [str(candidate.id) for candidate in all_candidates]

        # Create a dictionary to store total votes for each candidate
        total_votes_per_candidate = {candidate_id: 0 for candidate_id in all_candidate_ids}

        for committee in committees:
            committee_id = str(committee["id"])
            committee_results = ElectionCommitteeResult.objects.filter(election_committee=committee_id)
            results_serializer = ElectionCommitteeResultSerializer(committee_results, many=True)

            # Initialize the committee in the results with default votes for each candidate
            transformed_results[committee_id] = {candidate_id: 0 for candidate_id in all_candidate_ids}

            for result in results_serializer.data:
                candidate_id = str(result["election_candidate"])
                votes = result["votes"]

                # Update votes for the current candidate in the current committee
                transformed_results[committee_id][candidate_id] = votes

                # Update total votes for the candidate
                total_votes_per_candidate[candidate_id] += votes

        # Sort candidates based on total votes
        sorted_candidates_by_votes = sorted(total_votes_per_candidate, key=total_votes_per_candidate.get)

        # Reconstruct the results based on sorted candidate order
        sorted_transformed_results = {}
        for committee_id, results in transformed_results.items():
            sorted_transformed_results[committee_id] = {candidate_id: results[candidate_id] for candidate_id in sorted_candidates_by_votes}

        return sorted_transformed_results

    def get_campaigns_for_election(self, id):
        election_candidate_ids = ElectionCandidate.objects.filter(election=id).values_list("id", flat=True)
        campaign = Campaign.objects.filter(election_candidate__in=election_candidate_ids)
        campaign_serializer = CampaignSerializer(campaign, many=True)
        return campaign_serializer.data


class GetCategories(APIView):
    def get(self, request):
        categories = ElectionCategory.objects.filter(parent=None).exclude(id=0)
        subcategories = ElectionCategory.objects.exclude(parent=None).exclude(id=0)
        categories_serializer = CategoriesSerializer(categories, many=True)
        subcategories_serializer = SubCategoriesSerializer(subcategories, many=True)
        return Response({"data": {"categories": categories_serializer.data, "subCategories": subcategories_serializer.data}, "code": 200})



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
            "updatedBy": category.updated_by.username
        }
        return updated_category_data
