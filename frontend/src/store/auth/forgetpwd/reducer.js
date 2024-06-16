import {
  FORGET_PASSWORD,
  FORGET_PASSWORD_SUCCESS,
  FORGET_PASSWORD_ERROR,
} from "./actionTypes";

const initialState = {
<<<<<<< HEAD
=======
  loading: false,
>>>>>>> sanad
  forgetSuccessMsg: null,
  forgetError: null,
};

const forgetPassword = (state = initialState, action) => {
  switch (action.type) {
    case FORGET_PASSWORD:
      state = {
<<<<<<< HEAD
        ...state,
=======
        ...state, loading: true,
>>>>>>> sanad
        forgetSuccessMsg: null,
        forgetError: null,
      };
      break;
    case FORGET_PASSWORD_SUCCESS:
      state = {
<<<<<<< HEAD
        ...state,
=======
        ...state, loading: false,
>>>>>>> sanad
        forgetSuccessMsg: action.payload,
      };
      break;
    case FORGET_PASSWORD_ERROR:
<<<<<<< HEAD
      state = { ...state, forgetError: action.payload };
=======
      state = { ...state, loading: false, forgetError: action.payload };
>>>>>>> sanad
      break;
    default:
      state = { ...state };
      break;
  }
  return state;
};

export default forgetPassword;
