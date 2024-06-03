# Campaign Urls: campaigns/urls.py
from django.urls import path
from .views import *
from apps.schemas.committees.views import *
from apps.schemas.electors.views import *
from apps.schemas.guarantees.views import *
from apps.schemas.campaign_attendees.views import *
# from apps.schemas.election_sorting.views import *

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

    # # Guarantee Groups
    path("addCampaignGuaranteeGroup/<slug:schema>", AddCampaignGuaranteeGroup.as_view(), name="AddMemberGuaranteeGroup"),
    path("updateCampaignGuaranteeGroup/<slug:schema>/<int:pk>", UpdateCampaignGuaranteeGroup.as_view(), name="UpdateCampaignGuaranteeGroup"),
    path("deleteCampaignGuaranteeGroup/<slug:schema>/<int:pk>", DeleteCampaignGuaranteeGroup.as_view(), name="DeleteCampaignGuaranteeGroup"),
    
    # Guarantees
    path("addCampaignGuarantee/<slug:schema>", AddCampaignGuarantee.as_view(), name="AddMemberGuarantee"),
    path("updateCampaignGuarantee/<slug:schema>/<int:pk>", UpdateCampaignGuarantee.as_view(), name="UpdateCampaignGuarantee"),
    path("deleteCampaignGuarantee/<slug:schema>/<int:pk>", DeleteCampaignGuarantee.as_view(), name="DeleteCampaignGuarantee"),
    
    # path("getElectorsByCategoryOld/<slug:slug>/", GetElectorsByCategory.as_view(), name="getElectorsByCategory"),
    # path("getElectors", GetElectors.as_view(), name="GetElectors"),

    # # Attendees
    path("addCampaignAttendee/<slug:schema>", AddCampaignAttendee.as_view(), name="AddElectionAttendee"),
    path("deleteCampaignAttendee/<slug:schema>/<int:pk>", DeleteCampaignAttendee.as_view(), name="DeleteElectionAttendee"),
    path("updateCampaignAttendee/<slug:schema>/<int:pk>", UpdateCampaignAttendee.as_view(), name="UpdateElectionAttendee"),
    # # Sorting
    # path("getAllCampaignSorting", GetAllCampaignSorting.as_view(), name="GetAllCampaignSorting"),
    # path("GetCampaignCommitteeSorting/<int:id>", GetCampaignCommitteeSorting.as_view(), name="GetCampaignCommitteeSorting"),
]
