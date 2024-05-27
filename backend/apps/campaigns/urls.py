# Campaign Urls: campaigns/urls.py
from django.urls import path
from .views import *
from .members.views import *
# from .guarantees.views import *

app_name = "campaigns"

urlpatterns = [
    # Campaign
    path("getCampaigns", GetCampaigns.as_view(), name="getCampaigns"),
    path("getCampaignDetails/<slug:slug>", GetCampaignDetails.as_view(), name="getCampaignDetails"),
    path("addCampaign", AddCampaign.as_view(), name="AddCampaign"),
    path("deleteCampaign/<int:id>", DeleteCampaign.as_view(), name="DeleteCampaign"),
    path("updateCampaign/<int:id>", UpdateCampaign.as_view(), name="UpdateCampaign"),


    # # Election Campaign
    # path("getElectionCampaigns/<int:id>", GetElectionCampaigns.as_view(), name="getElectionCampaigns"),
    # # path('getElectionCampaigns', GetElectionCampaigns.as_view(), name='getElectionCampaigns'),
    path("addCampaignMember", AddCampaignMember.as_view(), name="AddCampaignMember"),
    path("deleteCampaignMember/<int:pk>", DeleteCampaignMember.as_view(), name="DeleteCampaignMember"),
    path("updateCampaignMember/<int:pk>", UpdateCampaignMember.as_view(), name="UpdateCampaignMember"),

    # # Guarantees
    # path("addCampaignGuarantee", AddCampaignGuarantee.as_view(), name="AddMemberGuarantee"),
    # path("updateCampaignGuarantee/<int:pk>", UpdateCampaignGuarantee.as_view(), name="UpdateCampaignGuarantee"),
    # path("deleteCampaignGuarantee/<int:pk>", DeleteCampaignGuarantee.as_view(), name="DeleteCampaignGuarantee"),

    # # Guarantee Groups
    # path("addCampaignGuaranteeGroup", AddCampaignGuaranteeGroup.as_view(), name="AddMemberGuaranteeGroup"),
    # path("updateCampaignGuaranteeGroup/<int:pk>", UpdateCampaignGuaranteeGroup.as_view(), name="UpdateCampaignGuaranteeGroup"),
    # path("deleteCampaignGuaranteeGroup/<int:pk>", DeleteCampaignGuaranteeGroup.as_view(), name="DeleteCampaignGuaranteeGroup"),

    # # Attendees
    # path("addCampaignAttendee", AddCampaignAttendee.as_view(), name="AddCampaignAttendee"),
    # path("deleteCampaignAttendee/<int:id>", DeleteCampaignAttendee.as_view(), name="DeleteCampaignAttendee"),
    # path("updateCampaignAttendee/<int:id>", UpdateCampaignAttendee.as_view(), name="UpdateCampaignAttendee"),

    # # Sorting
    # path("getAllCampaignSorting", GetAllCampaignSorting.as_view(), name="GetAllCampaignSorting"),
    # path("GetCampaignCommitteeSorting/<int:id>", GetCampaignCommitteeSorting.as_view(), name="GetCampaignCommitteeSorting"),

]