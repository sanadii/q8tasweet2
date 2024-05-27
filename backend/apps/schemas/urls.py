# Campaign Urls: campaigns/urls.py
from django.urls import path
from .views import *
from apps.schemas.committees.views import *
from apps.schemas.electors.views import *
from apps.schemas.guarantees.views import *

app_name = "schema"

urlpatterns = [
    # Campaign
    path("addElectionSchema/<slug:slug>", AddElectionSchema.as_view(), name="AddElectionSchema"),
    path("addSchemaTables/<slug:slug>", AddSchemaTables.as_view(), name="AddSchemaTables"),
    # path("getDatabaseSchemaDetails/<slug:slug>", GetDatabaseSchemaDetails.as_view(), name="GetDatabaseSchemaDetails"),
    # path("uploadElectionData/<slug:slug>", UploadElectionData.as_view(), name="UploadElectionData"),
    
    
    # Committees
    path("addNewCommittee", AddCommittee.as_view(), name="AddNewCommittee"),
    path("deleteCommittee/<int:id>", DeleteCommittee.as_view(), name="DeleteCommittee"),
    path("updateCommittee/<int:id>", UpdateCommittee.as_view(), name="UpdateCommittee"),
    
    #  Committee Results
    path("updateElectionResults/<int:id>", UpdateElectionResults.as_view(), name="UpdateElectionResults"),

    # Electors
    # path("getAllElectors", GetAllElectors.as_view(), name="GetAllElectors"),
    # path("getElectorStatistics/<slug:slug>", GetElectorStatistics.as_view(), name="GetElectorStatistics"),
    path("getElectorsByAll", GetElectorsByAll.as_view(), name="GetElectorsByAll"),
    path("getElectorsByCategory", GetElectorsByCategory.as_view(), name="GetElectorsByCategory"),
    path("getElectorsBySearch", GetElectorsBySearch.as_view(), name="GetElectorsBySearch"),
    path("getElectorRelatedElectors", GetElectorRelatedElectors.as_view(), name="GetElectorRelatedElectors"),


    # Guarantees
    path("addCampaignGuarantee", AddCampaignGuarantee.as_view(), name="AddMemberGuarantee"),
    path("updateCampaignGuarantee/<int:pk>", UpdateCampaignGuarantee.as_view(), name="UpdateCampaignGuarantee"),
    path("deleteCampaignGuarantee/<int:pk>", DeleteCampaignGuarantee.as_view(), name="DeleteCampaignGuarantee"),
    
    # # Guarantee Groups
    path("addCampaignGuaranteeGroup", AddCampaignGuaranteeGroup.as_view(), name="AddMemberGuaranteeGroup"),
    path("updateCampaignGuaranteeGroup/<int:pk>", UpdateCampaignGuaranteeGroup.as_view(), name="UpdateCampaignGuaranteeGroup"),
    path("deleteCampaignGuaranteeGroup/<int:pk>", DeleteCampaignGuaranteeGroup.as_view(), name="DeleteCampaignGuaranteeGroup"),
    

    # path("getElectorsByCategoryOld/<slug:slug>/", GetElectorsByCategory.as_view(), name="getElectorsByCategory"),
    # path("getElectors", GetElectors.as_view(), name="GetElectors"),

    # # Attendees
    # path("addCampaignAttendee", AddCampaignAttendee.as_view(), name="AddCampaignAttendee"),
    # path("deleteCampaignAttendee/<int:id>", DeleteCampaignAttendee.as_view(), name="DeleteCampaignAttendee"),
    # path("updateCampaignAttendee/<int:id>", UpdateCampaignAttendee.as_view(), name="UpdateCampaignAttendee"),
    # # Sorting
    # path("getAllCampaignSorting", GetAllCampaignSorting.as_view(), name="GetAllCampaignSorting"),
    # path("GetCampaignCommitteeSorting/<int:id>", GetCampaignCommitteeSorting.as_view(), name="GetCampaignCommitteeSorting"),
]
