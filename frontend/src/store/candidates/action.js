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
  GET_CANDIDATE_DETAILS,
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

export const updateCandidateSuccess = (candidate, candidateId) => ({
  type: UPDATE_CANDIDATE_SUCCESS,
  payload: candidate, candidateId
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

