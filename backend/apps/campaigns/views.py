# from apps.campaigns.models import Campaign
from django.http import JsonResponse
# from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.contrib.auth.decorators import user_passes_test
from rest_framework.generics import CreateAPIView, UpdateAPIView, DestroyAPIView, ListAPIView

from itertools import chain
from rest_framework.exceptions import ValidationError  # Add this import

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import AuthenticationFailed

# Models
from apps.auths.models import User, Group
from apps.campaigns.models import (
    Campaign,
    CampaignCommittee,
    CampaignCommitteeAttendee,
    CampaignCommitteeSorter,
    CampaignMember,
    CampaignGuarantee,
    CampaignGuaranteeGroup,
    CampaignPartyGuarantee,
    CampaignAttendee,
    CampaignSorting,

    CampaignParty,
    CampaignPartyMember,
    CampaignPartyMember,
    CampaignPartyGuarantee
    )

from apps.elections.models import (
    Election,
    ElectionCandidate,
    ElectionParty,
    ElectionCommitteeGroup
)

from django.contrib.auth.models import Group

# Serializers
from apps.campaigns.serializers import (
    CampaignSerializer,
    CampaignCommitteeSerializer,
    CampaignCommitteeAttendeeSerializer,
    CampaignCommitteeSorterSerializer,
    CampaignMemberSerializer,
    CampaignGuaranteeSerializer,
    CampaignGuaranteeGroupSerializer,
    CampaignAttendeeSerializer, 
    CampaignSortingSerializer,

    CampaignPartyMemberSerializer,
    CampaignPartyGuaranteeSerializer,

    # CampaignCombinedSerializer,
    # CampaignPartySerializer,
    )

from apps.notifications.models import CampaignNotification, CampaignPartyNotification
from apps.elections.serializers import ElectionCandidateSerializer, ElectionCommitteeGroupSerializer
from apps.auths.serializers import GroupSerializer
from apps.notifications.serializers import CampaignNotificationSerializer

from utils.views_helper import CustomPagination
from utils.views import (
    get_campaign_roles,
    determine_user_role,
    get_current_campaign_member,
    get_campaign_members_by_role
)


class GetCampaigns(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user

            # Fetch campaigns and campaign parties separately
            campaigns = Campaign.objects.all()
            # campaign_parties = CampaignParty.objects.all()

            # Apply filtering for non-admin/superadmin users
            if not (user.is_superuser or user.groups.filter(name__in=["admin", "superAdmin"]).exists()):
                accessible_campaign_ids = (
                    CampaignMember.objects.filter(user=user).values_list("campaign_id", flat=True)
                    | CampaignPartyMember.objects.filter(user=user).values_list("campaign_party_id", flat=True)
                )
                campaigns = campaigns.filter(id__in=accessible_campaign_ids)
                # campaign_parties = campaign_parties.filter(id__in=accessible_campaign_ids)

            # Combine results in Python
            # combined_data = list(chain(campaigns, campaign_parties))

            # Pagination
            paginator = CustomPagination()
            paginated_combined_data = paginator.paginate_queryset(campaigns, request)

            context = {"request": request}
            serializer = CampaignSerializer(paginated_combined_data, many=True, context=context)

            return paginator.get_paginated_response(serializer.data)

        except AuthenticationFailed as auth_failed:
            return Response({"error": str(auth_failed)}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class GetCampaignDetails(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, slug):

        context = {"request": request}
        user_id = context["request"].user.id
        campaign = get_object_or_404(Campaign, slug=slug)

        # Does User have Higher Privilage? Admin? Moderator?

        user_role = determine_user_role(campaign.id, user_id, context)
        current_campaign_member = get_current_campaign_member(campaign.id, user_id, context)

        # Fetch campaign members based on user/member role
        campaign_members, campaign_managed_members = get_campaign_members_by_role(campaign, user_role, current_campaign_member)

        # # Extract user ids from campaign_managed_members to further filter guarantees based on member's user
        campaign_guarantees = CampaignGuarantee.objects.filter(
            campaign=campaign,
            member__user__id__in=campaign_managed_members.values_list('user__id', flat=True)
        ).select_related('campaign')

        campaign_guarantee_groups = CampaignGuaranteeGroup.objects.all()
        #     member__user__id__in=campaign_managed_members.values_list('user__id', flat=True)
        # ).select_related('campaign')
        
        election = campaign.election_candidate.election
        election_candidates = ElectionCandidate.objects.filter(election=election).select_related('election')
        election_committee_groups = ElectionCommitteeGroup.objects.filter(election=election).select_related('election')
        campaign_attendees = CampaignAttendee.objects.filter(election=election).select_related('election')
        campaign_notifications = CampaignNotification.objects.filter(campaign=campaign).select_related('campaign')

        # Initialize dictionaries to store attendees and sorters for each committee
        campaign_committee_attendees = {}
        campaign_committee_sorters = {}

        # Iterate over each committee and fetch its attendees and sorters
        for committee in election_committee_groups:
            attendees = CampaignCommitteeAttendee.objects.filter(committee=committee)
            sorters = CampaignCommitteeSorter.objects.filter(committee=committee)

            # Serialize and store the data
            campaign_committee_attendees[committee.id] = CampaignCommitteeAttendeeSerializer(attendees, many=True, context=context).data
            campaign_committee_sorters[committee.id] = CampaignCommitteeSorterSerializer(sorters, many=True, context=context).data

        # ... rest of your view logic ...



        # Prepare data for each election candidate
        election_candidates_data = []
        for candidate in election_candidates:
            candidate_data = ElectionCandidateSerializer(candidate, context=context).data
            candidate_sorting = CampaignSorting.objects.filter(election_candidate=candidate)
            candidate_data["sorting"] = CampaignSortingSerializer(candidate_sorting, many=True, context=context).data
            election_candidates_data.append(candidate_data)

        # Further processing, returning response or any other operations can continue here...
        return Response({
            "data": {
                "currentCampaignMember": current_campaign_member,
                "campaignDetails": CampaignSerializer(campaign, context=context).data,
                "campaignMembers": CampaignMemberSerializer(campaign_members, many=True, context=context).data,
                "campaignGuarantees": CampaignGuaranteeSerializer(campaign_guarantees, many=True, context=context).data,
                "campaignGuaranteeGroups": CampaignGuaranteeGroupSerializer(campaign_guarantee_groups, many=True, context=context).data,
                "campaignAttendees": CampaignAttendeeSerializer(campaign_attendees, many=True, context=context).data,
                "campaignNotifications": CampaignNotificationSerializer(campaign_notifications, many=True, context=context).data,
                "campaignElectionCandidates": ElectionCandidateSerializer(election_candidates, many=True, context=context).data,
                "campaignElectionCommitteeGroups": ElectionCommitteeGroupSerializer(election_committee_groups, many=True, context=context).data,
                # "campaignCommittees": CampaignCommitteeSerializer(campaign_committees, many=True, context=context).data,
                "campaignCommitteeAttendees": campaign_committee_attendees,
                "campaignCommitteeSorters": campaign_committee_sorters,
                "campaign_roles": get_campaign_roles(context),
            },
            "code": 200
        })

class AddCampaign(APIView):
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
class CampaignMemberViewMixin:
    """Mixin to handle common functionality for campaign member views."""

    def get_queryset(self):
        """Return the appropriate queryset."""
        return CampaignMember.objects.all()

    def get_serializer_class(self):
        """Return the appropriate serializer class."""
        return CampaignMemberSerializer

class AddCampaignMember(CampaignMemberViewMixin, CreateAPIView):
    """View for creating new campaign members."""

    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        """Handle campaign guarantee creation."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response({"data": serializer.data, "count": 1, "code": 200}, status=status.HTTP_201_CREATED, headers=headers)


class UpdateCampaignMember(CampaignMemberViewMixin, UpdateAPIView):
    """View for updating existing campaign members."""

    permission_classes = [IsAuthenticated]

    def get_object(self):
        """Ensure campaign member type matches campaignType."""
        campaign_member = super().get_object()
        if campaign_member.__class__ != self.get_queryset().model:
            raise ValidationError("Campaign member type does not match campaignType")
        return campaign_member

    def update(self, request, *args, **kwargs):
        """Handle campaign member update."""
        partial = kwargs.pop('partial', False)
        serializer = self.get_serializer(instance=self.get_object(), data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({"data": serializer.data, "count": 1, "code": 200}, status=status.HTTP_200_OK)


class DeleteCampaignMember(CampaignMemberViewMixin, DestroyAPIView):
    """View for deleting campaign members."""

    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        """Handle campaign member deletion."""
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({"data": "Campaign guarantee deleted successfully", "count": 1, "code": 200}, status=status.HTTP_204_NO_CONTENT)


# 
#  Campaign Guarantees
# 
class CampaignGuaranteeViewMixin:
    """Mixin to handle common functionality for campaign guarantee views."""
    def get_queryset(self):
        """Return the appropriate queryset."""
        return CampaignGuarantee.objects.all()

    def get_serializer_class(self):
        """Return the appropriate serializer class."""
        return CampaignGuaranteeSerializer

class AddCampaignGuarantee(CampaignGuaranteeViewMixin, CreateAPIView):
    """View for creating new campaign guarantees."""

    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        """Handle campaign guarantee creation."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response({"data": serializer.data, "count": 1, "code": 200}, status=status.HTTP_201_CREATED, headers=headers)


class UpdateCampaignGuarantee(CampaignGuaranteeViewMixin, UpdateAPIView):
    """View for updating existing campaign guarantees."""

    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        """Handle campaign guarantee update."""
        partial = kwargs.pop('partial', False)
        serializer = self.get_serializer(instance=self.get_object(), data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({"data": serializer.data, "count": 1, "code": 200}, status=status.HTTP_200_OK)


class DeleteCampaignGuarantee(CampaignGuaranteeViewMixin, DestroyAPIView):
    """View for deleting campaign guarantees."""

    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        """Handle campaign guarantee deletion."""
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({"data": "Campaign guarantee deleted successfully", "count": 1, "code": 200}, status=status.HTTP_204_NO_CONTENT)


# 
#  Campaign Guarantee Groups
# 
class CampaignGuaranteeGroupViewMixin:
    """Mixin to handle common functionality for campaign guarantee group views."""
    def get_queryset(self):
        """Return the appropriate queryset."""
        return CampaignGuaranteeGroup.objects.all()

    def get_serializer_class(self):
        """Return the appropriate serializer class."""
        return CampaignGuaranteeGroupSerializer
class AddCampaignGuaranteeGroup(CampaignGuaranteeGroupViewMixin, CreateAPIView):
    """View for creating new campaign guarantee groups."""

    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        """Handle campaign guarantee group creation."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response({"data": serializer.data, "count": 1, "code": 200}, status=status.HTTP_201_CREATED, headers=headers)


class UpdateCampaignGuaranteeGroup(CampaignGuaranteeGroupViewMixin, UpdateAPIView):
    """View for updating existing campaign guarantee groups."""

    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        """Handle campaign guarantee group update."""
        partial = kwargs.pop('partial', False)
        serializer = self.get_serializer(instance=self.get_object(), data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({"data": serializer.data, "count": 1, "code": 200}, status=status.HTTP_200_OK)


class DeleteCampaignGuaranteeGroup(CampaignGuaranteeGroupViewMixin, DestroyAPIView):
    """View for deleting campaign guarantee groups."""

    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        """Handle campaign guarantee group deletion."""
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({"data": "campaign guarantee group deleted successfully", "count": 1, "code": 200}, status=status.HTTP_204_NO_CONTENT)


# Campaign Attendees
class AddCampaignAttendee(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
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