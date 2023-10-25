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

from helper.views_helper import CustomPagination


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

ADMIN = 1
SUPERADMIN = 2
CAMPAIGN_MODERATOR = 30
CAMPAIGN_CANDIDATE = 31
CAMPAIGN_MANAGER = 31
CAMPAIGN_CANDIDATE = 31
CAMPAIGN_CANDIDATE = 31


class GetCampaignDetails(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id):
        context = {"request": request}
        user_id = context["request"].user.id

        campaign = get_object_or_404(Campaign, id=id)
        election_candidate = campaign.election_candidate
        election = election_candidate.election

        campaign_members = CampaignMember.objects.filter(campaign=campaign).prefetch_related('campaign').only('id')
        campaign_guarantees = CampaignGuarantee.objects.filter(campaign=campaign).select_related('campaign')
        campaign_attendeess = CampaignAttendee.objects.filter(election=election).select_related('election')

        election_candidates = ElectionCandidate.objects.filter(election=election).select_related('election')
        election_committees = ElectionCommittee.objects.filter(election=election).select_related('election')

        campaign_roles = Group.objects.filter(Q(category=3))  # CampaignRoles

        return Response({
            "data": {
                "currentCampaignMember": self.get_current_campaign_member(id, request.user.id, context),
                "campaignDetails": self.get_campaign_data(campaign, context),
                "campaignMembers": self.get_campaign_members(campaign_members, campaign_roles, context),
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

    def get_current_campaign_member_role(self, campaign_member_id, campaign_roles):
        member_group_query = campaign_roles.filter(id=campaign_member_id).first()
        if member_group_query:
            return member_group_query.role
        return None


    def get_current_user_role(self, user_id):
        user_groups_query = Group.objects.filter(user=user_id)
        user_groups = [group.role for group in user_groups_query]
        if 'superAdmin' in user_groups:
            return 'superAdmin'
        elif 'Admin' in user_groups:
            return 'Admin'
        return None

    def get_campaign_members(self, campaign_members, campaign_roles, context):
        current_user_role = self.get_current_user_role(self.request.user.id)
        current_campaign_member_data = self.get_current_campaign_member(self.kwargs['id'], self.request.user.id, context)
        current_campaign_member_role = self.get_current_campaign_member_role(current_campaign_member_data.get('role') if current_campaign_member_data else None, campaign_roles)
        serialized_campaign_members = CampaignMemberSerializer(campaign_members, many=True).data
        groups_data = GroupSerializer(Group.objects.all(), many=True).data  # Assuming you have a Group model and its respective serializer
        
        def get_group_role_mapping(groups):
            return {group['id']: group['role'] for group in groups}

        group_role_mapping = get_group_role_mapping(groups_data)
        print(group_role_mapping)  # Just for debugging

        # Filtering method for getting specific roles
        def get_members_with_roles(serialized_list, roles):
            filtered_members = [member for member in serialized_list if group_role_mapping.get(member["role"]) in roles]
            print(filtered_members)  # Just for debugging
            return filtered_members

        def deep_tuple(item):
            if isinstance(item, (list, tuple)):
                return tuple(deep_tuple(sub_item) for sub_item in item)
            elif isinstance(item, dict):
                return tuple((key, deep_tuple(value)) for key, value in item.items())
            else:
                return item

        def merge_without_duplicates(list1, list2):
            seen = set()
            result = []
            for item in list1 + list2:
                # Convert OrderedDict to a tuple of items for hashing
                item_tuple = deep_tuple(item) if isinstance(item, dict) else item
                if item_tuple not in seen:
                    seen.add(item_tuple)
                    result.append(item)
            return result

        # Get Supervised Member for Supervisor
        if current_campaign_member_role == 'campaignSupervisor':
            current_campaign_member_id = current_campaign_member_data.get('id')
            supervised_members = [member for member in serialized_campaign_members if member["id"] == current_campaign_member_id or member["supervisor"] == current_campaign_member_id]
            other_roles_members = get_members_with_roles(serialized_campaign_members, ['campaignCandidate', 'campaignCoordinator', 'campaignGuarantor', 'campaignAttendant', 'campaignSorter'])
            return merge_without_duplicates(supervised_members, other_roles_members)
        
        # Get Supervisors for Guarantor, Attendant, & Sorter
        elif current_campaign_member_role in ['campaignGuarantor', 'campaignAttendant', 'campaignSorter']:
            if current_campaign_member_data:
                supervisor_id = current_campaign_member_data.get("supervisor")
                supervisor_member = next((member for member in serialized_campaign_members if member["id"] == supervisor_id), None)
                other_roles_members = get_members_with_roles(serialized_campaign_members, ['campaignModerator', 'campaignCandidate', 'campaignCoordinator'])
                return list(set([current_campaign_member_data, supervisor_member] + other_roles_members)) if supervisor_member else [current_campaign_member_data] + other_roles_members

        elif current_user_role in ['superAdmin', 'Admin'] or current_campaign_member_role in ['campaignModerator', 'campaignCandidate', 'campaignCoordinator']:
            return serialized_campaign_members
        
        else:
            return []

    def get_current_campaign_member(self, campaign_id, user_id, context):
        current_campaign_member_query = CampaignMember.objects.select_related('user').filter(campaign_id=campaign_id, user_id=user_id).first()
        if current_campaign_member_query:
            return CampaignMemberSerializer(current_campaign_member_query, context=context).data
        return None

    def get_campaign_data(self, campaign, context):
        return CampaignsSerializer(campaign, context=context).data

    def get_campaign_guarantees(self, campaign_guarantees, context):
        return CampaignGuaranteeSerializer(campaign_guarantees, many=True, context=context).data

    def get_campaign_attendees(self, campaign_attendeess, context):
        return CampaignAttendeeSerializer(campaign_attendeess, many=True, context=context).data

    def get_campaign_election_candidates(self, election_candidates, context):
        return ElectionCandidatesSerializer(election_candidates, many=True, context=context).data

    def get_campaign_election_committees(self, election_committees, context):
        return ElectionCommitteesSerializer(election_committees, many=True, context=context).data

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
        serializer = CampaignAttendeeSerializer(data=request.data, context={'request': request})
        
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
        serializer = CampaignAttendeeSerializer(instance=campaign_attendee, data=request.data, partial=True, context={'request': request})
        
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
      