import {
  // API Response
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,

  // Parties
  GET_PARTIES,
  ADD_PARTY,
  ADD_PARTY_SUCCESS,
  ADD_PARTY_FAIL,
  UPDATE_PARTY,
  UPDATE_PARTY_SUCCESS,
  UPDATE_PARTY_FAIL,
  DELETE_PARTY,
  DELETE_PARTY_SUCCESS,
  DELETE_PARTY_FAIL,

  // Party Details
  GET_PARTY_DETAILS,
} from "./actionType";

// Party Success / Error
export const PartyApiResponseSuccess = (actionType, data) => ({
  type: API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});

export const PartyApiResponseError = (actionType, error) => ({
  type: API_RESPONSE_ERROR,
  payload: { actionType, error },
});


// Get Parties
export const getParties = () => ({
  type: GET_PARTIES,
});


// Party Details
export const getPartyDetails = (electioParty) => ({
  type: GET_PARTY_DETAILS,
  payload: electioParty,
});


// Add New Party
export const addParty = (electioParty) => ({
  type: ADD_PARTY,
  payload: electioParty,
});

export const addPartySuccess = (electioParty) => ({
  type: ADD_PARTY_SUCCESS,
  payload: electioParty,
});

export const addPartyFail = (error) => ({
  type: ADD_PARTY_FAIL,
  payload: error,
});


// Update Party
export const updateParty = (electioParty) => ({
  type: UPDATE_PARTY,
  payload: electioParty,
});

export const updatePartySuccess = (electioParty) => ({
  type: UPDATE_PARTY_SUCCESS,
  payload: electioParty,
});


export const updatePartyFail = (error) => ({
  type: UPDATE_PARTY_FAIL,
  payload: error,
});

// Delete Party
export const deleteParty = (electioParty) => ({
  type: DELETE_PARTY,
  payload: electioParty,
});

export const deletePartySuccess = (electioParty) => ({
  type: DELETE_PARTY_SUCCESS,
  payload: electioParty,
});

export const deletePartyFail = (error) => ({
  type: DELETE_PARTY_FAIL,
  payload: error,
});

