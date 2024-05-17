import { call, put, takeEvery, all, fork, take } from "redux-saga/effects";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Committee Redux States
import {

    // Election Committees
    GET_ELECTION_COMMITTEES,
    ADD_NEW_ELECTION_COMMITTEE,
    UPDATE_ELECTION_COMMITTEE,
    DELETE_ELECTION_COMMITTEE,

    // Election Committee Results
    UPDATE_ELECTION_RESULTS,
} from "./actionType";

import {
    // API Response
    CommitteeApiResponseSuccess,
    CommitteeApiResponseError,

    // Election Committees
    addElectionCommitteeSuccess,
    addElectionCommitteeFail,
    updateElectionCommitteeSuccess,
    updateElectionCommitteeFail,
    deleteElectionCommitteeSuccess,
    deleteElectionCommitteeFail,

    // Election Committees Results
    updateElectionResultsSuccess,
    updateElectionResultsFail,
} from "./action";
import {
    // Election Committees
    getElectionCommittees as getElectionCommitteesApi,
    addNewElectionCommittee,
    updateElectionCommittee,
    deleteElectionCommittee,
    updateElectionResults,
} from "../../helpers/backend_helper";


// Election Committees
function* getElectionCommittees({ payload: election }) {
    try {
        const response = yield call(getElectionCommitteesApi, election);
        yield put(
            CommitteeApiResponseSuccess(GET_ELECTION_COMMITTEES, response.data)
        );
    } catch (error) {
        yield put(CommitteeApiResponseError(GET_ELECTION_COMMITTEES, error));
    }
}

function* onAddNewElectionCommittee({ payload: electionCommittee }) {
    try {
        const response = yield call(addNewElectionCommittee, electionCommittee);
        yield put(addElectionCommitteeSuccess(response));
        toast.success("تم إضافة لجنة الانتخابات بنجاح", { autoClose: 2000 });
    } catch (error) {
        yield put(addElectionCommitteeFail(error));
        toast.error("خطأ في إضافة اللجنة الإنتخابية", { autoClose: 2000 });
    }
}

function* onDeleteElectionCommittee({ payload: electionCommittee }) {
    try {
        const response = yield call(deleteElectionCommittee, electionCommittee);
        yield put(
            deleteElectionCommitteeSuccess({ electionCommittee, ...response })
        );
        toast.success("تم حذف اللجنة الإنتخابية بنجاح", { autoClose: 2000 });
    } catch (error) {
        yield put(deleteElectionCommitteeFail(error));
        toast.error("خطأ في حذف اللجنة الإنتخابية", { autoClose: 2000 });
    }
}

function* onUpdateElectionCommittee({ payload: electionCommittee }) {
    try {
        const response = yield call(updateElectionCommittee, electionCommittee);
        yield put(updateElectionCommitteeSuccess(response));
        toast.success("تم تحديث اللجنة الإنتخابية بنجاح", {
            autoClose: 2000,
        });
    } catch (error) {
        yield put(updateElectionCommitteeFail(error));
        toast.error("خطأ في تحديث اللجنة الإنتخابية", { autoClose: 2000 });
    }
}


function* onUpdateElectionCommitteeResults({ payload: electionResult }) {
    try {
        const response = yield call(updateElectionResults, electionResult);
        yield put(updateElectionResultsSuccess(response));
        toast.success("تم تحديث النتائج بنجاح", {
            autoClose: 2000,
        });
    } catch (error) {
        console.error('Saga Error:', error); // Log any error that occurs
        yield put(updateElectionResultsFail(error));
        toast.error("خطأ في تحديث النتائج", { autoClose: 2000 });
    }
}



// Election Committees Watchers
export function* watchGetElectionCommittees() {
    yield takeEvery(GET_ELECTION_COMMITTEES, getElectionCommittees);
}

export function* watchAddNewElectionCommittee() {
    yield takeEvery(ADD_NEW_ELECTION_COMMITTEE, onAddNewElectionCommittee);
}

export function* watchUpdateElectionCommittee() {
    yield takeEvery(UPDATE_ELECTION_COMMITTEE, onUpdateElectionCommittee);
}

export function* watchDeleteElectionCommittee() {
    yield takeEvery(DELETE_ELECTION_COMMITTEE, onDeleteElectionCommittee);
}

// Election Committees Results Watchers
export function* watchUpdateElectionCommitteeResults() {
    yield takeEvery(UPDATE_ELECTION_RESULTS, onUpdateElectionCommitteeResults);
}

function* committeeSaga() {
    yield all([
        // ElectionCommittees
        fork(watchGetElectionCommittees),
        fork(watchAddNewElectionCommittee),
        fork(watchUpdateElectionCommittee),
        fork(watchDeleteElectionCommittee),

        // ElectionCommitteeResults
        fork(watchUpdateElectionCommitteeResults),
    ]);
}

export default committeeSaga;
