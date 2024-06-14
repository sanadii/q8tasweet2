import {
  // API Response
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,


  // Elections
  GET_ELECTIONS,
  GET_ELECTION_DETAILS,
  ADD_ELECTION,
  ADD_ELECTION_SUCCESS,
  ADD_ELECTION_FAIL,
  UPDATE_ELECTION,
  UPDATE_ELECTION_SUCCESS,
  UPDATE_ELECTION_FAIL,
  DELETE_ELECTION,
  DELETE_ELECTION_SUCCESS,
  DELETE_ELECTION_FAIL,
  UPLOAD_ELECTION_DATA,
  UPLOAD_ELECTION_DATA_SUCCESS,
  UPLOAD_ELECTION_DATA_FAIL,


  // Election Candidate
  GET_ELECTION_CANDIDATES,
<<<<<<< HEAD
  ADD_NEW_ELECTION_CANDIDATE,
=======
  ADD_ELECTION_CANDIDATE,
>>>>>>> sanad
  ADD_ELECTION_CANDIDATE_SUCCESS,
  ADD_TO_ELECTION_AFTER_CANDIDATE_SUCCESS,
  ADD_ELECTION_CANDIDATE_FAIL,
  UPDATE_ELECTION_CANDIDATE,
  UPDATE_ELECTION_CANDIDATE_SUCCESS,
  UPDATE_ELECTION_CANDIDATE_FAIL,
  DELETE_ELECTION_CANDIDATE,
  DELETE_ELECTION_CANDIDATE_SUCCESS,
  DELETE_ELECTION_CANDIDATE_FAIL,


  // Election party
  GET_ELECTION_PARTIES,
  ADD_ELECTION_PARTY,
  ADD_ELECTION_PARTY_SUCCESS,
  ADD_TO_ELECTION_AFTER_PARTY_SUCCESS,
  ADD_ELECTION_PARTY_FAIL,
  UPDATE_ELECTION_PARTY,
  UPDATE_ELECTION_PARTY_SUCCESS,
  UPDATE_ELECTION_PARTY_FAIL,
  DELETE_ELECTION_PARTY,
  DELETE_ELECTION_PARTY_SUCCESS,
  DELETE_ELECTION_PARTY_FAIL,


  // Election Party Candidate
  GET_ELECTION_PARTY_CANDIDATES,
  ADD_ELECTION_PARTY_CANDIDATE,
  ADD_ELECTION_PARTY_CANDIDATE_SUCCESS,
  ADD_TO_ELECTION_AFTER_PARTY_CANDIDATE_SUCCESS,
  ADD_ELECTION_PARTY_CANDIDATE_FAIL,
  UPDATE_ELECTION_PARTY_CANDIDATE,
  UPDATE_ELECTION_PARTY_CANDIDATE_SUCCESS,
  UPDATE_ELECTION_PARTY_CANDIDATE_FAIL,
  DELETE_ELECTION_PARTY_CANDIDATE,
  DELETE_ELECTION_PARTY_CANDIDATE_SUCCESS,
  DELETE_ELECTION_PARTY_CANDIDATE_FAIL,

  // Election Candidate Votes
  UPDATE_ELECTION_CANDIDATE_VOTES,
  UPDATE_ELECTION_CANDIDATE_VOTES_SUCCESS,
  UPDATE_ELECTION_CANDIDATE_VOTES_FAIL,

  // Election Committee
  GET_ELECTION_COMMITTEES,
<<<<<<< HEAD
  ADD_NEW_ELECTION_COMMITTEE,
=======
  ADD_ELECTION_COMMITTEE,
>>>>>>> sanad
  ADD_ELECTION_COMMITTEE_SUCCESS,
  ADD_ELECTION_COMMITTEE_FAIL,
  UPDATE_ELECTION_COMMITTEE,
  UPDATE_ELECTION_COMMITTEE_SUCCESS,
  UPDATE_ELECTION_COMMITTEE_FAIL,
  DELETE_ELECTION_COMMITTEE,
  DELETE_ELECTION_COMMITTEE_SUCCESS,
  DELETE_ELECTION_COMMITTEE_FAIL,

  // Election Committee
  UPDATE_ELECTION_RESULTS,
  UPDATE_ELECTION_RESULTS_SUCCESS,
  UPDATE_ELECTION_RESULTS_FAIL,

  // Election Campaign
  GET_ELECTION_CAMPAIGNS,
<<<<<<< HEAD
  ADD_NEW_ELECTION_CAMPAIGN,
=======
  ADD_CAMPAIGN,
>>>>>>> sanad
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
export const getElections = (view) => ({
  type: GET_ELECTIONS,
  payload: view,

});

// Election Details
export const getElectionDetails = (election, view) => ({
  type: GET_ELECTION_DETAILS,
  payload: election, view
});

// Upload Election Data
export const uploadElectionData = (election) => ({
  type: UPLOAD_ELECTION_DATA,
  payload: election,
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

<<<<<<< HEAD
export const addNewElectionCandidate = electionCandidate => ({
  type: ADD_NEW_ELECTION_CANDIDATE,
=======
export const addElectionCandidate = electionCandidate => ({
  type: ADD_ELECTION_CANDIDATE,
>>>>>>> sanad
  payload: electionCandidate,
});

export const addElectionCandidateSuccess = electionCandidate => ({
  type: ADD_ELECTION_CANDIDATE_SUCCESS,
  payload: electionCandidate,
});

export const addToElectionAfterCandidateSuccess = electionCandidate => ({
  type: ADD_TO_ELECTION_AFTER_CANDIDATE_SUCCESS,
  payload: electionCandidate,
});
export const addElectionCandidateFail = error => ({
  type: ADD_ELECTION_CANDIDATE_FAIL,
  payload: error,
});

export const updateElectionCandidate = electionCandidate => ({
  type: UPDATE_ELECTION_CANDIDATE,
  payload: electionCandidate,
});
<<<<<<< HEAD
export const updateElectionCandidateSuccess = electionCandidate => ({
=======
export const updateElectionCandidateSuccess = (electionCandidate) => ({
>>>>>>> sanad
  type: UPDATE_ELECTION_CANDIDATE_SUCCESS,
  payload: electionCandidate,
});
export const updateElectionCandidateFail = error => ({
  type: UPDATE_ELECTION_CANDIDATE_FAIL,
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

export const updateElectionCandidateVotes = (electionCandidateVotes) => ({
  type: 'UPDATE_ELECTION_CANDIDATE_VOTES',
  payload: electionCandidateVotes,
});

export const updateElectionCandidateVotesSuccess = (electionCandidateVotes) => ({

  type: 'UPDATE_ELECTION_CANDIDATE_VOTES_SUCCESS',
  payload: electionCandidateVotes,
});

export const updateElectionCandidateVotesFail = (error) => ({
  type: 'UPDATE_ELECTION_CANDIDATE_VOTES_FAIL',
  payload: error,
});


// Election Party
export const getElectionParties = (election) => ({
  type: GET_ELECTION_PARTIES,
  payload: election,
});

export const addElectionParty = electionParty => ({
  type: ADD_ELECTION_PARTY,
  payload: electionParty,
});

export const addElectionPartySuccess = electionParty => ({
  type: ADD_ELECTION_PARTY_SUCCESS,
  payload: electionParty,
});

export const addToElectionAfterPartySuccess = electionParty => ({
  type: ADD_TO_ELECTION_AFTER_PARTY_SUCCESS,
  payload: electionParty,
});
export const addElectionPartyFail = error => ({
  type: ADD_ELECTION_PARTY_FAIL,
  payload: error,
});

export const updateElectionParty = electionParty => ({
  type: UPDATE_ELECTION_PARTY,
  payload: electionParty,
});
export const updateElectionPartySuccess = electionParty => ({
  type: UPDATE_ELECTION_PARTY_SUCCESS,
  payload: electionParty,
});
export const updateElectionPartyFail = error => ({
  type: UPDATE_ELECTION_PARTY_FAIL,
  payload: error,
});

export const deleteElectionParty = electionParty => ({
  type: DELETE_ELECTION_PARTY,
  payload: electionParty,
});

export const deleteElectionPartySuccess = electionParty => ({
  type: DELETE_ELECTION_PARTY_SUCCESS,
  payload: electionParty,
});

export const deleteElectionPartyFail = error => ({
  type: DELETE_ELECTION_PARTY_FAIL,
  payload: error,
});

export const updateElectionPartyResults = (electionPartyResults) => ({
  type: 'UPDATE_ELECTION_PARTY_RESULTS',
  payload: electionPartyResults,
});

export const updateElectionPartyResultsSuccess = (electionPartyResults) => ({

  type: 'UPDATE_ELECTION_PARTY_RESULTS_SUCCESS',
  payload: electionPartyResults,
});

export const updateElectionPartyResultsFail = (error) => ({
  type: 'UPDATE_ELECTION_PARTY_RESULTS_FAIL',
  payload: error,
});


// Election Party Candidate
export const getElectionPartyCandidates = (election) => ({
  type: GET_ELECTION_PARTY_CANDIDATES,
  payload: election,
});

export const addElectionPartyCandidate = electionPartyCandidate => ({
  type: ADD_ELECTION_PARTY_CANDIDATE,
  payload: electionPartyCandidate,
});

export const addElectionPartyCandidateSuccess = electionPartyCandidate => ({
  type: ADD_ELECTION_PARTY_CANDIDATE_SUCCESS,
  payload: electionPartyCandidate,
});

export const addToElectionAfterPartyCandidateSuccess = electionPartyCandidate => ({
  type: ADD_TO_ELECTION_AFTER_PARTY_CANDIDATE_SUCCESS,
  payload: electionPartyCandidate,
});
export const addElectionPartyCandidateFail = error => ({
  type: ADD_ELECTION_PARTY_CANDIDATE_FAIL,
  payload: error,
});

export const updateElectionPartyCandidate = electionPartyCandidate => ({
  type: UPDATE_ELECTION_PARTY_CANDIDATE,
  payload: electionPartyCandidate,
});
export const updateElectionPartyCandidateSuccess = electionPartyCandidate => ({
  type: UPDATE_ELECTION_PARTY_CANDIDATE_SUCCESS,
  payload: electionPartyCandidate,
});
export const updateElectionPartyCandidateFail = error => ({
  type: UPDATE_ELECTION_PARTY_CANDIDATE_FAIL,
  payload: error,
});

export const deleteElectionPartyCandidate = electionPartyCandidate => ({
  type: DELETE_ELECTION_PARTY_CANDIDATE,
  payload: electionPartyCandidate,
});

export const deleteElectionPartyCandidateSuccess = electionPartyCandidate => ({
  type: DELETE_ELECTION_PARTY_CANDIDATE_SUCCESS,
  payload: electionPartyCandidate,
});

export const deleteElectionPartyCandidateFail = error => ({
  type: DELETE_ELECTION_PARTY_CANDIDATE_FAIL,
  payload: error,
});

export const updateElectionPartyCandidateVotes = (electionPartyCandidateVotes) => ({
  type: 'UPDATE_ELECTION_PARTY_CANDIDATE_VOTES',
  payload: electionPartyCandidateVotes,
});

export const updateElectionPartyCandidateVotesSuccess = (electionPartyCandidateVotes) => ({

  type: 'UPDATE_ELECTION_PARTY_CANDIDATE_VOTES_SUCCESS',
  payload: electionPartyCandidateVotes,
});

export const updateElectionPartyCandidateVotesFail = (error) => ({
  type: 'UPDATE_ELECTION_PARTY_CANDIDATE_VOTES_FAIL',
  payload: error,
});


// Election Committees
export const getElectionCommittees = (election) => ({
  type: GET_ELECTION_COMMITTEES,
  payload: election,
});

export const updateElectionCommittee = electionCommittee => ({
  type: UPDATE_ELECTION_COMMITTEE,
  payload: electionCommittee,
});
export const updateElectionCommitteeSuccess = electionCommittee => ({
  type: UPDATE_ELECTION_COMMITTEE_SUCCESS,
  payload: electionCommittee,
});
export const updateElectionCommitteeFail = error => ({
  type: UPDATE_ELECTION_COMMITTEE_FAIL,
  payload: error,
});

<<<<<<< HEAD
export const addNewElectionCommittee = electionCommittee => ({
  type: ADD_NEW_ELECTION_COMMITTEE,
=======
export const addElectionCommittee = electionCommittee => ({
  type: ADD_ELECTION_COMMITTEE,
>>>>>>> sanad
  payload: electionCommittee,
});

export const addElectionCommitteeSuccess = electionCommittee => ({
  type: ADD_ELECTION_COMMITTEE_SUCCESS,
  payload: electionCommittee,
});

export const addElectionCommitteeFail = error => ({
  type: ADD_ELECTION_COMMITTEE_FAIL,
  payload: error,
});

export const deleteElectionCommittee = electionCommittee => ({
  type: DELETE_ELECTION_COMMITTEE,
  payload: electionCommittee,
});

export const deleteElectionCommitteeSuccess = electionCommittee => ({
  type: DELETE_ELECTION_COMMITTEE_SUCCESS,
  payload: electionCommittee,
});

export const deleteElectionCommitteeFail = error => ({
  type: DELETE_ELECTION_COMMITTEE_FAIL,
  payload: error,
});

// Election Committee Results
export const updateElectionResults = electionResult => ({
  type: UPDATE_ELECTION_RESULTS,
  payload: electionResult,
});
export const updateElectionResultsSuccess = electionResult => ({
  type: UPDATE_ELECTION_RESULTS_SUCCESS,
  payload: electionResult,
});
export const updateElectionResultsFail = error => ({
  type: UPDATE_ELECTION_RESULTS_FAIL,
  payload: error,
});

<<<<<<< HEAD

// Election Campaigns
export const getElectionCampaigns = (election) => ({
  type: GET_ELECTION_CAMPAIGNS,
  payload: election,
});

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
=======
>>>>>>> sanad
