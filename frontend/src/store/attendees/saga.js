import { call, put, takeEvery, all, fork } from "redux-saga/effects";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Invoice Redux States
import {

  GET_ALL_ATTENDEES,
<<<<<<< HEAD
  ADD_NEW_ATTENDEE,
=======
  ADD_ATTENDEE,
>>>>>>> sanad
  DELETE_ATTENDEE,
  UPDATE_ATTENDEE,
} from "./actionType";

import {
  attendeesApiResponseSuccess,
  attendeesApiResponseError,
  addAttendeeSuccess,
  addAttendeeFail,
  updateAttendeeSuccess,
  updateAttendeeFail,
  deleteAttendeeSuccess,
  deleteAttendeeFail
} from "./action";

//Include Both Helper Attendee with needed methods
import {
  getAllAttendees as getAllAttendeesApi,
<<<<<<< HEAD
  addNewAttendee,
=======
  addAttendee,
>>>>>>> sanad
  updateAttendee,
  deleteAttendee,
} from "../../helpers/backend_helper";


function* getAllAttendees() {
  try {
    const response = yield call(getAllAttendeesApi);
    yield put(attendeesApiResponseSuccess(GET_ALL_ATTENDEES, response.data));
  } catch (error) {
    yield put(attendeesApiResponseError(GET_ALL_ATTENDEES, error));
  }
}

function* onAddNewAttendee({ payload: attendee }) {

  try {
<<<<<<< HEAD
    const response = yield call(addNewAttendee, attendee);
=======
    const response = yield call(addAttendee, attendee);
>>>>>>> sanad
    yield put(addAttendeeSuccess(response));
    toast.success("Attendee Added Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(addAttendeeFail(error));
    toast.error("Attendee Added Failed", { autoClose: 3000 });
  }
}

function* onUpdateAttendee({ payload: attendee }) {
  try {
    const response = yield call(updateAttendee, attendee);

    yield put(updateAttendeeSuccess(response));
    toast.success("Attendee Updated Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(updateAttendeeFail(error));
    toast.error("Attendee Updated Failed", { autoClose: 3000 });
  }
}

function* onDeleteAttendee({ payload: attendee }) {
  try {
    const response = yield call(deleteAttendee, attendee);
    yield put(deleteAttendeeSuccess({ attendee, ...response }));
    toast.success("Attendee Delete Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(deleteAttendeeFail(error));
    toast.error("Attendee Delete Failed", { autoClose: 3000 });
  }
}



export function* watchGetAttendees() {
  yield takeEvery(GET_ALL_ATTENDEES, getAllAttendees);
}

export function* watchUpdateAttendee() {
  yield takeEvery(UPDATE_ATTENDEE, onUpdateAttendee);
}

export function* watchDeleteAttendee() {
  yield takeEvery(DELETE_ATTENDEE, onDeleteAttendee);
}

export function* watchAddNewAttendee() {
<<<<<<< HEAD
  yield takeEvery(ADD_NEW_ATTENDEE, onAddNewAttendee);
=======
  yield takeEvery(ADD_ATTENDEE, onAddNewAttendee);
>>>>>>> sanad
}

function* AttendeeManager() {
  yield all([
    fork(watchGetAttendees),
    fork(watchAddNewAttendee),
    fork(watchUpdateAttendee),
    fork(watchDeleteAttendee),
  ]);
}

export default AttendeeManager;