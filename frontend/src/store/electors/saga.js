import { call, put, takeEvery, all, fork } from "redux-saga/effects";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Invoice Redux States
import {
  GET_ALL_ELECTORS,
  GET_ELECTORS,
  ADD_NEW_ELECTOR,
  DELETE_ELECTOR,
  UPDATE_ELECTOR,
} from "./actionType";

import {
  electorsApiResponseSuccess,
  electorsApiResponseError,
  addElectorSuccess,
  addElectorFail,
  updateElectorSuccess,
  updateElectorFail,
  deleteElectorSuccess,
  deleteElectorFail,
} from "./action";

//Include Both Helper Elector with needed methods
import {
  getAllElectors as getAllElectorsApi,
  getElectors as getElectorsApi,
  addNewElector,
  updateElector,
  deleteElector,
} from "../../helpers/backend_helper";

function* getAllElectors() {
  try {
    const response = yield call(getAllElectorsApi);
    yield put(electorsApiResponseSuccess(GET_ALL_ELECTORS, response.data));
  } catch (error) {
    yield put(electorsApiResponseError(GET_ALL_ELECTORS, error));
  }
}

function* getElectors({ payload: elector }) {
  try {
    const response = yield call(getElectorsApi, elector);
    yield put(electorsApiResponseSuccess(GET_ELECTORS, response.data));
  } catch (error) {
    yield put(electorsApiResponseError(GET_ELECTORS, error));
  }
}

function* onAddNewElector({ payload: elector }) {
  try {
    const response = yield call(addNewElector, elector);
    yield put(addElectorSuccess(response));
    toast.success("Elector Added Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(addElectorFail(error));
    toast.error("Elector Added Failed", { autoClose: 3000 });
  }
}

function* onUpdateElector({ payload: elector }) {
  try {
    const response = yield call(updateElector, elector);

    yield put(updateElectorSuccess(response));
    toast.success("Elector Updated Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(updateElectorFail(error));
    toast.error("Elector Updated Failed", { autoClose: 3000 });
  }
}

function* onDeleteElector({ payload: elector }) {
  try {
    const response = yield call(deleteElector, elector);
    yield put(deleteElectorSuccess({ elector, ...response }));
    toast.success("Elector Delete Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(deleteElectorFail(error));
    toast.error("Elector Delete Failed", { autoClose: 3000 });
  }
}

export function* watchGetAllElectors() {
  yield takeEvery(GET_ALL_ELECTORS, getAllElectors);
}

export function* watchGetelectors() {
  yield takeEvery(GET_ELECTORS, getElectors);
}

export function* watchUpdateElector() {
  yield takeEvery(UPDATE_ELECTOR, onUpdateElector);
}

export function* watchDeleteElector() {
  yield takeEvery(DELETE_ELECTOR, onDeleteElector);
}

export function* watchAddNewElector() {
  yield takeEvery(ADD_NEW_ELECTOR, onAddNewElector);
}

function* ElectorManager() {
  yield all([
    fork(watchGetAllElectors),
    fork(watchGetelectors),
    fork(watchAddNewElector),
    fork(watchUpdateElector),
    fork(watchDeleteElector),
  ]);
}

export default ElectorManager;
