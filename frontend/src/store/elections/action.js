import {
  // API Response
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,

  // Elections
  GET_ELECTIONS,
  ADD_ELECTION,
  ADD_ELECTION_SUCCESS,
  ADD_ELECTION_FAIL,
  UPDATE_ELECTION,
  UPDATE_ELECTION_SUCCESS,
  UPDATE_ELECTION_FAIL,
  DELETE_ELECTION,
  DELETE_ELECTION_SUCCESS,
  DELETE_ELECTION_FAIL,

  // Election Details
  GET_ELECTION_COUNT,
  GET_ELECTION_DETAILS,

  // Election Candidate
  GET_ELECTION_CANDIDATES,
  ADD_NEW_ELECTION_CANDIDATE,
  ADD_ELECTION_CANDIDATE_SUCCESS,
  ADD_ELECTION_CANDIDATE_FAIL,
  UPDATE_ELECTION_CANDIDATE,
  UPDATE_ELECTION_CANDIDATE_SUCCESS,
  UPDATE_ELECTION_CANDIDATE_FAIL,
  DELETE_ELECTION_CANDIDATE,
  DELETE_ELECTION_CANDIDATE_SUCCESS,
  DELETE_ELECTION_CANDIDATE_FAIL,


  // Election Campaign
  GET_ELECTION_CAMPAIGNS,
  ADD_NEW_ELECTION_CAMPAIGN,
  ADD_ELECTION_CAMPAIGN_SUCCESS,
  ADD_ELECTION_CAMPAIGN_FAIL,
  UPDATE_ELECTION_CAMPAIGN,
  UPDATE_ELECTION_CAMPAIGN_SUCCESS,
  UPDATE_ELECTION_CAMPAIGN_FAIL,
  DELETE_ELECTION_CAMPAIGN,
  DELETE_ELECTION_CAMPAIGN_SUCCESS,
  DELETE_ELECTION_CAMPAIGN_FAIL,
 
} from "./actionType";

// Election Success / Error
export const ElectionApiResponseSuccess = (actionType, data) => ({
  type: API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});

export const ElectionApiResponseError = (actionType, error) => ({
  type: API_RESPONSE_ERROR,
  payload: { actionType, error },
});


// Get Elections
export const getElections = () => ({
  type: GET_ELECTIONS,
});

export const getElectionCount = () => ({
  type: GET_ELECTION_COUNT,
});


// Election Details
export const getElectionDetails = (election) => ({
  type: GET_ELECTION_DETAILS,
  payload: election,
});



// Update Election
export const updateElection = (election) => ({
  type: UPDATE_ELECTION,
  payload: election,
});

export const updateElectionSuccess = (election) => ({
  type: UPDATE_ELECTION_SUCCESS,
  payload: election,
});

export const updateElectionFail = (error) => ({
  type: UPDATE_ELECTION_FAIL,
  payload: error,
});

// Add New Election
export const addElection = (election) => ({
  type: ADD_ELECTION,
  payload: election,
});

export const addElectionSuccess = (election) => ({
  type: ADD_ELECTION_SUCCESS,
  payload: election,
});

export const addElectionFail = (error) => ({
  type: ADD_ELECTION_FAIL,
  payload: error,
});


// Delete Election
export const deleteElection = (election) => ({
  type: DELETE_ELECTION,
  payload: election,
});

export const deleteElectionSuccess = (election) => ({
  type: DELETE_ELECTION_SUCCESS,
  payload: election,
});

export const deleteElectionFail = (error) => ({
  type: DELETE_ELECTION_FAIL,
  payload: error,
});

// ElectionCandidates
export const getElectionCandidates = (election) => ({
  type: GET_ELECTION_CANDIDATES,
  payload: election,
});

// Election Candidates
export const updateElectionCandidate = electionCandidate => ({
  type: UPDATE_ELECTION_CANDIDATE,
  payload: electionCandidate,
});
export const updateElectionCandidateSuccess = electionCandidate => ({
  type: UPDATE_ELECTION_CANDIDATE_SUCCESS,
  payload: electionCandidate,
});
export const updateElectionCandidateFail = error => ({
  type: UPDATE_ELECTION_CANDIDATE_FAIL,
  payload: error,
});

export const addNewElectionCandidate = electionCandidate => ({
  type: ADD_NEW_ELECTION_CANDIDATE,
  payload: electionCandidate,
});

export const addElectionCandidateSuccess = electionCandidate => ({
  type: ADD_ELECTION_CANDIDATE_SUCCESS,
  payload: electionCandidate,
});

export const addElectionCandidateFail = error => ({
  type: ADD_ELECTION_CANDIDATE_FAIL,
  payload: error,
});

export const deleteElectionCandidate = electionCandidate => ({
  type: DELETE_ELECTION_CANDIDATE,
  payload: electionCandidate,
});

export const deleteElectionCandidateSuccess = electionCandidate => ({
  type: DELETE_ELECTION_CANDIDATE_SUCCESS,
  payload: electionCandidate,
});

export const deleteElectionCandidateFail = error => ({
  type: DELETE_ELECTION_CANDIDATE_FAIL,
  payload: error,
});


// Election Campaigns
export const getElectionCampaigns = (election) => ({
  type: GET_ELECTION_CAMPAIGNS,
  payload: election,
});

// Election Campaigns
export const updateElectionCampaign = electionCampaign => ({
  type: UPDATE_ELECTION_CAMPAIGN,
  payload: electionCampaign,
});
export const updateElectionCampaignSuccess = electionCampaign => ({
  type: UPDATE_ELECTION_CAMPAIGN_SUCCESS,
  payload: electionCampaign,
});
export const updateElectionCampaignFail = error => ({
  type: UPDATE_ELECTION_CAMPAIGN_FAIL,
  payload: error,
});

export const addNewElectionCampaign = electionCampaign => ({
  type: ADD_NEW_ELECTION_CAMPAIGN,
  payload: electionCampaign,
});

export const addElectionCampaignSuccess = electionCampaign => ({
  type: ADD_ELECTION_CAMPAIGN_SUCCESS,
  payload: electionCampaign,
});

export const addElectionCampaignFail = error => ({
  type: ADD_ELECTION_CAMPAIGN_FAIL,
  payload: error,
});

export const deleteElectionCampaign = electionCampaign => ({
  type: DELETE_ELECTION_CAMPAIGN,
  payload: electionCampaign,
});

export const deleteElectionCampaignSuccess = electionCampaign => ({
  type: DELETE_ELECTION_CAMPAIGN_SUCCESS,
  payload: electionCampaign,
});

export const deleteElectionCampaignFail = error => ({
  type: DELETE_ELECTION_CAMPAIGN_FAIL,
  payload: error,
});
