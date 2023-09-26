# Campaign Urls

from django.urls import path
from .views import *

app_name = "restapi"

urlpatterns = [
        # Candidates
    path("getCandidates", GetCandidates.as_view(), name="GetCandidates"),
    path("addNewCandidate", AddNewCandidate.as_view(), name="AddNewCandidate"),
    path("deleteCandidate/<int:id>", DeleteCandidate.as_view(), name="DeleteCandidate"),
    path("updateCandidate/<int:id>", UpdateCandidate.as_view(), name="UpdateCandidate"),

    # Candidate Details
    # path("getCandidateDetails/<int:id>", GetCandidateDetails.as_view(), name="GetCandidateDetails"),
    # path("getCandidateCandidates", GetCandidateCandidates.as_view(), name="GetCandidateCandidates"),
    # path("getCandidateCandidates/<int:id>", GetCandidateCandidates.as_view(), name="GetCandidateCandidates"),

    # Candidate Candidates
    # path("getCandidateCandidates/<int:candidate_id>", GetCandidateCandidates.as_view(), name="getCandidateCandidates"),
    # path("addNewCandidateCandidate", AddNewCandidateCandidate.as_view(), name="AddNewCandidateCandidate"),
    # path("deleteCandidateCandidate/<int:id>", DeleteCandidateCandidate.as_view(), name="DeleteCandidateCandidate"),
    # path("updateCandidateCandidate/<int:id>", UpdateCandidateCandidate.as_view(), name="UpdateCandidateCandidate"),

]