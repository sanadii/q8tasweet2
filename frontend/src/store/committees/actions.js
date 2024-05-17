import {
    // API Response
    API_RESPONSE_SUCCESS,
    API_RESPONSE_ERROR,

    // Election Committee
    GET_ELECTION_COMMITTEES,
    ADD_NEW_ELECTION_COMMITTEE,
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
} from "./actionType";


// Committee Success / Error
export const ElectionApiResponseSuccess = (actionType, data) => ({
    type: API_RESPONSE_SUCCESS,
    payload: { actionType, data },
});

export const ElectionApiResponseError = (actionType, error) => ({
    type: API_RESPONSE_ERROR,
    payload: { actionType, error },
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

export const addNewElectionCommittee = electionCommittee => ({
    type: ADD_NEW_ELECTION_COMMITTEE,
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

