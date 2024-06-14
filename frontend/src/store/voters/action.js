import {
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,
  GET_ALL_VOTERS,
  GET_VOTERS,
  UPDATE_VOTER,
  UPDATE_VOTER_SUCCESS,
  UPDATE_VOTER_FAIL,
  ADD_VOTER,
  ADD_VOTER_SUCCESS,
  ADD_VOTER_FAIL,
  DELETE_VOTER,
  DELETE_VOTER_SUCCESS,
  DELETE_VOTER_FAIL,
} from "./actionType";

// common success
export const votersApiResponseSuccess = (actionType, data) => ({
  type: API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});

// common error
export const votersApiResponseError = (actionType, error) => ({
  type: API_RESPONSE_ERROR,
  payload: { actionType, error },
});

export const getAllVoters = () => ({
  type: GET_ALL_VOTERS,
});

export const getElectors = (voter) => ({
  type: GET_VOTERS,
  payload: voter,
});

export const updateVoter = (voter) => ({
  type: UPDATE_VOTER,
  payload: voter,
});

export const updateVoterSuccess = (voter) => ({
  type: UPDATE_VOTER_SUCCESS,
  payload: voter,
});

export const updateVoterFail = (error) => ({
  type: UPDATE_VOTER_FAIL,
  payload: error,
});

export const addVoter = (voter) => ({
  type: ADD_VOTER,
  payload: voter,
});

export const addVoterSuccess = (voter) => ({
  type: ADD_VOTER_SUCCESS,
  payload: voter,
});

export const addVoterFail = (error) => ({
  type: ADD_VOTER_FAIL,
  payload: error,
});

export const deleteVoter = (voter) => ({
  type: DELETE_VOTER,
  payload: voter,
});

export const deleteVoterSuccess = (voter) => ({
  type: DELETE_VOTER_SUCCESS,
  payload: voter,
});

export const deleteVoterFail = (error) => ({
  type: DELETE_VOTER_FAIL,
  payload: error,
});
