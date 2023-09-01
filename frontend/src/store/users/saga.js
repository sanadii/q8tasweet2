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

  // User Candidates
  GET_USER_CANDIDATES,
  ADD_NEW_USER_CANDIDATE,
  DELETE_USER_CANDIDATE,
  UPDATE_USER_CANDIDATE,
  // GET_USER_CANDIDATE_DETAILS,

  // User Campaign
  GET_USER_CAMPAIGNS,
  ADD_NEW_USER_CAMPAIGN,
  DELETE_USER_CAMPAIGN,
  UPDATE_USER_CAMPAIGN,
  // GET_USER_CAMPAIGN_DETAILS,
} from "./actionType";

import {
  UPLOAD_IMAGE_SUCCESS,
  UPLOAD_IMAGE_FAIL,
} from "../uploadImage/actionType";

import {
  // getUsers, getUserDetails,
  // API Response
  UserApiResponseSuccess,
  UserApiResponseError,

  // Users
  addNewUserSuccess,
  addNewUserFail,
  updateUserSuccess,
  updateUserFail,
  deleteUserSuccess,
  deleteUserFail,

  // User Candidates
  addNewUserCandidateSuccess,
  addNewUserCandidateFail,
  updateUserCandidateSuccess,
  updateUserCandidateFail,
  deleteUserCandidateSuccess,
  deleteUserCandidateFail,

  // User Campaigns
  addNewUserCampaignSuccess,
  addNewUserCampaignFail,
  updateUserCampaignSuccess,
  updateUserCampaignFail,
  deleteUserCampaignSuccess,
  deleteUserCampaignFail,
} from "./action";

import { uploadNewImage } from "../uploadImage/action";

//Include Both Helper File with needed methods
import {
  getUsers as getUsersApi,
  getCurrentUser as getCurrentUserApi,
  getUserDetails as getUserDetailsApi,
  getModeratorUsers as getModeratorUsersApi,
  addNewUser,
  updateUser,
  deleteUser,

  // User Candidates
  getUserCandidates as getUserCandidatesApi,
  // getUserCandidateDetails as getUserCandidateDetailsApi,
  addNewUserCandidate,
  updateUserCandidate,
  deleteUserCandidate,

  // User Campaigns
  getUserCampaigns as getUserCampaignsApi,
  // getUserCampaignDetails as getUserCampaignDetailsApi,
  addNewUserCampaign,
  updateUserCampaign,
  deleteUserCampaign,
} from "../../helpers/backend_helper";

function* getUsers() {
  try {
    const response = yield call(getUsersApi);
    yield put(UserApiResponseSuccess(GET_USERS, response.data));
  } catch (error) {
    yield put(UserApiResponseError(GET_USERS, error));
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
    // Call the API function to add a new user & Dispatch the addNewUserSuccess action with the received data
    const addNewUserResponse = yield call(addNewUser, formData);
    yield put(addNewUserSuccess(addNewUserResponse));

    toast.success("User Added Successfully", { autoClose: 2000 });
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

// User Candidates
function* getUserCandidates({ payload: user }) {
  try {
    const response = yield call(getUserCandidatesApi, user);
    yield put(UserApiResponseSuccess(GET_USER_CANDIDATES, response.data));
  } catch (error) {
    yield put(UserApiResponseError(GET_USER_CANDIDATES, error));
  }
}

function* onAddNewUserCandidate({ payload: userCandidate }) {
  try {
    const response = yield call(addNewUserCandidate, userCandidate);
    yield put(addNewUserCandidateSuccess(response));
    toast.success("UserCandidate Added Successfully", { autoClose: 2000 });
  } catch (error) {
    yield put(addNewUserCandidateFail(error));
    toast.error("UserCandidate Added Failed", { autoClose: 2000 });
  }
}

function* onDeleteUserCandidate({ payload: userCandidate }) {
  try {
    const response = yield call(deleteUserCandidate, userCandidate);
    yield put(deleteUserCandidateSuccess({ userCandidate, ...response }));
    toast.success("UserCandidate Delete Successfully", { autoClose: 2000 });
  } catch (error) {
    yield put(deleteUserCandidateFail(error));
    toast.error("UserCandidate Delete Failed", { autoClose: 2000 });
  }
}

function* onUpdateUserCandidate({ payload: userCandidate }) {
  try {
    const response = yield call(updateUserCandidate, userCandidate);
    yield put(updateUserCandidateSuccess(response));
    toast.success("UserCandidate Updated Successfully", {
      autoClose: 2000,
    });
  } catch (error) {
    yield put(updateUserCandidateFail(error));
    toast.error("UserCandidate Updated Failed", { autoClose: 2000 });
  }
}

// User Campaigns
function* getUserCampaigns({ payload: user }) {
  try {
    const response = yield call(getUserCampaignsApi, user);
    yield put(UserApiResponseSuccess(GET_USER_CAMPAIGNS, response.data));
  } catch (error) {
    yield put(UserApiResponseError(GET_USER_CAMPAIGNS, error));
  }
}

function* onAddNewUserCampaign({ payload: userCampaign }) {
  try {
    const response = yield call(addNewUserCampaign, userCampaign);
    yield put(addNewUserCampaignSuccess(response));
    toast.success("UserCampaign Added Successfully", { autoClose: 2000 });
  } catch (error) {
    yield put(addNewUserCampaignFail(error));
    toast.error("UserCampaign Added Failed", { autoClose: 2000 });
  }
}

function* onDeleteUserCampaign({ payload: userCampaign }) {
  try {
    const response = yield call(deleteUserCampaign, userCampaign);
    yield put(deleteUserCampaignSuccess({ userCampaign, ...response }));
    toast.success("UserCampaign Delete Successfully", { autoClose: 2000 });
  } catch (error) {
    yield put(deleteUserCampaignFail(error));
    toast.error("UserCampaign Delete Failed", { autoClose: 2000 });
  }
}

function* onUpdateUserCampaign({ payload: userCampaign }) {
  try {
    const response = yield call(updateUserCampaign, userCampaign);
    yield put(updateUserCampaignSuccess(response));
    toast.success("UserCampaign Updated Successfully", {
      autoClose: 2000,
    });
  } catch (error) {
    yield put(updateUserCampaignFail(error));
    toast.error("UserCampaign Updated Failed", { autoClose: 2000 });
  }
}

// Watchers
export function* watchGetUsers() {
  yield takeEvery(GET_USERS, getUsers);
}
export function* watchGetCurrentUser() {
  yield takeEvery(GET_CURRENT_USER, getCurrentUser);
}
export function* watchGetUserDetails() {
  yield takeEvery(GET_USER_DETAILS, getUserDetails);
}
export function* watchGetModeratorUsers() {
  yield takeEvery(GET_MODERATOR_USERS, getModeratorUsers);
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

// User Candidates Watchers
export function* watchGetUserCandidates() {
  yield takeEvery(GET_USER_CANDIDATES, getUserCandidates);
}

export function* watchAddNewUserCandidate() {
  yield takeEvery(ADD_NEW_USER_CANDIDATE, onAddNewUserCandidate);
}

export function* watchUpdateUserCandidate() {
  yield takeEvery(UPDATE_USER_CANDIDATE, onUpdateUserCandidate);
}

export function* watchDeleteUserCandidate() {
  yield takeEvery(DELETE_USER_CANDIDATE, onDeleteUserCandidate);
}

// User Campaigns Watchers
export function* watchGetUserCampaigns() {
  yield takeEvery(GET_USER_CAMPAIGNS, getUserCampaigns);
}

export function* watchAddNewUserCampaign() {
  yield takeEvery(ADD_NEW_USER_CAMPAIGN, onAddNewUserCampaign);
}

export function* watchUpdateUserCampaign() {
  yield takeEvery(UPDATE_USER_CAMPAIGN, onUpdateUserCampaign);
}

export function* watchDeleteUserCampaign() {
  yield takeEvery(DELETE_USER_CAMPAIGN, onDeleteUserCampaign);
}

function* userSaga() {
  yield all([
    // Users
    fork(watchGetUsers),
    fork(watchGetCurrentUser),
    fork(watchGetUserDetails),
    fork(watchGetModeratorUsers),
    fork(watchAddNewUser),
    fork(watchUpdateUser),
    fork(watchDeleteUser),

    // UserCandidates
    fork(watchGetUserCandidates),
    // fork(watchGetUserCandidateDetails),
    fork(watchAddNewUserCandidate),
    fork(watchUpdateUserCandidate),
    fork(watchDeleteUserCandidate),

    // UserCampiagns
    fork(watchGetUserCampaigns),
    // fork(watchGetUserCampiagnDetails),
    fork(watchAddNewUserCampaign),
    fork(watchUpdateUserCampaign),
    fork(watchDeleteUserCampaign),
  ]);
}

export default userSaga;
