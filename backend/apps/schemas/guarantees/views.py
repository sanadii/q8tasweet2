# from apps.campaigns.models import Campaign
from rest_framework import status
from rest_framework.generics import CreateAPIView, UpdateAPIView, DestroyAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

# Apps
from apps.schemas.schema import schema_context

# Serializers
from apps.elections.candidates.models import ElectionCandidate, ElectionParty
from apps.schemas.guarantees.models import CampaignGuarantee, CampaignGuaranteeGroup
from apps.schemas.guarantees.serializers import (
    CampaignGuaranteeSerializer,
    CampaignGuaranteeGroupSerializer,
)

# from apps.notifications.serializers import CampaignNotificationSerializer
from apps.schemas.views_helper import AccessElectionSchemaMixin


#
#  Campaign Guarantee Groups
#
class CampaignGuaranteeGroupViewMixin:
    """Mixin to handle common functionality for campaign guarantee group views."""

    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return the appropriate queryset."""
        return CampaignGuaranteeGroup.objects.all()

    def get_serializer_class(self):
        """Return the appropriate serializer class."""
        return CampaignGuaranteeGroupSerializer


class AddCampaignGuaranteeGroup(
    AccessElectionSchemaMixin, CampaignGuaranteeGroupViewMixin, CreateAPIView
):
    """View for creating new campaign guarantee groups."""

    def create(self, request, *args, **kwargs):
        return self.execute_with_schema(request, self._create, *args, **kwargs)

    def _create(self, request, *args, **kwargs):
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


class UpdateCampaignGuaranteeGroup(
    AccessElectionSchemaMixin, CampaignGuaranteeGroupViewMixin, UpdateAPIView
):
    """View for updating existing campaign guarantee groups."""

    def update(self, request, *args, **kwargs):
        return self.execute_with_schema(request, self._update, *args, **kwargs)

    def _update(self, request, *args, **kwargs):
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


class DeleteCampaignGuaranteeGroup(
    AccessElectionSchemaMixin, CampaignGuaranteeGroupViewMixin, DestroyAPIView
):
    """View for deleting campaign guarantee groups."""

    def delete(self, request, *args, **kwargs):
        return self.execute_with_schema(request, self._delete, *args, **kwargs)

    def _delete(self, request, *args, **kwargs):
        """Handle campaign guarantee group deletion."""
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(
            {
                "data": "Campaign guarantee group deleted successfully",
                "count": 1,
                "code": 200,
            },
            status=status.HTTP_200_OK,
        )


#
#  Campaign Guarantees
#
class CampaignGuaranteeViewMixin:
    """Mixin to handle common functionality for campaign guarantee views."""

    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CampaignGuarantee.objects.all()

    def get_serializer_class(self):
        return CampaignGuaranteeSerializer


class AddCampaignGuarantee(
    AccessElectionSchemaMixin, CampaignGuaranteeViewMixin, CreateAPIView
):
    """View for creating new campaign guarantees."""

    def create(self, request, *args, **kwargs):
        return self.execute_with_schema(request, self._create, *args, **kwargs)

    def _create(self, request, *args, **kwargs):
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


class UpdateCampaignGuarantee(
    AccessElectionSchemaMixin, CampaignGuaranteeViewMixin, UpdateAPIView
):
    """View for updating existing campaign guarantees."""

    def update(self, request, *args, **kwargs):
        return self.execute_with_schema(request, self._update, *args, **kwargs)

    def _update(self, request, *args, **kwargs):
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


class DeleteCampaignGuarantee(
    AccessElectionSchemaMixin, CampaignGuaranteeViewMixin, DestroyAPIView
):
    """View for deleting campaign guarantees."""

    def delete(self, request, *args, **kwargs):
        return self.execute_with_schema(request, self._delete, *args, **kwargs)

    def _delete(self, request, *args, **kwargs):
        """Handle campaign guarantee deletion."""
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


# class DeleteCampaignGuarantee(AccessElectionSchemaMixin, CampaignGuaranteeViewMixin, DestroyAPIView):
#     """View for deleting campaign guarantees."""
#     def delete(self, request, *args, **kwargs):
#         return self.execute_with_schema(request, self._delete, *args, **kwargs)

#     def _delete(self, request, *args, **kwargs):
#         """Handle campaign guarantee deletion."""
#         instance = self.get_object()
#         self.perform_destroy(instance)
#         return Response(
#             {
#                 "data": "Campaign guarantee deleted successfully",
#                 "count": 1,
#                 "code": 200,
#             },
#             status=status.HTTP_204_NO_CONTENT,
#         )
