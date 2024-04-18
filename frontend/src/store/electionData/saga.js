import { call, put, takeEvery, all, fork, take } from "redux-saga/effects";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ElectionData Redux States
import {
  GET_ELECTION_DATA,
  GET_ELECTION_DATA_DETAILS,
  ADD_ELECTION_DATA,
  DELETE_ELECTION_DATA,
  UPDATE_ELECTION_DATA,

  // Election ElectionDatas
  ADD_ELECTION_ELECTION_DATA,

} from "./actionType";

import {
  // getElectionDatas, getElectionDataDetails, 
  // API Response
  ElectionDataApiResponseSuccess,
  ElectionDataApiResponseError,

  // ElectionDatas
  addElectionDataSuccess,
  addElectionDataFail,
  updateElectionDataSuccess,
  updateElectionDataFail,
  deleteElectionDataSuccess,
  deleteElectionDataFail,

} from "./actions";

//Include Both Helper File with needed methods
import {
  getElectionDatas as getElectionDatasApi,
  getElectionDataDetails as getElectionDataDetailsApi,
  addElectionData,
  updateElectionData,
  deleteElectionData,
} from "helpers/backend_helper";

function* getElectionDatas() {
  try {
    const response = yield call(getElectionDatasApi);
    yield put(ElectionDataApiResponseSuccess(GET_ELECTION_DATA, response.data));
  } catch (error) {
    yield put(ElectionDataApiResponseError(GET_ELECTION_DATA, error));
  }
}


function* getElectionDataDetails({ payload: electionData }) {
  try {
    const response = yield call(getElectionDataDetailsApi, electionData);
    yield put(ElectionDataApiResponseSuccess(GET_ELECTION_DATA_DETAILS, response.data));
  } catch (error) {
    yield put(ElectionDataApiResponseError(GET_ELECTION_DATA_DETAILS, error));
  }
}

function* onAddElectionData({ payload: electionData }) {
  try {
    const response = yield call(addElectionData, electionData);
    yield put(addElectionDataSuccess(response));
    toast.success("تم إضافة قاعدة بيانات الإنتخابات بنجاح", { autoClose: 2000 });
  } catch (error) {
    yield put(addElectionDataFail(error));
    toast.error("خطأ في إضافة البيانات للإنتخابات", { autoClose: 2000 });
  }
}

function* onUpdateElectionData({ payload: electionData }) {
  try {
    const response = yield call(updateElectionData, electionData);
    yield put(updateElectionDataSuccess(response));
    toast.success("تم تحديث المرشح بنجاح", {
      autoClose: 2000,
    });
  } catch (error) {
    yield put(updateElectionDataFail(error));
    toast.error("خطأ في تحديث المرشح", { autoClose: 2000 });
  }
}

function* onDeleteElectionData({ payload: electionData }) {
  try {
    const response = yield call(deleteElectionData, electionData);
    yield put(deleteElectionDataSuccess({ electionData, ...response }));
    toast.success("تم حذف المرشح بنجاح", { autoClose: 2000 });
  } catch (error) {
    yield put(deleteElectionDataFail(error));
    toast.error("خطأ في حذف المرشح", { autoClose: 2000 });
  }
}


// Watchers
export function* watchGetElectionDatas() {
  yield takeEvery(GET_ELECTION_DATA, getElectionDatas);
}

export function* watchAddElectionData() {
  yield takeEvery(ADD_ELECTION_DATA, onAddElectionData);
}

export function* watchUpdateElectionData() {
  yield takeEvery(UPDATE_ELECTION_DATA, onUpdateElectionData);
}

export function* watchDeleteElectionData() {
  yield takeEvery(DELETE_ELECTION_DATA, onDeleteElectionData);
}


export function* watchGetElectionDataDetails() {
  yield takeEvery(GET_ELECTION_DATA_DETAILS, getElectionDataDetails);
}


function* electionDataSaga() {
  yield all([

    // ElectionDatas
    fork(watchGetElectionDatas),
    fork(watchAddElectionData),
    fork(watchUpdateElectionData),
    fork(watchDeleteElectionData),
    fork(watchGetElectionDataDetails),
  ]);
}

export default electionDataSaga;
