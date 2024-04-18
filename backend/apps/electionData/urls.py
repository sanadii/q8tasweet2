# Campaign Urls: campaigns/urls.py
from django.urls import path
from .views import *

app_name = "elecionStatistics"

urlpatterns = [
    # Campaign
    # path("addElectionSchema/<slug:slug>", AddElectionSchema.as_view(), name="AddElectionSchema"),
    path("addElectionSchema/<slug:slug>", AddElectionSchemaTables.as_view(), name="AddElectionSchemaTables"),
    path("getElectionSchemaDetails/<slug:slug>", GetElectionSchemaDetails.as_view(), name="getElectionSchemaDetails"),
    # path("uploadElectionData/<slug:slug>", UploadElectionData.as_view(), name="UploadElectionData"),
    # path("getelectionData/<slug:slug>", GetelectionData.as_view(), name="GetelectionData"),
]