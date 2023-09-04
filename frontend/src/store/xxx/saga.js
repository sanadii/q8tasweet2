import { call, put, takeEvery, all, fork, take } from "redux-saga/effects";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// User Redux States
import {
  GET_USERS,
  GET_CURRENT_USER,
  GET_USER_DETAILS,
  GET_MODERATOR_USERS,

  ADD_NEW_USER,
  DELETE_USER,
  UPDATE_USER,
} from "./actionType";

import {
  UPLOAD_IMAGE_SUCCESS,
  UPLOAD_IMAGE_FAIL,
} from "../uploadImage/actionType";

import {
  // getUsers, getUserDetails, getUsersCount
  // API Response
  UserApiResponseSuccess,
  UserApiResponseError,
  getCurrentUser as getCurrentUserApi,
  getModeratorUsers as getModeratorUsersApi,

  // Users
  addNewUserSuccess,
  addNewUserFail,
  updateUserSuccess,
  updateUserFail,
  deleteUserSuccess,
  deleteUserFail,
} from "./action";

import { uploadNewImage } from "../uploadImage/action";

//Include Both Helper File with needed methods
import {
  getUsers as getUsersApi,
  getUserDetails as getUserDetailsApi,
  addNewUser,
  updateUser,
  deleteUser,
} from "../../helpers/backend_helper";

function* getUsers() {
  try {
    const response = yield call(getUsersApi);
    yield put(UserApiResponseSuccess(GET_USERS, response.data));
  } catch (error) {
    yield put(UserApiResponseError(GET_USERS, error));
  }
}


function* getUserDetails({ payload: user }) {
  try {
    const response = yield call(getUserDetailsApi, user);
    yield put(UserApiResponseSuccess(GET_USER_DETAILS, response.data));
  } catch (error) {
    yield put(UserApiResponseError(GET_USER_DETAILS, error));
  }
}

function* getModeratorUsers() {
  try {
    const response = yield call(getModeratorUsersApi);
    yield put(UserApiResponseSuccess(GET_MODERATOR_USERS, response.data));
  } catch (error) {
    yield put(UserApiResponseError(GET_MODERATOR_USERS, error));
  }
}


function* onAddNewUser({ payload: { user, formData } }) {
  try {
    // Check if formData contains an image
    if (formData && formData.get("image")) {
      // Dispatch the uploadNewImage action with the formData & Wait for the upload to succeed before proceeding
      yield put(uploadNewImage(formData));
      const { payload: uploadResponse } = yield take(UPLOAD_IMAGE_SUCCESS);

      // Replace backslashes in image URL with forward slashes & update the image field in user object with new url
      const formattedImageUrl = uploadResponse.url.replace(/\\/g, "/");
      const updatedUser = {
        ...user,
        image: formattedImageUrl,
      };

      // Call the API function to add a new user & Dispatch the addNewUserSuccess action with the received data
      const addNewUserResponse = yield call(addNewUser, updatedUser);
      yield put(addNewUserSuccess(addNewUserResponse));

      toast.success("User Added Successfully", { autoClose: 2000 });
    } else {
      // Call the API function to add a new user without uploading an image
      const addNewUserResponse = yield call(addNewUser, user);
      yield put(addNewUserSuccess(addNewUserResponse));

      toast.success("User Added Successfully", { autoClose: 2000 });
    }
  } catch (error) {
    yield put(addNewUserFail(error));
    toast.error("User Added Failed", { autoClose: 2000 });
  }
}


function* onDeleteUser({ payload: user }) {
  try {
    const response = yield call(deleteUser, user);
    yield put(deleteUserSuccess({ user, ...response }));
    toast.success("User Delete Successfully", { autoClose: 2000 });
  } catch (error) {
    yield put(deleteUserFail(error));
    toast.error("User Delete Failed", { autoClose: 2000 });
  }
}

function* onUpdateUser({ payload: { user, formData } }) {
  try {
    let uploadResponse;

    // Check if an image is selected (formData contains a selected file)
    if (formData && formData.get("image")) {
      // Dispatch the uploadNewImage action with the formData & Wait for the upload to succeed before proceeding
      yield put(uploadNewImage(formData));
      const action = yield take([UPLOAD_IMAGE_SUCCESS, UPLOAD_IMAGE_FAIL]);
      if (action.type === UPLOAD_IMAGE_SUCCESS) {
        uploadResponse = action.payload;
      } else {
        throw new Error("Image Upload Failed");
      }
    }

    // Replace backslashes in image URL with forward slashes & update the image field in the user object with the new URL
    const formattedImageUrl = uploadResponse?.url?.replace(/\\/g, "/");
    const updatedUser = {
      ...user,
      image: formattedImageUrl,
    };

    // Call the API function to update the user & Dispatch the updateUserSuccess action with the received data
    const updateUserResponse = yield call(updateUser, updatedUser);
    yield put(updateUserSuccess(updateUserResponse));

    toast.success("User Updated Successfully", { autoClose: 2000 });
  } catch (error) {
    yield put(updateUserFail(error));
    toast.error("User Updated Failed", { autoClose: 2000 });
  }
}

function* getCurrentUser({ payload: token }) {
  try {
    const response = yield call(getCurrentUserApi, token);
    yield put(UserApiResponseSuccess(GET_CURRENT_USER, response.data));
  } catch (error) {
    yield put(UserApiResponseError(GET_CURRENT_USER, error));
  }
}



// --------------- Watchers ---------------
export function* watchGetUsers() {
  yield takeEvery(GET_USERS, getUsers);
}

export function* watchAddNewUser() {
  yield takeEvery(ADD_NEW_USER, onAddNewUser);
}

export function* watchUpdateUser() {
  yield takeEvery(UPDATE_USER, onUpdateUser);
}

export function* watchDeleteUser() {
  yield takeEvery(DELETE_USER, onDeleteUser);
}

export function* watchGetUserDetails() {
  yield takeEvery(GET_USER_DETAILS, getUserDetails);
}

export function* watchGetCurrentUser() {
  yield takeEvery(GET_CURRENT_USER, getCurrentUser);
}
export function* watchGetModeratorUsers() {
  yield takeEvery(GET_MODERATOR_USERS, getModeratorUsers);
}



function* userSaga() {
  yield all([

    // Users
    fork(watchGetUsers),
    fork(watchAddNewUser),
    fork(watchUpdateUser),
    fork(watchDeleteUser),
    fork(watchGetUserDetails),

    fork(watchGetCurrentUser),
    fork(watchGetModeratorUsers),

  ]);
}

export default userSaga;
