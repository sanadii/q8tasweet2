# from campaigns.models import Campaigns
from django.http import JsonResponse
from django.http.response import JsonResponse
from rest_framework.response import Response
from rest_framework.views import APIView
from restapi.serializers import *
from restapi.models import *
from .models import *
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated, AllowAny

from rest_framework.exceptions import AuthenticationFailed
from rest_framework import status
from restapi.helper.views_helper import CustomPagination


class GetCampaigns(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            # Check if user is staff
            if request.user.is_staff:
                campaignss_data = Campaigns.objects.all()
                paginator = CustomPagination()
                paginated_campaignss = paginator.paginate_queryset(campaignss_data, request)
                
                # Passing context with request to the serializer
                context = {"request": request}
                data_serializer = CampaignsSerializer(paginated_campaignss, many=True, context=context)
                
                return paginator.get_paginated_response(data_serializer.data)

            else:  # if user is not staff
                current_user_id = request.user.id

                # Step 1: Query the CampaignMembers table
                member_entries = CampaignMembers.objects.filter(user_id=current_user_id)
                
                # Step 2: Get corresponding Campaigns
                campaign_ids = [entry.campaign.id for entry in member_entries if entry.campaign]
                campaigns_data = Campaigns.objects.filter(id__in=campaign_ids)
                
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
        current_user_id = context["request"].user.id

        campaign = get_object_or_404(Campaigns, id=id)
        election_candidate = campaign.election_candidate
        election = election_candidate.election
        candidate = election_candidate.candidate

        campaign_members = CampaignMembers.objects.filter(campaign=campaign).prefetch_related('campaign').only('id')
        campaign_guarantees = CampaignGuarantees.objects.filter(campaign=campaign).select_related('campaign')
        campaign_attendeess = CampaignAttendees.objects.filter(election=election).select_related('election')

        election_candidates = ElectionCandidates.objects.filter(election=election).select_related('election')
        election_committees = ElectionCommittees.objects.filter(election=election).select_related('election')

        return Response({
            "data": {
                "currentCampaignMember": self.get_current_campaign_member(id, request.user.id, context),
                "campaignDetails": self.get_campaign_data(campaign, context),
                "campaignMembers": self.get_campaign_members(campaign_members, context),
                "campaignGuarantees": self.get_campaign_guarantees(campaign_guarantees, context),
                "campaignAttendees": self.get_campaign_attendees(campaign_attendeess, context),
                
                "campaignElectionCandidates": self.get_campaign_election_candidates(election_candidates, context),
                "campaignElectionCommittees": self.get_campaign_election_committees(election_committees, context)
            },
            "code": 200
        })

    def get_current_campaign_member(self, campaign_id, user_id, context):
        current_campaign_member_query = CampaignMembers.objects.select_related('user').filter(campaign_id=campaign_id, user_id=user_id).first()
        if current_campaign_member_query:
            return CampaignMembersSerializer(current_campaign_member_query, context=context).data
        return None

    def get_campaign_data(self, campaign, context):
        return CampaignsSerializer(campaign, context=context).data

    def get_campaign_members(self, campaign_members, context):
        return CampaignMembersSerializer(campaign_members, many=True, context=context).data

    def get_campaign_guarantees(self, campaign_guarantees, context):
        return CampaignGuaranteesSerializer(campaign_guarantees, many=True, context=context).data

    def get_campaign_attendees(self, campaign_attendeess, context):
        return CampaignAttendeesSerializer(campaign_attendeess, many=True, context=context).data

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
            campaign = Campaigns.objects.get(id=id)
        except Campaigns.DoesNotExist:
            return Response({"error": "Campaign not found"}, status=404)
        
        serializer = CampaignsSerializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            serializer.save()
            return Response({"data": serializer.data, "count": 0, "code": 200})
        return Response(serializer.errors, status=400)

class DeleteCampaign(APIView):
    def delete(self, request, id):
        try:
            campaign = Campaigns.objects.get(id=id)
            campaign.delete()
            return JsonResponse({"data": "Campaign deleted successfully", "count": 1, "code": 200}, safe=False)
        except Campaigns.DoesNotExist:
            return JsonResponse({"data": "Campaign not found", "count": 0, "code": 404}, safe=False)


# Campaign Members
class AddNewCampaignMember(APIView):
    def post(self, request):
        campaign_id = request.data.get("campaignId")
        user_id = request.data.get("userId")

        # Fetch the user details based on userId
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        # Fetch the campaign details based on campaign
        try:
            campaign = Campaigns.objects.get(id=campaign_id)
        except Campaigns.DoesNotExist:
            return Response({"error": "Campaign not found"}, status=404)

        # Create the new campaign member with user and campaign details
        campaign_member = CampaignMembers.objects.create(
            campaign=campaign,
            user=user,
        )

        # Prepare the response data
        response_data = {
            "id": campaign_member.id,
            "user": {
                "id": user.id,
                "username": user.username,
                "name": f"{user.first_name} {user.last_name}",
                "email": user.email,
                "image": user.image.url if user.image else None,
                # Include other user fields here if needed
            },
            "campaign": campaign.id,
            # I'm assuming these fields are in the CampaignMembers model. 
            # If they aren't, you can adjust accordingly.
            "rank": campaign_member.rank,
            "supervisor": campaign_member.supervisor,
            "committee": campaign_member.committee,
            "notes": campaign_member.notes,
            "phone": campaign_member.phone,
            "status": campaign_member.status,
        }

        return Response({"data": response_data, "count": 0, "code": 200})

class UpdateCampaignMember(APIView):
    def patch(self, request, id):
        # Election Results
        rank = request.data.get("rank")
        supervisor = request.data.get("supervisor")
        committee = request.data.get("committee")
        phone = request.data.get("phone")
        notes = request.data.get("notes")
        status = request.data.get("status")

        # Fetch the campaign member details based on the URL parameter 'id'
        try:
            campaign_member = CampaignMembers.objects.get(id=id)
        except CampaignMembers.DoesNotExist:
            return Response({"error": "Campaign Member not found"}, status=404)

        # Update the election candidate with the new data

        # Election Related Data
        campaign_member.rank = rank
        if supervisor:
            try:
                supervisor_instance = CampaignMembers.objects.get(id=supervisor)
                campaign_member.supervisor = supervisor_instance
            except CampaignMembers.DoesNotExist:
                return Response({"error": "Supervisor not found"}, status=404)
        
        if committee:
            try:
                committee_instance = ElectionCommittees.objects.get(id=committee)  # Assuming your committee model is named ElectionCommittees
                campaign_member.committee = committee_instance
            except ElectionCommittees.DoesNotExist:
                return Response({"error": "Committee not found"}, status=404)
        
        campaign_member.notes = notes
        campaign_member.phone = phone
        campaign_member.status = status
        campaign_member.save()

        # Prepare the response data with member details
        updated_campaign_member_data = {
            # Basic Information
            "id": campaign_member.id,
            "campaignId": campaign_member.campaign.id,  # Extracted from the campaign_member instance
            "userId": campaign_member.user.id,          # Extracted from the campaign_member instance

            # Election Data
            "rank": campaign_member.rank,
            "supervisor": campaign_member.supervisor.id if campaign_member.supervisor else None,
            "committee": campaign_member.committee.id if campaign_member.committee else None,
            "phone": campaign_member.phone,
            "notes": campaign_member.notes,
            "status": campaign_member.status,
        }

        return Response({"data": updated_campaign_member_data, "count": 0, "code": 200})

class DeleteCampaignMember(APIView):
    def delete(self, request, id):
        try:
            campaign_member = CampaignMembers.objects.get(id=id)
            campaign_member.delete()
            return JsonResponse(
                {"data": "campaign member deleted successfully", "count": 1, "code": 200},
                safe=False,
            )
        except Elections.DoesNotExist:
            return JsonResponse(
                {"data": "campaign not found", "count": 0, "code": 404}, safe=False
            )


# Campaign Guarantees
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
        phone = request.data.get("phone")
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
        if phone:
            campaign_guarantee.phone = phone
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
            "phone": campaign_guarantee.phone,
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

class AddNewElectionAttendee(APIView):
    def post(self, request):
        user_id = request.data.get("user")
        election_id = request.data.get("election")
        committee_id = request.data.get("committee")
        civil = request.data.get("elector")
        status_value = request.data.get("status")  # Renamed to avoid conflict with status module

        # Fetch the elector details based on elector civil
        try:
            elector = Electors.objects.get(civil=civil)
        except Electors.DoesNotExist:
            return Response({"error": "Elector not found"}, status=status.HTTP_404_NOT_FOUND)

        # Fetch the member based on member_id
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        # Fetch the election based on election_id
        try:
            election = Elections.objects.get(id=election_id)
        except Elections.DoesNotExist:
            return Response({"error": "Election not found"}, status=status.HTTP_404_NOT_FOUND)

        # Fetch the election based on committee_id
        try:
            committee = ElectionCommittees.objects.get(id=committee_id)
        except ElectionCommittees.DoesNotExist:
            return Response({"error": "Committee not found"}, status=status.HTTP_404_NOT_FOUND)

        # Create the new link between the user, elector, and election
        Campaign_attendee = CampaignAttendees.objects.create(
            user_id=user_id,
            elector=elector,
            committee=committee,
            election=election,
            status=status_value,
        )

        # Prepare the response data with member, elector, and election details
        response_data = {
            "id": Campaign_attendee.id,
            "user": user.id,
            "civil": elector.civil,
            "election": election.id,
            "committee": committee.id,
            "full_name": elector.full_name(),
            "gender": elector.gender,
            "status": Campaign_attendee.status,
            # ... other fields you want to return
        }

        return Response({"data": response_data, "count": 0, "code": 200})

class UpdateElectionAttendee(APIView):
    def patch(self, request, id):
        # Fetch the campaign guarantee based on the URL parameter 'id'
        try:
            campaign_guarantee = CampaignAttendees.objects.get(id=id)
        except CampaignAttendees.DoesNotExist:
            return Response({"error": "Campaign Guarantee not found"}, status=status.HTTP_404_NOT_FOUND)

        # Since civil is a ForeignKey, you can directly use it to access the related Elector object
        elector = campaign_guarantee.civil
        if not elector:
            return Response({"error": "Elector not found"}, status=status.HTTP_404_NOT_FOUND)

        # Basic Information
        member_id = request.data.get("member_id")
        phone = request.data.get("phone")
        status_value = request.data.get("status")
        notes = request.data.get("notes")

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
        if phone:
            campaign_guarantee.phone = phone
        if notes:
            campaign_guarantee.notes = notes

        # Save the changes
        campaign_guarantee.save()

        # Prepare the response data with guarantee details
        updated_data = {
            "id": campaign_guarantee.id,
            "member": campaign_guarantee.member.id if campaign_guarantee.member else None,
            "civil": elector.civil,
            "full_name": elector.full_name(),  # Using the full_name method from Electors model
            "gender": elector.gender,
            "phone": campaign_guarantee.phone,
            "status": campaign_guarantee.status,
            "notes": campaign_guarantee.notes
        }

        return Response({"data": updated_data, "count": 0, "code": 200})

class DeleteElectionAttendee(APIView):
    def delete(self, request, id):
        try:
            campaign_guarantee = CampaignAttendees.objects.get(id=id)
            campaign_guarantee.delete()
            return JsonResponse(
                {"data": "campaign Guarantee deleted successfully", "count": 1, "code": 200},
                safe=False,
            )
        except CampaignAttendees.DoesNotExist:
            return JsonResponse(
                {"data": "campaign not found", "count": 0, "code": 404}, safe=False
            )
        
