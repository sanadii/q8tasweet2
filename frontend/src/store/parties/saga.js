import { call, put, takeEvery, all, fork, take } from "redux-saga/effects";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Party Redux States
import {
  GET_PARTIES,
  GET_PARTY_DETAILS,
  ADD_PARTY,
  DELETE_PARTY,
  UPDATE_PARTY,

  // Election Parties
  ADD_NEW_ELECTION_PARTY,

} from "./actionType";

import {
  // getParties, getPartyDetails, 
  // API Response
  PartyApiResponseSuccess,
  PartyApiResponseError,

  // Parties
  addPartySuccess,
  addPartyFail,
  updatePartySuccess,
  updatePartyFail,
  deletePartySuccess,
  deletePartyFail,

} from "./action";

import {
  // Election Parties
  addToElectionAfterPartySuccess,
} from "../elections/action";

//Include Both Helper File with needed methods
import {
  getParties as getPartiesApi,
  getPartyDetails as getPartyDetailsApi,
  addParty,
  updateParty,
  deleteParty,
} from "helpers/backend_helper";

function* getParties() {
  try {
    const response = yield call(getPartiesApi);
    yield put(PartyApiResponseSuccess(GET_PARTIES, response.data));
  } catch (error) {
    yield put(PartyApiResponseError(GET_PARTIES, error));
  }
}


function* getPartyDetails({ payload: party }) {
  try {
    const response = yield call(getPartyDetailsApi, party);
    yield put(PartyApiResponseSuccess(GET_PARTY_DETAILS, response.data));
  } catch (error) {
    yield put(PartyApiResponseError(GET_PARTY_DETAILS, error));
  }
}

function* onAddParty({ payload: party }) {
  try {
    const response = yield call(addParty, party);
    yield put(addPartySuccess(response));
    toast.success("تم إضافة المرشح بنجاح", { autoClose: 2000 });
    if (response.electionParty) {
      // Assuming that party.electionParty is the election object
      yield put(addToElectionAfterPartySuccess(response));
      toast.success("تم إضافة مرشح الانتخابات بنجاح", { autoClose: 2000 });
    }

  } catch (error) {
    yield put(addPartyFail(error));
    toast.error("خطأ في إضافة المرشح", { autoClose: 2000 });
  }
}

function* onUpdateParty({ payload: party }) {
  try {
    const response = yield call(updateParty, party);
    yield put(updatePartySuccess(response));
    toast.success("تم تحديث المرشح بنجاح", {
      autoClose: 2000,
    });
  } catch (error) {
    yield put(updatePartyFail(error));
    toast.error("خطأ في تحديث المرشح", { autoClose: 2000 });
  }
}

function* onDeleteParty({ payload: party }) {
  try {
    const response = yield call(deleteParty, party);
    yield put(deletePartySuccess({ party, ...response }));
    toast.success("تم حذف المرشح بنجاح", { autoClose: 2000 });
  } catch (error) {
    yield put(deletePartyFail(error));
    toast.error("خطأ في حذف المرشح", { autoClose: 2000 });
  }
}


// Watchers
export function* watchGetParties() {
  yield takeEvery(GET_PARTIES, getParties);
}

export function* watchAddParty() {
  yield takeEvery(ADD_PARTY, onAddParty);
}

export function* watchUpdateParty() {
  yield takeEvery(UPDATE_PARTY, onUpdateParty);
}

export function* watchDeleteParty() {
  yield takeEvery(DELETE_PARTY, onDeleteParty);
}


export function* watchGetPartyDetails() {
  yield takeEvery(GET_PARTY_DETAILS, getPartyDetails);
}


function* partySaga() {
  yield all([

    // Parties
    fork(watchGetParties),
    fork(watchAddParty),
    fork(watchUpdateParty),
    fork(watchDeleteParty),
    fork(watchGetPartyDetails),
  ]);
}

export default partySaga;
