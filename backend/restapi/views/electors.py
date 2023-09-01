from django.http import JsonResponse
from django.shortcuts import render
from django.http.response import JsonResponse

from django.core.files.base import ContentFile
from django.core.serializers import serialize

from django.views.static import serve
from django.http import FileResponse
from django.db import connection
from datetime import date

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView

from restapi.serializers import *
from restapi.models import *
from django.db.models import Q
from rest_framework.pagination import PageNumberPagination
from rest_framework import status


class GetAllElectors(APIView):
    def get(self, request):
        electors = Electors.objects.all()
        electors_serializer = ElectorsSerializer(electors, many=True)
        return Response({"data": {"allElectors": electors_serializer.data}, "code": 200})

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 100  # default number of items per page
    page_size_query_param = 'page_size'  # Allow client to override, using `?page_size=xxx`.
    max_page_size = 1000  # Maximum limit allowed when using `?page_size=xxx`.


# class GetElectors(APIView):
#     def get(self, request):
#         query = request.GET.get('searchInput', '').strip()
#         search_type = request.GET.get('searchType', '').lower()

#         if search_type == 'cid':
#             if not (query.isdigit() and len(query) == 12):  # Validate Civil ID
#                 return Response({"error": "Invalid Civil ID."}, status=400)
#             electors = Electors.objects.filter(civil=query)
            
#         elif search_type == 'name':
#             if len(query) < 3:  # Validate name length
#                 return Response({"error": "Name should be at least 3 characters long."}, status=400)
#             electors = Electors.objects.filter(
#                 Q(name_1__icontains=query) | 
#                 Q(name_2__icontains=query) | 
#                 Q(name_3__icontains=query) | 
#                 Q(name_4__icontains=query) | 
#                 Q(last_name__icontains=query)
#             )
            
#         elif search_type == 'detailed':
#             return Response({"error": "Detailed search is not yet implemented."}, status=501)
            
#         elif search_type == 'location':
#             return Response({"error": "Location search is not yet implemented."}, status=501)
            
#         else:
#             return Response({"error": "Invalid search type specified."}, status=400)

#         # Pagination
#         paginator = StandardResultsSetPagination()
#         result_page = paginator.paginate_queryset(electors, request)
#         serialized = ElectorsSerializer(result_page, many=True)
#         response_data = {
#             "data": {
#                 "electors": serialized.data,
#                 "count": paginator.page.paginator.count,
#                 "nextPageUrl": paginator.get_next_link(),
#                 "previousPageUrl": paginator.get_previous_link()
#             }
#         }

#         return Response(response_data)

# class GetElectors(APIView):
#     def get(self, request):
#         query = request.GET.get('searchInput', '').strip()
#         queries = Q()  # Start with an empty Q object to chain queries
        
#         # If query can be converted to a number, try to match it against the civil field
#         if query.isdigit():
#             queries |= Q(civil=query)
            
#         # If the query has sufficient length, try to match it against name fields
#         if len(query) >= 3:
#             for i in range(1, 11):
#                 queries |= Q(**{f"name_{i}__icontains": query})
            
#             for i in range(1, 5):
#                 queries |= Q(**{f"last_{i}__icontains": query})

#             queries |= Q(last_name__icontains=query)
        
#         electors = Electors.objects.filter(queries)

#         # Pagination
#         paginator = StandardResultsSetPagination()
#         result_page = paginator.paginate_queryset(electors, request)
#         serialized = ElectorsSerializer(result_page, many=True)
#         response_data = {
#             "data": {
#                 "electors": serialized.data,
#                 "count": paginator.page.paginator.count,
#                 "nextPageUrl": paginator.get_next_link(),
#                 "previousPageUrl": paginator.get_previous_link()
#             }
#         }

#         return Response(response_data)

class GetElectors(APIView):
    def get(self, request):
        query = request.GET.get('searchInput', '').strip()
        
        if query.isdigit():
            electors = Electors.objects.filter(civil=query)
        else:
            # Get all electors and filter them in Python based on full_name
            all_electors = Electors.objects.all()
            if len(query) >= 3:
                electors = [elector for elector in all_electors if query.lower() in elector.full_name().lower()]
            else:
                electors = all_electors

        # Pagination
        paginator = StandardResultsSetPagination()
        result_page = paginator.paginate_queryset(electors, request)
        serialized = ElectorsSerializer(result_page, many=True)
        response_data = {
            "data": {
                "electors": serialized.data,
                "count": paginator.page.paginator.count,
                "nextPageUrl": paginator.get_next_link(),
                "previousPageUrl": paginator.get_previous_link()
            }
        }

        return Response(response_data)


class AddNewElectionAttendee(APIView):
    def post(self, request):
        user_id = request.data.get("user")
        election_id = request.data.get("election")
        committee_id = request.data.get("committee")
        civil = request.data.get("elector")
        status_value = request.data.get("status")  # Renamed to avoid conflict with status module

        # Fetch the elector details based on elector civil
        try:
            elector = Electors.objects.get(civil=civil)
        except Electors.DoesNotExist:
            return Response({"error": "Elector not found"}, status=status.HTTP_404_NOT_FOUND)

        # Fetch the member based on member_id
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        # Fetch the election based on election_id
        try:
            election = Elections.objects.get(id=election_id)
        except Elections.DoesNotExist:
            return Response({"error": "Election not found"}, status=status.HTTP_404_NOT_FOUND)

        # Fetch the election based on committee_id
        try:
            committee = ElectionCommittees.objects.get(id=committee_id)
        except ElectionCommittees.DoesNotExist:
            return Response({"error": "Committee not found"}, status=status.HTTP_404_NOT_FOUND)

        # Create the new link between the user, elector, and election
        election_attendee = ElectionAttendees.objects.create(
            user_id=user_id,
            elector=elector,
            committee=committee,
            election=election,
            status=status_value,
        )

        # Prepare the response data with member, elector, and election details
        response_data = {
            "id": election_attendee.id,
            "user": user.id,
            "civil": elector.civil,
            "election": election.id,
            "committee": committee.id,
            "full_name": elector.full_name(),
            "gender": elector.gender,
            "status": election_attendee.status,
            # ... other fields you want to return
        }

        return Response({"data": response_data, "count": 0, "code": 200})

class UpdateElectionAttendee(APIView):
    def patch(self, request, id):
        # Fetch the campaign guarantee based on the URL parameter 'id'
        try:
            campaign_guarantee = ElectionAttendees.objects.get(id=id)
        except ElectionAttendees.DoesNotExist:
            return Response({"error": "Campaign Guarantee not found"}, status=status.HTTP_404_NOT_FOUND)

        # Since civil is a ForeignKey, you can directly use it to access the related Elector object
        elector = campaign_guarantee.civil
        if not elector:
            return Response({"error": "Elector not found"}, status=status.HTTP_404_NOT_FOUND)

        # Basic Information
        member_id = request.data.get("member_id")
        mobile = request.data.get("mobile")
        status_value = request.data.get("status")
        notes = request.data.get("notes")

        # If there's a member_id provided, update the member
        if member_id:
            try:
                member = CampaignMembers.objects.get(id=member_id)
                campaign_guarantee.member = member
            except CampaignMembers.DoesNotExist:
                return Response({"error": "Member not found"}, status=status.HTTP_404_NOT_FOUND)

        # Update status
        if status_value:
            campaign_guarantee.status = status_value

        # Update fields
        if mobile:
            campaign_guarantee.mobile = mobile
        if notes:
            campaign_guarantee.notes = notes

        # Save the changes
        campaign_guarantee.save()

        # Prepare the response data with guarantee details
        updated_data = {
            "id": campaign_guarantee.id,
            "member": campaign_guarantee.member.id if campaign_guarantee.member else None,
            "civil": elector.civil,
            "full_name": elector.full_name(),  # Using the full_name method from Electors model
            "gender": elector.gender,
            "mobile": campaign_guarantee.mobile,
            "status": campaign_guarantee.status,
            "notes": campaign_guarantee.notes
        }

        return Response({"data": updated_data, "count": 0, "code": 200})

class DeleteElectionAttendee(APIView):
    def delete(self, request, id):
        try:
            campaign_guarantee = ElectionAttendees.objects.get(id=id)
            campaign_guarantee.delete()
            return JsonResponse(
                {"data": "campaign Guarantee deleted successfully", "count": 1, "code": 200},
                safe=False,
            )
        except ElectionAttendees.DoesNotExist:
            return JsonResponse(
                {"data": "campaign not found", "count": 0, "code": 404}, safe=False
            )
        
