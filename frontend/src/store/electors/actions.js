import {
  // API Response
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,

  // Database
  GET_ELECTORS,
  ADD_ELECTOR,
  ADD_ELECTOR_SUCCESS,
  ADD_ELECTOR_FAIL,


  // ElectionStatistics
  GET_ELECTOR_STATISTICS,
  GET_ELECTORS_BY_FAMILY,

} from "./actionType";



// Election Committee Results
export const getElectors = (voter) => ({
  type: GET_ELECTORS,
  payload: voter,
});
export const addElector = elector => ({
  type: ADD_ELECTOR,
  payload: elector,
});
export const addElectorSuccess = elector => ({
  type: ADD_ELECTOR_SUCCESS,
  payload: elector,
});
export const addElectorFail = error => ({
  type: ADD_ELECTOR_FAIL,
  payload: error,
});


// ElectionStatistic Success / Error
export const ElectorApiResponseSuccess = (actionType, data) => ({
  type: API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});

export const ElectorApiResponseError = (actionType, error) => ({
  type: API_RESPONSE_ERROR,
  payload: { actionType, error },
});

// Get ElectionStatistics
export const getElectorStatistics = (election) => ({
  type: GET_ELECTOR_STATISTICS,
  payload: election
});

export const getElectorsByFamily = (electors) => ({
  type: GET_ELECTORS_BY_FAMILY,
  payload: electors
});
