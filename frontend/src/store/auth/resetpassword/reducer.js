import {
  RESET_PASSWORD,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_ERROR,
} from "./actionTypes";

const initialState = {
  loading: false,
  resetPasswordSuccessMsg: null,
  resetPasswordError: null,
};

const forgetPassword = (state = initialState, action) => {
  switch (action.type) {
    case RESET_PASSWORD:
      state = {
        ...state, loading: true,
        resetPasswordSuccessMsg: null,
        resetPasswordError: null,
      };
      break;
    case RESET_PASSWORD_SUCCESS:
      return { ...state, loading: false, resetPasswordSuccessMsg: action.payload, };
    case RESET_PASSWORD_ERROR:
      return { ...state, loading: false, resetPasswordError: action.payload };
    default:
      state = { ...state };
      break;
  }
  return state;
};

export default forgetPassword;
