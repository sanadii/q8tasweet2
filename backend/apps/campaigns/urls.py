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

    # # Sorting
    # path("getAllCampaignSorting", GetAllCampaignSorting.as_view(), name="GetAllCampaignSorting"),
    # path("GetCampaignCommitteeSorting/<int:id>", GetCampaignCommitteeSorting.as_view(), name="GetCampaignCommitteeSorting"),

]