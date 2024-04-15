# Campaign Urls: campaigns/urls.py
from django.urls import path
from .views import *

app_name = "elecionStatistics"

urlpatterns = [
    # Campaign
    path("getElectionStatistics/<slug:slug>", GetElectionStatistics.as_view(), name="GetElectionStatistics"),
]