# Election Urls: elections/urls.py
from django.urls import path
from apps.elections.views import *
from apps.elections.candidates.views import *

# from .views.candidates import *
from rest_framework.routers import DefaultRouter

app_name = "elections"

urlpatterns = [
    # Election
    path("getElections", GetElections.as_view(), name="GetElections"),
    path("getElectionDetails/<slug:slug>", GetElectionDetails.as_view(), name="GetElectionDetails"),
    path("addElection", AddElection.as_view(), name="AddElection"),
    path("deleteElection/<int:id>", DeleteElection.as_view(), name="DeleteElection"),
    path("updateElection/<int:id>", UpdateElection.as_view(), name="UpdateElection"),
    
    # Election Categories
    path("getCategories", GetCategories.as_view(), name="GetCategories"),
    path("updateCategory/<int:id>", UpdateCategory.as_view(), name="UpdateCategory"),

    # Election Candidate
    # path("getElectionCandidates/<int:election_id>", GetElectionCandidates.as_view(), name="getElectionCandidates"),
    path("addElectionCandidate", AddElectionCandidate.as_view(), name="AddElectionCandidate"),
    path("deleteElectionCandidate/<int:id>", DeleteElectionCandidate.as_view(), name="DeleteElectionCandidate"),
    path("updateElectionCandidate/<int:id>", UpdateElectionCandidate.as_view(), name="UpdateElectionCandidate"),
    path("updateElectionCandidate/<int:id>", UpdateElectionCandidate.as_view(), name="UpdateElectionCandidate"),
    path("updateElectionCandidateVotes/votes", UpdateElectionCandidateVotes.as_view(), name="UpdateElectionCandidateVotes"),

    # Election Party
    # path("getElectionParties/<int:election_id>", GetElectionPartys.as_view(), name="getElectionPartys"),
    path("addElectionParty", AddElectionParty.as_view(), name="AddElectionParty"),
    path("deleteElectionParty/<int:id>", DeleteElectionParty.as_view(), name="DeleteElectionParty"),
    path("updateElectionParty/<int:id>", UpdateElectionParty.as_view(), name="UpdateElectionParty"),
    path("updateElectionParty/<int:id>", UpdateElectionParty.as_view(), name="UpdateElectionParty"),

    # Election Party
    # path("getElectionPartyCandidateCandidates/<int:election_id>", GetElectionPartyCandidates.as_view(), name="getElectionPartyCandidates"),
    path("addElectionPartyCandidate", AddElectionPartyCandidate.as_view(), name="AddElectionPartyCandidate"),
    path("deleteElectionPartyCandidate/<int:id>", DeleteElectionPartyCandidate.as_view(), name="DeleteElectionPartyCandidate"),
    path("updateElectionPartyCandidate/<int:id>", UpdateElectionPartyCandidate.as_view(), name="UpdateElectionPartyCandidate"),
    path("updateElectionPartyCandidate/<int:id>", UpdateElectionPartyCandidate.as_view(), name="UpdateElectionPartyCandidate"),

    # Public
    path("getPublicElections", GetPublicElections.as_view(), name="GetPublicElections"),
    path("getPublicElectionDetails", GetPublicElectionDetails.as_view(), name="GetPublicElectionDetails"),
]