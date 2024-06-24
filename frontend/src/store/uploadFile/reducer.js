import {
  UPLOAD_FILE,
  UPLOAD_FILE_LOADING,
  UPLOAD_FILE_SUCCESS,
  UPLOAD_FILE_FAILED,
  CANCEL_UPLOAD,
  SET_UPLOAD_PROGRESS,
} from "./actionType";

const INIT_STATE = {
  formState: "idle",
  progress: 0,
  message: "",
};

const uploadFile = (state = INIT_STATE, action) => {
  switch (action.type) {
    case UPLOAD_FILE:
      return {
        ...state,
        formState: "loading",
        message: "",
      };
    case UPLOAD_FILE_LOADING:
      return {
        ...state,
        formState: "loading",
        message: "",
      };
    case UPLOAD_FILE_SUCCESS:
      return {
        ...state,
        formState: "idle",
        message: UPLOAD_SUCCESS,
      };
    case UPLOAD_FILE_FAILED:
      return {
        ...state,
        formState: "idle",
        message: action.payload,
      };
    case CANCEL_UPLOAD:
      return {
        ...state,
        formState: "idle",
        message: "",
      };
    case SET_UPLOAD_PROGRESS:
      return {
        ...state,
        progress: action.payload,
      };
    default:
      return state;
  }
};

export default uploadFile;
