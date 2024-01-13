import { call, put, takeEvery, all, fork, take } from "redux-saga/effects";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Campaign Redux States
import {
  GET_CAMPAIGNS,
  GET_CAMPAIGN_DETAILS,
  ADD_NEW_CAMPAIGN,
  DELETE_CAMPAIGN,
  UPDATE_CAMPAIGN,

  // Campaign Members
  GET_ALL_CAMPAIGN_MEMBERS,
  ADD_NEW_CAMPAIGN_MEMBER,
  DELETE_CAMPAIGN_MEMBER,
  UPDATE_CAMPAIGN_MEMBER,
  GET_CAMPAIGN_MEMBER_DETAILS,

  // Campaign Guarantees
  GET_ALL_CAMPAIGN_GUARANTEES,
  ADD_NEW_CAMPAIGN_GUARANTEE,
  DELETE_CAMPAIGN_GUARANTEE,
  UPDATE_CAMPAIGN_GUARANTEE,
  GET_CAMPAIGN_GUARANTEE_DETAILS,

  // Campaign Attendees
  GET_CAMPAIGN_ATTENDEES,
  ADD_NEW_CAMPAIGN_ATTENDEE,
  DELETE_CAMPAIGN_ATTENDEE,
  UPDATE_CAMPAIGN_ATTENDEE,
  GET_CAMPAIGN_ATTENDEE_DETAILS,

  // Campaign Sorting
  GET_ALL_CAMPAIGN_SORTING,
  GET_CAMPAIGN_COMMITTEE_SORTING,
} from "./actionType";


import {
  // getCampaigns, getCampaignDetails,
  // API Response
  CampaignApiResponseSuccess,
  CampaignApiResponseError,

  // Campaigns
  addNewCampaignSuccess,
  addNewCampaignFail,
  updateCampaignSuccess,
  updateCampaignFail,
  deleteCampaignSuccess,
  deleteCampaignFail,

  // Campaign Members
  addNewCampaignMemberSuccess,
  addNewCampaignMemberFail,
  updateCampaignMemberSuccess,
  updateCampaignMemberFail,
  deleteCampaignMemberSuccess,
  deleteCampaignMemberFail,

  // Campaign Guarantees
  addNewCampaignGuaranteeSuccess,
  addNewCampaignGuaranteeFail,
  updateCampaignGuaranteeSuccess,
  updateCampaignGuaranteeFail,
  deleteCampaignGuaranteeSuccess,
  deleteCampaignGuaranteeFail,

  // Campaign Attendees
  addNewCampaignAttendeeSuccess,
  addNewCampaignAttendeeFail,
  updateCampaignAttendeeSuccess,
  updateCampaignAttendeeFail,
  deleteCampaignAttendeeSuccess,
  deleteCampaignAttendeeFail,

  // Campaign Sorting
  getAllCampaignSortingSuccess,
  getAllCampaignSortingFail,
  getCampaignCommitteeSortingSuccess,
  getCampaignCommitteeSortingFail,
} from "./action";

//Include Both Helper File with needed methods
import {
  getCampaigns as getCampaignsApi,
  getCampaignDetails as getCampaignDetailsApi,
  addNewCampaign,
  updateCampaign,
  deleteCampaign,

  // Campaign Members
  getAllCampaignMembers as getAllCampaignMembersApi,
  addNewCampaignMember,
  updateCampaignMember,
  deleteCampaignMember,

  // Campaign Guarantees
  getAllCampaignGuarantees as getAllCampaignGuaranteesApi,
  addNewCampaignGuarantee,
  updateCampaignGuarantee,
  deleteCampaignGuarantee,

  // Campaign Attendees
  getAllCampaignAttendees as getAllCampaignAttendeesApi,
  addNewCampaignAttendee,
  updateCampaignAttendee,
  deleteCampaignAttendee,

  // Campaign Sorting
  getAllCampaignSorting as getAllCampaignSortingApi,
  getCampaignCommitteeSorting as getCampaignCommitteeSortingApi,

} from "../../helpers/backend_helper";

// Campaigns
function* getCampaigns() {
  try {
    const response = yield call(getCampaignsApi);
    yield put(CampaignApiResponseSuccess(GET_CAMPAIGNS, response.data));
  } catch (error) {
    yield put(CampaignApiResponseError(GET_CAMPAIGNS, error));
  }
}

function* getCampaignDetails({ payload: campaign }) {
  try {
    const response = yield call(getCampaignDetailsApi, campaign);
    yield put(CampaignApiResponseSuccess(GET_CAMPAIGN_DETAILS, response.data));
  } catch (error) {
    yield put(CampaignApiResponseError(GET_CAMPAIGN_DETAILS, error));
  }
}

// Campaign Members
function* getAllCampaignMembers({ payload: campaign }) {
  try {
    const response = yield call(getAllCampaignMembersApi, campaign);
    yield put(
      CampaignApiResponseSuccess(GET_ALL_CAMPAIGN_MEMBERS, response.data)
    );
  } catch (error) {
    yield put(CampaignApiResponseError(GET_ALL_CAMPAIGN_MEMBERS, error));
  }
}


function* onAddNewCampaign({ payload: campaign }) {
  try {
    const response = yield call(addNewCampaign, campaign);
    yield put(addNewCampaignSuccess(response));
    toast.success("تم إضافة الحملة الإنتخابية بنجاح", { autoClose: 2000 });
  } catch (error) {
    yield put(addNewCampaignFail(error));
    toast.error("خطأ في إضافة الحملة الإنتخابية", { autoClose: 2000 });
  }
}


function* onDeleteCampaign({ payload: campaign }) {
  try {
    const response = yield call(deleteCampaign, campaign);
    yield put(deleteCampaignSuccess({ campaign, ...response }));
    toast.success("تم حذف الحملة الإنتخابية بنجاح", { autoClose: 2000 });
  } catch (error) {
    yield put(deleteCampaignFail(error));
    toast.error("خطأ في حذف الحملة الإنتخابية", { autoClose: 2000 });
  }
}

function* onUpdateCampaign({ payload: campaign }) {
  try {
    const response = yield call(updateCampaign, campaign);
    yield put(updateCampaignSuccess(response));
    toast.success("تم تحديث الحملة الإنتخابية بنجاح", {
      autoClose: 2000,
    });
  } catch (error) {
    yield put(updateCampaignFail(error));
    toast.error("خطأ في تحديث الحملة الإنتخابية", { autoClose: 2000 });
  }
}


// CampaignGuarantees
function* getAllCampaignGuarantees({ payload: campaign }) {
  try {
    const response = yield call(getAllCampaignGuaranteesApi, campaign);
    yield put(
      CampaignApiResponseSuccess(GET_ALL_CAMPAIGN_GUARANTEES, response.data)
    );
  } catch (error) {
    yield put(CampaignApiResponseError(GET_ALL_CAMPAIGN_GUARANTEES, error));
  }
}

function* onAddNewCampaignMember({ payload: campaignMember }) {
  try {
    const response = yield call(addNewCampaignMember, campaignMember);
    yield put(addNewCampaignMemberSuccess(response));
    toast.success("تم إضافة عضو للحملة الإنتخابية بنجاح", { autoClose: 2000 });
  } catch (error) {
    yield put(addNewCampaignMemberFail(error));
    toast.error("خطأ في إضافة عضو للحملة الإنتخابية", { autoClose: 2000 });
  }
}

function* onUpdateCampaignMember({ payload: campaignMember }) {
  try {
    const response = yield call(updateCampaignMember, campaignMember);
    yield put(updateCampaignMemberSuccess(response));
    toast.success("تم تعديل عضو الحملة الإنتخابية بنجاح", {
      autoClose: 2000,
    });
  } catch (error) {
    yield put(updateCampaignMemberFail(error));
    toast.error("خطأ في تحديث عضو للحملة الإنتخابية", { autoClose: 2000 });
  }
}

function* onDeleteCampaignMember({ payload: campaignMember }) {
  try {
    const response = yield call(deleteCampaignMember, campaignMember);
    yield put(deleteCampaignMemberSuccess({ campaignMember, ...response }));
    toast.success("تم حذف عضو الحملة الإنتخابية بنجاح", { autoClose: 2000 });
  } catch (error) {
    yield put(deleteCampaignMemberFail(error));
    toast.error("خطأ في حذف عضو للحملة الإنتخابية", { autoClose: 2000 });
  }
}
function* onAddNewCampaignGuarantee({ payload: campaignGuarantee }) {
  try {
    const response = yield call(addNewCampaignGuarantee, campaignGuarantee);
    yield put(addNewCampaignGuaranteeSuccess(response));
    toast.success("تم إضافة المضمون للحملة الإنتخابية بنجاح", { autoClose: 2000 });
  } catch (error) {
    yield put(addNewCampaignGuaranteeFail(error));
    toast.error("خطأ في إضافة المضمون للحملة الإنتخابية", { autoClose: 2000 });
  }
}


function* onUpdateCampaignGuarantee({ payload: campaignGuarantee }) {
  try {
    const response = yield call(updateCampaignGuarantee, campaignGuarantee);
    yield put(updateCampaignGuaranteeSuccess(response));
    toast.success("تم تحديث المضمون للحملة الإنتخابية بنجاح", {
      autoClose: 2000,
    });
  } catch (error) {
    yield put(updateCampaignGuaranteeFail(error));
    toast.error("خطأ في تحديث المضمون للحملة الإنتخابية", { autoClose: 2000 });
  }
}

function* onDeleteCampaignGuarantee({ payload: campaignGuarantee }) {
  try {
    const response = yield call(deleteCampaignGuarantee, campaignGuarantee);
    yield put(
      deleteCampaignGuaranteeSuccess({ campaignGuarantee, ...response })
    );
    toast.success("تم حذف المضمون للحملة الإنتخابية بنجاح", { autoClose: 2000 });
  } catch (error) {
    yield put(deleteCampaignGuaranteeFail(error));
    toast.error("خطأ في حذف المضمون للحملة الإنتخابية", { autoClose: 2000 });
  }
}

// CampaignAttendees
function* getAllCampaignAttendees({ payload: campaign }) {
  try {
    console.log("getAllCampaignAttendees: SAGA?")
    const response = yield call(getAllCampaignAttendeesApi, campaign);
    yield put(
      CampaignApiResponseSuccess(GET_CAMPAIGN_ATTENDEES, response.data)
    );
  } catch (error) {
    yield put(CampaignApiResponseError(GET_CAMPAIGN_ATTENDEES, error));
  }
}

function* onAddNewCampaignAttendee({ payload: campaignAttendee }) {
  try {
    const response = yield call(addNewCampaignAttendee, campaignAttendee);
    yield put(addNewCampaignAttendeeSuccess(response));
    // toast.success("CampaignAttendee Added Successfully", { autoClose: 2000 });
  } catch (error) {
    yield put(addNewCampaignAttendeeFail(error));
    // toast.error("CampaignAttendee Added Failed", { autoClose: 2000 });
  }
}

function* onDeleteCampaignAttendee({ payload: campaignAttendee }) {
  try {
    const response = yield call(deleteCampaignAttendee, campaignAttendee);
    yield put(
      deleteCampaignAttendeeSuccess({ campaignAttendee, ...response })
    );
    toast.success("CampaignAttendee Delete Successfully", { autoClose: 2000 });
  } catch (error) {
    yield put(deleteCampaignAttendeeFail(error));
    toast.error("CampaignAttendee Delete Failed", { autoClose: 2000 });
  }
}

function* onUpdateCampaignAttendee({ payload: campaignAttendee }) {
  try {
    const response = yield call(updateCampaignAttendee, campaignAttendee);
    yield put(updateCampaignAttendeeSuccess(response));
    toast.success("CampaignAttendee Updated Successfully", {
      autoClose: 2000,
    });
  } catch (error) {
    yield put(updateCampaignAttendeeFail(error));
    toast.error("CampaignAttendee Updated Failed", { autoClose: 2000 });
  }
}

// Campaign Sorting
function* getAllCampaignSorting() {
  try {
    const response = yield call(getAllCampaignSortingApi);
    yield put(
      CampaignApiResponseSuccess(GET_ALL_CAMPAIGN_SORTING, response.data)
    );
  } catch (error) {
    yield put(CampaignApiResponseError(GET_ALL_CAMPAIGN_SORTING, error));
  }
}

function* getCampaignCommitteeSorting(){
  try {
    const response = yield call(getCampaignCommitteeSortingApi);
    yield put(
      CampaignApiResponseSuccess(GET_CAMPAIGN_COMMITTEE_SORTING, response.data)
    );
  } catch (error) {
    yield put(CampaignApiResponseError(GET_CAMPAIGN_COMMITTEE_SORTING, error));
  }
}



// Campaign Watchers
export function* watchGetCampaigns() {
  yield takeEvery(GET_CAMPAIGNS, getCampaigns);
}

export function* watchGetCampaignDetails() {
  yield takeEvery(GET_CAMPAIGN_DETAILS, getCampaignDetails);
}

export function* watchAddNewCampaign() {
  yield takeEvery(ADD_NEW_CAMPAIGN, onAddNewCampaign);
}

export function* watchUpdateCampaign() {
  yield takeEvery(UPDATE_CAMPAIGN, onUpdateCampaign);
}

export function* watchDeleteCampaign() {
  yield takeEvery(DELETE_CAMPAIGN, onDeleteCampaign);
}

// Campaign Members Watchers
export function* watchGetAllCampaignMembers() {
  yield takeEvery(GET_ALL_CAMPAIGN_MEMBERS, getAllCampaignMembers);
}

export function* watchAddNewCampaignMember() {
  yield takeEvery(ADD_NEW_CAMPAIGN_MEMBER, onAddNewCampaignMember);
}

export function* watchUpdateCampaignMember() {
  yield takeEvery(UPDATE_CAMPAIGN_MEMBER, onUpdateCampaignMember);
}

export function* watchDeleteCampaignMember() {
  yield takeEvery(DELETE_CAMPAIGN_MEMBER, onDeleteCampaignMember);
}

// CampaignGuarantees Watchers
export function* watchGetAllCampaignGuarantees() {
  yield takeEvery(GET_ALL_CAMPAIGN_GUARANTEES, getAllCampaignGuarantees);
}

export function* watchAddNewCampaignGuarantee() {
  yield takeEvery(ADD_NEW_CAMPAIGN_GUARANTEE, onAddNewCampaignGuarantee);
}

export function* watchUpdateCampaignGuarantee() {
  yield takeEvery(UPDATE_CAMPAIGN_GUARANTEE, onUpdateCampaignGuarantee);
}

export function* watchDeleteCampaignGuarantee() {
  yield takeEvery(DELETE_CAMPAIGN_GUARANTEE, onDeleteCampaignGuarantee);
}

// CampaignAttendees Watchers
export function* watchGetAllCampaignAttendees() {
  yield takeEvery(GET_CAMPAIGN_ATTENDEES, getAllCampaignAttendees);
}

export function* watchAddNewCampaignAttendee() {
  yield takeEvery(ADD_NEW_CAMPAIGN_ATTENDEE, onAddNewCampaignAttendee);
}

export function* watchUpdateCampaignAttendee() {
  yield takeEvery(UPDATE_CAMPAIGN_ATTENDEE, onUpdateCampaignAttendee);
}

export function* watchDeleteCampaignAttendee() {
  yield takeEvery(DELETE_CAMPAIGN_ATTENDEE, onDeleteCampaignAttendee);
}

// Campaign Sorting Watchers
export function* watchGetAllCampaignSorting() {
  yield takeEvery(GET_ALL_CAMPAIGN_SORTING, getAllCampaignSorting);
}

export function* watchGetCampaignCommitteeSorting() {
  yield takeEvery(GET_CAMPAIGN_COMMITTEE_SORTING, getCampaignCommitteeSorting);
}

function* campaignSaga() {
  yield all([
    // Campaigns
    fork(watchGetCampaigns),
    fork(watchGetCampaignDetails),
    fork(watchAddNewCampaign),
    fork(watchUpdateCampaign),
    fork(watchDeleteCampaign),

    // Campaign Members
    fork(watchGetAllCampaignMembers),
    // fork(watchGetCampaignMemberDetails),
    fork(watchAddNewCampaignMember),
    fork(watchUpdateCampaignMember),
    fork(watchDeleteCampaignMember),

    // CampaignGuarantees
    fork(watchGetAllCampaignGuarantees),
    // fork(watchGetCampaignGuaranteeDetails),
    fork(watchAddNewCampaignGuarantee),
    fork(watchUpdateCampaignGuarantee),
    fork(watchDeleteCampaignGuarantee),

    // CampaignAttendees
    fork(watchGetAllCampaignAttendees),
    // fork(watchGetCampaignAttendeeDetails),
    fork(watchAddNewCampaignAttendee),
    fork(watchUpdateCampaignAttendee),
    fork(watchDeleteCampaignAttendee),

// Campaign Sorting
    fork(watchGetAllCampaignSorting),
    fork(watchGetCampaignCommitteeSorting),
  ]);
}

export default campaignSaga;
