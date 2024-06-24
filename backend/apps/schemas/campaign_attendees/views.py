# from apps.campaigns.models import Campaign
from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView, UpdateAPIView, DestroyAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import AuthenticationFailed

# Models
from apps.schemas.campaign_attendees.models import CampaignAttendee

from apps.schemas.guarantees.serializers import (
    CampaignGuaranteeSerializer,
    CampaignGuaranteeGroupSerializer,
)

from apps.schemas.campaign_attendees.serializers import CampaignAttendeeSerializer
from apps.schemas.views_helper import AccessElectionSchemaMixin


#
#  Election Attendees
#
class CampaignAttendeeViewMixin:
    """Mixin to handle common functionality for campaign guarantee group views."""

    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Return the appropriate queryset."""
        return CampaignAttendee.objects.all()

    def get_serializer_class(self):
        """Return the appropriate serializer class."""
        return CampaignAttendeeSerializer


# Campaign Attendees
class AddCampaignAttendee(
    AccessElectionSchemaMixin, CampaignAttendeeViewMixin, CreateAPIView
):
    """View for creating new election attendee."""

    def create(self, request, *args, **kwargs):
        return self.execute_with_schema(request, self._create, *args, **kwargs)

    def _create(self, request, *args, **kwargs):
        """Handle election attendee creation."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            {"data": serializer.data, "count": 1, "code": 200},
            status=status.HTTP_201_CREATED,
            headers=headers,
        )


class UpdateCampaignAttendee(
    AccessElectionSchemaMixin, CampaignAttendeeViewMixin, UpdateAPIView
):
    """View for updating existing election attendee."""

    def update(self, request, *args, **kwargs):
        return self.execute_with_schema(request, self._update, *args, **kwargs)

    def _update(self, request, *args, **kwargs):
        """Handle election attendee update."""
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

        # # Assuming you have a serializer for CampaignAttendee
        # serializer = CampaignGuaranteeSerializer(
        #     instance=campaign_attendee,
        #     data=request.data,
        #     partial=True,
        #     context={"request": request},
        # )

        # if serializer.is_valid():
        #     serializer.save()
        #     return Response(
        #         {"data": serializer.data, "count": 1, "code": 200}, status=200
        #     )

        # return Response(
        #     {"data": serializer.errors, "count": 0, "code": 400}, status=400
        # )


class DeleteCampaignAttendee(
    AccessElectionSchemaMixin, CampaignAttendeeViewMixin, DestroyAPIView
):
    """View for deleting election attendee."""

    def delete(self, request, *args, **kwargs):
        return self.execute_with_schema(request, self._delete, *args, **kwargs)

    def _delete(self, request, *args, **kwargs):
        """Handle election attendee deletion."""
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(
            {
                "data": "election attendee deleted successfully",
                "count": 1,
                "code": 200,
            },
            status=status.HTTP_200_OK,
        )
