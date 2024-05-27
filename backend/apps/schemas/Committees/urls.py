# Campaign Urls: campaigns/urls.py
from django.urls import path
from .views import *

app_name = "committees"

urlpatterns = [
    # Committees
    # path("getCommittees/<int:election_id>", GetCommittees.as_view(), name="getCommittees"),
    path("addNewCommittee", AddCommittee.as_view(), name="AddNewCommittee"),
    path("deleteCommittee/<int:id>", DeleteCommittee.as_view(), name="DeleteCommittee"),
    path("updateCommittee/<int:id>", UpdateCommittee.as_view(), name="UpdateCommittee"),

    #  Results
    path("updateElectionResults/<int:id>", UpdateElectionResults.as_view(), name="UpdateElectionResults"),


]