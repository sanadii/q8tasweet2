# Campaign Urls: campaigns/urls.py
from django.urls import path
from .views import *

app_name = "elecionStatistics"

urlpatterns = [
    # Campaign
    path("addElectionDatabase/<slug:slug>", AddElectionDatabase.as_view(), name="AddElectionDatabase"),
    # path("uploadElectionData/<slug:slug>", UploadElectionData.as_view(), name="UploadElectionData"),
    path("getElectionStatistics/<slug:slug>", GetElectionStatistics.as_view(), name="GetElectionStatistics"),
]