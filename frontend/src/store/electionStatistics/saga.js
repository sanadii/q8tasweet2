import { call, put, takeEvery, all, fork, take } from "redux-saga/effects";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ElectionStatistic Redux States
import {
  ADD_ELECTION_DATABASE,
  GET_ELECTION_STATISTICS,
} from "./actionType";


import {
  ElectionDatabaseApiResponseSuccess,
  ElectionDatabaseApiResponseError,
  // getElectionStatistics,
  // API Response
  addElectionDatabaseSuccess,
  addElectionDatabaseFail,


} from "./actions";


//Include Both Helper File with needed methods
import {
  addElectionDatabase as AddElectionDatabaseApi,

  getElectionStatistics as getElectionStatisticsApi,
} from "../../helpers/backend_helper";


// 
// Election Database
// 

// Elections
function* addElectionDatabase({ payload: electionDatabase }) {
  try {
    const response = yield call(AddElectionDatabaseApi, electionDatabase);
    yield put(addElectionDatabaseSuccess(ADD_ELECTION_DATABASE, response.data));
  } catch (error) {
    yield put(ElectionDatabaseApiResponseError(ADD_ELECTION_DATABASE, error));
  }
}

function* getElectionStatistics({ payload: election }) {
  console.log("is there an issue with dispatch?")
  try {
    const response = yield call(getElectionStatisticsApi, election);
    yield put(ElectionDatabaseApiResponseSuccess(GET_ELECTION_STATISTICS, response.data));
  } catch (error) {
    yield put(addElectionDatabaseFail(GET_ELECTION_STATISTICS, error));
  }
}

// 
// Watchers
// 

// Election Database
// Election Parties Watchers
export function* watchAddElectionDatabase() {
  yield takeEvery(ADD_ELECTION_DATABASE, addElectionDatabase);
}


// Election Statistics
export function* watchGetElectionStatistics() {
  yield takeEvery(GET_ELECTION_STATISTICS, getElectionStatistics);
}
function* electionStatisticSaga() {
  yield all([
    // Election Dtabase
    fork(watchAddElectionDatabase),
    // ElectionStatistics
    fork(watchGetElectionStatistics),
  ]);
}

export default electionStatisticSaga;
