import {
  put,
  call,
  take,
  race,
  all,
  cancelled,
  fork,
} from "redux-saga/effects";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { UPLOAD_FILE, CANCEL_UPLOAD } from "./actionType";

import {
  uploadFileLoading,
  uploadFileSuccess,
  uploadFileFailed,
  setUploadProgress,
} from "./action";

import { upload as uploadAPI } from "../../helpers/file_upload_helper";
import { UPLOAD_CANCELED } from "../../helpers/Constants";

function* uploadFile(action) {
  try {
    yield put(uploadFileLoading());
    const channel = yield call(uploadAPI, action.payload);
    while (true) {
      const { progress = 0, err, success } = yield take(channel);
      if (!(yield cancelled())) {
        if (err) {
          yield put(uploadFileFailed(err));
          yield put(setUploadProgress(0));
          return;
        }
        if (success) {
          yield put(uploadFileSuccess());
          yield put(setUploadProgress(0));
          return;
        }
        yield put(setUploadProgress(progress));
      }
    }
  } catch (err) {
    yield put(uploadFileFailed(err));
    yield put(setUploadProgress(0));
  } finally {
    if (yield cancelled()) {
      yield put(uploadFileFailed(UPLOAD_CANCELED));
      yield put(setUploadProgress(0));
    }
  }
}

function* watchUploadFile() {
  try {
    while (true) {
      const action = yield take(UPLOAD_FILE);
      yield race([call(uploadFile, action), take(CANCEL_UPLOAD)]);
    }
  } finally {
    console.log("watchUploadFile terminated");
  }
}

// export { uploadFile, watchUploadFile };

function* fileSaga() {
  yield all([fork(uploadFile), fork(watchUploadFile)]);
}

export default fileSaga;
