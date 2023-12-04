import { call, put, takeEvery, all, fork, take } from "redux-saga/effects";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Group Redux States
import {
  GET_GROUPS,
  ADD_NEW_GROUP,
  DELETE_GROUP,
  UPDATE_GROUP,
} from "./actionType";

import {
  UPLOAD_IMAGE_SUCCESS,
  UPLOAD_IMAGE_FAIL,
} from "../uploadImage/actionType";

import {
  // getGroups,
  // API Response
  GroupApiResponseSuccess,
  GroupApiResponseError,

  // Groups
  addNewGroupSuccess,
  addNewGroupFail,
  updateGroupSuccess,
  updateGroupFail,
  deleteGroupSuccess,
  deleteGroupFail,

} from "./action";

import { uploadNewImage } from "../uploadImage/action";

//Include Both Helper File with needed methods
import {
  getGroups as getGroupsApi,
  addNewGroup,
  updateGroup,
  deleteGroup,
} from "../../helpers/backend_helper";

function* getGroups() {
  try {
    const response = yield call(getGroupsApi);
    yield put(GroupApiResponseSuccess(GET_GROUPS, response.data));
  } catch (error) {
    yield put(GroupApiResponseError(GET_GROUPS, error));
  }
}


function* onAddNewGroup({ payload: { group, formData } }) {
  try {
    // Call the API function to add a new group & Dispatch the addNewGroupSuccess action with the received data
    const addNewGroupResponse = yield call(addNewGroup, formData);
    yield put(addNewGroupSuccess(addNewGroupResponse));

    toast.success("Group Added Successfully", { autoClose: 2000 });
  } catch (error) {
    yield put(addNewGroupFail(error));
    toast.error("Group Added Failed", { autoClose: 2000 });
  }
}

function* onDeleteGroup({ payload: group }) {
  try {
    const response = yield call(deleteGroup, group);
    yield put(deleteGroupSuccess({ group, ...response }));
    toast.success("Group Delete Successfully", { autoClose: 2000 });
  } catch (error) {
    yield put(deleteGroupFail(error));
    toast.error("Group Delete Failed", { autoClose: 2000 });
  }
}

function* onUpdateGroup({ payload: { group, formData } }) {
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

    // Replace backslashes in image URL with forward slashes & update the image field in the group object with the new URL
    const formattedImageUrl = uploadResponse?.url?.replace(/\\/g, "/");
    const updatedGroup = {
      ...group,
      image: formattedImageUrl,
    };

    // Call the API function to update the group & Dispatch the updateGroupSuccess action with the received data
    const updateGroupResponse = yield call(updateGroup, updatedGroup);
    yield put(updateGroupSuccess(updateGroupResponse));

    toast.success("Group Updated Successfully", { autoClose: 2000 });
  } catch (error) {
    yield put(updateGroupFail(error));
    toast.error("Group Updated Failed", { autoClose: 2000 });
  }
}

// Watchers
export function* watchGetGroups() {
  yield takeEvery(GET_GROUPS, getGroups);
}

export function* watchAddNewGroup() {
  yield takeEvery(ADD_NEW_GROUP, onAddNewGroup);
}
export function* watchUpdateGroup() {
  yield takeEvery(UPDATE_GROUP, onUpdateGroup);
}
export function* watchDeleteGroup() {
  yield takeEvery(DELETE_GROUP, onDeleteGroup);
}

function* groupSaga() {
  yield all([
    // Groups
    fork(watchGetGroups),
    fork(watchAddNewGroup),
    fork(watchUpdateGroup),
    fork(watchDeleteGroup),
  ]);
}

export default groupSaga;
