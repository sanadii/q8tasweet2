# from elections.models import Elections
from django.http import JsonResponse
from django.http.response import JsonResponse
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated

from django.contrib.auth import get_user_model
from django.shortcuts import render
from rest_framework.views import APIView
from restapi.serializers import *
from restapi.models import *
import ast 
from datetime import datetime  # Add this line to import the datetime class
from django.db.models.query import QuerySet


def index(request):
    return render(request, 'index.html')


SECRET_KEY = b'pseudorandomly generated server secret key'
AUTH_SIZE = 16

# Elections: getElection, deleteElection, addElection, updateElection, ElectionCount
class getElections(APIView):
    permission_classes = [IsAuthenticated]
    
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
        election_candidate = ElectionCandidates.objects.filter(election=id).order_by('-votes')
        candidate_serializer = ElectionCandidatesSerializer(election_candidate, many=True)
        election_candidates = candidate_serializer.data
        # Sort and modify the candidates here as you were doing before
        for candidate in election_candidates:
            candidate['votes'] = candidate['votes'] or 0
            candidate['position'] = "-"
        # Rest of the code to determine the position, winner status, etc.
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
        all_candidates = ElectionCandidates.objects.all() # Assuming you have a model named ElectionCandidate
        all_candidate_ids = [str(candidate.id) for candidate in all_candidates]

        for committee in committees:
            committee_id = str(committee['id'])  # Convert to string for consistency
            committee_results = ElectionCommitteeResults.objects.filter(election_committee=committee_id)
            results_serializer = ElectionCommitteeResultsSerializer(committee_results, many=True)

            # Initialize the committee in the results with default votes for each candidate
            transformed_results[committee_id] = {candidate_id: 0 for candidate_id in all_candidate_ids}

            for result in results_serializer.data:
                candidate_id = str(result['election_candidate'])  # Convert to string
                votes = result['votes']

                # Update votes for the current candidate in the current committee
                transformed_results[committee_id][candidate_id] = votes

        return transformed_results

    def get_campaigns_for_election(self, id):
        election_candidate_ids = ElectionCandidates.objects.filter(election=id).values_list('id', flat=True)
        campaign = Campaigns.objects.filter(election_candidate__in=election_candidate_ids)
        campaign_serializer = CampaignsSerializer(campaign, many=True)
        return campaign_serializer.data

# class GetElectionDetails(APIView):
#     def get(self, request, id):
#         try:
#             election = Elections.objects.get(id=id)
#             election_serializer = ElectionsSerializer(election)
#             election_data = election_serializer.data

#             # Get the candidates for the given election
#             election_candidate = ElectionCandidates.objects.filter(election=id).order_by('-votes')
#             candidate_serializer = ElectionCandidatesSerializer(election_candidate, many=True)

#             # Assuming election_candidates is a list of dictionaries containing the candidate data
#             election_candidates = candidate_serializer.data
#             for candidate in election_candidates:
#                 candidate['votes'] = candidate['votes'] or 0
#                 candidate['position'] = "-"

#             # Assuming you have a model ElectionCommittees and a serializer ElectionCommitteesSerializer
#             election_committees = ElectionCommittees.objects.filter(election=id)
#             committees_serializer = ElectionCommitteesSerializer(election_committees, many=True)
#             electionCommittees = committees_serializer.data


#             # Sort the candidates by votes in descending order
#             election_candidates = sorted(election_candidates, key=lambda x: x['votes'], reverse=True)

#             # Update the position based on the sorted order
#             for idx, candidate in enumerate(election_candidates, start=1):
#                 candidate['position'] = str(idx)

#             # Number of Seats & Winners
#             number_of_seats = election_data["seats"] or 0
#             # Update the position based on the sorted order and check if the candidate is a winner
#             for idx, candidate in enumerate(election_candidates, start=1):
#                 candidate['position'] = str(idx)
#                 if idx <= number_of_seats:
#                     candidate['is_winner'] = True
#                 else:
#                     candidate['is_winner'] = False

#             # Reverse the order of election_candidates
#             election_candidates = list(reversed(election_candidates))

#             # Get the campaigns for the given election
#             election_candidate_ids = election_candidate.values_list('id', flat=True)
#             campaign = Campaigns.objects.filter(election_candidate__in=election_candidate_ids)
#             campaign_serializer = CampaignsSerializer(campaign, many=True)
#             campaigns = campaign_serializer.data


#             details = {
#                 "id": election_data["id"],
#                 "name": election_data["name"],
#                 "image": election_data["image"],
#                 "description": election_data["description"],
#                 "duedate": election_data["dueDate"],

#                 "moderators": election_data["moderators"],

#                 # Taxonomies
#                 "category": election_data["category"],
#                 "sub_category": election_data["subCategory"],
#                 "tags": election_data["tags"],

#                 # Admin
#                 "status": election_data["status"],
#                 "priority": election_data["priority"],

#                 # Spedifications
#                 "type": election_data["type"],
#                 "result": election_data["result"],
#                 "votes": election_data["votes"],
#                 "seats": election_data["seats"],
#                 "electors": election_data["electors"],
#                 "attendees": election_data["attendees"],

#                 # System
#                 "deleted": election_data["deleted"],
#                 "created_by": election_data["createdBy"],
#                 "updated_by": election_data["updatedBy"],
#             }

#             return Response({
#                 "data": {
#                     "electionDetails": details,
#                     "electionCandidates": election_candidates,
#                     "electionCampaigns": campaigns,
#                     "electionCommittees": electionCommittees,
#                 },
#                 "count": 0,
#                 "code": 200
#             })
#         except Elections.DoesNotExist:
#             return JsonResponse({"error": "Election not found"}, status=404)


class addElection(APIView):
    def post(self, request):
        User = get_user_model()

        name = request.data.get("name")
        image = request.data.get("image")
        description = request.data.get("description")
        duedate = self.extract_date(request.data.get("dueDate"))
        
        category_instance = self.get_instance(Categories, request.data.get("category"))
        sub_category_instance = self.get_instance(Categories, request.data.get("subCategory"))
        
        # Election Specifications
        type = request.data.get("type")
        result = request.data.get("result")
        votes = request.data.get("votes")
        seats = request.data.get("seats")
        electors = request.data.get("electors")
        attendees = request.data.get("attendees")

        # Admin
        moderators = self.get_moderators_list(request.data.get("moderators"))
        status = request.data.get("status")
        priority = request.data.get("priority")
        deleted = request.data.get("deleted")
        created_by = request.user

        election = self.create_election(
            name, image, description, duedate,
            category_instance, sub_category_instance,
            type, result, votes, seats, electors, attendees,
            status, priority, moderators, created_by, deleted
        )

        new_election_data = self.prepare_new_election_data(election, moderators)
        
        return Response({"data": new_election_data, "count": 0, "code": 200})

    def extract_date(self, date_str):
        if not date_str:
            return None
        try:
            return datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            return None

    def get_instance(self, model, id):
        if id:
            try:
                return model.objects.get(id=id)
            except model.DoesNotExist:
                return None
        return None

    def get_moderators_list(self, moderators):
        if isinstance(moderators, str):
            return ast.literal_eval(moderators)
        return []

    def create_election(self, name, image, description, duedate, category, sub_category, type, result, votes, seats, electors, attendees, status, priority, moderators, created_by, deleted):
        election = Elections(
            name=name,
            image=image,
            description=description,
            duedate=duedate,
            category=category,
            sub_category=sub_category,
            type=type,
            result=result,
            votes=votes,
            seats=seats,
            electors=electors,
            attendees=attendees,
            status=status,
            priority=priority,
            moderators=moderators,
            created_by=created_by,
            deleted=deleted
        )
        election.save()
        return election

    def prepare_new_election_data(self, election, moderators):
        new_election_data = {
            "id": election.id,
            "name": election.name,
            "image": election.image.url if election.image else None,
            "description": election.description,
            "dueDate": election.duedate,

            # Taxonomies
            "category": {
                "id": election.category.id if election.category else None,
                "name": election.category.name if election.category else None
            },
            "subCategory": {
                "id": election.sub_category.id if election.sub_category else None,
                "name": election.sub_category.name if election.sub_category else None
            },

            # Election Specifications
            "type": election.type,
            "result": election.result,
            "votes": election.votes,
            "seats": election.seats,
            "electors": election.electors,
            "attendees": election.attendees,

            # Admin
            "status": election.status,
            "priority": election.priority,
            "moderators": moderators,  # Now this includes details not just IDs
            "createdBy": election.created_by.first_name if election.created_by else None,
            "deleted": election.deleted,
        }
        return new_election_data


class DeleteElection(APIView):
    def delete(self, request, id):
        try:
            election = Elections.objects.get(id=id)
            election.delete()
            return JsonResponse({"data": "Election deleted successfully", "count": 1, "code": 200}, safe=False)
        except Elections.DoesNotExist:
            return JsonResponse({"data": "Election not found", "count": 0, "code": 404}, safe=False)

class UpdateElection(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, id):
        try:
            election = Elections.objects.get(id=id)
        except Elections.DoesNotExist:
            return Response({"error": "Election not found"}, status=404)

        # Extract the desired fields from the request data
        name = request.data.get("name")
        image = request.data.get("image")
        description = request.data.get("description")
        duedate = request.data.get("dueDate")

        # Taxonomies
        category_id = request.data.get("category")
        sub_category_id = request.data.get("subCategory")
        category_instance, sub_category_instance = self.get_taxonomies(category_id, sub_category_id)

        tags = request.data.get("tags")

        # Election Specifications
        type = request.data.get("type")
        result = request.data.get("result")
        votes = request.data.get("votes")
        seats = request.data.get("seats")
        electors = request.data.get("electors")
        attendees = request.data.get("attendees")

        # Admin
        moderators = self.get_moderators_list(request.data.get("moderators"))
        
        status = request.data.get("status")
        priority = request.data.get("priority")
        deleted = request.data.get("deleted")
        updated_by = request.user

        if isinstance(moderators, str):
            moderators = ast.literal_eval(moderators)

        # Update the election object with the new values
        election.name = name
        election.description = description
        election.duedate = duedate
        if image:
            election.image = image

        # Taxonomies
        election.category = category_instance
        election.sub_category = sub_category_instance
        election.tags = tags

        # Admin
        election.priority = priority
        election.status = status
        election.moderators = moderators

        # Election Specifications
        election.type = type
        election.result = result
        election.votes = votes
        election.seats = seats
        election.electors = electors
        election.attendees = attendees

        # System
        election.deleted = deleted
        election.updated_by = updated_by

        election.save()

        # Fetch the updated list of moderators
        moderators_list = self.get_updated_moderators_list(moderators)

        # Return the updated election data in the response
        updated_election_data = self.prepare_updated_election_data(election, moderators_list)

        return Response({"data": updated_election_data, "count": 0, "code": 200})

    # Add the following utility methods here

    def get_taxonomies(self, category_id, sub_category_id):
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
            "attendees": election.attendees,
            # Admin
            "status": election.status,
            "priority": election.priority,
            "moderators": moderators_list,
            "updatedBy": election.updated_by.first_name,
            "deleted": election.deleted,
        }
        return updated_election_data

# Election Details: ElectionDetails, deleteElectionCandidate, addElectionCandidate, updateElectionCandidate, ElectionCount

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
