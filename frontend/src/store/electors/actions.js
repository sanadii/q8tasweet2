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
  GET_ELECTORS_BY_ALL,
  GET_ELECTORS_BY_CATEGORY,
  GET_ELECTORS_BY_SEARCH,
  GET_ELECTOR_RELATED_ELECTORS,
  
} from "./actionType";



// Election Committee Results
export const getElectors = (elector) => ({
  type: GET_ELECTORS,
  payload: elector,
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
// Get ElectionStatistics
export const getElectorsByAll = (election) => {
  console.log("getElectorsByAll called with:", election);
  return {
    type: GET_ELECTORS_BY_ALL,
    payload: election
  };
};


export const getElectorsByCategory = (elector) => ({
  type: GET_ELECTORS_BY_CATEGORY,
  payload: elector,
});


export const getElectorsBySearch = elector => ({
  type: GET_ELECTORS_BY_SEARCH,
  payload: elector
});


export const getElectorRelatedElectors = (elector) => ({
  type: GET_ELECTOR_RELATED_ELECTORS,
  payload: elector,
});
