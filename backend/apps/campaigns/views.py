# from apps.campaigns.models import Campaign
from django.http import JsonResponse
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.contrib.auth.decorators import user_passes_test

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import AuthenticationFailed

# Models
from apps.auths.models import User, Group
from apps.campaigns.models import Campaign, CampaignMember, CampaignGuarantee, CampaignAttendee
from apps.elections.models import Election, ElectionCandidate, ElectionCommittee
from django.contrib.auth.models import Group

# Serializers
from apps.campaigns.serializers import CampaignsSerializer, CampaignMemberSerializer, CampaignGuaranteeSerializer
from apps.elections.serializers import ElectionCandidatesSerializer, ElectionCommitteesSerializer
from apps.auths.serializers import GroupSerializer

from helper.views_helper import CustomPagination


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
            data_serializer = CampaignsSerializer(paginated_campaigns, many=True, context=context)

            return paginator.get_paginated_response(data_serializer.data)

        except AuthenticationFailed as auth_failed:
            return Response({"error": str(auth_failed)}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class GetCampaignDetails(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id):
        context = {"request": request}
        user_id = context["request"].user.id
        current_campaign_member = self.get_current_campaign_member(id, user_id, context)

        # Fetching all campaign roles & check user role
        campaign_roles = Group.objects.filter(Q(category=3))  # CampaignRoles
        user_role = self.determine_user_role(id, user_id, campaign_roles)

        # Fetch campaign details and its associated models
        campaign = get_object_or_404(Campaign, id=id)
        election_candidate = campaign.election_candidate
        election = election_candidate.election
        candidate = election_candidate.candidate


        MANAGER_ROLES = {"admin", "campaignModerator", "campaignCandidate", "campaignCoordinator"}
        SUPERVISOR_ROLES = {"campaignSupervisor"}
        MEMBER_ROLES = {"campaignSupervisor", "campaignGuarantor", "campaignAttendant", "campaignSorter"}

        # Fetch campaign members based on user/member role
        if user_role in MANAGER_ROLES:
            campaign_members = CampaignMember.objects.filter(campaign=campaign)
            campaign_managed_members = campaign_members  # For these roles, all campaign members are considered "managed"
        
        elif user_role in SUPERVISOR_ROLES:
            # If user is a supervisor, fetch members they manage and members with managerial roles
            # get_campaign_managed_members = get_campaign_managed_members
            campaign_managers = self.get_campaign_managers(campaign)
            campaign_managed_members = self.get_campaign_managed_members(current_campaign_member, user_role)
            campaign_members = campaign_managers | campaign_managed_members

        else:
            # For other roles or non-members, return an empty query set
            campaign_managed_members = CampaignMember.objects.none()

        # Extract user ids from campaign_managed_members to further filter guarantees based on member's user
        managed_user_ids = campaign_managed_members.values_list('user__id', flat=True)
        campaign_guarantees = CampaignGuarantee.objects.filter(campaign=campaign, member__user__id__in=managed_user_ids).select_related('campaign')

        # Fetch other related details based on the current campaign
        campaign_attendeess = CampaignAttendee.objects.filter(election=election).select_related('election')
        election_candidates = ElectionCandidate.objects.filter(election=election).select_related('election')
        election_committees = ElectionCommittee.objects.filter(election=election).select_related('election')


        # Further processing, returning response or any other operations can continue here...


        return Response({
            "data": {
                "currentCampaignMember": current_campaign_member,
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

    def determine_user_role(self, campaign_id, user_id, campaign_roles):
        current_campaign_member = self.get_current_campaign_member(campaign_id, user_id, {"request": self.request})
        
        # If the user is not part of the campaign, then check for admin roles
        if not current_campaign_member:
            return "admin" if self.is_higher_privilege(user_id) else None
        
        # Convert campaign_roles to a dictionary for faster lookup & Fetch role name
        role_lookup = {role.id: role.name for role in campaign_roles}
        return role_lookup.get(current_campaign_member.get('role'))

    def is_higher_privilege(self, user_id):
        # Directly filtering without fetching the user first
        return User.objects.filter(pk=user_id, groups__name__in=["admin", "superAdmin"]).exists()


    def get_current_campaign_member(self, campaign_id, user_id, context):
        current_campaign_member_query = CampaignMember.objects.select_related('user').filter(campaign_id=campaign_id, user_id=user_id).first()
        if current_campaign_member_query:
            return CampaignMemberSerializer(current_campaign_member_query, context=context).data
        return None

    def get_campaign_data(self, campaign, context):
        return CampaignsSerializer(campaign, context=context).data


    def get_campaign_managed_members(self, current_campaign_member, user_role):
        """Get members managed by the given supervisor."""
        campaign_member_id = current_campaign_member.get('id')
        current_campaign_member = CampaignMember.objects.filter(id=campaign_member_id)

        # if supervisor, get the member managed by supervisor together with current member (supervisor)
        if user_role == "campaignSupervisor":
            campaign_supervised_members = CampaignMember.objects.filter(supervisor_id=campaign_member_id)
            campaign_managed_members = current_campaign_member | campaign_supervised_members
        else:
            campaign_managed_members = current_campaign_member

        return campaign_managed_members


    def get_campaign_managers(self, campaign):
        """Get members with managerial roles in the campaign."""
        
        # Define the roles for campaign managers
        manager_roles = ["campaignModerator", "campaignCandidate", "campaignCoordinator" ]
        
        campaign_managers = CampaignMember.objects.select_related('role').filter(
            campaign=campaign,
            role__name__in=manager_roles
        )
        
        return campaign_managers

    def get_campaign_members(self, campaign_members, context):
        return CampaignMemberSerializer(campaign_members, many=True, context=context).data
        








    def get_campaign_guarantees(self, campaign_guarantees, context):
        return CampaignGuaranteeSerializer(campaign_guarantees, many=True, context=context).data

    def get_campaign_attendees(self, campaign_attendeess, context):
        return CampaignGuaranteeSerializer(campaign_attendeess, many=True, context=context).data

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
            campaign = Campaign.objects.get(id=id)
        except Campaign.DoesNotExist:
            return Response({"error": "Campaign not found"}, status=404)
        
        serializer = CampaignsSerializer(instance=campaign, data=request.data, partial=True, context={'request': request})

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
      