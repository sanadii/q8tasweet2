<<<<<<< HEAD
import {
  UPLOAD_FILE,
  UPLOAD_FILE_LOADING,
  UPLOAD_FILE_SUCCESS,
  UPLOAD_FILE_FAILED,
  CANCEL_UPLOAD,
  SET_UPLOAD_PROGRESS,
} from "./actionType";

export const uploadFile = () => ({
  type: UPLOAD_FILE,
});

export const uploadFileLoading = () => ({
  type: UPLOAD_FILE_LOADING,
});

export const uploadFileSuccess = () => ({
  type: UPLOAD_FILE_SUCCESS,
});

export const uploadFileFailed = () => ({
  type: UPLOAD_FILE_FAILED,
});

export const cancelUpload = () => ({
  type: CANCEL_UPLOAD,
});

export const setUploadProgress = (progress) => ({
  type: SET_UPLOAD_PROGRESS,
  payload: progress,
});
=======
import {
  UPLOAD_FILE,
  UPLOAD_FILE_LOADING,
  UPLOAD_FILE_SUCCESS,
  UPLOAD_FILE_FAILED,
  CANCEL_UPLOAD,
  SET_UPLOAD_PROGRESS,
} from "./actionType";

export const uploadFile = () => ({
  type: UPLOAD_FILE,
});

export const uploadFileLoading = () => ({
  type: UPLOAD_FILE_LOADING,
});

export const uploadFileSuccess = () => ({
  type: UPLOAD_FILE_SUCCESS,
});

export const uploadFileFailed = () => ({
  type: UPLOAD_FILE_FAILED,
});

export const cancelUpload = () => ({
  type: CANCEL_UPLOAD,
});

export const setUploadProgress = (progress) => ({
  type: SET_UPLOAD_PROGRESS,
  payload: progress,
});
>>>>>>> sanad
