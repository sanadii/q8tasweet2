# from campaigns.models import Campaigns
from django.http import JsonResponse
from django.http.response import JsonResponse
from django.db.models import Q
from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import AuthenticationFailed

from restapi.serializers import *
from restapi.models import *
from .models import *

from restapi.helper.views_helper import CustomPagination


class GetCampaigns(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            # Check if user is staff
            if request.user.is_staff:
                campaignss_data = Campaigns.objects.all()
                paginator = CustomPagination()
                paginated_campaignss = paginator.paginate_queryset(campaignss_data, request)
                
                # Passing context with request to the serializer
                context = {"request": request}
                data_serializer = CampaignsSerializer(paginated_campaignss, many=True, context=context)
                
                return paginator.get_paginated_response(data_serializer.data)

            else:  # if user is not staff
                current_user_id = request.user.id

                # Step 1: Query the CampaignMembers table
                member_entries = CampaignMembers.objects.filter(user_id=current_user_id)
                
                # Step 2: Get corresponding Campaigns
                campaign_ids = [entry.campaign.id for entry in member_entries if entry.campaign]
                campaigns_data = Campaigns.objects.filter(id__in=campaign_ids)
                
                # Step 3: Serialize the data
                data_serializer = CampaignsSerializer(campaigns_data, many=True)

                return Response({
                    "data": data_serializer.data,
                    "code": 200
                }, status=status.HTTP_200_OK)

        except AuthenticationFailed as auth_failed:
            return Response({"error": str(auth_failed)}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class GetCampaignDetails(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id):
        context = {"request": request}
        current_user_id = context["request"].user.id

        campaign = get_object_or_404(Campaigns, id=id)
        election_candidate = campaign.election_candidate
        election = election_candidate.election
        candidate = election_candidate.candidate

        campaign_members = CampaignMembers.objects.filter(campaign=campaign).prefetch_related('campaign').only('id')
        campaign_guarantees = CampaignGuarantees.objects.filter(campaign=campaign).select_related('campaign')
        campaign_attendeess = CampaignAttendees.objects.filter(election=election).select_related('election')

        election_candidates = ElectionCandidates.objects.filter(election=election).select_related('election')
        election_committees = ElectionCommittees.objects.filter(election=election).select_related('election')

        campaign_roles = Group.objects.filter(Q(category=4))

        return Response({
            "data": {
                "currentCampaignMember": self.get_current_campaign_member(id, request.user.id, context),
                "campaignDetails": self.get_campaign_data(campaign, context),
                "campaignMembers": self.get_campaign_members(campaign_members, context),
                "campaignGuarantees": self.get_campaign_guarantees(campaign_guarantees, context),
                "campaignAttendees": self.get_campaign_attendees(campaign_attendeess, context),
                
                "campaignElectionCandidates": self.get_campaign_election_candidates(election_candidates, context),
                "campaignElectionCommittees": self.get_campaign_election_committees(election_committees, context),
                "campaign_roles": self.get_campaign_roles(campaign_roles, context),
            },
            "code": 200
        })

    def get_campaign_roles(self, campaign_roles, context):
        return GroupSerializer(campaign_roles, many=True, context=context).data

    def get_current_campaign_member(self, campaign_id, user_id, context):
        current_campaign_member_query = CampaignMembers.objects.select_related('user').filter(campaign_id=campaign_id, user_id=user_id).first()
        if current_campaign_member_query:
            return CampaignMembersSerializer(current_campaign_member_query, context=context).data
        return None

    def get_campaign_data(self, campaign, context):
        return CampaignsSerializer(campaign, context=context).data

    def get_campaign_members(self, campaign_members, context):
        return CampaignMembersSerializer(campaign_members, many=True, context=context).data

    def get_campaign_guarantees(self, campaign_guarantees, context):
        return CampaignGuaranteesSerializer(campaign_guarantees, many=True, context=context).data

    def get_campaign_attendees(self, campaign_attendeess, context):
        return CampaignAttendeesSerializer(campaign_attendeess, many=True, context=context).data

    def get_campaign_election_candidates(self, election_candidates, context):
        return ElectionCandidatesSerializer(election_candidates, many=True, context=context).data

    def get_campaign_election_committees(self, election_committees, context):
        return ElectionCommitteesSerializer(election_committees, many=True, context=context).data

    # Add any other helper methods here

class AddNewCampaign(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CampaignsSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({"data": serializer.data, "count": 0, "code": 200}, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UpdateCampaign(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, id):
        try:
            campaign = Campaigns.objects.get(id=id)
        except Campaigns.DoesNotExist:
            return Response({"error": "Campaign not found"}, status=404)
        
        serializer = CampaignsSerializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            serializer.save()
            return Response({"data": serializer.data, "count": 0, "code": 200})
        return Response(serializer.errors, status=400)

class DeleteCampaign(APIView):
    def delete(self, request, id):
        try:
            campaign = Campaigns.objects.get(id=id)
            campaign.delete()
            return JsonResponse({"data": "Campaign deleted successfully", "count": 1, "code": 200}, safe=False)
        except Campaigns.DoesNotExist:
            return JsonResponse({"data": "Campaign not found", "count": 0, "code": 404}, safe=False)


# Campaign Members
class AddNewCampaignMember(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CampaignMembersSerializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            serializer.save()
            return Response({"data": serializer.data, "count": 1, "code": 200}, status=200)
        return Response({"data": serializer.errors, "count": 0, "code": 400}, status=400)

class UpdateCampaignMember(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, id):
        try:
            campaign_member = CampaignMembers.objects.get(id=id)
        except CampaignMembers.DoesNotExist:
            return Response({"data": "Campaign Member not found", "count": 0, "code": 404}, status=404)
        
        serializer = CampaignMembersSerializer(instance=campaign_member, data=request.data, partial=True, context={'request': request})
        
        if serializer.is_valid():
            serializer.save()
            return Response({"data": serializer.data, "count": 1, "code": 200}, status=200)
        
        return Response({"data": serializer.errors, "count": 0, "code": 400}, status=400)

class DeleteCampaignMember(APIView):
    def delete(self, request, id):
        try:
            campaign_member = CampaignMembers.objects.get(id=id)
            campaign_member.delete()
            return JsonResponse(
                {"data": "campaign member deleted successfully", "count": 1, "code": 200},
                safe=False,
            )
        except Elections.DoesNotExist:
            return JsonResponse(
                {"data": "campaign not found", "count": 0, "code": 404}, safe=False
            )


# Campaign Guarantees
class AddNewCampaignGuarantee(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CampaignGuaranteesSerializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            serializer.save()
            return Response({"data": serializer.data, "count": 1, "code": 200}, status=200)
        return Response({"data": serializer.errors, "count": 0, "code": 400}, status=400)

class UpdateCampaignGuarantee(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, id):
        try:
            campaign_guarantee = CampaignGuarantees.objects.get(id=id)
        except CampaignGuarantees.DoesNotExist:
            return Response({"data": "Campaign Guarantee not found", "count": 0, "code": 404}, status=404)
        
        serializer = CampaignGuaranteesSerializer(instance=campaign_guarantee, data=request.data, partial=True, context={'request': request})
        
        if serializer.is_valid():
            serializer.save()
            return Response({"data": serializer.data, "count": 1, "code": 200}, status=200)
        
        return Response({"data": serializer.errors, "count": 0, "code": 400}, status=400)

class DeleteCampaignGuarantee(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, id):
        try:
            campaign_guarantee = CampaignGuarantees.objects.get(id=id)
            campaign_guarantee.delete()
            return JsonResponse({"data": "Campaign Guarantee deleted successfully", "count": 1, "code": 200}, safe=False)
        except CampaignGuarantees.DoesNotExist:
            return JsonResponse({"data": "Campaign Guarantee not found", "count": 0, "code": 404}, safe=False)

class AddNewCampaignAttendee(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Assuming you have a serializer for CampaignAttendees
        serializer = CampaignAttendeesSerializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            serializer.save()
            return Response({"data": serializer.data, "count": 1, "code": 200}, status=200)
        
        return Response({"data": serializer.errors, "count": 0, "code": 400}, status=400)

class UpdateCampaignAttendee(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, id):
        try:
            campaign_attendee = CampaignAttendees.objects.get(id=id)
        except CampaignAttendees.DoesNotExist:
            return Response({"data": "Campaign Attendee not found", "count": 0, "code": 404}, status=404)
        
        # Assuming you have a serializer for CampaignAttendees
        serializer = CampaignAttendeesSerializer(instance=campaign_attendee, data=request.data, partial=True, context={'request': request})
        
        if serializer.is_valid():
            serializer.save()
            return Response({"data": serializer.data, "count": 1, "code": 200}, status=200)
        
        return Response({"data": serializer.errors, "count": 0, "code": 400}, status=400)

class DeleteCampaignAttendee(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, id):
        try:
            campaign_attendee = CampaignAttendees.objects.get(id=id)
            campaign_attendee.delete()
            return Response({"data": "Campaign Attendee deleted successfully", "count": 1, "code": 200}, status=200)
        except CampaignAttendees.DoesNotExist:
            return Response({"data": "Campaign Attendee not found", "count": 0, "code": 404}, status=404)
      