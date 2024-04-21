import { call, put, takeEvery, all, fork, take } from "redux-saga/effects";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ElectionStatistic Redux States
import {
  ADD_ELECTOR,
  GET_ELECTOR_STATISTICS,
} from "./actionType";


import {
  ElectorApiResponseSuccess,
  ElectorApiResponseError,
  // getElectorStatistics,
  // API Response
  addElectorSuccess,
  addElectorFail,


} from "./actions";


//Include Both Helper File with needed methods
import {
  addElector as AddElectorApi,

  getElectorStatistics as getElectorStatisticsApi,
} from "../../helpers/backend_helper";


// 
// Election Database
// 

// Elections
function* addElector({ payload: elector }) {
  try {
    const response = yield call(AddElectorApi, elector);
    yield put(addElectorSuccess(ADD_ELECTOR, response.data));
  } catch (error) {
    yield put(ElectorApiResponseError(ADD_ELECTOR, error));
  }
}

function* getElectorStatistics({ payload: election }) {
  console.log("is there an issue with dispatch?")
  try {
    const response = yield call(getElectorStatisticsApi, election);
    yield put(ElectorApiResponseSuccess(GET_ELECTOR_STATISTICS, response.data));
  } catch (error) {
    yield put(addElectorFail(GET_ELECTOR_STATISTICS, error));
  }
}

// 
// Watchers
// 

// Election Database
// Election Parties Watchers
export function* watchAddElector() {
  yield takeEvery(ADD_ELECTOR, addElector);
}


// Election Statistics
export function* watchGetElectionStatistics() {
  yield takeEvery(GET_ELECTOR_STATISTICS, getElectorStatistics);
}
function* electionStatisticSaga() {
  yield all([
    // Election Dtabase
    fork(watchAddElector),
    // ElectionStatistics
    fork(watchGetElectionStatistics),
  ]);
}

export default electionStatisticSaga;
