import { call, put, takeEvery, all, fork } from "redux-saga/effects";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Invoice Redux States
import {
  GET_ALL_VOTERS,
  GET_VOTERS,
  ADD_NEW_VOTER,
  DELETE_VOTER,
  UPDATE_VOTER,
} from "./actionType";

import {
  votersApiResponseSuccess,
  votersApiResponseError,
  addVoterSuccess,
  addVoterFail,
  updateVoterSuccess,
  updateVoterFail,
  deleteVoterSuccess,
  deleteVoterFail,
} from "./action";

//Include Both Helper Voter with needed methods
import {
  getAllVoters as getAllVotersApi,
  getVoters as getVotersApi,
  addNewVoter,
  updateVoter,
  deleteVoter,
} from "../../helpers/backend_helper";

function* getAllVoters() {
  try {
    const response = yield call(getAllVotersApi);
    yield put(votersApiResponseSuccess(GET_ALL_VOTERS, response.data));
  } catch (error) {
    yield put(votersApiResponseError(GET_ALL_VOTERS, error));
  }
}

function* getVoters({ payload: voter }) {
  try {
    const response = yield call(getVotersApi, voter);
    yield put(votersApiResponseSuccess(GET_VOTERS, response.data));
  } catch (error) {
    yield put(votersApiResponseError(GET_VOTERS, error));
  }
}

function* onAddNewVoter({ payload: voter }) {
  try {
    const response = yield call(addNewVoter, voter);
    yield put(addVoterSuccess(response));
    toast.success("Voter Added Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(addVoterFail(error));
    toast.error("Voter Added Failed", { autoClose: 3000 });
  }
}

function* onUpdateVoter({ payload: voter }) {
  try {
    const response = yield call(updateVoter, voter);

    yield put(updateVoterSuccess(response));
    toast.success("Voter Updated Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(updateVoterFail(error));
    toast.error("Voter Updated Failed", { autoClose: 3000 });
  }
}

function* onDeleteVoter({ payload: voter }) {
  try {
    const response = yield call(deleteVoter, voter);
    yield put(deleteVoterSuccess({ voter, ...response }));
    toast.success("Voter Delete Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(deleteVoterFail(error));
    toast.error("Voter Delete Failed", { autoClose: 3000 });
  }
}

export function* watchGetAllVoters() {
  yield takeEvery(GET_ALL_VOTERS, getAllVoters);
}

export function* watchGetvoters() {
  yield takeEvery(GET_VOTERS, getVoters);
}

export function* watchUpdateVoter() {
  yield takeEvery(UPDATE_VOTER, onUpdateVoter);
}

export function* watchDeleteVoter() {
  yield takeEvery(DELETE_VOTER, onDeleteVoter);
}

export function* watchAddNewVoter() {
  yield takeEvery(ADD_NEW_VOTER, onAddNewVoter);
}

function* VoterManager() {
  yield all([
    fork(watchGetAllVoters),
    fork(watchGetvoters),
    fork(watchAddNewVoter),
    fork(watchUpdateVoter),
    fork(watchDeleteVoter),
  ]);
}

export default VoterManager;
