# from apps.campaigns.models import Campaign
from django.http import JsonResponse
# from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.contrib.auth.decorators import user_passes_test

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import AuthenticationFailed

# Models
from apps.auths.models import User, Group
from apps.campaigns.models import Campaign, CampaignMember, CampaignGuarantee, CampaignAttendee, CampaignSorting
from apps.elections.models import Election, ElectionCandidate, ElectionCommittee
from django.contrib.auth.models import Group

# Serializers
from apps.campaigns.serializers import CampaignSerializer, CampaignMemberSerializer, CampaignGuaranteeSerializer, CampaignSortingSerializer
from apps.elections.serializers import ElectionCandidateSerializer, ElectionCommitteeSerializer
from apps.auths.serializers import GroupSerializer

from helper.views_helper import CustomPagination
from utils.views import (
    get_campaign_roles,
    determine_user_role,
    get_current_campaign_member,
    get_campaign_members_by_role
)


class GetCampaigns(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            # Check if user is admin or superadmin (group.name)
            user_id = request.user.id

            if User.objects.filter(pk=user_id, groups__name__in=["admin", "superAdmin"]).exists():
                campaign_data = Campaign.objects.all()

            else:

                # Step 1: Query the CampaignMember table
                member_entries = CampaignMember.objects.filter(user_id=user_id)
                
                # Step 2: Get corresponding Campaign
                campaign_ids = [entry.campaign.id for entry in member_entries if entry.campaign]
                campaign_data = Campaign.objects.filter(id__in=campaign_ids)
                
            # Pagination
            paginator = CustomPagination()
            paginated_campaigns = paginator.paginate_queryset(campaign_data, request)
            
            # Passing context with request to the serializer
            context = {"request": request}
            data_serializer = CampaignSerializer(paginated_campaigns, many=True, context=context)

            return paginator.get_paginated_response(data_serializer.data)

        except AuthenticationFailed as auth_failed:
            return Response({"error": str(auth_failed)}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class GetCampaignDetails(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, slug):
        campaign = get_object_or_404(Campaign, slug=slug)
        context = {"request": request}
        user_id = context["request"].user.id
        user_role = determine_user_role(campaign.id, user_id, context)
        current_campaign_member = get_current_campaign_member(campaign.id, user_id, context)

        # Fetch campaign members based on user/member role
        campaign_members, campaign_managed_members = get_campaign_members_by_role(campaign, user_role, current_campaign_member)

        # Extract user ids from campaign_managed_members to further filter guarantees based on member's user
        campaign_guarantees = CampaignGuarantee.objects.filter(
            campaign=campaign,
            member__user__id__in=campaign_managed_members.values_list('user__id', flat=True)
        ).select_related('campaign')

        # Fetch other related details based on the current campaign
        election = campaign.election_candidate.election
        election_candidates = ElectionCandidate.objects.filter(election=election).select_related('election')
        election_committees = ElectionCommittee.objects.filter(election=election).select_related('election')
        campaign_attendees = CampaignAttendee.objects.filter(election=election).select_related('election')

        # Prepare data for each election candidate
        election_candidates_data = []
        for candidate in election_candidates:
            candidate_data = ElectionCandidateSerializer(candidate, context=context).data
            candidate_sorting = CampaignSorting.objects.filter(electionCandidate=candidate)
            candidate_data["sorting"] = CampaignSortingSerializer(candidate_sorting, many=True, context=context).data
            election_candidates_data.append(candidate_data)

        # Further processing, returning response or any other operations can continue here...
        return Response({
            "data": {
                "currentCampaignMember": current_campaign_member,
                "campaignDetails": CampaignSerializer(campaign, context=context).data,
                "campaignMembers": CampaignMemberSerializer(campaign_members, many=True, context=context).data,
                "campaignGuarantees": CampaignGuaranteeSerializer(campaign_guarantees, many=True, context=context).data,
                "campaignAttendees": CampaignGuaranteeSerializer(campaign_attendees, many=True, context=context).data,
                "campaignElectionCandidates": ElectionCandidateSerializer(election_candidates, many=True, context=context).data,
                "campaignElectionCommittees": ElectionCommitteeSerializer(election_committees, many=True, context=context).data,
                "campaignElectionSorting": CampaignSortingSerializer(election_candidates_data, many=True, context=context).data,
                "campaign_roles": get_campaign_roles(context),
            },
            "code": 200
        })

class AddNewCampaign(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CampaignSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({"data": serializer.data, "count": 0, "code": 200}, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UpdateCampaign(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, id):
        try:
            campaign = Campaign.objects.get(id=id)
        except Campaign.DoesNotExist:
            return Response({"error": "Campaign not found"}, status=404)
        
        serializer = CampaignSerializer(instance=campaign, data=request.data, partial=True, context={'request': request})

        if serializer.is_valid():
            serializer.save()
            return Response({"data": serializer.data, "count": 0, "code": 200})
        return Response(serializer.errors, status=400)

class DeleteCampaign(APIView):
    def delete(self, request, id):
        try:
            campaign = Campaign.objects.get(id=id)
            campaign.delete()
            return JsonResponse({"data": "Campaign deleted successfully", "count": 1, "code": 200}, safe=False)
        except Campaign.DoesNotExist:
            return JsonResponse({"data": "Campaign not found", "count": 0, "code": 404}, safe=False)


# Campaign Members
class AddNewCampaignMember(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CampaignMemberSerializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            serializer.save()
            return Response({"data": serializer.data, "count": 1, "code": 200}, status=200)
        return Response({"data": serializer.errors, "count": 0, "code": 400}, status=400)

class UpdateCampaignMember(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, id):
        try:
            current_campaign_member = CampaignMember.objects.get(id=id)
            
        except CampaignMember.DoesNotExist:
            return Response({"data": "Campaign Member not found", "count": 0, "code": 404}, status=404)
        
        serializer = CampaignMemberSerializer(instance=current_campaign_member, data=request.data, partial=True, context={'request': request})
        
        if serializer.is_valid():
            serializer.save()
            return Response({"data": serializer.data, "count": 1, "code": 200}, status=200)
        
        return Response({"data": serializer.errors, "count": 0, "code": 400}, status=400)

class DeleteCampaignMember(APIView):
    def delete(self, request, id):
        try:
            current_campaign_member = CampaignMember.objects.get(id=id)
            current_campaign_member.delete()
            return JsonResponse(
                {"data": "campaign member deleted successfully", "count": 1, "code": 200},
                safe=False,
            )
        except Election.DoesNotExist:
            return JsonResponse(
                {"data": "campaign not found", "count": 0, "code": 404}, safe=False
            )


# Campaign Guarantees
class AddNewCampaignGuarantee(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CampaignGuaranteeSerializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            serializer.save()
            return Response({"data": serializer.data, "count": 1, "code": 200}, status=200)
        return Response({"data": serializer.errors, "count": 0, "code": 400}, status=400)

class UpdateCampaignGuarantee(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, id):
        try:
            campaign_guarantee = CampaignGuarantee.objects.get(id=id)
        except CampaignGuarantee.DoesNotExist:
            return Response({"data": "Campaign Guarantee not found", "count": 0, "code": 404}, status=404)
        
        serializer = CampaignGuaranteeSerializer(instance=campaign_guarantee, data=request.data, partial=True, context={'request': request})
        
        if serializer.is_valid():
            serializer.save()
            return Response({"data": serializer.data, "count": 1, "code": 200}, status=200)
        
        return Response({"data": serializer.errors, "count": 0, "code": 400}, status=400)

class DeleteCampaignGuarantee(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, id):
        try:
            campaign_guarantee = CampaignGuarantee.objects.get(id=id)
            campaign_guarantee.delete()
            return JsonResponse({"data": "Campaign Guarantee deleted successfully", "count": 1, "code": 200}, safe=False)
        except CampaignGuarantee.DoesNotExist:
            return JsonResponse({"data": "Campaign Guarantee not found", "count": 0, "code": 404}, safe=False)

class AddNewCampaignAttendee(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Assuming you have a serializer for CampaignAttendee
        serializer = CampaignGuaranteeSerializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            serializer.save()
            return Response({"data": serializer.data, "count": 1, "code": 200}, status=200)
        
        return Response({"data": serializer.errors, "count": 0, "code": 400}, status=400)

class UpdateCampaignAttendee(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, id):
        try:
            campaign_attendee = CampaignAttendee.objects.get(id=id)
        except CampaignAttendee.DoesNotExist:
            return Response({"data": "Campaign Attendee not found", "count": 0, "code": 404}, status=404)
        
        # Assuming you have a serializer for CampaignAttendee
        serializer = CampaignGuaranteeSerializer(instance=campaign_attendee, data=request.data, partial=True, context={'request': request})
        
        if serializer.is_valid():
            serializer.save()
            return Response({"data": serializer.data, "count": 1, "code": 200}, status=200)
        
        return Response({"data": serializer.errors, "count": 0, "code": 400}, status=400)

class DeleteCampaignAttendee(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, id):
        try:
            campaign_attendee = CampaignAttendee.objects.get(id=id)
            campaign_attendee.delete()
            return Response({"data": "Campaign Attendee deleted successfully", "count": 1, "code": 200}, status=200)
        except CampaignAttendee.DoesNotExist:
            return Response({"data": "Campaign Attendee not found", "count": 0, "code": 404}, status=404)
      
class GetAllCampaignSorting(APIView):
    def get(self, request, format=None):
        sortings = CampaignSorting.objects.all()
        serializer = CampaignSortingSerializer(sortings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class GetCampaignCommitteeSorting(APIView):
    def get(self, request, format=None):
        sortings = CampaignSorting.objects.all()
        serializer = CampaignSortingSerializer(sortings, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)