<<<<<<< HEAD
import { call, put, takeEvery, all, fork } from "redux-saga/effects";
import axios from "axios";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Image Redux States
import {
  GET_IMAGE_s,
  UPLOAD_NEW_IMAGE,
  DELETE_IMAGE,
  UPDATE_IMAGE,
} from "./actionType";
import {
  ImageApiResponseSuccess,
  ImageApiResponseError,
  uploadImageSuccess,
  uploadImageFail,
  updateImageSuccess,
  updateImageFail,
  deleteImageSuccess,
  deleteImageFail,
} from "./action";

//Include Both Helper File with needed methods
import {
  getImages as getImagesApi,
  uploadNewImage,
  updateImage,
  deleteImage,
} from "../../helpers/backend_helper";

function* getImages() {
  try {
    const response = yield call(getImagesApi);
    yield put(ImageApiResponseSuccess(GET_IMAGE_s, response.data));
  } catch (error) {
    yield put(ImageApiResponseError(GET_IMAGE_s, error));
  }
}

// function* onUploadNewImage({ payload: formData }) {
//   try {
//     // Call the API function that uploads the image and pass the formData
//     const response = yield call(uploadNewImage, formData);

//     // Dispatch the uploadImageSuccess action with the received data
//     yield put(uploadImageSuccess(response.data));

//     toast.success("Image Added Successfully", { autoClose: 3000 });
//     return response; // <-- Add this line
//   } catch (error) {
//     yield put(uploadImageFail(error));
//     toast.error("Image Added Failed", { autoClose: 3000 });
//   }
// }


function* onUploadNewImage({ payload: formData }) {
  try {
    // Call the API function that uploads the image and pass the formData
    const response = yield call(uploadNewImage, formData);

    // Dispatch the uploadImageSuccess action with the received data
    yield put(uploadImageSuccess(response.data));

    // toast.success("Image Added Successfully", { autoClose: 3000 });

    // Return the response data
    return response.data;
  } catch (error) {
    yield put(uploadImageFail(error));
    // toast.error("Image Added Failed", { autoClose: 3000 });

    // Re-throw the error
    throw error;
  }
}



function* onDeleteImage({ payload: image }) {
  try {
    const response = yield call(deleteImage, image);
    yield put(deleteImageSuccess({ image, ...response }));
    toast.success("Image Delete Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(deleteImageFail(error));
    toast.error("Image Delete Failed", { autoClose: 3000 });
  }
}

function* onUpdateImage({ payload: image }) {
  try {
    const response = yield call(updateImage, image);
    yield put(updateImageSuccess(response));
    toast.success("Image Updated Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(updateImageFail(error));
    toast.error("Image Updated Failed", { autoClose: 3000 });
  }
}

export function* watchGetImages() {
  yield takeEvery(GET_IMAGE_s, getImages);
}

export function* watchUploadNewImage() {
  yield takeEvery(UPLOAD_NEW_IMAGE, onUploadNewImage);
}

export function* watchUpdateImage() {
  yield takeEvery(UPDATE_IMAGE, onUpdateImage);
}

export function* watchDeleteImage() {
  yield takeEvery(DELETE_IMAGE, onDeleteImage);
}

function* imageSaga() {
  yield all([
    fork(watchGetImages),
    fork(watchUploadNewImage),
    fork(watchUpdateImage),
    fork(watchDeleteImage),
  ]);
}

export default imageSaga;
=======
import { call, put, takeEvery, all, fork } from "redux-saga/effects";
import axios from "axios";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Image Redux States
import {
  GET_IMAGE_s,
  UPLOAD_NEW_IMAGE,
  DELETE_IMAGE,
  UPDATE_IMAGE,
} from "./actionType";
import {
  ImageApiResponseSuccess,
  ImageApiResponseError,
  uploadImageSuccess,
  uploadImageFail,
  updateImageSuccess,
  updateImageFail,
  deleteImageSuccess,
  deleteImageFail,
} from "./action";

//Include Both Helper File with needed methods
import {
  getImages as getImagesApi,
  uploadNewImage,
  updateImage,
  deleteImage,
} from "../../helpers/backend_helper";

function* getImages() {
  try {
    const response = yield call(getImagesApi);
    yield put(ImageApiResponseSuccess(GET_IMAGE_s, response.data));
  } catch (error) {
    yield put(ImageApiResponseError(GET_IMAGE_s, error));
  }
}

// function* onUploadNewImage({ payload: formData }) {
//   try {
//     // Call the API function that uploads the image and pass the formData
//     const response = yield call(uploadNewImage, formData);

//     // Dispatch the uploadImageSuccess action with the received data
//     yield put(uploadImageSuccess(response.data));

//     toast.success("Image Added Successfully", { autoClose: 3000 });
//     return response; // <-- Add this line
//   } catch (error) {
//     yield put(uploadImageFail(error));
//     toast.error("Image Added Failed", { autoClose: 3000 });
//   }
// }


function* onUploadNewImage({ payload: formData }) {
  try {
    // Call the API function that uploads the image and pass the formData
    const response = yield call(uploadNewImage, formData);
    // Dispatch the uploadImageSuccess action with the received data
    yield put(uploadImageSuccess(response.data));
    // toast.success("Image Added Successfully", { autoClose: 3000 });
    // Return the response data
    return response.data;
  } catch (error) {
    yield put(uploadImageFail(error));
    // toast.error("Image Added Failed", { autoClose: 3000 });

    // Re-throw the error
    // throw error;
  }
}



function* onDeleteImage({ payload: image }) {
  try {
    const response = yield call(deleteImage, image);
    yield put(deleteImageSuccess({ image, ...response }));
    toast.success("Image Delete Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(deleteImageFail(error));
    toast.error("Image Delete Failed", { autoClose: 3000 });
  }
}

function* onUpdateImage({ payload: image }) {
  try {
    const response = yield call(updateImage, image);
    yield put(updateImageSuccess(response));
    toast.success("Image Updated Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(updateImageFail(error));
    toast.error("Image Updated Failed", { autoClose: 3000 });
  }
}

export function* watchGetImages() {
  yield takeEvery(GET_IMAGE_s, getImages);
}

export function* watchUploadNewImage() {
  yield takeEvery(UPLOAD_NEW_IMAGE, onUploadNewImage);
}

export function* watchUpdateImage() {
  yield takeEvery(UPDATE_IMAGE, onUpdateImage);
}

export function* watchDeleteImage() {
  yield takeEvery(DELETE_IMAGE, onDeleteImage);
}

function* imageSaga() {
  yield all([
    fork(watchGetImages),
    fork(watchUploadNewImage),
    fork(watchUpdateImage),
    fork(watchDeleteImage),
  ]);
}

export default imageSaga;
>>>>>>> sanad
