import { call, put, takeEvery, all, fork, take } from "redux-saga/effects";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// UserNotification Redux States
import {
  GET_USER_NOTIFICATIONS,
  GET_CAMPAIGN_NOTIFICATIONS,
} from "./actionType";


import {
  // API Response
  UserNotificationApiResponseSuccess,
  UserNotificationApiResponseError,
} from "./action";


//Include Both Helper File with needed methods
import {
  getUserNotifications as getUserNotificationsApi,
} from "helpers/backend_helper";

function* getUserNotifications() {
  try {
    const response = yield call(getUserNotificationsApi);
    yield put(UserNotificationApiResponseSuccess(GET_USER_NOTIFICATIONS, response.data));
  } catch (error) {
    yield put(UserNotificationApiResponseError(GET_USER_NOTIFICATIONS, error));
  }
}


// Watchers
export function* watchGetUserNotifications() {
  yield takeEvery(GET_USER_NOTIFICATIONS, getUserNotifications);
}


function* NotificationSaga() {
  yield all([
    // UserNotifications
    fork(watchGetUserNotifications),
  ]);
}

export default NotificationSaga;
