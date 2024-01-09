# Election Urls: elections/urls.py
from django.urls import path
from apps.elections.views import *

# from .views.candidates import *
from rest_framework.routers import DefaultRouter

app_name = "elections"

urlpatterns = [
    # Election
    path("getElections", GetElections.as_view(), name="GetElections"),
    path("getElectionDetails/<slug:slug>", GetElectionDetails.as_view(), name="GetElectionDetails"),
    path("getElectionDetails/<int:id>", GetElectionDetails.as_view(), name="GetElectionDetails"),
    path("addElection", AddElection.as_view(), name="AddElection"),
    path("deleteElection/<int:id>", DeleteElection.as_view(), name="DeleteElection"),
    path("updateElection/<int:id>", UpdateElection.as_view(), name="UpdateElection"),
    

    # Election Categories
    path("getCategories", GetCategories.as_view(), name="GetCategories"),
    path("updateCategory/<int:id>", UpdateCategory.as_view(), name="UpdateCategory"),

    # Election Candidate
    # path("getElectionCandidates/<int:election_id>", GetElectionCandidates.as_view(), name="getElectionCandidates"),
    path("addNewElectionCandidate", AddNewElectionCandidate.as_view(), name="AddNewElectionCandidate"),
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
    path("updateElectionPartyVotes/votes", UpdateElectionPartyVotes.as_view(), name="UpdateElectionPartyVotes"),

    # Election Party
    # path("getElectionPartyCandidateCandidates/<int:election_id>", GetElectionPartyCandidates.as_view(), name="getElectionPartyCandidates"),
    path("addElectionPartyCandidate", AddElectionPartyCandidate.as_view(), name="AddElectionPartyCandidate"),
    path("deleteElectionPartyCandidate/<int:id>", DeleteElectionPartyCandidate.as_view(), name="DeleteElectionPartyCandidate"),
    path("updateElectionPartyCandidate/<int:id>", UpdateElectionPartyCandidate.as_view(), name="UpdateElectionPartyCandidate"),
    path("updateElectionPartyCandidate/<int:id>", UpdateElectionPartyCandidate.as_view(), name="UpdateElectionPartyCandidate"),
    path("updateElectionPartyCandidateVotes/votes", UpdateElectionPartyCandidateVotes.as_view(), name="UpdateElectionPartyCandidateVotes"),

    # Election Committees
    # path("getElectionCommittees/<int:election_id>", GetElectionCommittees.as_view(), name="getElectionCommittees"),
    path("addNewElectionCommittee", AddNewElectionCommittee.as_view(), name="AddNewElectionCommittee"),
    path("deleteElectionCommittee/<int:id>", DeleteElectionCommittee.as_view(), name="DeleteElectionCommittee"),
    path("updateElectionCommittee/<int:id>", UpdateElectionCommittee.as_view(), name="UpdateElectionCommittee"),
    path("updateElectionCommitteeResults/<int:id>", UpdateElectionCommitteeResults.as_view(), name="UpdateElectionCommitteeResults"),

    # Public
    path("getPublicElections", GetPublicElections.as_view(), name="GetPublicElections"),
    path("getPublicElectionDetails", GetPublicElectionDetails.as_view(), name="GetPublicElectionDetails"),
]