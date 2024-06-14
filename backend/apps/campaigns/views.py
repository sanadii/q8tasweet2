# from apps.campaigns.models import Campaign
from django.http import JsonResponse

# from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.contrib.auth.decorators import user_passes_test
from rest_framework.generics import (
    CreateAPIView,
    UpdateAPIView,
    DestroyAPIView,
    ListAPIView,
)

from itertools import chain
from rest_framework.exceptions import ValidationError  # Add this import

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import AuthenticationFailed

# Models
from apps.auths.models import User, Group
from apps.candidates.models import Candidate, Party
from apps.campaigns.models import (
    Campaign,
    # CampaignAttendee,
    # CampaignSorting,
    # CampaignPartyMember,
    # CampaignPartyMember,
    # CampaignCommittee,
    # CampaignCommitteeAttendee,
    # CampaignCommitteeSorter,
    # CampaignPartyGuarantee,
    # CampaignParty,
    # CampaignPartyGuarantee,
)
from apps.campaigns.members.models import CampaignMember
from apps.schemas.guarantees.models import CampaignGuarantee, CampaignGuaranteeGroup
from apps.schemas.campaign_attendees.models import CampaignAttendee


from apps.elections.candidates.models import Election, ElectionCandidate, ElectionParty
from apps.schemas.committees.models import CommitteeSite, Committee
from django.contrib.auth.models import Group

# Serializers
from apps.campaigns.members.serializers import CampaignMemberSerializer
from apps.schemas.campaign_attendees.serializers import CampaignAttendeeSerializer

from apps.elections.serializers import ElectionSerializer
from apps.campaigns.serializers import (
    CampaignSerializer,
    # CampaignCommitteeSerializer,
    # CampaignCommitteeAttendeeSerializer,
    # CampaignCommitteeSorterSerializer,
    # CampaignAttendeeSerializer,
    # CampaignSortingSerializer,
    # CampaignPartyMemberSerializer,
    # CampaignPartyGuaranteeSerializer,
    # CampaignCombinedSerializer,
    # CampaignPartySerializer,
)
from apps.schemas.guarantees.serializers import (
    CampaignGuaranteeSerializer,
    CampaignGuaranteeGroupSerializer,
)


# from apps.notifications.models import CampaignNotification, CampaignPartyNotification
from apps.elections.candidates.serializers import ElectionCandidateSerializer
from apps.schemas.committees.serializers import (
    CommitteeSerializer,
    CommitteeSiteSerializer,
)
from apps.auths.serializers import GroupSerializer

# from apps.notifications.serializers import CampaignNotificationSerializer

from utils.views_helper import CustomPagination
from apps.campaigns.views_helper import (
    get_campaign_roles,
    determine_user_role,
    get_current_campaign_member,
    get_campaign_members_by_role,
)

from utils.schema import schema_context

# from django.db import ElectorsByGender


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


def get_campaign_related_object(obj):
    """Helper function to retrieve the related ElectionCandidate or ElectionParty object based on campaign_type."""
    if obj.campaign_type and obj.campaigner_id:
        campaign_type = obj.campaign_type
        model_class = campaign_type.model_class()

        if model_class == Candidate:
            return ElectionCandidate.objects.get(id=obj.campaigner_id)
        elif model_class == Party:
            return ElectionParty.objects.get(id=obj.campaigner_id)
        else:
            raise ValueError(f"Invalid content type: {campaign_type}")
    else:
        raise ValueError("Campaign object is missing campaign_type or campaigner_id")


# class GetCampaignDetails(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request, slug):

#         context = {"request": request}
#         user_id = context["request"].user.id
#         campaign = get_object_or_404(Campaign, slug=slug)

#         # Election
#         # related_object = get_campaign_related_object(campaign)
#         election = campaign.election_candidate.election
#         election_slug = election.slug
#         previous_election = get_previous_election(election)

#         # Get Campaign Roles
#         campaign_roles = get_campaign_roles(context)

#         # get campaign members
#         current_campaign_member = get_current_campaign_member(
#             campaign.id, user_id, context
#         )

#         # Does User have Higher Privilage? Admin? Moderator?
#         user_role = determine_user_role(campaign.id, user_id, campaign_roles, context)

#         # Fetch campaign members based on user/member role
#         campaign_members, campaign_managed_members = get_campaign_members_by_role(
#             campaign, user_role, current_campaign_member
#         )

#         # election = campaign.election_candidate.election
#         election_candidates = ElectionCandidate.objects.filter(
#             election=election
#         ).select_related("election")

#         # Prepare data for each election candidate
#         election_candidates_data = []
#         for candidate in election_candidates:
#             candidate_data = ElectionCandidateSerializer(
#                 candidate, context=context
#             ).data
#             # candidate_sorting = CampaignSorting.objects.filter(
#             #     election_candidate=candidate
#             # )
#             # candidate_data["sorting"] = CampaignSortingSerializer(
#             #     candidate_sorting, many=True, context=context
#             # ).data
#             election_candidates_data.append(candidate_data)

#         election_details = CampaignSerializer(campaign, context=context).data
#         election_candidatess = ElectionCandidateSerializer(
#             election_candidates, many=True, context=context
#         ).data

#         response_data = {
#             "currentCampaignMember": current_campaign_member,
#             "campaignDetails": election_details,
#             "previousElection": ElectionSerializer(
#                 previous_election, context=context
#             ).data,
#             "campaignMembers": CampaignMemberSerializer(
#                 campaign_members, many=True, context=context
#             ).data,
#             "campaignElectionCandidates": election_candidates,
#             "campaign_roles": campaign_roles,
#         }

#         get_campaign_schema_content(
#             context, election_slug, campaign, campaign_managed_members, response_data
#         )

#         # Further processing, returning response or any other operations can continue here...
#         return Response({"data": response_data, "code": 200})


class GetCampaignDetails(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, slug):
        context = {"request": request}
        user_id = context["request"].user.id
        campaign = get_object_or_404(Campaign, slug=slug)

        # Get Campaign Roles
        campaign_roles = get_campaign_roles(context)

        # Get current campaign member
        current_campaign_member = get_current_campaign_member(
            campaign.id, user_id, context
        )

        # Determine the user's role
        user_role = determine_user_role(campaign.id, user_id, campaign_roles, context)

        # Fetch campaign members based on user/member role
        campaign_members, campaign_managed_members = get_campaign_members_by_role(
            campaign, user_role, current_campaign_member
        )

        # Serialize campaign details
        campaign_details = CampaignSerializer(campaign, context=context).data

        response_data = {
            "currentCampaignMember": current_campaign_member,
            "campaignDetails": campaign_details,
            "campaignMembers": CampaignMemberSerializer(
                campaign_members, many=True, context=context
            ).data,
            "campaign_roles": campaign_roles,
        }

        # Get the related election details
        election = campaign.election_candidate.election
        election_slug = election.slug
        election_details_data = get_election_details(election, context)

        # Add election details to the response
        response_data.update(election_details_data)

        get_campaign_schema_content(
            context, election_slug, campaign, campaign_managed_members, response_data
        )

        return Response({"data": response_data, "code": 200})


def get_election_details(election, context):
    previous_election = get_previous_election(election)

    # Get current election candidates
    current_election_candidates = ElectionCandidate.objects.filter(
        election=election
    ).select_related("election")

    current_election_candidates_data = [
        ElectionCandidateSerializer(candidate, context=context).data
        for candidate in current_election_candidates
    ]

    # Prepare current election details
    current_election = {
        "election_details": ElectionSerializer(election, context=context).data,
        "election_candidates": current_election_candidates_data
    }

    # Prepare previous election details if available
    previous_election_data = {}
    if previous_election:
        previous_election_candidates = ElectionCandidate.objects.filter(
            election=previous_election
        ).select_related("election")

        previous_election_candidates_data = [
            ElectionCandidateSerializer(candidate, context=context).data
            for candidate in previous_election_candidates
        ]

        previous_election_data = {
            "election_details": ElectionSerializer(previous_election, context=context).data,
            "election_candidates": previous_election_candidates_data
        }

    return {
        "current_election": current_election,
        "previous_election": previous_election_data
    }


def get_previous_election(election):
    previous_election = (
        Election.objects.filter(
            sub_category=election.sub_category, due_date__lt=election.due_date
        )
        .order_by("-due_date")
        .first()
    )

    if previous_election:
        return previous_election
    return None


def get_campaign_schema_content(
    context, election_slug, campaign, campaign_managed_members, response_data
):
    if not isinstance(response_data, dict):
        response_data = {}

    with schema_context(election_slug):
        campaign_id = campaign.id if hasattr(campaign, "id") else campaign

        try:
            election_committee_sites = CommitteeSite.objects.prefetch_related(
                "committee_site_committees"
            ).all()
            if election_committee_sites.exists():
                committees_data = CommitteeSiteSerializer(
                    election_committee_sites, many=True, context=context
                ).data
                response_data["election_committee_sites"] = committees_data
        except Exception as e:
            response_data["committeeDataError"] = str(e)

        try:
            campaign_guarantee_groups = CampaignGuaranteeGroup.objects.filter(
                member__in=campaign_managed_members.values_list("id", flat=True)
            )
            if campaign_guarantee_groups.exists():
                campaign_guarantee_group_data = CampaignGuaranteeGroupSerializer(
                    campaign_guarantee_groups, many=True, context=context
                ).data
                response_data["campaign_guarantee_groups"] = campaign_guarantee_group_data
        except Exception as e:
            response_data["campaignGuaranteeGroupDataError"] = str(e)

        try:
            campaign_guarantees = CampaignGuarantee.objects.filter(
                member__in=campaign_managed_members.values_list("id", flat=True)
            )
            if campaign_guarantees.exists():
                campaign_guarantee_data = CampaignGuaranteeSerializer(
                    campaign_guarantees, many=True, context=context
                ).data
                response_data["campaign_guarantees"] = campaign_guarantee_data
        except Exception as e:
            response_data["campaignGuaranteeDataError"] = str(e)

        try:
            campaign_attendees = CampaignAttendee.objects.filter(
                member__in=campaign_managed_members.values_list("id", flat=True)
            )
            if campaign_attendees.exists():
                campaign_attendee_data = CampaignAttendeeSerializer(
                    campaign_attendees, many=True, context=context
                ).data
                response_data["campaign_attendees"] = campaign_attendee_data
        except Exception as e:
            response_data["campaignAttendeeDataError"] = str(e)

    return Response(response_data)

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
