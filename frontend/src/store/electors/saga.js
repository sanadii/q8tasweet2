import { call, put, takeEvery, all, fork, take } from "redux-saga/effects";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ElectionStatistic Redux States
import {
  ADD_ELECTOR,
  GET_ELECTOR_BY_ALL,
  GET_ELECTORS_BY_CATEGORY,
  GET_ELECTORS_BY_SEARCH,

  GET_ELECTOR_FAMILY_DIVISIONS,
} from "./actionType";


import {
  ElectorApiResponseSuccess,
  ElectorApiResponseError,
  // API Response
  addElectorSuccess,
  addElectorFail,

  getElectorsBySearchSuccess,
  getElectorsBySearchFail,

} from "./actions";


//Include Both Helper File with needed methods
import {
  addElector as AddElectorApi,
  getElectorsByCategory as getElectorsByCategoryApi,
  getElectorsByAll as getElectorByAllApi,
  // getElectorsBySearch as getElectorsBySearchApi,
  getElectorsBySearch,
  // 
  getElectorFamilyDivisions as getElectorFamilyDivisionsApi,
} from "../../helpers/backend_helper";


// 
// Election Database
// 

// Elections


function* getElectorsByAll({ payload: elector }) {
  try {
    const response = yield call(getElectorByAllApi, elector);
    yield put(ElectorApiResponseSuccess(GET_ELECTOR_BY_ALL, response.data));
  } catch (error) {
    yield put(ElectorApiResponseError(GET_ELECTOR_BY_ALL, error));
  }
}

function* getElectorsByCategory({ payload: elector }) {
  try {
    const response = yield call(getElectorsByCategoryApi, elector);
    yield put(ElectorApiResponseSuccess(GET_ELECTORS_BY_CATEGORY, response.data));
  } catch (error) {
    yield put(ElectorApiResponseError(GET_ELECTORS_BY_CATEGORY, error));
  }
}

// function* getElectorsBySearch({ payload: elector }) {
//   try {
//     const response = yield call(getElectorsBySearchApi, elector);
//     yield put(ElectorApiResponseSuccess(GET_ELECTORS_BY_SEARCH, response.data));
//   } catch (error) {
//     yield put(ElectorApiResponseError(GET_ELECTORS_BY_SEARCH, error));
//   }
// }

function* onGetElectorsBySearch({ payload: elector }) {
  try {
    const response = yield call(getElectorsBySearch, elector);
    yield put(getElectorsBySearchSuccess(response));
    toast.success("تم البحث بنجاح", { autoClose: 2000 });
  } catch (error) {
    yield put(getElectorsBySearchFail(error));
    toast.error("خطأ في البحث", { autoClose: 2000 });
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
export function* watchGetElectorsByAll() {
  yield takeEvery(GET_ELECTOR_BY_ALL, getElectorsByAll);
}

export function* watchGetElectorsByCategory() {
  yield takeEvery(GET_ELECTORS_BY_CATEGORY, getElectorsByCategory);
}

export function* watchGetElectorsBySearch() {
  yield takeEvery(GET_ELECTORS_BY_SEARCH, onGetElectorsBySearch);
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
    fork(watchGetElectorsByAll),
    fork(watchGetElectorsByCategory),
    fork(watchGetElectorsBySearch),
    // 
    fork(watchGetElectorFamilyDivisions),
  ]);
}

export default electionStatisticSaga;
