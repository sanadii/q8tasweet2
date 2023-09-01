# from candidates.models import Candidates
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


def index(request):
    return render(request, 'index.html')


SECRET_KEY = b'pseudorandomly generated server secret key'
AUTH_SIZE = 16

# Candidates: getCandidate, deleteCandidate, addCandidate, updateCandidate, CandidateCount
class GetCandidates(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        candidates_data = Candidates.objects.all()
        data_serializer = CandidatesSerializer(candidates_data, many=True)

        return Response({"data": data_serializer.data, "counts": 1, "code": 200})


class AddNewCandidate(APIView):
    def post(self, request):
        User = get_user_model()

        name = request.data.get("name")
        image = request.data.get("image")
        description = request.data.get("description")

        # Candidate
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

        candidate = self.create_candidate(
            name, image, description, gender, phone, email, twitter, instagram,
            status, priority, moderators, created_by, deleted
        )

        new_candidate_data = self.prepare_new_candidate_data(candidate, moderators)
        
        return Response({"data": new_candidate_data, "count": 0, "code": 200})

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

    def create_candidate(self, name, image, description, gender, phone, email, twitter, instagram, status, priority, moderators, created_by, deleted):
        candidate = Candidates(
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
        candidate.save()
        return candidate

    def prepare_new_candidate_data(self, candidate, moderators):
        new_candidate_data = {
            "id": candidate.id,
            "name": candidate.name,
            "image": candidate.image.url if candidate.image else None,
            "gender": candidate.gender,
            "phone": candidate.phone,
            "email": candidate.email,
            "twitter": candidate.twitter,
            "instagram": candidate.instagram,

            # Admin
            "status": candidate.status,
            "priority": candidate.priority,
            "moderators": moderators,  # Now this includes details not just IDs
            "createdBy": candidate.created_by.first_name if candidate.created_by else None,
            "deleted": candidate.deleted,
        }
        return new_candidate_data


class DeleteCandidate(APIView):
    def delete(self, request, id):
        try:
            candidate = Candidates.objects.get(id=id)
            candidate.delete()
            return JsonResponse({"data": "Candidate deleted successfully", "count": 1, "code": 200}, safe=False)
        except Candidates.DoesNotExist:
            return JsonResponse({"data": "Candidate not found", "count": 0, "code": 404}, safe=False)

class UpdateCandidate(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, id):
        try:
            candidate = Candidates.objects.get(id=id)
        except Candidates.DoesNotExist:
            return Response({"error": "Candidate not found"}, status=404)

        # Extract the desired fields from the request data
        name = request.data.get("name")
        image = request.data.get("image")
        description = request.data.get("description")

        # Admin
        moderators = self.get_moderators_list(request.data.get("moderators"))
        
        status = request.data.get("status")
        priority = request.data.get("priority")
        deleted = request.data.get("deleted")
        updated_by = request.user

        if isinstance(moderators, str):
            moderators = ast.literal_eval(moderators)

        # Update the candidate object with the new values
        candidate.name = name
        candidate.description = description
        if image:
            candidate.image = image

        # Admin
        candidate.priority = priority
        candidate.status = status
        candidate.moderators = moderators

        # System
        candidate.deleted = deleted
        candidate.updated_by = updated_by

        candidate.save()

        # Fetch the updated list of moderators
        moderators_list = self.get_updated_moderators_list(moderators)

        # Return the updated candidate data in the response
        updated_candidate_data = self.prepare_updated_candidate_data(candidate, moderators_list)

        return Response({"data": updated_candidate_data, "count": 0, "code": 200})

    # Add the following utility methods here

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

    def prepare_updated_candidate_data(self, candidate, moderators_list):
        updated_candidate_data = {
            "id": candidate.id,
            "name": candidate.name,
            "image": candidate.image.url if candidate.image else None,
            "description": candidate.description,
            # Admin
            "status": candidate.status,
            "priority": candidate.priority,
            "moderators": moderators_list,
            "updatedBy": candidate.updated_by.first_name,
            "deleted": candidate.deleted,
        }
        return updated_candidate_data