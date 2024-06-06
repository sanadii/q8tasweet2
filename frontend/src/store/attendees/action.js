import {
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,
  
  GET_ALL_ATTENDEES,
  UPDATE_ATTENDEE,
  UPDATE_ATTENDEE_SUCCESS,
  UPDATE_ATTENDEE_FAIL,
  ADD_ATTENDEE,
  ADD_ATTENDEE_SUCCESS,
  ADD_ATTENDEE_FAIL,
  DELETE_ATTENDEE,
  DELETE_ATTENDEE_SUCCESS,
  DELETE_ATTENDEE_FAIL,
} from "./actionType";

// common success
export const attendeesApiResponseSuccess = (actionType, data) => ({
  type: API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});

// common error
export const attendeesApiResponseError = (actionType, error) => ({
  type: API_RESPONSE_ERROR,
  payload: { actionType, error },
});

export const getAllAttendees = () => ({
  type: GET_ALL_ATTENDEES,
});

export const updateAttendee = attendee => ({
  type: UPDATE_ATTENDEE,
  payload: attendee,
});

export const updateAttendeeSuccess = attendee => ({
  type: UPDATE_ATTENDEE_SUCCESS,
  payload: attendee,
});

export const updateAttendeeFail = error => ({
  type: UPDATE_ATTENDEE_FAIL,
  payload: error,
});

export const addAttendee = attendee => ({
  type: ADD_ATTENDEE,
  payload: attendee,
});

export const addAttendeeSuccess = attendee => ({
  type: ADD_ATTENDEE_SUCCESS,
  payload: attendee,
});

export const addAttendeeFail = error => ({
  type: ADD_ATTENDEE_FAIL,
  payload: error,
});

export const deleteAttendee = attendee => ({
  type: DELETE_ATTENDEE,
  payload: attendee,
});

export const deleteAttendeeSuccess = attendee => ({
  type: DELETE_ATTENDEE_SUCCESS,
  payload: attendee,
});

export const deleteAttendeeFail = error => ({
  type: DELETE_ATTENDEE_FAIL,
  payload: error,
});