<<<<<<< HEAD
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
=======
import { call, put, takeEvery, all, fork, take } from "redux-saga/effects";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ElectionStatistic Redux States
import {
  ADD_ELECTOR,
  GET_ELECTORS_BY_ALL,
  GET_ELECTORS_BY_CATEGORY,
  GET_ELECTORS_BY_SEARCH,
  GET_ELECTOR_RELATED_ELECTORS,
} from "./actionType";


import {
  ElectorApiResponseSuccess,
  ElectorApiResponseError,
  addElectorSuccess,
} from "./actions";


//Include Both Helper File with needed methods
import {
  addElector as AddElectorApi,
  getElectorsByCategory as getElectorsByCategoryApi,
  getElectorsByAll as getElectorsByAllApi,
  getElectorsBySearch,
  getElectorRelatedElectors,
} from "../../helpers/backend_helper";



// electorsByAll
function* getElectorsByAll({ payload: elector }) {
  console.log("getElectorsByAll saga called with")
  try {
    const response = yield call(getElectorsByAllApi, elector);
    yield put(ElectorApiResponseSuccess(GET_ELECTORS_BY_ALL, response.data));
  } catch (error) {
    yield put(ElectorApiResponseError(GET_ELECTORS_BY_ALL, error));
  }
}

// electorsByCategories
function* getElectorsByCategory({ payload: elector }) {
  try {
    const response = yield call(getElectorsByCategoryApi, elector);
    yield put(ElectorApiResponseSuccess(GET_ELECTORS_BY_CATEGORY, response.data));
  } catch (error) {
    yield put(ElectorApiResponseError(GET_ELECTORS_BY_CATEGORY, error));
  }
}

// electorsBySearch
function* onGetElectorsBySearch({ payload: elector }) {
  try {
    const response = yield call(getElectorsBySearch, elector);
    yield put(ElectorApiResponseSuccess(GET_ELECTORS_BY_SEARCH, response.data));
  } catch (error) {
    yield put(ElectorApiResponseError(GET_ELECTORS_BY_SEARCH, error));
  }
}

function* onGetElectorRelatedElectors({ payload: elector }) {
  try {
    const response = yield call(getElectorRelatedElectors, elector);
    yield put(ElectorApiResponseSuccess(GET_ELECTOR_RELATED_ELECTORS, response.data));
  } catch (error) {
    yield put(ElectorApiResponseError(GET_ELECTOR_RELATED_ELECTORS, error));
  }
}


function* addElector({ payload: elector }) {
  try {
    const response = yield call(AddElectorApi, elector);
    yield put(addElectorSuccess(ADD_ELECTOR, response.data));
  } catch (error) {
    yield put(ElectorApiResponseError(ADD_ELECTOR, error));
  }
}

// 
// Watchers
// 

// Election Database
export function* watchGetElectorsByAll() {
  yield takeEvery(GET_ELECTORS_BY_ALL, getElectorsByAll);
}

export function* watchGetElectorsByCategory() {
  yield takeEvery(GET_ELECTORS_BY_CATEGORY, getElectorsByCategory);
}

export function* watchGetElectorsBySearch() {
  yield takeEvery(GET_ELECTORS_BY_SEARCH, onGetElectorsBySearch);
}

export function* watchGetElectorRelatedElectors() {
  yield takeEvery(GET_ELECTOR_RELATED_ELECTORS, onGetElectorRelatedElectors);
}



export function* watchAddElector() {
  yield takeEvery(ADD_ELECTOR, addElector);
}


// Election Statistics

function* electionStatisticSaga() {
  yield all([
    // Election Dtabase
    fork(watchAddElector),
    // ElectionStatistics
    fork(watchGetElectorsByAll),
    fork(watchGetElectorsByCategory),
    fork(watchGetElectorsBySearch),
    fork(watchGetElectorRelatedElectors),
  ]);
}

export default electionStatisticSaga;
>>>>>>> sanad
