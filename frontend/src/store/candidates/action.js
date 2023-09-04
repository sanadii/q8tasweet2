import {
  // API Response
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,

  // Candidates
  GET_CANDIDATES,
  ADD_NEW_CANDIDATE,
  ADD_NEW_CANDIDATE_SUCCESS,
  ADD_NEW_CANDIDATE_FAIL,
  UPDATE_CANDIDATE,
  UPDATE_CANDIDATE_SUCCESS,
  UPDATE_CANDIDATE_FAIL,
  DELETE_CANDIDATE,
  DELETE_CANDIDATE_SUCCESS,
  DELETE_CANDIDATE_FAIL,

  // Candidate Details
  GET_CANDIDATE_COUNT,
  GET_CANDIDATE_DETAILS,

  // Candidate Candidate
  GET_CANDIDATE_CANDIDATES,
  ADD_NEW_CANDIDATE_CANDIDATE,
  ADD_NEW_CANDIDATE_CANDIDATE_SUCCESS,
  ADD_NEW_CANDIDATE_CANDIDATE_FAIL,
  UPDATE_CANDIDATE_CANDIDATE,
  UPDATE_CANDIDATE_CANDIDATE_SUCCESS,
  UPDATE_CANDIDATE_CANDIDATE_FAIL,
  DELETE_CANDIDATE_CANDIDATE,
  DELETE_CANDIDATE_CANDIDATE_SUCCESS,
  DELETE_CANDIDATE_CANDIDATE_FAIL,


  // Candidate Campaign
  GET_CANDIDATE_CAMPAIGNS,
  ADD_NEW_CANDIDATE_CAMPAIGN,
  ADD_NEW_CANDIDATE_CAMPAIGN_SUCCESS,
  ADD_NEW_CANDIDATE_CAMPAIGN_FAIL,
  UPDATE_CANDIDATE_CAMPAIGN,
  UPDATE_CANDIDATE_CAMPAIGN_SUCCESS,
  UPDATE_CANDIDATE_CAMPAIGN_FAIL,
  DELETE_CANDIDATE_CAMPAIGN,
  DELETE_CANDIDATE_CAMPAIGN_SUCCESS,
  DELETE_CANDIDATE_CAMPAIGN_FAIL,
 
} from "./actionType";

// Candidate Success / Error
export const CandidateApiResponseSuccess = (actionType, data) => ({
  type: API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});

export const CandidateApiResponseError = (actionType, error) => ({
  type: API_RESPONSE_ERROR,
  payload: { actionType, error },
});


// Get Candidates
export const getCandidates = () => ({
  type: GET_CANDIDATES,
});

export const getCandidateCount = () => ({
  type: GET_CANDIDATE_COUNT,
});


// Candidate Details
export const getCandidateDetails = (candidate) => ({
  type: GET_CANDIDATE_DETAILS,
  payload: candidate,
});



// Update Candidate
export const updateCandidate = (candidate) => ({
  type: UPDATE_CANDIDATE,
  payload: candidate,
});

export const updateCandidateSuccess = (candidate) => ({
  type: UPDATE_CANDIDATE_SUCCESS,
  payload: candidate,
});

export const updateCandidateFail = (error) => ({
  type: UPDATE_CANDIDATE_FAIL,
  payload: error,
});

// Add New Candidate
export const addNewCandidate = (candidate) => ({
  type: ADD_NEW_CANDIDATE,
  payload: candidate,
});

export const addNewCandidateSuccess = (candidate) => ({
  type: ADD_NEW_CANDIDATE_SUCCESS,
  payload: candidate,
});

export const addNewCandidateFail = (error) => ({
  type: ADD_NEW_CANDIDATE_FAIL,
  payload: error,
});


// Delete Candidate
export const deleteCandidate = (candidate) => ({
  type: DELETE_CANDIDATE,
  payload: candidate,
});

export const deleteCandidateSuccess = (candidate) => ({
  type: DELETE_CANDIDATE_SUCCESS,
  payload: candidate,
});

export const deleteCandidateFail = (error) => ({
  type: DELETE_CANDIDATE_FAIL,
  payload: error,
});

// CandidateElections
export const getCandidateElections = (candidate) => ({
  type: GET_CANDIDATE_CANDIDATES,
  payload: candidate,
});

// Candidate Candidates
export const updateCandidateElection = candidateElection => ({
  type: UPDATE_CANDIDATE_CANDIDATE,
  payload: candidateElection,
});
export const updateCandidateElectionSuccess = candidateElection => ({
  type: UPDATE_CANDIDATE_CANDIDATE_SUCCESS,
  payload: candidateElection,
});
export const updateCandidateElectionFail = error => ({
  type: UPDATE_CANDIDATE_CANDIDATE_FAIL,
  payload: error,
});

export const addNewCandidateElection = candidateElection => ({
  type: ADD_NEW_CANDIDATE_CANDIDATE,
  payload: candidateElection,
});

export const addNewCandidateElectionSuccess = candidateElection => ({
  type: ADD_NEW_CANDIDATE_CANDIDATE_SUCCESS,
  payload: candidateElection,
});

export const addNewCandidateElectionFail = error => ({
  type: ADD_NEW_CANDIDATE_CANDIDATE_FAIL,
  payload: error,
});

export const deleteCandidateElection = candidateElection => ({
  type: DELETE_CANDIDATE_CANDIDATE,
  payload: candidateElection,
});

export const deleteCandidateElectionSuccess = candidateElection => ({
  type: DELETE_CANDIDATE_CANDIDATE_SUCCESS,
  payload: candidateElection,
});

export const deleteCandidateElectionFail = error => ({
  type: DELETE_CANDIDATE_CANDIDATE_FAIL,
  payload: error,
});


// Candidate Campaigns
export const getCandidateCampaigns = (candidate) => ({
  type: GET_CANDIDATE_CAMPAIGNS,
  payload: candidate,
});

// Candidate Campaigns
export const updateCandidateCampaign = candidateCampaign => ({
  type: UPDATE_CANDIDATE_CAMPAIGN,
  payload: candidateCampaign,
});
export const updateCandidateCampaignSuccess = candidateCampaign => ({
  type: UPDATE_CANDIDATE_CAMPAIGN_SUCCESS,
  payload: candidateCampaign,
});
export const updateCandidateCampaignFail = error => ({
  type: UPDATE_CANDIDATE_CAMPAIGN_FAIL,
  payload: error,
});

export const addNewCandidateCampaign = candidateCampaign => ({
  type: ADD_NEW_CANDIDATE_CAMPAIGN,
  payload: candidateCampaign,
});

export const addNewCandidateCampaignSuccess = candidateCampaign => ({
  type: ADD_NEW_CANDIDATE_CAMPAIGN_SUCCESS,
  payload: candidateCampaign,
});

export const addNewCandidateCampaignFail = error => ({
  type: ADD_NEW_CANDIDATE_CAMPAIGN_FAIL,
  payload: error,
});

export const deleteCandidateCampaign = candidateCampaign => ({
  type: DELETE_CANDIDATE_CAMPAIGN,
  payload: candidateCampaign,
});

export const deleteCandidateCampaignSuccess = candidateCampaign => ({
  type: DELETE_CANDIDATE_CAMPAIGN_SUCCESS,
  payload: candidateCampaign,
});

export const deleteCandidateCampaignFail = error => ({
  type: DELETE_CANDIDATE_CAMPAIGN_FAIL,
  payload: error,
});
