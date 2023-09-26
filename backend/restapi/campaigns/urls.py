# Campaign Urls
from django.urls import path
from .views import *

urlpatterns = [
    # Campaigns
    path("getCampaigns", GetCampaigns.as_view(), name="getCampaigns"),
    path("getCampaignDetails/<int:id>", GetCampaignDetails.as_view(), name="getCampaignDetails"),
    path("addNewCampaign", AddNewCampaign.as_view(), name="AddNewCampaign"),
    path("deleteCampaign/<int:id>", DeleteCampaign.as_view(), name="DeleteCampaign"),
    # path("updateCampaign/<int:id>", UpdateCampaign.as_view(), name="UpdateCampaign"),
    # path("getCampaignCount", GetCampaignCount.as_view(), name="GetCampaignCount"),


    # # Election Campaigns
    # path("getElectionCampaigns/<int:id>", GetElectionCampaigns.as_view(), name="getElectionCampaigns"),
    # # path('getElectionCampaigns', GetElectionCampaigns.as_view(), name='getElectionCampaigns'),
    path("addNewCampaignMember", AddNewCampaignMember.as_view(), name="AddNewCampaignMember"),
    path("deleteCampaignMember/<int:id>", DeleteCampaignMember.as_view(), name="DeleteCampaignMember"),
    path("updateCampaignMember/<int:id>", UpdateCampaignMember.as_view(), name="UpdateCampaignMember"),


    # Guarantees
    path("addNewCampaignGuarantee", AddNewCampaignGuarantee.as_view(), name="AddNewMemberGuarantee"),
    path("deleteCampaignGuarantee/<int:id>", DeleteCampaignGuarantee.as_view(), name="DeleteCampaignGuarantee"),
    path("updateCampaignGuarantee/<int:id>", UpdateCampaignGuarantee.as_view(), name="UpdateCampaignGuarantee"),

    # Attendees
    path("addNewElectionAttendee", AddNewElectionAttendee.as_view(), name="AddNewElectionAttendee"),
    path("deleteElectionAttendee/<int:id>", DeleteElectionAttendee.as_view(), name="DeleteElectionAttendee"),
    path("updateElectionAttendee/<int:id>", UpdateElectionAttendee.as_view(), name="UpdateElectionAttendee"),

    # Attendees
    path("getPublicElections", GetPublicElections.as_view(), name="GetPublicElections"),
    path("getPublicElectionDetails", GetPublicElectionDetails.as_view(), name="GetPublicElectionDetails"),

]