# from elections.models import Elections
from django.http import JsonResponse
from django.http.response import JsonResponse
from django.db.models.query import QuerySet
from django.db.models import Sum
from django.db.models import Count
from django.contrib.auth import get_user_model
from django.shortcuts import render

from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from restapi.serializers import *
from restapi.models import *
import ast 
from datetime import datetime
from operator import itemgetter



def index(request):
    return render(request, 'index.html')


SECRET_KEY = b'pseudorandomly generated server secret key'
AUTH_SIZE = 16

# Elections: getElection, deleteElection, addElection, updateElection, ElectionCount
class GetElections(APIView):
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

class GetElectionDetails(APIView):
    def get(self, request, id):
        try:
            # 1. Fetch election data
            election_data = self.get_election_data(id)
            
            # 2. Fetch candidates for this election
            election_candidates = self.get_election_candidates(id)
            
            # 3. Fetch committees related to this election
            election_committees = self.get_election_committees(id)
            
            # 4. Fetch committee results for this election
            committee_results = self.get_election_committee_results(id, election_committees)

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

    # Showing Committee Results for Candidates of This Election Only
    def get_election_committee_results(self, id, committees):
        transformed_results = {}

        # Get a list of candidate IDs for this election only
        all_candidates = ElectionCandidates.objects.filter(election=id)
        all_candidate_ids = [str(candidate.id) for candidate in all_candidates]

        # Create a dictionary to store total votes and positions for each candidate
        candidate_data = {candidate_id: {"votes": 0, "position": None} for candidate_id in all_candidate_ids}

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
                candidate_data[candidate_id]["votes"] += votes

        # Sort candidates by position and then by total votes
        sorted_candidates = sorted(all_candidate_ids, key=lambda candidate_id: (candidate_data[candidate_id]["position"], candidate_data[candidate_id]["votes"]), reverse=True)

        # Reconstruct the results based on sorted candidate order
        sorted_transformed_results = {}
        for committee_id, results in transformed_results.items():
            sorted_transformed_results[committee_id] = {candidate_id: results[candidate_id] for candidate_id in sorted_candidates}

        return sorted_transformed_results
    
    def get_campaigns_for_election(self, id):
        election_candidate_ids = ElectionCandidates.objects.filter(election=id).values_list('id', flat=True)
        campaign = Campaigns.objects.filter(election_candidate__in=election_candidate_ids)
        campaign_serializer = CampaignsSerializer(campaign, many=True)
        return campaign_serializer.data


class AddElection(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Extract and process fields from the request
        data_fields = self.extract_fields(request)
        
        # Create a new election object
        new_election = self.create_election(**data_fields)

        # Prepare and return new election data
        new_election_data = self.prepare_new_election_data(new_election, data_fields['moderators'])
        return Response({"data": new_election_data, "count": 0, "code": 200})

    def extract_fields(self, request):
        return {
            'description': request.data.get("description"),
            'duedate': self.extract_date(request.data.get("dueDate")),
            'category': self.get_instance(Categories, request.data.get("category")),
            'sub_category': self.get_instance(Categories, request.data.get("subCategory")),
            'type': request.data.get("type"),
            'result': request.data.get("result"),
            'votes': request.data.get("votes"),
            'seats': request.data.get("seats"),
            'electors': request.data.get("electors"),
            'attendees': request.data.get("attendees"),
            'status': request.data.get("status"),
            'priority': request.data.get("priority"),
            'moderators': self.get_moderators_list(request.data.get("moderators")),
            'created_by': request.user,
            'deleted': request.data.get("deleted")
        }

    def extract_date(self, date_str):
        if date_str:
            return datetime.strptime(date_str, '%Y-%m-%d').date()
        return None

    def get_instance(self, model, id):
        return model.objects.get(id=id) if id else None

    def get_moderators_list(self, moderators):
        return ast.literal_eval(moderators) if isinstance(moderators, str) else []

    def create_election(self, **kwargs):
        kwargs['name'] = self.get_name(kwargs.get('sub_category'), kwargs.get('duedate'))  # Pass 'duedate' here
        kwargs['image'] = self.get_image(kwargs.get('sub_category'))
        new_election = Elections.objects.create(**kwargs)
        return new_election

    def get_name(self, sub_category_instance, duedate):
        if sub_category_instance:
            if duedate:
                # If duedate is a datetime.date object, you can directly get the year attribute
                year = duedate.year
                return f"{sub_category_instance.name} - {year}"
            else:
                return f"{sub_category_instance.name} - No Due Date"
        return None  # Return None or a default name if you have one

    def get_image(self, sub_category):
        return sub_category.image.url if sub_category and sub_category.image else None

    def prepare_new_election_data(self, election, moderators):
        # Prepare data in the same way as your original function, but cleaner
        return {
            "id": election.id,
            "name": election.name,
            "image": election.image.url if election.image else None,
            "description": election.description,
            "dueDate": election.duedate,
            "category": election.category.id if election.category else None,
            "subCategory": election.sub_category.id if election.sub_category else None,
            "type": election.type,
            "result": election.result,
            "votes": election.votes,
            "seats": election.seats,
            "electors": election.electors,
            "attendees": election.attendees,
            "status": election.status,
            "priority": election.priority,
            "moderators": moderators,
            "createdBy": election.created_by.first_name if election.created_by else None,
            "deleted": election.deleted,
        }


class UpdateElection(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, id):
        # Fetch and validate the election object
        try:
            election = Elections.objects.get(id=id)
        except Elections.DoesNotExist:
            return Response({"error": "Election not found"}, status=404)

        # Extract fields from request
        self.extract_fields_from_request(request, election)

        # Save changes to the database
        election.save()

        # Prepare and return updated election data
        moderators_list = self.get_updated_moderators_list(election.moderators)
        updated_election_data = self.prepare_updated_election_data(election, moderators_list)
        return Response({"data": updated_election_data, "count": 0, "code": 200})

    def extract_fields_from_request(self, request, election):
        # General Info
        election.description = request.data.get("description")
        election.duedate = self.convert_str_to_date(request.data.get("dueDate"))

        # Taxonomies
        category_id, sub_category_id = request.data.get("category"), request.data.get("subCategory")
        election.category, election.sub_category = self.get_categories(category_id, sub_category_id)
        election.tags = request.data.get("tags")

        # Specifications & Admin
        election.type = request.data.get("type")
        election.result = request.data.get("result")
        election.votes = request.data.get("votes")
        election.seats = request.data.get("seats")
        election.electors = request.data.get("electors")
        election.electors_males = request.data.get("electorsMales")
        election.electors_females = request.data.get("electorsFemales")
        election.attendees = request.data.get("attendees")
        election.attendees_males = request.data.get("attendeesMales")
        election.attendees_females = request.data.get("attendeesFemales")
        election.moderators = self.get_moderators_list(request.data.get("moderators"))
        election.status = request.data.get("status")
        election.priority = request.data.get("priority")
        election.deleted = request.data.get("deleted")
        election.updated_by = request.user

        # Set Name and Image
        if election.sub_category:
            election.name = self.get_name(election.sub_category, election.duedate)
            election.image = self.get_image(election.sub_category)

    # Helper methods to generate name and image
    @staticmethod
    def convert_str_to_date(date_str):
        return datetime.strptime(date_str, '%Y-%m-%d').date()


    def get_name(self, sub_category_instance, duedate):
        if sub_category_instance:
            if duedate:
                # If duedate is a datetime.date object, you can directly get the year attribute
                year = duedate.year
                return f"{sub_category_instance.name} - {year}"
            else:
                return f"{sub_category_instance.name} - No Due Date"
        return None  # Return None or a default name if you have one

    def get_image(self, sub_category):
        if sub_category and sub_category.image:
            image_url = sub_category.image.url
            return image_url.replace('/media/', '', 1)  # remove one occurrence of '/media/'
        return None

    def get_categories(self, category_id, sub_category_id):
        try:
            category_instance = Categories.objects.get(id=category_id)
            sub_category_instance = Categories.objects.get(id=sub_category_id)
            return category_instance, sub_category_instance
        except Categories.DoesNotExist:
            return None, None

    def get_moderators_list(self, moderators):
        if isinstance(moderators, str):
            return ast.literal_eval(moderators)
        return []

    def get_updated_moderators_list(self, moderators):
        moderators_list = []
        if moderators:
            for moderator_id in moderators:
                try:
                    moderator = User.objects.get(id=moderator_id)
                    moderators_list.append({
                        "id": moderator.id,
                        "img": moderator.image.url if moderator.image else None,
                        "name": f"{moderator.first_name} {moderator.last_name}",
                    })
                except User.DoesNotExist:
                    pass
        return moderators_list

    def prepare_updated_election_data(self, election, moderators_list):
        updated_election_data = {
            "id": election.id,
            "name": election.name,
            "image": election.image.url if election.image else None,
            "description": election.description,
            "dueDate": election.duedate,
            # Taxonomies
            "category": election.category.id if election.category else None,
            "subCategory": election.sub_category.id if election.sub_category else None,
            "tags": election.tags,
            # Election Specifications
            "type": election.type,
            "result": election.result,
            "votes": election.votes,
            "seats": election.seats,
            "electors": election.electors,
            "electorsMales": election.electors_males,
            "electorsFemales": election.electors_females,

            "attendees": election.attendees,
            "attendeesMales": election.attendees_males,
            "attendeesFemales": election.attendees_females,

            # Admin
            "status": election.status,
            "priority": election.priority,
            "moderators": moderators_list,
            "updatedBy": election.updated_by.first_name,
            "deleted": election.deleted,
        }
        return updated_election_data

class DeleteElection(APIView):
    def delete(self, request, id):
        try:
            election = Elections.objects.get(id=id)
            election.delete()
            return JsonResponse({"data": "Election deleted successfully", "count": 1, "code": 200}, safe=False)
        except Elections.DoesNotExist:
            return JsonResponse({"data": "Election not found", "count": 0, "code": 404}, safe=False)


# ElectionCandidates -----------------
class AddNewElectionCandidate(APIView):
    def post(self, request):
        election_id = request.data.get("election_id")
        candidate_id = request.data.get("candidate_id")

        # Fetch the candidate details based on candidate
        try:
            candidate = Candidates.objects.get(id=candidate_id)
        except Candidates.DoesNotExist:
            return Response({"error": "Candidate not found"}, status=404)

        # Create the new election candidate with candidate details
        election_candidate = ElectionCandidates.objects.create(
            election_id=election_id,
            candidate_id=candidate_id,
        )

        # Prepare the response data with candidate details
        new_election_candidate_data = {
            "id": election_candidate.id,
            "candidate_id": candidate_id,
            "election": election_id,
            "name": candidate.name,
            "image": candidate.image.url if candidate.image else None,

            # "image": candidate.image.url if candidate.image else None,
            "gender": candidate.gender,
            "deleted": candidate.deleted,
            "position": "-",
            "votes": "-",

            # Other details you want to include
        }

        return Response({"data": new_election_candidate_data, "count": 0, "code": 200})

class DeleteElectionCandidate(APIView):
    def delete(self, request, id):
        try:
            election_candidate = ElectionCandidates.objects.get(id=id)
            election_candidate.delete()
            return JsonResponse(
                {"data": "Election deleted successfully", "count": 1, "code": 200},
                safe=False,
            )
        except Elections.DoesNotExist:
            return JsonResponse(
                {"data": "Election not found", "count": 0, "code": 404}, safe=False
            )
        
class UpdateElectionCandidate(APIView):
    def patch(self, request, id):
        # Basic Information
        election_id = request.data.get("election_id")
        candidate_id = request.data.get("candidate_id")

        # Election Results
        votes = request.data.get("votes")
        remarks = request.data.get("remarks")

        # Fetch the election candidate details based on the URL parameter 'id'
        try:
            election_candidate = ElectionCandidates.objects.get(id=id)
        except ElectionCandidates.DoesNotExist:
            return Response({"error": "Election candidate not found"}, status=404)

        # Get the actual Election instance
        try:
            election = Elections.objects.get(id=election_id)
        except Elections.DoesNotExist:
            return Response({"error": "Election not found"}, status=404)

        # Get the actual Candidate instance
        try:
            candidate = Candidates.objects.get(id=candidate_id)
        except Candidates.DoesNotExist:
            return Response({"error": "Candidate not found"}, status=404)

        # Update the election candidate with the new data
        
        # Basic Data
        election_candidate.election = election
        election_candidate.candidate = candidate

        # Election Related Data
        election_candidate.votes = votes
        election_candidate.remarks = remarks
        election_candidate.save()

        # Prepare the response data with candidate details
        updated_election_candidate_data = {
            # Basic Information
            "id": election_candidate.id,
            "election_id": election_candidate.election.id,
            "candidate_id": election_candidate.candidate.id,

            # Election Data
            "votes": election_candidate.votes,
            "remarks": election_candidate.remarks,

        }

        return Response({"data": updated_election_candidate_data, "count": 0, "code": 200})


class GetElectionCount(APIView):
    def get(self, request):
        total_count = Elections.objects.count()
        new_count = Elections.objects.filter(status='New').count()
        inprogress_count = Elections.objects.filter(
            status='Inprogress').count()
        pending_count = Elections.objects.filter(status='Pending').count()
        completed_count = Elections.objects.filter(status='Completed').count()

        data = {
            'total_elections': total_count,
            'new_elections': new_count,
            'inprogress_elections': inprogress_count,
            'pending_elections': pending_count,
            'completed_elections': completed_count,
        }

        return Response({"data": data, "count": 0, "code": 200})
