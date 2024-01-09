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
export const getPartyDetails = (party) => ({
  type: GET_PARTY_DETAILS,
  payload: party,
});


// Add New Party
export const addParty = (party) => ({
  type: ADD_PARTY,
  payload: party,
});

export const addPartySuccess = (party) => ({
  type: ADD_PARTY_SUCCESS,
  payload: party,
});

export const addPartyFail = (error) => ({
  type: ADD_PARTY_FAIL,
  payload: error,
});



// Update Party
// export const updatePartySuccess = (party) => ({
//   type: UPDATE_PARTY_SUCCESS,
//   payload: party,
// });

// export const updateParty = (party) => {
//   console.log("Party in updateParty:", party);

//   return {
//     type: UPDATE_PARTY,
//     payload: party,
//   };
// };

// Update Party
export const updateParty = (party) => ({
  type: UPDATE_PARTY,
  payload: party,
});

export const updatePartySuccess = (party) => ({
  type: UPDATE_PARTY_SUCCESS,
  payload: party,
});


export const updatePartyFail = (error) => ({
  type: UPDATE_PARTY_FAIL,
  payload: error,
});

// Delete Party
export const deleteParty = (party) => ({
  type: DELETE_PARTY,
  payload: party,
});

export const deletePartySuccess = (party) => ({
  type: DELETE_PARTY_SUCCESS,
  payload: party,
});

export const deletePartyFail = (error) => ({
  type: DELETE_PARTY_FAIL,
  payload: error,
});

