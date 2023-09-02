# from campaigns.models import Campaigns
from django.http import JsonResponse
from django.http.response import JsonResponse
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.shortcuts import render
from rest_framework.views import APIView
from restapi.serializers import *
from restapi.models import *
from users.models import *
import ast 
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication, SessionAuthentication

from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

from django.db.models import Count, Case, When, IntegerField
from collections import defaultdict
from rest_framework import status
import jwt
from django.conf import settings


# class GetCampaigns(APIView):
#     def get(self, request):
#         campaigns_data = Campaigns.objects.all()
#         data_serializer = CampaignsSerializer(campaigns_data, many=True)

#         return Response({"data": data_serializer.data, "code": 200})


class GetCampaigns(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
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
                # "currentUserId": current_user_id,
                "code": 200
            }, status=status.HTTP_200_OK)

        except AuthenticationFailed as auth_failed:
            return Response({"error": str(auth_failed)}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class GetCampaignDetails(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id):
        try:
            current_user_id = request.user.id
            
            # 1. Fetch campaign data
            campaign_data = self.get_campaign_data(id)

            # 2. Extract the election ID directly from campaignDetails
            election_id = campaign_data['election']['id']  # This is assuming campaignDetails.election.id structure

            # 2. Get election candidate data
            election_candidate_data = self.get_election_candidate_data(campaign_data)

            # 3. Extract election and candidate details
            election_details, candidate_details = self.extract_election_candidate_details(election_candidate_data)

            # 4. Fetch election related data (committees and candidates)
            election_committees, election_candidates = self.get_election_related_data(election_id)

            # 5. Get campaign members data
            campaign_members, current_campaign_member_data = self.get_campaign_members_data(id, current_user_id)

            # 6. Fetch CampaignGuarantees
            campaign_guarantees = self.get_campaign_guarantees(campaign_members, election_id)
            election_attendees = self.get_election_attendees(election_id)

            return Response({
                "data": {
                    "currentCampaignMember": current_campaign_member_data,
                    "campaignDetails": campaign_data,
                    "campaignMembers": campaign_members,
                    "campaignGuarantees": campaign_guarantees,
                    "electionCandidates": election_candidates,
                    "electionCommittees": election_committees,
                    "electionAttendees": election_attendees,

                },
                "code": 200
            })

        except Campaigns.DoesNotExist:
            return JsonResponse({"error": "Campaign not found"}, status=404)
        
    # ... [ keep all helper methods here without any change ] ...

    def get_campaign_data(self, id):
        # Fetch the campaign details based on the given ID
        campaign = Campaigns.objects.get(id=id)
        campaign_serializer = CampaignsSerializer(campaign)
        campaign_data = campaign_serializer.data
        return campaign_data

    def get_election_candidate_data(self, campaign_data):
        # Extract the election_candidate ID from the campaign_data
        election_candidate_id = campaign_data.get('election_candidate')  # Adjust the field name if it's different

        # If there's a valid ID, query the ElectionCandidates table using it
        election_candidate_obj = get_object_or_404(ElectionCandidates, id=election_candidate_id)
        election_candidate_serializer = CampaignDetailsSerializer(election_candidate_obj)
        election_candidate_data = election_candidate_serializer.data
        return election_candidate_data

    def extract_election_candidate_details(self, election_candidate_data):
        # Extract election and candidate details from the serialized data
        election_details = election_candidate_data.get("election", {})
        candidate_details = election_candidate_data.get("candidate", {})
        return election_details, candidate_details

    def get_campaign_members_data(self, id, current_user_id):
        # Query for campaign members
        campaign_members_query = CampaignMembers.objects.select_related('user').filter(campaign_id=id)
        campaign_members_serializer = CampaignMembersSerializer(campaign_members_query, many=True)
        campaign_members = campaign_members_serializer.data

        # Fetch the current user's campaign member details
        current_campaign_member_query = CampaignMembers.objects.select_related('user').filter(campaign_id=id, user_id=current_user_id).first()
        current_campaign_member_data = {}

        if current_campaign_member_query:
            current_campaign_member_serializer = CampaignMembersSerializer(current_campaign_member_query)
            current_campaign_member_data = current_campaign_member_serializer.data

            # Extract the fullName
            user = current_campaign_member_query.user
            fullName = f"{user.first_name} {user.last_name}"

            # Get user data from serializer
            user_data = current_campaign_member_data.get("user", {})

            # Include the fullName and other user details in the current_campaign_member_data dictionary
            current_campaign_member_data["fullName"] = fullName
            current_campaign_member_data["user"] = {
                "id": user.id,
                "email": user.email,
            }

            # Filter the campaign members based on the current user's rank
            rank = current_campaign_member_data["rank"]
            if rank < 3:
                # If the rank is less than 3, show all members. So, no changes needed.
                pass
            elif rank == 3:
                # Show only the current member and members whose supervisor is the current member's ID.
                campaign_members = [member for member in campaign_members if member["id"] == current_campaign_member_data["id"] or member["supervisor"] == current_campaign_member_data["id"]]
            else: # rank > 3
                # Show only the current member and their supervisor.
                supervisor_id = current_campaign_member_data["supervisor"]
                campaign_members = [member for member in campaign_members if member["id"] == current_campaign_member_data["id"] or member["id"] == supervisor_id]

        return campaign_members, current_campaign_member_data


    def get_election_related_data(self, election_id):
        # Fetch ElectionCommittees based on the election ID
        election_committees_query = ElectionCommittees.objects.filter(election=election_id)
        election_committees_serializer = ElectionCommitteesSerializer(election_committees_query, many=True)
        election_committees = election_committees_serializer.data

        # Fetch ElectionCandidates for the same election
        election_candidates_query = ElectionCandidates.objects.filter(election=election_id)
        election_candidates_serializer = CampaignDetailsSerializer(election_candidates_query, many=True)  # Use the appropriate serializer
        election_candidates = election_candidates_serializer.data

        return election_committees, election_candidates

    def get_campaign_guarantees(self, campaign_members, election_id):
        # Extract the IDs from campaign_members
        campaign_member_ids = [member["id"] for member in campaign_members]

        # Fetch CampaignGuarantees related to the campaign members
        campaign_guarantees_query = CampaignGuarantees.objects.filter(member__id__in=campaign_member_ids)
        campaign_guarantees_serializer = CampaignGuaranteesSerializer(campaign_guarantees_query, many=True)
        campaign_guarantees = campaign_guarantees_serializer.data
        
        # Fetch election attendees for given election_id
        # attendees = ElectionAttendees.objects.filter(election_id=election_id).values_list('civil', flat=True)
        attendees = ElectionAttendees.objects.filter(election_id=election_id).values_list('elector_id', flat=True)

        attendee_set = set(attendees)  # Convert to set for faster lookups

        # Marking campaign guarantees as attended based on the civil value
        for guarantee in campaign_guarantees:
            guarantee['attended'] = guarantee['civil'] in attendee_set

        return campaign_guarantees

    def get_election_attendees(self, election_id):
        # Filter ElectionAttendee entries based on the provided election_id
        election_attendees_query = ElectionAttendees.objects.filter(election_id=election_id)
        
        # Serialize the data
        election_attendees_serializer = ElectionAttendeesSerializer(election_attendees_query, many=True)
        election_attendees = election_attendees_serializer.data
        return election_attendees


class AddNewCampaign(APIView):
    def post(self, request):
        election_candidate_id = request.data.get("election_candidate")

        # Fetch the candidate details based on the candidate ID
        try:
            election_candidate = ElectionCandidates.objects.get(id=election_candidate_id)
        except ElectionCandidates.DoesNotExist:
            return Response({"error": "Election Candidate not found"}, status=404)

        campaign = Campaigns.objects.create(
            election_candidate=election_candidate,
        )

        new_campaign_data = {
            "id": campaign.id,
            "election_candidate": election_candidate_id,
            "name": election_candidate.candidate.name if election_candidate.candidate else None,
            "candidate_image": election_candidate.candidate.image.url if election_candidate.candidate and election_candidate.candidate.image else None,
            "gender": election_candidate.candidate.gender if election_candidate.candidate else None,
            # Add other details you want to include
        }

        return Response({"data": new_campaign_data, "count": 0, "code": 200})


class DeleteCampaign(APIView):
    def delete(self, request, id):
        try:
            campaign = Campaigns.objects.get(id=id)
            campaign.delete()
            return JsonResponse({"data": "Campaigns deleted successfully", "count": 1, "code": 200}, safe=False)
        except Campaigns.DoesNotExist:
            return JsonResponse({"data": "Campaigns not found", "count": 0, "code": 404}, safe=False)


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
        


class AddNewCampaignMember(APIView):
    def post(self, request):
        campaign_id = request.data.get("campaign")
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
            "mobile": campaign_member.mobile,
            "status": campaign_member.status,
        }

        return Response({"data": response_data, "count": 0, "code": 200})



class UpdateCampaignMember(APIView):
    def patch(self, request, id):
        # Election Results
        rank = request.data.get("rank")
        supervisor = request.data.get("supervisor")
        committee = request.data.get("committee")
        mobile = request.data.get("mobile")
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
        campaign_member.mobile = mobile
        campaign_member.status = status
        campaign_member.save()

        # Prepare the response data with member details
        updated_campaign_member_data = {
            # Basic Information
            "id": campaign_member.id,
            # "campaign_id": campaign_member.campaign.id,  # Extracted from the campaign_member instance
            # "user_id": campaign_member.user.id,          # Extracted from the campaign_member instance

            # Election Data
            "rank": campaign_member.rank,
            "supervisor": campaign_member.supervisor.id if campaign_member.supervisor else None,
            "committee": campaign_member.committee.id if campaign_member.committee else None,
            "mobile": campaign_member.mobile,
            "notes": campaign_member.notes,
            "status": campaign_member.status,
        }

        return Response({"data": updated_campaign_member_data, "count": 0, "code": 200})


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
            "full_name": elector.full_name(),
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
            "full_name": elector.full_name(),  # Using the full_name method from Electors model
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
        
