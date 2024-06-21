# from apps.campaigns.models import Campaign
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import AuthenticationFailed

# Apps Models
from apps.campaigns.models import Campaign
from apps.campaigns.members.models import CampaignMember


# Apps Serializers
from apps.campaigns.members.serializers import CampaignMemberSerializer
from apps.campaigns.serializers import CampaignSerializer


# Apps Helper and Utils
from apps.campaigns.views_helper import (
    get_campaign_roles,
    determine_user_role,
    get_current_campaign_member,
    get_campaign_members_by_role,
)

from apps.campaigns.get_election_details import get_election_details
from apps.campaigns.get_campaign_details import get_campaign_details

from utils.views_helper import CustomPagination


class GetCampaigns(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user

            # Fetch campaigns and campaign parties separately
            campaigns = Campaign.objects.all()
            # campaign_parties = CampaignParty.objects.all()

            # Apply filtering for non-admin/superadmin users
            if not (
                user.is_superuser
                or user.groups.filter(name__in=["admin", "superAdmin"]).exists()
            ):
                accessible_campaign_ids = CampaignMember.objects.filter(
                    user=user
                ).values_list("campaign_id", flat=True)
                # | CampaignPartyMember.objects.filter(
                #     user=user
                # ).values_list(
                #     "campaign_party_id", flat=True
                # )
                campaigns = campaigns.filter(id__in=accessible_campaign_ids)
                # campaign_parties = campaign_parties.filter(id__in=accessible_campaign_ids)

            # Combine results in Python
            # combined_data = list(chain(campaigns, campaign_parties))

            # Pagination
            paginator = CustomPagination()
            paginated_combined_data = paginator.paginate_queryset(campaigns, request)

            context = {"request": request}
            serializer = CampaignSerializer(
                paginated_combined_data, many=True, context=context
            )

            return paginator.get_paginated_response(serializer.data)

        except AuthenticationFailed as auth_failed:
            return Response(
                {"error": str(auth_failed)}, status=status.HTTP_401_UNAUTHORIZED
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class GetCampaignDetails(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, slug):
        context = {"request": request}
        user_id = context["request"].user.id
        campaign = get_object_or_404(Campaign, slug=slug)

        response_data = {}
        
        self.populate_campaign_details(context, campaign, user_id, response_data)      

        return Response({"data": response_data, "code": 200})

    def populate_campaign_details(self, context, campaign, user_id, response_data):
        campaign_roles = get_campaign_roles(context)
        current_campaign_member = get_current_campaign_member(campaign.id, user_id, context)
        user_role = determine_user_role(campaign.id, user_id, campaign_roles, context)
        campaign_members, campaign_managed_members = get_campaign_members_by_role(
            campaign, user_role, current_campaign_member
        )

        campaign_details_serialized = CampaignSerializer(campaign, context=context).data
        campaign_members_serialized = CampaignMemberSerializer(
            campaign_members, many=True, context=context
        ).data

        response_data.update({
            "currentCampaignMember": current_campaign_member,
            "campaignDetails": campaign_details_serialized,
            "campaignMembers": campaign_members_serialized,
            "campaign_roles": campaign_roles,
        })
        
        # Get the related election details
        election = campaign.election_candidate.election
        election_slug = election.slug
        
        get_election_details(context, election, response_data)
        get_campaign_details(context, election_slug, campaign, current_campaign_member, campaign_managed_members, response_data)



class AddCampaign(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CampaignSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"data": serializer.data, "count": 0, "code": 200},
                status=status.HTTP_201_CREATED,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UpdateCampaign(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, id):
        try:
            campaign = Campaign.objects.get(id=id)
        except Campaign.DoesNotExist:
            return Response({"error": "Campaign not found"}, status=404)

        serializer = CampaignSerializer(
            instance=campaign,
            data=request.data,
            partial=True,
            context={"request": request},
        )

        if serializer.is_valid():
            serializer.save()
            return Response({"data": serializer.data, "count": 0, "code": 200})
        return Response(serializer.errors, status=400)


class DeleteCampaign(APIView):
    def delete(self, request, id):
        try:
            campaign = Campaign.objects.get(id=id)
            campaign.delete()
            return JsonResponse(
                {"data": "Campaign deleted successfully", "count": 1, "code": 200},
                safe=False,
            )
        except Campaign.DoesNotExist:
            return JsonResponse(
                {"data": "Campaign not found", "count": 0, "code": 404}, safe=False
            )