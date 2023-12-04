import { call, put, takeEvery, all, fork, take } from "redux-saga/effects";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// User Redux States
import {
  GET_USERS,
  GET_USER_DETAILS,
  ADD_NEW_USER,
  DELETE_USER,
  UPDATE_USER_PROFILE,
  CHANGE_USER_PASSWORD,

  // Specific User(s)
  GET_CURRENT_USER,
  GET_MODERATOR_USERS,
  GET_CAMPAIGN_MODERATORS,
  GET_CAMPAIGN_SORTERS,
} from "./actionType";

import {
  UPLOAD_IMAGE_SUCCESS,
  UPLOAD_IMAGE_FAIL,
} from "../../uploadImage/actionType";

import {
  // getUsers,
  // getUserDetails,
  // API Response
  UserApiResponseSuccess,
  UserApiResponseError,

  // Users
  addNewUserSuccess,
  addNewUserFail,
  updateUserSuccess,
  updateUserFail,
  changeUserPasswordSuccess,
  changeUserPasswordFail,
  deleteUserSuccess,
  deleteUserFail,

  // // Specific User(s)
  // getModeratorUsers,
  // getCampaignModerators,
  // getCampaignSorters,
} from "./action";

import { uploadNewImage } from "../../uploadImage/action";

//Include Both Helper File with needed methods
import {
  getUsers as getUsersApi,
  getUserDetails as getUserDetailsApi,
  addNewUser,
  updateUser,
  changeUserPassword,
  deleteUser,

  // Specific User(s)
  getCurrentUser as getCurrentUserApi,
  getModeratorUsers as getModeratorUsersApi,
  getCampaignModerators as getCampaignModeratorsApi,
  getCampaignSorters as getCampaignSortersApi,
} from "helpers/backend_helper";

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

function* onAddNewUser({ payload: user }) {
  try {
    const response = yield call(addNewUser, user);
    yield put(addNewUserSuccess(response));
    toast.success("تم إضافة مستخدم بنجاح", { autoClose: 2000 });
  } catch (error) {
    yield put(addNewUserFail(error));
    toast.error("خطأ في إضافة مستخدم", { autoClose: 2000 });
  }
}

function* onUpdateUser({ payload: user }) {
  try {
    const response = yield call(updateUser, user);
    yield put(updateUserSuccess(response));
    toast.success("تم تحديث بيانات المستخدم بنجاح", { autoClose: 2000 });
  } catch (error) {
    yield put(updateUserFail(error));
    toast.error("خطأ في تحديث بيانات المستخدم", { autoClose: 2000 });
  }
}

function* onChangeUserPassword({ payload: user }) {
  try {
    const response = yield call(changeUserPassword, user);
    yield put(changeUserPasswordSuccess(response));
    toast.success("تم تحديث بيانات المستخدم بنجاح", {
      autoClose: 2000,
    });
  } catch (error) {
    console.error('Saga Error:', error); // Log any error that occurs
    yield put(changeUserPasswordFail(error));
    toast.error("خطأ في تحديث بيانات المستخدم", { autoClose: 2000 });
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




function* getCurrentUser({ payload: token }) {
  try {
    const response = yield call(getCurrentUserApi, token);
    yield put(UserApiResponseSuccess(GET_CURRENT_USER, response.data));
  } catch (error) {
    yield put(UserApiResponseError(GET_CURRENT_USER, error));
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

function* getCampaignModerators() {
  try {
    const response = yield call(getCampaignModeratorsApi);
    yield put(UserApiResponseSuccess(GET_CAMPAIGN_MODERATORS, response.data));
  } catch (error) {
    yield put(UserApiResponseError(GET_CAMPAIGN_MODERATORS, error));
  }
}

function* getCampaignSorters() {
  try {
    const response = yield call(getCampaignSortersApi);
    yield put(UserApiResponseSuccess(GET_CAMPAIGN_SORTERS, response.data));
  } catch (error) {
    yield put(UserApiResponseError(GET_CAMPAIGN_SORTERS, error));
  }
}



// Watchers
export function* watchGetUsers() {
  yield takeEvery(GET_USERS, getUsers);
}
export function* watchGetUserDetails() {
  yield takeEvery(GET_USER_DETAILS, getUserDetails);
}
export function* watchAddNewUser() {
  yield takeEvery(ADD_NEW_USER, onAddNewUser);
}
export function* watchUpdateUser() {
  yield takeEvery(UPDATE_USER_PROFILE, onUpdateUser);
}
export function* watchChangeUserPassword() {
  yield takeEvery(CHANGE_USER_PASSWORD, onChangeUserPassword);
}
export function* watchDeleteUser() {
  yield takeEvery(DELETE_USER, onDeleteUser);
}

// Specific User(s)
export function* watchGetCurrentUser() {
  yield takeEvery(GET_CURRENT_USER, getCurrentUser);
}
export function* watchGetModeratorUsers() {
  yield takeEvery(GET_MODERATOR_USERS, getModeratorUsers);
}
export function* watchGetCampaignModerators() {
  yield takeEvery(GET_CAMPAIGN_MODERATORS, getCampaignModerators);
}
export function* watchGetCampaignSorters() {
  yield takeEvery(GET_CAMPAIGN_SORTERS, getCampaignSorters);
}


function* userSaga() {
  yield all([
    // Users
    fork(watchGetUsers),
    fork(watchGetUserDetails),
    fork(watchAddNewUser),
    fork(watchUpdateUser),
    fork(watchChangeUserPassword),
    fork(watchDeleteUser),

    // UserCandidates
    fork(watchGetCurrentUser),
    fork(watchGetModeratorUsers),
    fork(watchGetCampaignModerators),
    fork(watchGetCampaignSorters),

  ]);
}

export default userSaga;
