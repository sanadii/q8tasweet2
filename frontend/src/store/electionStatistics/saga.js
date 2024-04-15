import { call, put, takeEvery, all, fork, take } from "redux-saga/effects";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ElectionStatistic Redux States
import {
  GET_ELECTION_STATISTICS,
} from "./actionType";


import {
  // getElectionStatistics,
  // API Response
  ElectionStatisticApiResponseSuccess,
  ElectionStatisticApiResponseError,


} from "./actions";


//Include Both Helper File with needed methods
import {
  getElectionStatistics as getElectionStatisticsApi,
} from "../../helpers/backend_helper";


function* getElectionStatistics({ payload: election }) {
  console.log("is there an issue with dispatch?")
  try {
    const response = yield call(getElectionStatisticsApi, election);
    yield put(ElectionStatisticApiResponseSuccess(GET_ELECTION_STATISTICS, response.data));
  } catch (error) {
    yield put(ElectionStatisticApiResponseError(GET_ELECTION_STATISTICS, error));
  }
}

// Watchers
export function* watchGetElectionStatistics() {
  yield takeEvery(GET_ELECTION_STATISTICS, getElectionStatistics);
}

function* electionStatisticSaga() {
  yield all([
    // ElectionStatistics
    fork(watchGetElectionStatistics),
  ]);
}

export default electionStatisticSaga;
