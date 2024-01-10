# Campaign Urls: campaigns/urls.py
from django.urls import path
from .views import *

app_name = "campaigns"

urlpatterns = [
    # Campaign
    path("getCampaigns", GetCampaigns.as_view(), name="getCampaigns"),
    path("getCampaignDetails/<slug:campaignType>/<slug:slug>", GetCampaignDetails.as_view(), name="getCampaignDetails"),
    path("addNewCampaign", AddNewCampaign.as_view(), name="AddNewCampaign"),
    path("deleteCampaign/<int:id>", DeleteCampaign.as_view(), name="DeleteCampaign"),
    path("updateCampaign/<int:id>", UpdateCampaign.as_view(), name="UpdateCampaign"),


    # # Election Campaign
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
    path("addNewCampaignAttendee", AddNewCampaignAttendee.as_view(), name="AddNewCampaignAttendee"),
    path("deleteCampaignAttendee/<int:id>", DeleteCampaignAttendee.as_view(), name="DeleteCampaignAttendee"),
    path("updateCampaignAttendee/<int:id>", UpdateCampaignAttendee.as_view(), name="UpdateCampaignAttendee"),

    # Sorting
    path("getAllCampaignSorting", GetAllCampaignSorting.as_view(), name="GetAllCampaignSorting"),
    path("GetCampaignCommitteeSorting/<int:id>", GetCampaignCommitteeSorting.as_view(), name="GetCampaignCommitteeSorting"),

]