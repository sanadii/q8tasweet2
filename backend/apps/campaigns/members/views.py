# from apps.campaigns.models import Campaign

from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.decorators import user_passes_test
from rest_framework.generics import (
    CreateAPIView,
    UpdateAPIView,
    DestroyAPIView,
    ListAPIView,
)
from rest_framework.exceptions import ValidationError  # Add this import

from rest_framework import status
from rest_framework.response import Response
from apps.campaigns.members.models import CampaignMember
from apps.campaigns.members.serializers import CampaignMemberSerializer


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
        return Response(
            {"data": serializer.data, "count": 1, "code": 200},
            status=status.HTTP_201_CREATED,
            headers=headers,
        )


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
        partial = kwargs.pop("partial", False)
        serializer = self.get_serializer(
            instance=self.get_object(), data=request.data, partial=partial
        )
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(
            {"data": serializer.data, "count": 1, "code": 200},
            status=status.HTTP_200_OK,
        )


class DeleteCampaignMember(CampaignMemberViewMixin, DestroyAPIView):
    """View for deleting campaign members."""

    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        """Handle campaign member deletion."""
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(
            {
                "data": "Campaign guarantee deleted successfully",
                "count": 1,
                "code": 200,
            },
            status=status.HTTP_200_OK,
        )

    # def delete(self, request, id):
    #     try:
    #         election_party = ElectionParty.objects.get(id=id)
    #         election_party.delete()
    #         return Response(
    #             {
    #                 "data": "Election party deleted successfully",
    #                 "count": 1,
    #                 "code": 200,
    #             },
    #             status=200,
    #         )
    #     except ElectionParty.DoesNotExist:
    #         return Response(
    #             {"data": "Election party not found", "count": 0, "code": 404},
    #             status=404,
    #         )