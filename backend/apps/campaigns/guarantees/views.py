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
from rest_framework.permissions import IsAuthenticated, AllowAny

# Serializers
from apps.campaigns.members.serializers import CampaignMemberSerializer
from apps.campaigns.guarantees.models import CampaignGuarantee, CampaignGuaranteeGroup
from apps.campaigns.guarantees.serializers import CampaignGuaranteeSerializer, CampaignGuaranteeGroupSerializer

from apps.elections.serializers import ElectionSerializer
# from apps.notifications.serializers import CampaignNotificationSerializer


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
        return Response(
            {"data": serializer.data, "count": 1, "code": 200},
            status=status.HTTP_201_CREATED,
            headers=headers,
        )


class UpdateCampaignGuarantee(CampaignGuaranteeViewMixin, UpdateAPIView):
    """View for updating existing campaign guarantees."""

    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        """Handle campaign guarantee update."""
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


class DeleteCampaignGuarantee(CampaignGuaranteeViewMixin, DestroyAPIView):
    """View for deleting campaign guarantees."""

    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        """Handle campaign guarantee deletion."""
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(
            {
                "data": "Campaign guarantee deleted successfully",
                "count": 1,
                "code": 200,
            },
            status=status.HTTP_204_NO_CONTENT,
        )


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
        return Response(
            {"data": serializer.data, "count": 1, "code": 200},
            status=status.HTTP_201_CREATED,
            headers=headers,
        )


class UpdateCampaignGuaranteeGroup(CampaignGuaranteeGroupViewMixin, UpdateAPIView):
    """View for updating existing campaign guarantee groups."""

    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        """Handle campaign guarantee group update."""
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


class DeleteCampaignGuaranteeGroup(CampaignGuaranteeGroupViewMixin, DestroyAPIView):
    """View for deleting campaign guarantee groups."""

    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        """Handle campaign guarantee group deletion."""
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(
            {
                "data": "campaign guarantee group deleted successfully",
                "count": 1,
                "code": 200,
            },
            status=status.HTTP_204_NO_CONTENT,
        )
