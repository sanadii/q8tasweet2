from elections.models import Elections
from django.http import JsonResponse
import json
import hashlib
import os
import base64
import random
import string
import datetime

from django.shortcuts import render
from django.http.response import JsonResponse

from django.conf import settings
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.core.serializers import serialize

from django.views.static import serve
from django.http import FileResponse
from django.db import connection
from datetime import date

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import *
from .models import *


def index(request):
    return render(request, 'index.html')


SECRET_KEY = b'pseudorandomly generated server secret key'
AUTH_SIZE = 16

# Project Info


class ProjectInfo(APIView):
    def get(self, request):
        project_info = ProjectInfo.objects.all()
        serializer = ProjectInfoSerializer(project_info, many=True)
        return Response(serializer.data)


# Elections: getElection, delElection, addElection, updateElection, ElectionCount
class GetElections(APIView):
    def get(self, request):
        data_data = Elections.objects.all()
        data_serializer = electionSerializer(data_data, many=True)
        return Response({"data": data_serializer.data, "code": 200})


class GetElectionDetails(APIView):
    def get(self, request, id):
        try:
            election = Elections.objects.get(id=id)
            serializer = electionSerializer(election)
            election_data = serializer.data
            election_data_details = {
                "id": election_data["id"],
                "title": election_data["title"],

                "image": election_data["image"],
                "description": election_data["description"],
                "duedate": election_data["duedate"],

                "candidates": election_data["candidates"],
                "committees": election_data["committees"],
                "moderators": election_data["moderators"],

                "category": election_data["category"],
                "sub_category": election_data["sub_category"],
                "tags": election_data["tags"],

                "status": election_data["status"],
                "priority": election_data["priority"],

                "del_flag": election_data["del_flag"],
                "created_by": election_data["created_by"],
                "created_date": election_data["created_date"],
                "updated_by": election_data["updated_by"],
                "updated_date": election_data["updated_date"],
            }
            return Response({"data": election_data_details, "count": 0, "code": 200})
        except Elections.DoesNotExist:
            return JsonResponse({"error": "Election not found"}, status=404)


class DelElection(APIView):
    def delete(self, request, id):
        try:
            election = Elections.objects.get(id=id)
            election.delete()
            return JsonResponse({"data": "Election deleted successfully", "count": 1, "code": 200}, safe=False)
        except Elections.DoesNotExist:
            return JsonResponse({"data": "Election not found", "count": 0, "code": 404}, safe=False)


class addNewElection(APIView):
    def post(self, request):
        title = request.data.get("title")
        image = request.data.get("image")
        description = request.data.get("description")
        duedate = request.data.get("duedate")

        category = request.data.get("category")
        sub_category = request.data.get("sub_category")
        tags = request.data.get("tags")

        status = request.data.get("status")
        priority = request.data.get("priority")

        election = Elections(
            title=title,
            description=description,
            duedate=duedate,
            # committees=committees,

            category=category,
            sub_category=sub_category,
            tags=tags,

            priority=priority,
            status=status,
        )

        if image:
            election.image = image

        election.save()

        new_election_data = {
            "id": election.id,
            "title": election.title,
            "image": election.image.url if election.image else None,
            "description": election.description,
            "duedate": election.duedate,

            "category": election.category,
            "sub_category": election.sub_category,
            "tags": election.tags,

            "status": election.status,
            "priority": election.priority,
        }

        return Response({"data": new_election_data, "count": 0, "code": 200})


import os

# ...

class UpdateElection(APIView):
    def patch(self, request, id):
        try:
            election = Elections.objects.get(id=id)
        except Elections.DoesNotExist:
            return Response({"error": "Election not found"}, status=404)
        
        # Extract the desired fields from the request data
        title = request.data.get("title")
        image = request.data.get("image")
        description = request.data.get("description")
        duedate = request.data.get("duedate")
        # Extract other fields as needed
        
        # Update the election object with the new values
        election.title = title
        
        # Extract the filename from the image URL
        if image:
            filename = os.path.basename(image)
            election.image = filename
        
        election.description = description
        election.duedate = duedate
        # Update other fields as needed
        
        # Save the updated election object
        election.save()

        # Return the updated election data in the response
        updated_election_data = {
            "id": election.id,
            "title": election.title,
            "image": election.image.url if election.image else None,
            "description": election.description,
            "duedate": election.duedate,
            # Include other fields in the response
        }

        return Response({"data": updated_election_data, "count": 0, "code": 200})


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


# class UploadElectionImage(APIView):
#     def post(self, request):
#         image = request.FILES.get('image')
#         letters = string.ascii_lowercase
#         result_str = ''.join(random.choice(letters) for i in range(20))

#         if image:
#             with open(os.path.join(settings.MEDIA_ROOT, result_str + image.name), 'wb+') as destination:
#                 for chunk in image.chunks():
#                     destination.write(chunk)
#             return JsonResponse({'success': True, 'url': result_str + image.name})

#         return JsonResponse({'success': False})

class UploadElectionImage(APIView):
    def post(self, request):
        image = request.FILES.get('image')
        letters = string.ascii_lowercase
        result_str = ''.join(random.choice(letters) for i in range(20))

        if image:
            with open(os.path.join(settings.MEDIA_ROOT, 'elections', result_str + image.name), 'wb+') as destination:
                for chunk in image.chunks():
                    destination.write(chunk)
            return JsonResponse({'success': True, 'url': '/media/elections/' + result_str + image.name})

        return JsonResponse({'success': False})

