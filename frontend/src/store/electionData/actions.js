import {
  // API Response
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,

  // ElectionDatas
  GET_ELECTION_DATA,
  ADD_ELECTION_DATA,
  ADD_ELECTION_DATA_SUCCESS,
  ADD_ELECTION_DATA_FAIL,
  UPDATE_ELECTION_DATA,
  UPDATE_ELECTION_DATA_SUCCESS,
  UPDATE_ELECTION_DATA_FAIL,
  DELETE_ELECTION_DATA,
  DELETE_ELECTION_DATA_SUCCESS,
  DELETE_ELECTION_DATA_FAIL,

  // ElectionData Details
  GET_ELECTION_DATA_DETAILS,
} from "./actionType";

// ElectionData Success / Error
export const ElectionDataApiResponseSuccess = (actionType, data) => ({
  type: API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});

export const ElectionDataApiResponseError = (actionType, error) => ({
  type: API_RESPONSE_ERROR,
  payload: { actionType, error },
});


// Get ElectionDatas
export const getElectionDatas = () => ({
  type: GET_ELECTION_DATA,
});


// ElectionData Details
export const getElectionDataDetails = (electionData) => ({
  type: GET_ELECTION_DATA_DETAILS,
  payload: electionData,
});


// Add  ElectionData
export const addElectionData = (electionData) => ({
  type: ADD_ELECTION_DATA,
  payload: electionData,
});

export const addElectionDataSuccess = (electionData) => ({
  type: ADD_ELECTION_DATA_SUCCESS,
  payload: electionData,
});

export const addElectionDataFail = (error) => ({
  type: ADD_ELECTION_DATA_FAIL,
  payload: error,
});



// Update ElectionData
// export const updateElectionDataSuccess = (electionData) => ({
//   type: UPDATE_ELECTION_DATA_SUCCESS,
//   payload: electionData,
// });

// export const updateElectionData = (electionData) => {
//   console.log("ElectionData in updateElectionData:", electionData);

//   return {
//     type: UPDATE_ELECTION_DATA,
//     payload: electionData,
//   };
// };

// Update ElectionData
export const updateElectionData = (electionData) => ({
  type: UPDATE_ELECTION_DATA,
  payload: electionData,
});

export const updateElectionDataSuccess = (electionData) => ({
  type: UPDATE_ELECTION_DATA_SUCCESS,
  payload: electionData,
});


export const updateElectionDataFail = (error) => ({
  type: UPDATE_ELECTION_DATA_FAIL,
  payload: error,
});

// Delete ElectionData
export const deleteElectionData = (electionData) => ({
  type: DELETE_ELECTION_DATA,
  payload: electionData,
});

export const deleteElectionDataSuccess = (electionData) => ({
  type: DELETE_ELECTION_DATA_SUCCESS,
  payload: electionData,
});

export const deleteElectionDataFail = (error) => ({
  type: DELETE_ELECTION_DATA_FAIL,
  payload: error,
});

