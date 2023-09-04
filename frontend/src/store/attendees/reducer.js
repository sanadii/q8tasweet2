import {
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,

  GET_ALL_ATTENDEES,
  ADD_ATTENDEE_SUCCESS,
  ADD_ATTENDEE_FAIL,
  UPDATE_ATTENDEE_SUCCESS,
  UPDATE_ATTENDEE_FAIL,
  DELETE_ATTENDEE_SUCCESS,
  DELETE_ATTENDEE_FAIL,
} from "./actionType";

const initialState = {
  attendees: [],
  subAttendees: [],
  error: {},
};

const Attendees = (state = initialState, action) => {

  switch (action.type) {
    case API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {

        case GET_ALL_ATTENDEES:
          return {
            ...state,
            attendees: action.payload.data.attendees,
            subAttendees: action.payload.data.subAttendees,
          };
        default:
          return { ...state };
      }
    case API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case GET_ALL_ATTENDEES:
          return {
            ...state,
            error: action.payload.error,
          };
        default:
          return { ...state };
      }

    case ADD_ATTENDEE_SUCCESS:
      return {
        ...state,
        attendeeList: [...state.attendeeList, action.payload],
      };

    case ADD_ATTENDEE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_ATTENDEE_SUCCESS:
      return {
        ...state,
        attendeeList: state.attendeeList.map(attendee =>
          attendee.id.toString() === action.payload.id.toString()
            ? { ...attendee, ...action.payload }
            : attendee
        ),
      };

    case UPDATE_ATTENDEE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_ATTENDEE_SUCCESS:
      return {
        ...state,
        attendeeList: state.attendeeList.filter(
          attendee => attendee.id.toString() !== action.payload.id.toString()
        ),
      };

    case DELETE_ATTENDEE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return { ...state };
  }
};

export default Attendees;