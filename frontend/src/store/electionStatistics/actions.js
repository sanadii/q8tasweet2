import {
  // API Response
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,

  // Database
  ADD_ELECTION_DATABASE,
  ADD_ELECTION_DATABASE_SUCCESS,
  ADD_ELECTION_DATABASE_FAIL,


  // ElectionStatistics
  GET_ELECTION_STATISTICS,
  GET_ELECTORS_BY_FAMILY,

} from "./actionType";



// Election Committee Results
export const addElectionDatabase = electionDatabase => ({
  type: ADD_ELECTION_DATABASE,
  payload: electionDatabase,
});
export const addElectionDatabaseSuccess = electionDatabase => ({
  type: ADD_ELECTION_DATABASE_SUCCESS,
  payload: electionDatabase,
});
export const addElectionDatabaseFail = error => ({
  type: ADD_ELECTION_DATABASE_FAIL,
  payload: error,
});


// ElectionStatistic Success / Error
export const ElectionDatabaseApiResponseSuccess = (actionType, data) => ({
  type: API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});

export const ElectionDatabaseApiResponseError = (actionType, error) => ({
  type: API_RESPONSE_ERROR,
  payload: { actionType, error },
});

// Get ElectionStatistics
export const getElectionStatistics = (election) => ({
  type: GET_ELECTION_STATISTICS,
  payload: election
});

export const getElectorsByFamily = (electors) => ({
  type: GET_ELECTORS_BY_FAMILY,
  payload: electors
});

