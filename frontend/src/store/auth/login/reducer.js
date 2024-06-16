import {
  LOGIN_USER,
  LOGIN_SUCCESS,
  LOGOUT_USER,
  LOGOUT_USER_SUCCESS,
  API_ERROR,
  RESET_LOGIN_FLAG
} from "./actionTypes";

const initialState = {
  errorMsg: "",
  loading: false,
  error: false,
};

const login = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_USER:
      state = {
        ...state,
        loading: true,
        error: false,
      };
      break;
    case LOGIN_SUCCESS:
      state = {
        ...state,
        loading: false,
        error: false,
      };
      break;
    case LOGOUT_USER:
<<<<<<< HEAD
      state = { ...state, isUserLogout: false };
      break;
    case LOGOUT_USER_SUCCESS:
      state = { ...state, isUserLogout: true };
=======
      state = {
        ...state,
        loading: true,
        error: false,
      };
      break;
    case LOGOUT_USER_SUCCESS:
      state = { ...state, isUserLogout: false };
>>>>>>> sanad
      break;
    case API_ERROR:
      state = {
        ...state,
<<<<<<< HEAD
        errorMsg: action.payload.data,
        loading: true,
=======
        errorMsg: action.payload,
        loading: false,
>>>>>>> sanad
        error: true,
        isUserLogout: false,
      };
      break;
    case RESET_LOGIN_FLAG:
      state = {
        ...state,
        errorMsg: null,
        loading: false,
        error: false,
      };
      break;
    default:
      state = { ...state };
      break;
  }
  return state;
};

export default login;
