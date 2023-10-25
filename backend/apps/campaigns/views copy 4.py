# from apps.campaigns.models import Campaign
from django.http import JsonResponse
from django.db.models import Q
from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import AuthenticationFailed

# Models
from models import Campaign, CampaignMember, CampaignGuarantee, CampaignAttendee
from apps.elections.models import Election, ElectionCandidate, ElectionCommittee
from apps.candidates.models import Candidate
from electors.models import Elector
from apps.categories.models import Category
from django.contrib.auth.models import Group, Permission

# Serializers
from candidates.serializers import CandidatesSerializer
from elections.serializers import ElectionSerializer
from apps.auths.serializers import UserSerializer
from electors.serializers import ElectorsSerializer
from enum import IntEnum

from helper.views_helper import CustomPagination

class CampaignRoleIDs(IntEnum):
    ADMIN = 1
    SUPERADMIN = 2
    MODERATOR = 30
    CANDIDATE = 31
    COORDINATOR = 32
    SUPERVISOR = 33
    GUARANTOR = 34
    ATTENDANT = 35
    SORTER = 36


class GetCampaigns(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            # Check if user is staff
            if request.user.is_staff:
                campaignss_data = Campaign.objects.all()
                paginator = CustomPagination()
                paginated_campaignss = paginator.paginate_queryset(campaignss_data, request)
                
                # Passing context with request to the serializer
                context = {"request": request}
                data_serializer = CampaignsSerializer(paginated_campaignss, many=True, context=context)
                
                return paginator.get_paginated_response(data_serializer.data)

            else:  # if user is not staff
                current_user_id = request.user.id

                # Step 1: Query the CampaignMember table
                member_entries = CampaignMember.objects.filter(user_id=current_user_id)
                
                # Step 2: Get corresponding Campaign
                campaign_ids = [entry.campaign.id for entry in member_entries if entry.campaign]
                campaigns_data = Campaign.objects.filter(id__in=campaign_ids)
                
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
        user_id = context["request"].user.id

        campaign = get_object_or_404(Campaign, id=id)
        election_candidate = campaign.election_candidate
        election = election_candidate.election
        candidate = election_candidate.candidate

        campaign_members = CampaignMember.objects.filter(campaign=campaign).prefetch_related('campaign').only('id')
        campaign_guarantees = CampaignGuarantee.objects.filter(campaign=campaign).select_related('campaign')
        # conditions, campaign=campaign, member_id is in memberlist without the managers

        campaign_attendeess = CampaignAttendee.objects.filter(election=election).select_related('election')

        election_candidates = ElectionCandidate.objects.filter(election=election).select_related('election')
        election_committees = ElectionCommittee.objects.filter(election=election).select_related('election')

        campaign_roles = Group.objects.filter(Q(category=3)) #CampaignRoles

        return Response({
            "data": {
                "currentCampaignMember": self.get_current_campaign_member(id, request.user.id, context),
                "campaignDetails": self.get_campaign_data(campaign, context),
                "campaignMembers": self.get_campaign_members(campaign_members, user_id, context),
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
        current_campaign_member_query = CampaignMember.objects.select_related('user').filter(campaign_id=campaign_id, user_id=user_id).first()
        if current_campaign_member_query:
            return CampaignMemberSerializer(current_campaign_member_query, context=context).data
        return None

    def get_campaign_data(self, campaign, context):
        return CampaignsSerializer(campaign, context=context).data

    def get_campaign_members(self, campaign_members, user_id, context):

        # Fetch user object and associated groups
        user = User.objects.get(pk=user_id)
        user_groups = user.groups.all().values_list('name', flat=True)
        
        # Ensure to use a consistent keyword for the campaign_id
        current_campaign_member = self.get_current_campaign_member(self.kwargs.get('campaign_id', self.kwargs.get('id')), user_id, context)
        print("Current campaign member:", current_campaign_member)

        # Check if user is an Admin or SuperAdmin, if so, show all
        if any(role in user_groups for role in ("admin", "superAdmin")):
            print("User is an Admin or SuperAdmin.")
            return CampaignMemberSerializer(campaign_members, many=True, context=context).data
        
        # Check if user's role is campaignModerator, campaignCandidate, or campaignCoordinator
        elif current_campaign_member and current_campaign_member.get('role') in (
            CampaignRoleIDs.MODERATOR.value,
            CampaignRoleIDs.CANDIDATE.value,
            CampaignRoleIDs.COORDINATOR.value
            ):
            specific_role = CampaignRoleIDs(current_campaign_member.get('role')).name
            print(f"User has the role: {specific_role}.")
            return CampaignMemberSerializer(campaign_members, many=True, context=context).data
        
        # Check if user's role is campaignSupervisor
        elif current_campaign_member and current_campaign_member.get('role') == CampaignRoleIDs.SUPERVISOR.value:
            print("User is a campaignSupervisor.")
            
            # Filtering the campaign_members queryset to get the campaign_managers
            campaign_managers = campaign_members.filter(role__in=[
                CampaignRoleIDs.MODERATOR.value,
                CampaignRoleIDs.CANDIDATE.value,
                CampaignRoleIDs.COORDINATOR.value
            ])
            
            # Filtering the campaign_members queryset to get the managed_members
            current_campaign_member_id = current_campaign_member.get('id')
            managed_members = campaign_members.filter(supervisor_id=current_campaign_member_id)
            
            # Queryset for the current member
            current_member_queryset = campaign_members.filter(id=current_campaign_member_id)

            combined_queryset = campaign_managers | managed_members | current_member_queryset

            # Serializing the combined queryset
            serialized_campaign_members = CampaignMemberSerializer(combined_queryset, many=True, context=context).data
            return serialized_campaign_members

        # Handle all other roles or cases
        else:
            print("User doesn't match any specific role criteria.")
            return []  # Return empty or handle as needed








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
        
        serializer = CampaignsSerializer(data=request.data, context={'request': request})
        
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
            campaign_member = CampaignMember.objects.get(id=id)
        except CampaignMember.DoesNotExist:
            return Response({"data": "Campaign Member not found", "count": 0, "code": 404}, status=404)
        
        serializer = CampaignMemberSerializer(instance=campaign_member, data=request.data, partial=True, context={'request': request})
        
        if serializer.is_valid():
            serializer.save()
            return Response({"data": serializer.data, "count": 1, "code": 200}, status=200)
        
        return Response({"data": serializer.errors, "count": 0, "code": 400}, status=400)

class DeleteCampaignMember(APIView):
    def delete(self, request, id):
        try:
            campaign_member = CampaignMember.objects.get(id=id)
            campaign_member.delete()
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
      