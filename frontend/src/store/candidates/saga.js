import { call, put, takeEvery, all, fork, take } from "redux-saga/effects";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Candidate Redux States
import {
  GET_CANDIDATES,
  GET_CANDIDATE_DETAILS,
  ADD_CANDIDATE,
  DELETE_CANDIDATE,
  UPDATE_CANDIDATE,

  // Election Candidates
  ADD_ELECTION_CANDIDATE,

} from "./actionType";

import {
  // getCandidates, getCandidateDetails, 
  // API Response
  CandidateApiResponseSuccess,
  CandidateApiResponseError,

  // Candidates
  addCandidateSuccess,
  addCandidateFail,
  updateCandidateSuccess,
  updateCandidateFail,
  deleteCandidateSuccess,
  deleteCandidateFail,

} from "./action";

import {
  addElectionCandidateSuccess,
} from "../elections/action"

import {
  // Election Candidates
  addToElectionAfterCandidateSuccess,
  addToElectionAfterPartyCandidateSuccess,
} from "../elections/action";

//Include Both Helper File with needed methods
import {
  getCandidates as getCandidatesApi,
  getCandidateDetails as getCandidateDetailsApi,
  addCandidate,
  updateCandidate,
  deleteCandidate,
} from "helpers/backend_helper";

function* getCandidates() {
  try {
    const response = yield call(getCandidatesApi);
    yield put(CandidateApiResponseSuccess(GET_CANDIDATES, response.data));
  } catch (error) {
    yield put(CandidateApiResponseError(GET_CANDIDATES, error));
  }
}


function* getCandidateDetails({ payload: candidate }) {
  try {
    const response = yield call(getCandidateDetailsApi, candidate);
    yield put(CandidateApiResponseSuccess(GET_CANDIDATE_DETAILS, response.data));
  } catch (error) {
    yield put(CandidateApiResponseError(GET_CANDIDATE_DETAILS, error));
  }
}

function* onAddCandidate({ payload: candidate }) {
  try {
    const response = yield call(addCandidate, candidate);
    yield put(addCandidateSuccess(response));
    toast.success("تم إضافة المرشح بنجاح", { autoClose: 2000 });
    
    if (response.electionCandidate) {
      const electionCandidateResponse = {
        data: response.electionCandidate
      }
      yield put(addElectionCandidateSuccess(electionCandidateResponse));
    }

  } catch (error) {
    yield put(addCandidateFail(error));
    toast.error("خطأ في إضافة المرشح", { autoClose: 2000 });
  }
}

function* onUpdateCandidate({ payload: candidate }) {
  try {
    const response = yield call(updateCandidate, candidate);
    yield put(updateCandidateSuccess(response));
    toast.success("تم تحديث المرشح بنجاح", {
      autoClose: 2000,
    });
  } catch (error) {
    yield put(updateCandidateFail(error));
    toast.error("خطأ في تحديث المرشح", { autoClose: 2000 });
  }
}

function* onDeleteCandidate({ payload: candidate }) {
  try {
    const response = yield call(deleteCandidate, candidate);
    yield put(deleteCandidateSuccess({ candidate, ...response }));
    toast.success("تم حذف المرشح بنجاح", { autoClose: 2000 });
  } catch (error) {
    yield put(deleteCandidateFail(error));
    toast.error("خطأ في حذف المرشح", { autoClose: 2000 });
  }
}


// Watchers
export function* watchGetCandidates() {
  yield takeEvery(GET_CANDIDATES, getCandidates);
}

export function* watchAddNewCandidate() {
  yield takeEvery(ADD_CANDIDATE, onAddCandidate);
}

export function* watchUpdateCandidate() {
  yield takeEvery(UPDATE_CANDIDATE, onUpdateCandidate);
}

export function* watchDeleteCandidate() {
  yield takeEvery(DELETE_CANDIDATE, onDeleteCandidate);
}


export function* watchGetCandidateDetails() {
  yield takeEvery(GET_CANDIDATE_DETAILS, getCandidateDetails);
}


function* candidateSaga() {
  yield all([

    // Candidates
    fork(watchGetCandidates),
    fork(watchAddNewCandidate),
    fork(watchUpdateCandidate),
    fork(watchDeleteCandidate),
    fork(watchGetCandidateDetails),
  ]);
}

export default candidateSaga;
