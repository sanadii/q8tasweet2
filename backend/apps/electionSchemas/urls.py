# Campaign Urls: campaigns/urls.py
from django.urls import path
from .views import *

app_name = "dynamicSchema"

urlpatterns = [
    # Campaign
    # path("addElectionSchema/<slug:slug>", AddElectionSchema.as_view(), name="AddElectionSchema"),
    path("addElectionSchema/<slug:slug>", AddElectionSchemaTables.as_view(), name="AddElectionSchemaTables"),
    # path("getDatabaseSchemaDetails/<slug:slug>", GetDatabaseSchemaDetails.as_view(), name="GetDatabaseSchemaDetails"),
    # path("uploadElectionData/<slug:slug>", UploadElectionData.as_view(), name="UploadElectionData"),
    
]