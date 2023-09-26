# from campaigns.models import Campaigns
from django.http import JsonResponse
from django.http.response import JsonResponse
from rest_framework.response import Response
from rest_framework.views import APIView
from restapi.serializers import *
from restapi.models import *
from users.models import *
from rest_framework import status

class AddNewCampaignGuarantee(APIView):
    def post(self, request):
        campaign_id = request.data.get("campaign")
        member_id = request.data.get("member")
        civil = request.data.get("elector")
        status = request.data.get("status")

        # Fetch the elector details based on elector civil
        try:
            elector = Electors.objects.get(civil=civil)
        except Electors.DoesNotExist:
            return Response({"error": "Elector not found"}, status=status.HTTP_404_NOT_FOUND)

        # Fetch the campaign based on campaign_id
        try:
            campaign = Campaigns.objects.get(id=campaign_id)
        except CampaignMembers.DoesNotExist:
            return Response({"error": "Campaign not found"}, status=status.HTTP_404_NOT_FOUND)

        # Fetch the member based on member_id
        try:
            member = CampaignMembers.objects.get(id=member_id)
        except CampaignMembers.DoesNotExist:
            return Response({"error": "Member not found"}, status=status.HTTP_404_NOT_FOUND)

        # Create the new link between the campaign member and the elector
        campaign_guarantee = CampaignGuarantees.objects.create(
            campaign_id=campaign_id,
            member_id=member_id,
            civil=elector,
            status=status,
        )

        # Prepare the response data with member and elector details
        response_data = {
            "id": campaign_guarantee.id,
            "campaign": campaign.id,
            "member": member.id,
            "civil": elector.civil,
            # "full_name": elector.full_name(),
            "full_name": elector.full_name,
            "gender": elector.gender,
            "status": campaign_guarantee.status,
            # ... other fields you want to return
        }

        return Response({"data": response_data, "count": 0, "code": 200})

class UpdateCampaignGuarantee(APIView):
    def patch(self, request, id):
        # Fetch the campaign guarantee based on the URL parameter 'id'
        try:
            campaign_guarantee = CampaignGuarantees.objects.get(id=id)
        except CampaignGuarantees.DoesNotExist:
            return Response({"error": "Campaign Guarantee not found"}, status=status.HTTP_404_NOT_FOUND)

        # Since civil is a ForeignKey, you can directly use it to access the related Elector object
        elector = campaign_guarantee.civil
        if not elector:
            return Response({"error": "Elector not found"}, status=status.HTTP_404_NOT_FOUND)

        # Basic Information
        campaign_id = request.data.get("campaign")
        member_id = request.data.get("member")
        mobile = request.data.get("mobile")
        status_value = request.data.get("status")
        notes = request.data.get("notes")

        # If there's a campaign_id provided, update the campaign
        if campaign_id:
            try:
                campaign = Campaigns.objects.get(id=campaign_id)
                # Assuming there is a 'campaign' attribute in CampaignGuarantees
                campaign_guarantee.campaign = campaign
            except Campaigns.DoesNotExist:
                return Response({"error": "Campaign not found"}, status=status.HTTP_404_NOT_FOUND)

        # If there's a member_id provided, update the member
        if member_id:
            try:
                member = CampaignMembers.objects.get(id=member_id)
                campaign_guarantee.member = member
            except CampaignMembers.DoesNotExist:
                return Response({"error": "Member not found"}, status=status.HTTP_404_NOT_FOUND)

        # Update status
        if status_value:
            campaign_guarantee.status = status_value

        # Update fields
        if mobile:
            campaign_guarantee.mobile = mobile
        if notes:
            campaign_guarantee.notes = notes

        # Save the changes
        campaign_guarantee.save()

        # Prepare the response data with guarantee details
        updated_data = {
            "id": campaign_guarantee.id,
            "campaign": campaign_guarantee.campaign.id if campaign_guarantee.campaign else None,
            "member": campaign_guarantee.member.id if campaign_guarantee.member else None,
            "civil": elector.civil,
            # "full_name": elector.full_name(),  # Using the full_name method from Electors model
            "full_name": elector.full_name,  # Using the full_name method from Electors model
            "gender": elector.gender,
            "mobile": campaign_guarantee.mobile,
            "status": campaign_guarantee.status,
            "notes": campaign_guarantee.notes
        }

        return Response({"data": updated_data, "count": 0, "code": 200})

class DeleteCampaignGuarantee(APIView):
    def delete(self, request, id):
        try:
            campaign_guarantee = CampaignGuarantees.objects.get(id=id)
            campaign_guarantee.delete()
            return JsonResponse(
                {"data": "campaign Guarantee deleted successfully", "count": 1, "code": 200},
                safe=False,
            )
        except CampaignGuarantees.DoesNotExist:
            return JsonResponse(
                {"data": "campaign not found", "count": 0, "code": 404}, safe=False
            )
