# from committees.models import Committees
from django.http import JsonResponse
from rest_framework import status

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


def index(request):
    return render(request, 'index.html')


SECRET_KEY = b'pseudorandomly generated server secret key'
AUTH_SIZE = 16

# Committees: getCommittee, deleteCommittee, addCommittee, updateCommittee, CommitteeCount
class GetCommittees(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        committees_data = ElectionCommittees.objects.all()
        data_serializer = ElectionCommitteesSerializer(committees_data, many=True)

        return Response({"data": data_serializer.data, "counts": 1, "code": 200})


class AddNewElectionCommittee(APIView):
    def post(self, request):
        User = get_user_model()

        name = request.data.get("name")
        image = request.data.get("image")
        description = request.data.get("description")

        # Committee
        gender = request.data.get("gender")
        phone = request.data.get("phone")
        email = request.data.get("email")
        twitter = request.data.get("twitter")
        instagram = request.data.get("instagram")

        # Admin
        moderators = self.get_moderators_list(request.data.get("moderators"))
        status = request.data.get("status")
        priority = request.data.get("priority")
        deleted = request.data.get("deleted")
        created_by = request.user

        committee = self.create_committee(
            name, image, description, gender, phone, email, twitter, instagram,
            status, priority, moderators, created_by, deleted
        )

        new_committee_data = self.prepare_new_committee_data(committee, moderators)
        
        return Response({"data": new_committee_data, "count": 0, "code": 200})

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

    def create_committee(self, name, image, description, gender, phone, email, twitter, instagram, status, priority, moderators, created_by, deleted):
        committee = Committees(
            name=name,
            image=image,
            gender=gender,
            phone=phone,
            email=email,
            twitter=twitter,
            instagram=instagram,
            description=description,
            status=status,
            priority=priority,
            moderators=moderators,
            created_by=created_by,
            deleted=deleted
        )
        committee.save()
        return committee

    def prepare_new_committee_data(self, committee, moderators):
        new_committee_data = {
            "id": committee.id,
            "name": committee.name,
            "image": committee.image.url if committee.image else None,
            "gender": committee.gender,
            "phone": committee.phone,
            "email": committee.email,
            "twitter": committee.twitter,
            "instagram": committee.instagram,

            # Admin
            "status": committee.status,
            "priority": committee.priority,
            "moderators": moderators,  # Now this includes details not just IDs
            "createdBy": committee.created_by.first_name if committee.created_by else None,
            "deleted": committee.deleted,
        }
        return new_committee_data


class DeleteElectionCommittee(APIView):
    def delete(self, request, id):
        try:
            committee = ElectionCommittees.objects.get(id=id)
            committee.delete()
            return JsonResponse({"data": "Committee deleted successfully", "count": 1, "code": 200}, safe=False)
        except ElectionCommittees.DoesNotExist:
            return JsonResponse({"data": "Committee not found", "count": 0, "code": 404}, safe=False)

class UpdateElectionCommittee(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, id):
        try:
            committee = ElectionCommittees.objects.get(id=id)
        except ElectionCommittees.DoesNotExist:
            return Response({"error": "Committee not found"}, status=404)

        # Extract the desired fields from the request data
        name = request.data.get("name")
        gender = request.data.get("gender")
        election_id = request.data.get("election_id")

        # Check if the fields are not None before updating
        if name is not None:
            committee.name = name
        if gender is not None:
            committee.gender = gender
        
        # Set the election using the provided election_id
        try:
            election = Elections.objects.get(id=election_id)
            committee.election = election
        except Elections.DoesNotExist:
            return Response({"error": "Election not found"}, status=404)

        # Save the committee
        committee.save(update_fields=['name', 'gender', 'election'])

        # Serialize the updated committee object
        serialized_data = ElectionCommitteesSerializer(committee).data

        return Response({"data": serialized_data, "count": 1, "code": 200})

class UpdateElectionCommitteeResults(APIView):
    permission_classes = [IsAuthenticated]  # Assuming only authenticated users can update

    def patch(self, request, id):
        # Loop through the candidates and update/insert the votes
        for candidate_id, votes in request.data.get("data", {}).items():
            obj, created = ElectionCommitteeResults.objects.update_or_create(
                election_committee_id=id,
                election_candidate_id=candidate_id,
                defaults={
                    'votes': votes,
                    'updated_by': request.user
                }
            )

        # Once the patch operation is done, fetch all relevant results
        results = ElectionCommitteeResults.objects.all()

        # Process these results into your desired structure
        output = {}
        for result in results:
            committee_id = result.election_committee.id
            candidate_id = result.election_candidate.id
            votes = result.votes

            if committee_id not in output:
                output[committee_id] = {}

            output[committee_id][candidate_id] = votes

        return Response({"data": output}, status=status.HTTP_200_OK)
