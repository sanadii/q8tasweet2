import { call, put, takeEvery, all, fork, take } from "redux-saga/effects";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ElectionStatistic Redux States
import {
  ADD_ELECTOR,
  GET_ELECTOR_BY_ALL,
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
  getElectorsByAll as getElectorByAllApi,
  getElectorsBySearch,
  getElectorRelatedElectors,
} from "../../helpers/backend_helper";



// electorsByAll
function* getElectorsByAll({ payload: elector }) {
  try {
    const response = yield call(getElectorByAllApi, elector);
    yield put(ElectorApiResponseSuccess(GET_ELECTOR_BY_ALL, response.data));
  } catch (error) {
    yield put(ElectorApiResponseError(GET_ELECTOR_BY_ALL, error));
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
  yield takeEvery(GET_ELECTOR_BY_ALL, getElectorsByAll);
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
