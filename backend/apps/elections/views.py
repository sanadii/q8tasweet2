# from apps.elections.models import Election
from django.http import JsonResponse
from django.http.response import JsonResponse
from django.db.models import Sum
from django.shortcuts import render
from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination

# Models
from apps.campaigns.models import (
    Campaign,
    CampaignMember,
    CampaignGuarantee,
    CampaignAttendee,
)

from apps.elections.models import (
    Election,
    ElectionCategory,
    ElectionCandidate,
    ElectionCommittee,
    ElectionCommitteeResult,
)


# Serializers
from apps.campaigns.serializers import CampaignSerializer
from apps.elections.serializers import (
    ElectionSerializer,
    CategoriesSerializer,
    SubCategoriesSerializer,
    ElectionCommitteesSerializer,
    ElectionCandidateSerializer,
    ElectionCommitteeResultSerializer,
)
from helper.views_helper import CustomPagination


def index(request):
    return render(request, "index.html")

# Election: getElection, deleteElection, addElection, updateElection, ElectionCount
class CustomPagination(PageNumberPagination):
    page_size = 50

    def get_paginated_response(self, data):
        return Response({
            "count": self.page.paginator.count,
            "next": self.get_next_link(),
            "previous": self.get_previous_link(),
            "data": data,
        })

class GetElections(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, *args, **kwargs):
        elections_data = Election.objects.all()
        paginator = CustomPagination()
        paginated_elections = paginator.paginate_queryset(elections_data, request)
        
        # Passing context with request to the serializer
        context = {"request": request}
        data_serializer = ElectionSerializer(paginated_elections, many=True, context=context)
        
        return paginator.get_paginated_response(data_serializer.data)

# class GetElections(APIView):
#     permission_classes = [AllowAny]
    
#     def get(self, request, *args, **kwargs):
#         # Get all elections and order them by due_date in descending order
#         elections_data = Election.objects.all().order_by('-due_date')
        
#         # Use the paginator to paginate the queryset
#         paginator = CustomPagination()
#         paginated_elections = paginator.paginate_queryset(elections_data, request)
        
#         # Passing context with request to the serializer
#         context = {"request": request}
#         data_serializer = ElectionSerializer(paginated_elections, many=True, context=context)
        
#         return paginator.get_paginated_response(data_serializer.data)


class GetElectionDetails(APIView):
    def get(self, request, slug):
        election = get_object_or_404(Election, slug=slug)
    # def get(self, request, id):
    #     election = get_object_or_404(Election, id=id)
        context = {"request": request}

        election_candidates = ElectionCandidate.objects.filter(election=election).prefetch_related('candidate').only('id')
        election_committees = ElectionCommittee.objects.filter(election=election).select_related('election')
        election_campaigns = Campaign.objects.filter(election_candidate__election=election)

        election_committee_results = self.get_election_committee_results(election, election_candidates, election_committees)

        return Response({
            "data": {
                "electionDetails": self.get_election_data(election, context),
                "electionCandidates": self.get_election_candidates(election_candidates, context),
                "electionCommittees": self.get_election_committees(election_committees, context),
                "electionCampaigns": self.get_election_campaigns(election, context),

                # Include Election Committee Results in the response
                "electionCommitteeResults": election_committee_results,

            },
            "code": 200
        })

    def get_election_data(self, election, context):
        return ElectionSerializer(election, context=context).data

    def get_election_candidates(self, election_candidates, context):
        return ElectionCandidateSerializer(election_candidates, many=True, context=context).data

    def get_election_committees(self, election_committees, context):
        return ElectionCommitteesSerializer(election_committees, many=True, context=context).data

    def get_election_campaigns(self, election, context):
        election_candidate_ids = ElectionCandidate.objects.filter(election=election).values_list('id', flat=True)
        election_campaigns = Campaign.objects.filter(election_candidate__in=election_candidate_ids)
        return CampaignSerializer(election_campaigns, many=True, context=context).data
    
    def get_election_committee_results(self, election, election_candidates, election_committees):
        # Step 1: Initialize results dictionary
        committee_results = {str(committee.id): {str(candidate.id): 0 for candidate in election_candidates} for committee in election_committees}

        # Step 2: Fetch and update results from the database
        results = ElectionCommitteeResult.objects.filter(
            election_committee__in=election_committees,
            election_candidate__in=election_candidates
        ).values(
            'election_committee_id',
            'election_candidate_id'
        ).annotate(
            total_votes=Sum('votes')
        )
        for result in results:
            committee_id = str(result['election_committee_id'])
            candidate_id = str(result['election_candidate_id'])
            votes = result['total_votes']
            committee_results[committee_id][candidate_id] = votes

        # Step 3: Sort the candidates within each committee
        sorted_committee_results = {}
        for committee_id, candidates in committee_results.items():
            sorted_candidates = sorted(candidates.items(), key=lambda x: (-x[1], x[0]))
            sorted_committee_results[committee_id] = dict(sorted_candidates)

        return sorted_committee_results


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


# ElectionCandidate
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


# ElectionCandidate
class GetCommittees(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        committees_data = ElectionCommittee.objects.all()
        data_serializer = ElectionCommitteesSerializer(committees_data, many=True)

        return Response({"data": data_serializer.data, "counts": 1, "code": 200})

class AddNewElectionCommittee(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ElectionCommitteesSerializer(data=request.data, context={'request': request})

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

        serializer = ElectionCommitteesSerializer(committee, data=request.data, partial=True)
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


class UpdateElectionCommitteeResults(APIView):
    permission_classes = [IsAuthenticated]  # Assuming only authenticated users can update

    def patch(self, request, id):
        # Loop through the candidates and update/insert the votes
        for candidate_id, votes in request.data.get("data", {}).items():
            obj, created = ElectionCommitteeResult.objects.update_or_create(
                election_committee_id=id,
                election_candidate_id=candidate_id,
                defaults={
                    "votes": votes,
                    "updated_by": request.user
                }
            )
        # Once the patch operation is done, fetch all relevant results
        results = ElectionCommitteeResult.objects.filter(election_committee_id=id)
        
        # Process these results into your desired structure
        output = {}
        for result in results:
            committee_id = str(result.election_committee.id)  # Converted to string as it is key in dictionary
            candidate_id = str(result.election_candidate.id)  # Converted to string as it is key in dictionary
            votes = result.votes
            
            if committee_id not in output:
                output[committee_id] = {}
                
            output[committee_id][candidate_id] = votes
        
        # If "output" is the main key in response
        return Response({"data": output, "count": 1, "code": 200})

class GetPublicElections(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        elections_data = Election.objects.all()
        data_serializer = ElectionSerializer(elections_data, many=True)

        # Fetch categories with parent equal to NULL
        category_options = Category.objects.filter(parent__isnull=True)

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
                    "electionCommitteeResults": committee_results,
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
        committees_serializer = ElectionCommitteesSerializer(election_committees, many=True)
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
