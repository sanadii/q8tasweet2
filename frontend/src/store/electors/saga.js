import { call, put, takeEvery, all, fork, take } from "redux-saga/effects";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ElectionStatistic Redux States
import {
  ADD_ELECTOR,
  GET_ELECTOR_STATISTICS,
  GET_ELECTORS_BY_CATEGORY,

  GET_ELECTOR_FAMILY_DIVISIONS,
} from "./actionType";


import {
  ElectorApiResponseSuccess,
  ElectorApiResponseError,
  // API Response
  addElectorSuccess,
  addElectorFail,

} from "./actions";


//Include Both Helper File with needed methods
import {
  addElector as AddElectorApi,
  getElectorsByCategory as getElectorsByCategoryApi,
  getElectorStatistics as getElectorStatisticsApi,

  // 
  getElectorFamilyDivisions as getElectorFamilyDivisionsApi,
} from "../../helpers/backend_helper";


// 
// Election Database
// 

// Elections


function* getElectorStatistics({ payload: election }) {
  try {
    const response = yield call(getElectorStatisticsApi, election);
    yield put(ElectorApiResponseSuccess(GET_ELECTOR_STATISTICS, response.data));
  } catch (error) {
    yield put(ElectorApiResponseError(GET_ELECTOR_STATISTICS, error));
  }
}

function* getElectorsByCategory({ payload: electorCategory }) {
  try {
    const response = yield call(getElectorsByCategoryApi, electorCategory);
    yield put(ElectorApiResponseSuccess(GET_ELECTORS_BY_CATEGORY, response.data));
  } catch (error) {
    yield put(ElectorApiResponseError(GET_ELECTORS_BY_CATEGORY, error));
  }
}

function* getElectorFamilyDivisions({ payload: electorData }) {
  try {
    const response = yield call(getElectorFamilyDivisionsApi, electorData);
    yield put(ElectorApiResponseSuccess(GET_ELECTOR_FAMILY_DIVISIONS, response.data));
  } catch (error) {
    yield put(ElectorApiResponseError(GET_ELECTOR_FAMILY_DIVISIONS, error));
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
export function* watchGetElectionStatistics() {
  yield takeEvery(GET_ELECTOR_STATISTICS, getElectorStatistics);
}

export function* watchGetElectorsByCategory() {
  yield takeEvery(GET_ELECTORS_BY_CATEGORY, getElectorsByCategory);
}


export function* watchGetElectorFamilyDivisions() {
  yield takeEvery(GET_ELECTOR_FAMILY_DIVISIONS, getElectorFamilyDivisions);
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
    fork(watchGetElectionStatistics),
    fork(watchGetElectorsByCategory),

    // 
    fork(watchGetElectorFamilyDivisions),
  ]);
}

export default electionStatisticSaga;
