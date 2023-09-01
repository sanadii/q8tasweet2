import {
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,
  GET_ALL_ELECTORS,
  GET_ELECTORS,
  UPDATE_ELECTOR,
  UPDATE_ELECTOR_SUCCESS,
  UPDATE_ELECTOR_FAIL,
  ADD_NEW_ELECTOR,
  ADD_ELECTOR_SUCCESS,
  ADD_ELECTOR_FAIL,
  DELETE_ELECTOR,
  DELETE_ELECTOR_SUCCESS,
  DELETE_ELECTOR_FAIL,
} from "./actionType";

// common success
export const electorsApiResponseSuccess = (actionType, data) => ({
  type: API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});

// common error
export const electorsApiResponseError = (actionType, error) => ({
  type: API_RESPONSE_ERROR,
  payload: { actionType, error },
});

export const getAllElectors = () => ({
  type: GET_ALL_ELECTORS,
});

export const getElectors = (elector) => ({
  type: GET_ELECTORS,
  payload: elector,
});

export const updateElector = (elector) => ({
  type: UPDATE_ELECTOR,
  payload: elector,
});

export const updateElectorSuccess = (elector) => ({
  type: UPDATE_ELECTOR_SUCCESS,
  payload: elector,
});

export const updateElectorFail = (error) => ({
  type: UPDATE_ELECTOR_FAIL,
  payload: error,
});

export const addNewElector = (elector) => ({
  type: ADD_NEW_ELECTOR,
  payload: elector,
});

export const addElectorSuccess = (elector) => ({
  type: ADD_ELECTOR_SUCCESS,
  payload: elector,
});

export const addElectorFail = (error) => ({
  type: ADD_ELECTOR_FAIL,
  payload: error,
});

export const deleteElector = (elector) => ({
  type: DELETE_ELECTOR,
  payload: elector,
});

export const deleteElectorSuccess = (elector) => ({
  type: DELETE_ELECTOR_SUCCESS,
  payload: elector,
});

export const deleteElectorFail = (error) => ({
  type: DELETE_ELECTOR_FAIL,
  payload: error,
});
