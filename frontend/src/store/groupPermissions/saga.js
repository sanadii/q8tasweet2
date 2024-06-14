import { call, put, takeEvery, all, fork, take } from "redux-saga/effects";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// GroupPermission Redux States
import {
  GET_GROUP_PERMISSIONS,
<<<<<<< HEAD
  ADD_NEW_GROUP_PERMISSION,
=======
  ADD_GROUP_PERMISSION,
>>>>>>> sanad
  DELETE_GROUP_PERMISSION,
  UPDATE_GROUP_PERMISSION,
} from "./actionType";

import {
  UPLOAD_IMAGE_SUCCESS,
  UPLOAD_IMAGE_FAIL,
} from "../uploadImage/actionType";

import {
  // getGroupPermissions, 
  // API Response
  GroupPermissionApiResponseSuccess,
  GroupPermissionApiResponseError,

  // GroupPermissions
<<<<<<< HEAD
  addNewGroupPermissionSuccess,
  addNewGroupPermissionFail,
=======
  addGroupPermissionSuccess,
  addGroupPermissionFail,
>>>>>>> sanad
  updateGroupPermissionSuccess,
  updateGroupPermissionFail,
  deleteGroupPermissionSuccess,
  deleteGroupPermissionFail,

} from "./action";

import { uploadNewImage } from "../uploadImage/action";

//Include Both Helper File with needed methods
import {
  getGroupPermissions as getGroupPermissionsApi,
<<<<<<< HEAD
  addNewGroupPermission,
=======
  addGroupPermission,
>>>>>>> sanad
  updateGroupPermission,
  deleteGroupPermission,
} from "helpers/backend_helper";

function* getGroupPermissions() {
  try {
    const response = yield call(getGroupPermissionsApi);
    yield put(GroupPermissionApiResponseSuccess(GET_GROUP_PERMISSIONS, response.data));
  } catch (error) {
    yield put(GroupPermissionApiResponseError(GET_GROUP_PERMISSIONS, error));
  }
}


function* onAddNewGroupPermission({ payload: { groupPermission, formData } }) {
  try {
<<<<<<< HEAD
    // Call the API function to add a new groupPermission & Dispatch the addNewGroupPermissionSuccess action with the received data
    const addNewGroupPermissionResponse = yield call(addNewGroupPermission, formData);
    yield put(addNewGroupPermissionSuccess(addNewGroupPermissionResponse));

    toast.success("GroupPermission Added Successfully", { autoClose: 2000 });
  } catch (error) {
    yield put(addNewGroupPermissionFail(error));
=======
    // Call the API function to add a new groupPermission & Dispatch the addGroupPermissionSuccess action with the received data
    const addGroupPermissionResponse = yield call(addGroupPermission, formData);
    yield put(addGroupPermissionSuccess(addGroupPermissionResponse));

    toast.success("GroupPermission Added Successfully", { autoClose: 2000 });
  } catch (error) {
    yield put(addGroupPermissionFail(error));
>>>>>>> sanad
    toast.error("GroupPermission Added Failed", { autoClose: 2000 });
  }
}

function* onDeleteGroupPermission({ payload: groupPermission }) {
  try {
    const response = yield call(deleteGroupPermission, groupPermission);
    yield put(deleteGroupPermissionSuccess({ groupPermission, ...response }));
    toast.success("GroupPermission Delete Successfully", { autoClose: 2000 });
  } catch (error) {
    yield put(deleteGroupPermissionFail(error));
    toast.error("GroupPermission Delete Failed", { autoClose: 2000 });
  }
}

function* onUpdateGroupPermission({ payload: { groupPermission, formData } }) {
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

    // Replace backslashes in image URL with forward slashes & update the image field in the groupPermission object with the new URL
    const formattedImageUrl = uploadResponse?.url?.replace(/\\/g, "/");
    const updatedGroupPermission = {
      ...groupPermission,
      image: formattedImageUrl,
    };

    // Call the API function to update the groupPermission & Dispatch the updateGroupPermissionSuccess action with the received data
    const updateGroupPermissionResponse = yield call(updateGroupPermission, updatedGroupPermission);
    yield put(updateGroupPermissionSuccess(updateGroupPermissionResponse));

    toast.success("GroupPermission Updated Successfully", { autoClose: 2000 });
  } catch (error) {
    yield put(updateGroupPermissionFail(error));
    toast.error("GroupPermission Updated Failed", { autoClose: 2000 });
  }
}

// Watchers
export function* watchGetGroupPermissions() {
  yield takeEvery(GET_GROUP_PERMISSIONS, getGroupPermissions);
}
export function* watchAddNewGroupPermission() {
<<<<<<< HEAD
  yield takeEvery(ADD_NEW_GROUP_PERMISSION, onAddNewGroupPermission);
=======
  yield takeEvery(ADD_GROUP_PERMISSION, onAddNewGroupPermission);
>>>>>>> sanad
}
export function* watchUpdateGroupPermission() {
  yield takeEvery(UPDATE_GROUP_PERMISSION, onUpdateGroupPermission);
}
export function* watchDeleteGroupPermission() {
  yield takeEvery(DELETE_GROUP_PERMISSION, onDeleteGroupPermission);
}

function* groupPermissionSaga() {
  yield all([
    // GroupPermissions
    fork(watchGetGroupPermissions),
    fork(watchAddNewGroupPermission),
    fork(watchUpdateGroupPermission),
    fork(watchDeleteGroupPermission),
  ]);
}

export default groupPermissionSaga;
