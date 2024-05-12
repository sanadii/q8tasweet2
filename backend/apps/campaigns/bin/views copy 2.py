# from apps.campaigns.models import Campaign
from django.http import JsonResponse
from django.http.response import JsonResponse
from rest_framework.response import Response
from rest_framework.views import APIView

# Models
from models import Campaign, CampaignMember, CampaignGuarantee, CampaignAttendee
from apps.elections.models import Election, ElectionCandidate, ElectionCommittee
from apps.candidates.models import Candidate
from electors.models import Voter
from apps.categories.models import Category
from django.contrib.auth.models import Group, Permission

# Serializers
from candidates.serializers import CandidateSerializer
from elections.serializers import ElectionSerializer
from apps.auths.serializers import UserSerializer
from electors.serializers import VotersSerializer

from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated, AllowAny

from rest_framework.exceptions import AuthenticationFailed
from rest_framework import status
from utils.views_helper import CustomPagination


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
                data_serializer = CampaignSerializer(paginated_campaignss, many=True, context=context)
                
                return paginator.get_paginated_response(data_serializer.data)

            else:  # if user is not staff
                current_user_id = request.user.id

                # Step 1: Query the CampaignMember table
                member_entries = CampaignMember.objects.filter(user_id=current_user_id)
                
                # Step 2: Get corresponding Campaign
                campaign_ids = [entry.campaign.id for entry in member_entries if entry.campaign]
                campaigns_data = Campaign.objects.filter(id__in=campaign_ids)
                
                # Step 3: Serialize the data
                data_serializer = CampaignSerializer(campaigns_data, many=True)

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

            # 6. Fetch Guarantees & Attendees
            campaign_guarantees = self.get_campaign_guarantees(campaign_members, election_id)
            Campaign_attendees = self.get_Campaign_attendees(election_id)

            return Response({
                "data": {
                    "currentCampaignMember": current_campaign_member_data,
                    "campaignDetails": campaign_data,
                    "campaignMembers": campaign_members,
                    "campaignGuarantees": campaign_guarantees,
                    "CampaignAttendee": Campaign_attendees,
                    "electionCandidates": election_candidates,
                    "electionCommittees": election_committees,
                    

                },
                "code": 200
            })

        except Campaign.DoesNotExist:
            return JsonResponse({"error": "Campaign not found"}, status=404)
        
    # ... [ keep all helper methods here without any change ] ...

    def get_campaign_data(self, id):
        # Fetch the campaign details based on the given ID
        campaign = Campaign.objects.get(id=id)
        campaign_serializer = CampaignSerializer(campaign)
        campaign_data = campaign_serializer.data
        return campaign_data

    def get_election_candidate_data(self, campaign_data):
        # Extract the election_candidate ID from the campaign_data
        election_candidate_id = campaign_data.get('election_candidate')  # Adjust the field name if it's different

        # If there's a valid ID, query the ElectionCandidate table using it
        election_candidate_obj = get_object_or_404(ElectionCandidate, id=election_candidate_id)
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
        campaign_members_query = CampaignMember.objects.select_related('user').filter(campaign_id=id)
        campaign_members_serializer = CampaignMemberSerializer(campaign_members_query, many=True)
        campaign_members = campaign_members_serializer.data

        # Fetch the current user's campaign member details
        current_campaign_member_query = CampaignMember.objects.select_related('user').filter(campaign_id=id, user_id=current_user_id).first()
        current_campaign_member_data = {}

        if current_campaign_member_query:
            current_campaign_member_serializer = CampaignMemberSerializer(current_campaign_member_query)
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

            # TODO: add admin to work here
            # Filter the campaign members based on the current user's role
            role = int(current_campaign_member_data.get("role", 0))  # Safely get and convert role
            if role < 3:
                # If the role is less than 3, show all members. So, no changes needed.
                pass
            elif role == 3:
                # Show only the current member and members whose supervisor is the current member's ID.
                campaign_members = [member for member in campaign_members if member["id"] == current_campaign_member_data["id"] or member["supervisor"] == current_campaign_member_data["id"]]
            else: # role > 3
                # Show only the current member and their supervisor.
                supervisor_id = current_campaign_member_data["supervisor"]
                campaign_members = [member for member in campaign_members if member["id"] == current_campaign_member_data["id"] or member["id"] == supervisor_id]
            # ...

        return campaign_members, current_campaign_member_data


    def get_election_related_data(self, election_id):
        # Fetch ElectionCommittee based on the election ID
        election_committees_query = ElectionCommittee.objects.filter(election=election_id)
        election_committees_serializer = ElectionCommitteeSerializer(election_committees_query, many=True)
        election_committees = election_committees_serializer.data

        # Fetch ElectionCandidate for the same election
        election_candidates_query = ElectionCandidate.objects.filter(election=election_id)
        election_candidates_serializer = CampaignDetailsSerializer(election_candidates_query, many=True)  # Use the appropriate serializer
        election_candidates = election_candidates_serializer.data

        return election_committees, election_candidates

    def get_campaign_guarantees(self, campaign_members, election_id):
        # Extract the IDs from campaign_members
        campaign_member_ids = [member.get("id") for member in campaign_members if member.get("id") is not None]

        if not campaign_member_ids:
            return []

        # Fetch CampaignGuarantee related to the campaign members
        campaign_guarantees_query = CampaignGuarantee.objects.filter(member__id__in=campaign_member_ids)
        campaign_guarantees_serializer = CampaignGuaranteeSerializer(campaign_guarantees_query, many=True)
        campaign_guarantees = campaign_guarantees_serializer.data
        
        # Fetch election attendees for given election_id
        # attendees = CampaignAttendee.objects.filter(election_id=election_id).values_list('civil', flat=True)
        attendees = CampaignAttendee.objects.filter(election_id=election_id).values_list('voter_id', flat=True)

        attendee_set = set(attendees)  # Convert to set for faster lookups

        # Marking campaign guarantees as attended based on the civil value
        for guarantee in campaign_guarantees:
            guarantee['attended'] = guarantee['civil'] in attendee_set

        return campaign_guarantees

    def get_Campaign_attendees(self, election_id):
        # Filter ElectionAttendee entries based on the provided election_id
        Campaign_attendees_query = CampaignAttendee.objects.filter(election_id=election_id)
        
        # Serialize the data
        Campaign_attendees_serializer = CampaignAttendeeSerializer(Campaign_attendees_query, many=True)
        Campaign_attendees = Campaign_attendees_serializer.data
        return Campaign_attendees

class AddNewCampaign(APIView):
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
        
        serializer = CampaignSerializer(data=request.data, context={'request': request})
        
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
            campaign = Campaign.objects.get(id=campaign_id)
        except Campaign.DoesNotExist:
            return Response({"error": "Campaign not found"}, status=404)

        # Create the new campaign member with user and campaign details
        campaign_member = CampaignMember.objects.create(
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
            # I'm assuming these fields are in the CampaignMember model. 
            # If they aren't, you can adjust accordingly.
            "role": campaign_member.role,
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
        role = request.data.get("role")
        supervisor = request.data.get("supervisor")
        committee = request.data.get("committee")
        phone = request.data.get("phone")
        notes = request.data.get("notes")
        status = request.data.get("status")

        # Fetch the campaign member details based on the URL parameter 'id'
        try:
            campaign_member = CampaignMember.objects.get(id=id)
        except CampaignMember.DoesNotExist:
            return Response({"error": "Campaign Member not found"}, status=404)

        # Update the election candidate with the new data

        # Election Related Data
        campaign_member.role = role
        if supervisor:
            try:
                supervisor_instance = CampaignMember.objects.get(id=supervisor)
                campaign_member.supervisor = supervisor_instance
            except CampaignMember.DoesNotExist:
                return Response({"error": "Supervisor not found"}, status=404)
        
        if committee:
            try:
                committee_instance = ElectionCommittee.objects.get(id=committee)  # Assuming your committee model is named ElectionCommittee
                campaign_member.committee = committee_instance
            except ElectionCommittee.DoesNotExist:
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
            "role": campaign_member.role,
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
    def post(self, request):
        campaign_id = request.data.get("campaign")
        member_id = request.data.get("member")
        civil = request.data.get("voter")
        status = request.data.get("status")

        # Fetch the voter details based on voter civil
        try:
            voter = Voter.objects.get(civil=civil)
        except Voter.DoesNotExist:
            return Response({"error": "Voter not found"}, status=status.HTTP_404_NOT_FOUND)

        # Fetch the campaign based on campaign_id
        try:
            campaign = Campaign.objects.get(id=campaign_id)
        except CampaignMember.DoesNotExist:
            return Response({"error": "Campaign not found"}, status=status.HTTP_404_NOT_FOUND)

        # Fetch the member based on member_id
        try:
            member = CampaignMember.objects.get(id=member_id)
        except CampaignMember.DoesNotExist:
            return Response({"error": "Member not found"}, status=status.HTTP_404_NOT_FOUND)

        # Create the new link between the campaign member and the voter
        campaign_guarantee = CampaignGuarantee.objects.create(
            campaign_id=campaign_id,
            member_id=member_id,
            civil=voter,
            status=status,
        )

        # Prepare the response data with member and voter details
        response_data = {
            "id": campaign_guarantee.id,
            "campaign": campaign.id,
            "member": member.id,
            "civil": voter.civil,
            # "full_name": voter.full_name(),
            "full_name": voter.full_name,
            "gender": voter.gender,
            "status": campaign_guarantee.status,
            # ... other fields you want to return
        }

        return Response({"data": response_data, "count": 0, "code": 200})

class UpdateCampaignGuarantee(APIView):
    def patch(self, request, id):
        # Fetch the campaign guarantee based on the URL parameter 'id'
        try:
            campaign_guarantee = CampaignGuarantee.objects.get(id=id)
        except CampaignGuarantee.DoesNotExist:
            return Response({"error": "Campaign Guarantee not found"}, status=status.HTTP_404_NOT_FOUND)

        # Since civil is a ForeignKey, you can directly use it to access the related Voter object
        voter = campaign_guarantee.civil
        if not voter:
            return Response({"error": "Voter not found"}, status=status.HTTP_404_NOT_FOUND)

        # Basic Information
        campaign_id = request.data.get("campaign")
        member_id = request.data.get("member")
        phone = request.data.get("phone")
        status_value = request.data.get("status")
        notes = request.data.get("notes")

        # If there's a campaign_id provided, update the campaign
        if campaign_id:
            try:
                campaign = Campaign.objects.get(id=campaign_id)
                # Assuming there is a 'campaign' attribute in CampaignGuarantee
                campaign_guarantee.campaign = campaign
            except Campaign.DoesNotExist:
                return Response({"error": "Campaign not found"}, status=status.HTTP_404_NOT_FOUND)

        # If there's a member_id provided, update the member
        if member_id:
            try:
                member = CampaignMember.objects.get(id=member_id)
                campaign_guarantee.member = member
            except CampaignMember.DoesNotExist:
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
            "civil": voter.civil,
            # "full_name": voter.full_name(),  # Using the full_name method from Voter model
            "full_name": voter.full_name,  # Using the full_name method from Voter model
            "gender": voter.gender,
            "phone": campaign_guarantee.phone,
            "status": campaign_guarantee.status,
            "notes": campaign_guarantee.notes
        }

        return Response({"data": updated_data, "count": 0, "code": 200})

class DeleteCampaignGuarantee(APIView):
    def delete(self, request, id):
        try:
            campaign_guarantee = CampaignGuarantee.objects.get(id=id)
            campaign_guarantee.delete()
            return JsonResponse(
                {"data": "campaign Guarantee deleted successfully", "count": 1, "code": 200},
                safe=False,
            )
        except CampaignGuarantee.DoesNotExist:
            return JsonResponse(
                {"data": "campaign not found", "count": 0, "code": 404}, safe=False
            )

class AddNewElectionAttendee(APIView):
    def post(self, request):
        user_id = request.data.get("user")
        election_id = request.data.get("election")
        committee_id = request.data.get("committee")
        civil = request.data.get("voter")
        status_value = request.data.get("status")  # Renamed to avoid conflict with status module

        # Fetch the voter details based on voter civil
        try:
            voter = Voter.objects.get(civil=civil)
        except Voter.DoesNotExist:
            return Response({"error": "Voter not found"}, status=status.HTTP_404_NOT_FOUND)

        # Fetch the member based on member_id
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        # Fetch the election based on election_id
        try:
            election = Election.objects.get(id=election_id)
        except Election.DoesNotExist:
            return Response({"error": "Election not found"}, status=status.HTTP_404_NOT_FOUND)

        # Fetch the election based on committee_id
        try:
            committee = ElectionCommittee.objects.get(id=committee_id)
        except ElectionCommittee.DoesNotExist:
            return Response({"error": "Committee not found"}, status=status.HTTP_404_NOT_FOUND)

        # Create the new link between the user, voter, and election
        Campaign_attendee = CampaignAttendee.objects.create(
            user_id=user_id,
            voter=voter,
            committee=committee,
            election=election,
            status=status_value,
        )

        # Prepare the response data with member, voter, and election details
        response_data = {
            "id": Campaign_attendee.id,
            "user": user.id,
            "civil": voter.civil,
            "election": election.id,
            "committee": committee.id,
            "full_name": voter.full_name(),
            "gender": voter.gender,
            "status": Campaign_attendee.status,
            # ... other fields you want to return
        }

        return Response({"data": response_data, "count": 0, "code": 200})

class UpdateElectionAttendee(APIView):
    def patch(self, request, id):
        # Fetch the campaign guarantee based on the URL parameter 'id'
        try:
            campaign_guarantee = CampaignAttendee.objects.get(id=id)
        except CampaignAttendee.DoesNotExist:
            return Response({"error": "Campaign Guarantee not found"}, status=status.HTTP_404_NOT_FOUND)

        # Since civil is a ForeignKey, you can directly use it to access the related Voter object
        voter = campaign_guarantee.civil
        if not voter:
            return Response({"error": "Voter not found"}, status=status.HTTP_404_NOT_FOUND)

        # Basic Information
        member_id = request.data.get("member_id")
        phone = request.data.get("phone")
        status_value = request.data.get("status")
        notes = request.data.get("notes")

        # If there's a member_id provided, update the member
        if member_id:
            try:
                member = CampaignMember.objects.get(id=member_id)
                campaign_guarantee.member = member
            except CampaignMember.DoesNotExist:
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
            "civil": voter.civil,
            "full_name": voter.full_name(),  # Using the full_name method from Voter model
            "gender": voter.gender,
            "phone": campaign_guarantee.phone,
            "status": campaign_guarantee.status,
            "notes": campaign_guarantee.notes
        }

        return Response({"data": updated_data, "count": 0, "code": 200})

class DeleteElectionAttendee(APIView):
    def delete(self, request, id):
        try:
            campaign_guarantee = CampaignAttendee.objects.get(id=id)
            campaign_guarantee.delete()
            return JsonResponse(
                {"data": "campaign Guarantee deleted successfully", "count": 1, "code": 200},
                safe=False,
            )
        except CampaignAttendee.DoesNotExist:
            return JsonResponse(
                {"data": "campaign not found", "count": 0, "code": 404}, safe=False
            )
        
