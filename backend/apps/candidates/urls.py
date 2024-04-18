# Campaign Urls

from django.urls import path
from .views import *

app_name = "candidates"

urlpatterns = [
    # Candidate
    path("getCandidates", GetCandidates.as_view(), name="GetCandidates"),
    path("getCandidateDetails/<slug:slug>", GetCandidateDetails.as_view(), name="GetCandidateDetails"),
    path("getCandidateDetails/<int:id>", GetCandidateDetails.as_view(), name="GetCandidateDetails"),
<<<<<<< HEAD
    path("addNewCandidate", AddNewCandidate.as_view(), name="AddNewCandidate"),
=======
    path("addCandidate", AddCandidate.as_view(), name="AddCandidate"),
>>>>>>> sanad
    path("deleteCandidate/<int:id>", DeleteCandidate.as_view(), name="DeleteCandidate"),
    path("updateCandidate/<int:id>", UpdateCandidate.as_view(), name="UpdateCandidate"),

    # Candidate Details
    # path("getCandidateDetails/<int:id>", GetCandidateDetails.as_view(), name="GetCandidateDetails"),
    # path("getCandidateCandidates", GetCandidateCandidates.as_view(), name="GetCandidateCandidates"),
    # path("getCandidateCandidates/<int:id>", GetCandidateCandidates.as_view(), name="GetCandidateCandidates"),

    # Candidate Candidate
    # path("getCandidateCandidates/<int:candidate_id>", GetCandidateCandidates.as_view(), name="getCandidateCandidates"),
<<<<<<< HEAD
    # path("addNewCandidateCandidate", AddNewCandidateCandidate.as_view(), name="AddNewCandidateCandidate"),
=======
    # path("addCandidateCandidate", AddCandidateCandidate.as_view(), name="AddCandidateCandidate"),
>>>>>>> sanad
    # path("deleteCandidateCandidate/<int:id>", DeleteCandidateCandidate.as_view(), name="DeleteCandidateCandidate"),
    # path("updateCandidateCandidate/<int:id>", UpdateCandidateCandidate.as_view(), name="UpdateCandidateCandidate"),


    path("getParties", GetParties.as_view(), name="GetParties"),
    path("getPartyDetails/<slug:slug>", GetPartyDetails.as_view(), name="GetPartyDetails"),
    path("getPartyDetails/<int:id>", GetPartyDetails.as_view(), name="GetPartyDetails"),
    path("addParty", AddParty.as_view(), name="AddParty"),
    path("deleteParty/<int:id>", DeleteParty.as_view(), name="DeleteParty"),
    path("updateParty/<int:id>", UpdateParty.as_view(), name="UpdateParty"),

]