<<<<<<< HEAD
import {
  GET_IMAGE_s,
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,

  UPLOAD_NEW_IMAGE,
  UPLOAD_IMAGE_SUCCESS,
  UPLOAD_IMAGE_FAIL,
  
  UPDATE_IMAGE,
  UPDATE_IMAGE_SUCCESS,
  UPDATE_IMAGE_FAIL,

  DELETE_IMAGE,
  DELETE_IMAGE_SUCCESS,
  DELETE_IMAGE_FAIL,
} from "./actionType";

// common success
export const ImageApiResponseSuccess = (actionType, data) => ({
  type: API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});
// common error
export const ImageApiResponseError = (actionType, error) => ({
  type: API_RESPONSE_ERROR,
  payload: { actionType, error },
});

export const getImages = () => ({
  type: GET_IMAGE_s,
});

export const updateImage = image => ({
  type: UPDATE_IMAGE,
  payload: image,
});

export const updateImageSuccess = image => ({
  type: UPDATE_IMAGE_SUCCESS,
  payload: image,
});

export const updateImageFail = error => ({
  type: UPDATE_IMAGE_FAIL,
  payload: error,
});

export const uploadNewImage = image => ({
  type: UPLOAD_NEW_IMAGE,
  payload: image,
});

export const uploadImageSuccess = image => ({
  type: UPLOAD_IMAGE_SUCCESS,
  payload: image,
});

export const uploadImageFail = error => ({
  type: UPLOAD_IMAGE_FAIL,
  payload: error,
});
export const deleteImage = image => ({
  type: DELETE_IMAGE,
  payload: image,
});

export const deleteImageSuccess = image => ({
  type: DELETE_IMAGE_SUCCESS,
  payload: image,
});

export const deleteImageFail = error => ({
  type: DELETE_IMAGE_FAIL,
  payload: error,
=======
import {
  GET_IMAGE_s,
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,

  UPLOAD_NEW_IMAGE,
  UPLOAD_IMAGE_SUCCESS,
  UPLOAD_IMAGE_FAIL,
  
  UPDATE_IMAGE,
  UPDATE_IMAGE_SUCCESS,
  UPDATE_IMAGE_FAIL,

  DELETE_IMAGE,
  DELETE_IMAGE_SUCCESS,
  DELETE_IMAGE_FAIL,
} from "./actionType";

// common success
export const ImageApiResponseSuccess = (actionType, data) => ({
  type: API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});
// common error
export const ImageApiResponseError = (actionType, error) => ({
  type: API_RESPONSE_ERROR,
  payload: { actionType, error },
});

export const getImages = () => ({
  type: GET_IMAGE_s,
});

export const updateImage = image => ({
  type: UPDATE_IMAGE,
  payload: image,
});

export const updateImageSuccess = image => ({
  type: UPDATE_IMAGE_SUCCESS,
  payload: image,
});

export const updateImageFail = error => ({
  type: UPDATE_IMAGE_FAIL,
  payload: error,
});

export const uploadNewImage = image => ({
  type: UPLOAD_NEW_IMAGE,
  payload: image,
});

export const uploadImageSuccess = image => ({
  type: UPLOAD_IMAGE_SUCCESS,
  payload: image,
});

export const uploadImageFail = error => ({
  type: UPLOAD_IMAGE_FAIL,
  payload: error,
});
export const deleteImage = image => ({
  type: DELETE_IMAGE,
  payload: image,
});

export const deleteImageSuccess = image => ({
  type: DELETE_IMAGE_SUCCESS,
  payload: image,
});

export const deleteImageFail = error => ({
  type: DELETE_IMAGE_FAIL,
  payload: error,
>>>>>>> sanad
});