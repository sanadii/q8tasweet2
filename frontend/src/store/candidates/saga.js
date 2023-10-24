import { call, put, takeEvery, all, fork, take } from "redux-saga/effects";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Candidate Redux States
import {
  GET_CANDIDATES,
  GET_CANDIDATE_DETAILS,
  ADD_NEW_CANDIDATE,
  DELETE_CANDIDATE,
  UPDATE_CANDIDATE,
} from "./actionType";

import {
  // getCandidates, getCandidateDetails, 
  // API Response
  CandidateApiResponseSuccess,
  CandidateApiResponseError,

  // Candidates
  addNewCandidateSuccess,
  addNewCandidateFail,
  updateCandidateSuccess,
  updateCandidateFail,
  deleteCandidateSuccess,
  deleteCandidateFail,
} from "./action";

//Include Both Helper File with needed methods
import {
  getCandidates as getCandidatesApi,
  getCandidateDetails as getCandidateDetailsApi,
  addNewCandidate,
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
    console.log('Saga Payload:', candidate); // Log the payload here
    const response = yield call(addNewCandidate, candidate);
    yield put(addNewCandidateSuccess(response));
    toast.success("Candidate Added Successfully", { autoClose: 2000 });
  } catch (error) {
    yield put(addNewCandidateFail(error));
    toast.error("Candidate Added Failed", { autoClose: 2000 });
  }
}

function* onUpdateCandidate({ payload: { candidate, candidateId } }) {
  try {
    const response = yield call(updateCandidate, candidate, candidateId);
    yield put(updateCandidateSuccess(response));
    toast.success("Candidate Updated Successfully", {
      autoClose: 2000,
    });
  } catch (error) {
    yield put(updateCandidateFail(error));
    toast.error("Candidate Updated Failed", { autoClose: 2000 });
  }
}

function* onDeleteCandidate({ payload: candidate }) {
  try {
    const response = yield call(deleteCandidate, candidate);
    yield put(deleteCandidateSuccess({ candidate, ...response }));
    toast.success("Candidate Delete Successfully", { autoClose: 2000 });
  } catch (error) {
    yield put(deleteCandidateFail(error));
    toast.error("Candidate Delete Failed", { autoClose: 2000 });
  }
}





// Watchers
export function* watchGetCandidates() {
  yield takeEvery(GET_CANDIDATES, getCandidates);
}

export function* watchAddNewCandidate() {
  yield takeEvery(ADD_NEW_CANDIDATE, onAddCandidate);
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
