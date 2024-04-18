import { call, put, takeEvery, all, fork, take } from "redux-saga/effects";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ElectionSchema Redux States
import {
  GET_ELECTION_SCHEMAS,
  GET_ELECTION_SCHEMA_DETAILS,
  ADD_ELECTION_SCHEMA,
  DELETE_ELECTION_SCHEMA,
  UPDATE_ELECTION_SCHEMA,

  // Election ElectionSchemas
  ADD_ELECTION_ELECTION_SCHEMA,

} from "./actionType";

import {
  // getElectionSchemas, getElectionSchemaDetails, 
  // API Response
  ElectionSchemaApiResponseSuccess,
  ElectionSchemaApiResponseError,

  // ElectionSchemas
  addElectionSchemaSuccess,
  addElectionSchemaFail,
  updateElectionSchemaSuccess,
  updateElectionSchemaFail,
  deleteElectionSchemaSuccess,
  deleteElectionSchemaFail,

} from "./actions";

//Include Both Helper File with needed methods
import {
  getElectionSchemas as getElectionSchemasApi,
  getElectionSchemaDetails as getElectionSchemaDetailsApi,
  addElectionSchema as onAddElectionSchema,
  updateElectionSchema,
  deleteElectionSchema,
} from "helpers/backend_helper";

function* getElectionSchemas() {
  try {
    const response = yield call(getElectionSchemasApi);
    yield put(ElectionSchemaApiResponseSuccess(GET_ELECTION_SCHEMAS, response.data));
  } catch (error) {
    yield put(ElectionSchemaApiResponseError(GET_ELECTION_SCHEMAS, error));
  }
}


function* getElectionSchemaDetails({ payload: electionSchema }) {
  try {
    const response = yield call(getElectionSchemaDetailsApi, electionSchema);
    yield put(ElectionSchemaApiResponseSuccess(GET_ELECTION_SCHEMA_DETAILS, response.data));
  } catch (error) {
    yield put(ElectionSchemaApiResponseError(GET_ELECTION_SCHEMA_DETAILS, error));
  }
}

function* addElectionSchema({ payload: electionDatabase }) {
  try {
    const response = yield call(onAddElectionSchema, electionDatabase);
    yield put(addElectionSchemaSuccess(ADD_ELECTION_SCHEMA, response.data));
  } catch (error) {
    yield put(addElectionSchemaFail(ADD_ELECTION_SCHEMA, error));
  }
}


function* onUpdateElectionSchema({ payload: electionSchema }) {
  try {
    const response = yield call(updateElectionSchema, electionSchema);
    yield put(updateElectionSchemaSuccess(response));
    toast.success("تم تحديث المرشح بنجاح", {
      autoClose: 2000,
    });
  } catch (error) {
    yield put(updateElectionSchemaFail(error));
    toast.error("خطأ في تحديث المرشح", { autoClose: 2000 });
  }
}

function* onDeleteElectionSchema({ payload: electionSchema }) {
  try {
    const response = yield call(deleteElectionSchema, electionSchema);
    yield put(deleteElectionSchemaSuccess({ electionSchema, ...response }));
    toast.success("تم حذف المرشح بنجاح", { autoClose: 2000 });
  } catch (error) {
    yield put(deleteElectionSchemaFail(error));
    toast.error("خطأ في حذف المرشح", { autoClose: 2000 });
  }
}


// Watchers
export function* watchGetElectionSchemas() {
  yield takeEvery(GET_ELECTION_SCHEMAS, getElectionSchemas);
}

export function* watchAddElectionSchema() {
  yield takeEvery(ADD_ELECTION_SCHEMA, addElectionSchema);
}

export function* watchUpdateElectionSchema() {
  yield takeEvery(UPDATE_ELECTION_SCHEMA, onUpdateElectionSchema);
}

export function* watchDeleteElectionSchema() {
  yield takeEvery(DELETE_ELECTION_SCHEMA, onDeleteElectionSchema);
}


export function* watchGetElectionSchemaDetails() {
  yield takeEvery(GET_ELECTION_SCHEMA_DETAILS, getElectionSchemaDetails);
}


function* electionSchemaSaga() {
  yield all([

    // ElectionSchemas
    fork(watchGetElectionSchemas),
    fork(watchAddElectionSchema),
    fork(watchUpdateElectionSchema),
    fork(watchDeleteElectionSchema),
    fork(watchGetElectionSchemaDetails),
  ]);
}

export default electionSchemaSaga;
