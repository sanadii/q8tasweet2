# from elections.models import Elections
from django.http import JsonResponse
from django.http.response import JsonResponse
from django.db.models.query import QuerySet
from django.db.models import Sum
from django.contrib.auth import get_user_model
from django.shortcuts import render

from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from restapi.serializers import *
from restapi.models import *
import ast 
from datetime import datetime  # Add this line to import the datetime class


class GetPublicElections(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        elections_data = Elections.objects.all()
        data_serializer = ElectionsSerializer(elections_data, many=True)

        # Fetch categories with parent equal to NULL
        category_options = Categories.objects.filter(parent__isnull=True)

        # Initialize count dictionary
        counts = {
            'All Elections': Elections.objects.count(),
            'Category': {category.name: 0 for category in category_options},
        }

        # Count total for each category
        for category in category_options:
            counts['Category'][category.name] = Elections.objects.filter(category=category).count()

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

        except Elections.DoesNotExist:
            return JsonResponse({"error": "Election not found"}, status=404)

    def get_election_data(self, id):
        election = Elections.objects.get(id=id)
        election_serializer = ElectionsSerializer(election)
        return election_serializer.data

    def get_election_candidates(self, id):
        # Fetch the election candidates
        election_candidate = ElectionCandidates.objects.filter(election=id)
        candidate_serializer = ElectionCandidatesSerializer(election_candidate, many=True)
        election_candidates = candidate_serializer.data
        
        # Aggregate votes for each candidate across all committees
        for candidate in election_candidates:
            total_votes = ElectionCommitteeResults.objects.filter(election_candidate=candidate['id']).aggregate(total_votes=Sum('votes'))['total_votes'] or 0
            candidate['votes'] = total_votes

        # Sort the candidates by their total votes
        election_candidates.sort(key=lambda x: x['votes'], reverse=True)

        # Determine the number of seats from the election data
        election = Elections.objects.get(id=id)
        number_of_seats = election.seats or 0

        # Update the candidates' position and winner status
        for idx, candidate in enumerate(election_candidates, start=1):
            candidate['position'] = str(idx)
            
            # Check if the candidate is a winner
            candidate['is_winner'] = idx <= number_of_seats

        election_candidates.reverse()  # Reverse the order of the list

        return election_candidates

    def get_election_committees(self, id):
        election_committees = ElectionCommittees.objects.filter(election=id)
        committees_serializer = ElectionCommitteesSerializer(election_committees, many=True)
        print("In get_election_committees, returning:", committees_serializer.data)  # Add this line
        return committees_serializer.data

    # # Showing Candidate results in all Committees
    # def get_election_committee_results(self, committees):
    #     transformed_results = {}

    #     for committee in committees:
    #         committee_id = committee['id']
    #         committee_results = ElectionCommitteeResults.objects.filter(election_committee=committee_id)
    #         results_serializer = ElectionCommitteeResultsSerializer(committee_results, many=True)

    #         for result in results_serializer.data:
    #             candidate_id = result['election_candidate']
    #             votes = result['votes']

    #             # Initialize if candidate not yet in the results
    #             if candidate_id not in transformed_results:
    #                 transformed_results[candidate_id] = {}

    #             # Store votes for the current committee
    #             transformed_results[candidate_id][committee_id] = votes

    #     return transformed_results

    # Showing Committee Results for All Candidates
    def get_election_committee_results(self, committees):
        transformed_results = {}

        # Get a list of all candidate IDs
        all_candidates = ElectionCandidates.objects.all()
        all_candidate_ids = [str(candidate.id) for candidate in all_candidates]

        # Create a dictionary to store total votes for each candidate
        total_votes_per_candidate = {candidate_id: 0 for candidate_id in all_candidate_ids}

        for committee in committees:
            committee_id = str(committee['id'])
            committee_results = ElectionCommitteeResults.objects.filter(election_committee=committee_id)
            results_serializer = ElectionCommitteeResultsSerializer(committee_results, many=True)

            # Initialize the committee in the results with default votes for each candidate
            transformed_results[committee_id] = {candidate_id: 0 for candidate_id in all_candidate_ids}

            for result in results_serializer.data:
                candidate_id = str(result['election_candidate'])
                votes = result['votes']

                # Update votes for the current candidate in the current committee
                transformed_results[committee_id][candidate_id] = votes

                # Update total votes for the candidate
                total_votes_per_candidate[candidate_id] += votes

        # Sort candidates based on total votes
        sorted_candidates_by_votes = sorted(total_votes_per_candidate, key=total_votes_per_candidate.get, reverse=True)

        # Reconstruct the results based on sorted candidate order
        sorted_transformed_results = {}
        for committee_id, results in transformed_results.items():
            sorted_transformed_results[committee_id] = {candidate_id: results[candidate_id] for candidate_id in sorted_candidates_by_votes}

        return sorted_transformed_results

    def get_campaigns_for_election(self, id):
        election_candidate_ids = ElectionCandidates.objects.filter(election=id).values_list('id', flat=True)
        campaign = Campaigns.objects.filter(election_candidate__in=election_candidate_ids)
        campaign_serializer = CampaignsSerializer(campaign, many=True)
        return campaign_serializer.data
