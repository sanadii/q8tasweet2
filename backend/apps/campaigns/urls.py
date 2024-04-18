# Campaign Urls: campaigns/urls.py
from django.urls import path
from .views import *
<<<<<<< HEAD
=======
from .members.views import *
# from .guarantees.views import *
>>>>>>> sanad

app_name = "campaigns"

urlpatterns = [
    # Campaign
    path("getCampaigns", GetCampaigns.as_view(), name="getCampaigns"),
    path("getCampaignDetails/<slug:slug>", GetCampaignDetails.as_view(), name="getCampaignDetails"),
<<<<<<< HEAD
    path("addNewCampaign", AddNewCampaign.as_view(), name="AddNewCampaign"),
=======
    path("addCampaign", AddCampaign.as_view(), name="AddCampaign"),
>>>>>>> sanad
    path("deleteCampaign/<int:id>", DeleteCampaign.as_view(), name="DeleteCampaign"),
    path("updateCampaign/<int:id>", UpdateCampaign.as_view(), name="UpdateCampaign"),


    # # Election Campaign
    # path("getElectionCampaigns/<int:id>", GetElectionCampaigns.as_view(), name="getElectionCampaigns"),
    # # path('getElectionCampaigns', GetElectionCampaigns.as_view(), name='getElectionCampaigns'),
<<<<<<< HEAD
    path("addNewCampaignMember", AddNewCampaignMember.as_view(), name="AddNewCampaignMember"),
    path("deleteCampaignMember/<int:pk>", DeleteCampaignMember.as_view(), name="DeleteCampaignMember"),
    path("updateCampaignMember/<int:pk>", UpdateCampaignMember.as_view(), name="UpdateCampaignMember"),

    # Guarantees
    path("addNewCampaignGuarantee", AddNewCampaignGuarantee.as_view(), name="AddNewMemberGuarantee"),
    path("updateCampaignGuarantee/<int:pk>", UpdateCampaignGuarantee.as_view(), name="UpdateCampaignGuarantee"),
    path("deleteCampaignGuarantee/<int:pk>", DeleteCampaignGuarantee.as_view(), name="DeleteCampaignGuarantee"),

    # Attendees
    path("addNewCampaignAttendee", AddNewCampaignAttendee.as_view(), name="AddNewCampaignAttendee"),
    path("deleteCampaignAttendee/<int:id>", DeleteCampaignAttendee.as_view(), name="DeleteCampaignAttendee"),
    path("updateCampaignAttendee/<int:id>", UpdateCampaignAttendee.as_view(), name="UpdateCampaignAttendee"),

    # Sorting
    path("getAllCampaignSorting", GetAllCampaignSorting.as_view(), name="GetAllCampaignSorting"),
    path("GetCampaignCommitteeSorting/<int:id>", GetCampaignCommitteeSorting.as_view(), name="GetCampaignCommitteeSorting"),
=======
    path("addCampaignMember", AddCampaignMember.as_view(), name="AddCampaignMember"),
    path("deleteCampaignMember/<int:pk>", DeleteCampaignMember.as_view(), name="DeleteCampaignMember"),
    path("updateCampaignMember/<int:pk>", UpdateCampaignMember.as_view(), name="UpdateCampaignMember"),

    # # Sorting
    # path("getAllCampaignSorting", GetAllCampaignSorting.as_view(), name="GetAllCampaignSorting"),
    # path("GetCampaignCommitteeSorting/<int:id>", GetCampaignCommitteeSorting.as_view(), name="GetCampaignCommitteeSorting"),
>>>>>>> sanad

]