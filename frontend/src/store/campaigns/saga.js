import { call, put, takeEvery, all, fork, take } from "redux-saga/effects";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Campaign Redux States
import {
  GET_CAMPAIGNS,
  GET_CAMPAIGN_DETAILS,
  ADD_CAMPAIGN,
  DELETE_CAMPAIGN,
  UPDATE_CAMPAIGN,
  // Campaign Members
  GET_ALL_CAMPAIGN_MEMBERS,
  ADD_CAMPAIGN_MEMBER,
  DELETE_CAMPAIGN_MEMBER,
  UPDATE_CAMPAIGN_MEMBER,
  GET_CAMPAIGN_MEMBER_DETAILS,

  // Campaign Guarantees
  GET_ALL_CAMPAIGN_GUARANTEES,
  ADD_CAMPAIGN_GUARANTEE,
  DELETE_CAMPAIGN_GUARANTEE,
  UPDATE_CAMPAIGN_GUARANTEE,
  GET_CAMPAIGN_GUARANTEE_DETAILS,

  // Campaign GuaranteeGroups
  GET_ALL_CAMPAIGN_GUARANTEE_GROUPS,
  ADD_CAMPAIGN_GUARANTEE_GROUP,
  DELETE_CAMPAIGN_GUARANTEE_GROUP,
  UPDATE_CAMPAIGN_GUARANTEE_GROUP,
  GET_CAMPAIGN_GUARANTEE_GROUP_DETAILS,

  // Campaign Attendees
  GET_CAMPAIGN_ATTENDEES,
  ADD_CAMPAIGN_ATTENDEE,
  DELETE_CAMPAIGN_ATTENDEE,
  UPDATE_CAMPAIGN_ATTENDEE,
  GET_CAMPAIGN_ATTENDEE_DETAILS,

  // Campaign Sorting
  GET_ALL_CAMPAIGN_SORTING,
  GET_CAMPAIGN_COMMITTEE_SORTING,
} from "./actionType";

import { UPDATE_ELECTION_CANDIDATE_SUCCESS, UPDATE_ELECTION_CANDIDATE_FAIL } from "../elections/actionType";

import {
  // getCampaigns, getCampaignDetails,
  // API Response
  CampaignApiResponseSuccess,
  CampaignApiResponseError,

  // Campaigns
  addCampaignSuccess,
  addCampaignFail,
  updateCampaignSuccess,
  updateCampaignFail,
  deleteCampaignSuccess,
  deleteCampaignFail,

  // Campaign Members
  addCampaignMemberSuccess,
  addCampaignMemberFail,
  updateCampaignMemberSuccess,
  updateCampaignMemberFail,
  deleteCampaignMemberSuccess,
  deleteCampaignMemberFail,

  // Campaign Guarantees
  addCampaignGuaranteeSuccess,
  addCampaignGuaranteeFail,
  updateCampaignGuaranteeSuccess,
  updateCampaignGuaranteeFail,
  deleteCampaignGuaranteeSuccess,
  deleteCampaignGuaranteeFail,

  // Campaign GuaranteeGroups
  addCampaignGuaranteeGroupSuccess,
  addCampaignGuaranteeGroupFail,
  updateCampaignGuaranteeGroupSuccess,
  updateCampaignGuaranteeGroupFail,
  deleteCampaignGuaranteeGroupSuccess,
  deleteCampaignGuaranteeGroupFail,

  // Campaign Attendees
  addCampaignAttendeeSuccess,
  addCampaignAttendeeFail,
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

import {
  updateElectionCandidateSuccess,
  updateElectionCandidateFail
} from "../elections/action"

//Include Both Helper File with needed methods
import {
  getCampaigns as getCampaignsApi,
  getCampaignDetails as getCampaignDetailsApi,
  addCampaign as addCampaignApi,
  updateCampaign,
  deleteCampaign,

  // Campaign Members
  getAllCampaignMembers as getAllCampaignMembersApi,
  addCampaignMember,
  updateCampaignMember,
  deleteCampaignMember,

  // Campaign Guarantees
  getAllCampaignGuarantees as getAllCampaignGuaranteesApi,
  addCampaignGuarantee,
  updateCampaignGuarantee,
  deleteCampaignGuarantee,

  // Campaign GuaranteeGroups
  getAllCampaignGuaranteeGroups as getAllCampaignGuaranteeGroupsApi,
  addCampaignGuaranteeGroup,
  updateCampaignGuaranteeGroup,
  deleteCampaignGuaranteeGroup,


  // Campaign Attendees
  getAllCampaignAttendees as getAllCampaignAttendeesApi,
  addCampaignAttendee,
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


function* onAddCampaign({ payload: campaign }) {
  try {
    const response = yield call(addCampaignApi, campaign);
    const electionCandidate = {
      data: {
        id: response.data.electionCandidate,
        campaign: response.data,
      }
    };
    console.log("electionCandidateResponse", electionCandidate);
    yield put(CampaignApiResponseSuccess(ADD_CAMPAIGN, response.data));
    yield put(updateElectionCandidateSuccess(electionCandidate));
    toast.success("تم إضافة الحملة الإنتخابية بنجاح", { autoClose: 2000 });
  } catch (error) {
    yield put(CampaignApiResponseError(ADD_CAMPAIGN, error));
    yield put(updateElectionCandidateFail(error));
    toast.error("خطأ في إضافة الحملة الإنتخابية", { autoClose: 2000 });
  }
}




// function* onAddCampaign({ payload: campaign }) {
//   console.log("campaign: ", campaign)
//   try {
//     const response = yield call(addCampaign, campaign);
//     yield put(addCampaignSuccess(response));
//     toast.success("تم إضافة الحملة الإنتخابية بنجاح", { autoClose: 2000 });
//   } catch (error) {
//     yield put(addCampaignFail(error));
//     toast.error("خطأ في إضافة الحملة الإنتخابية", { autoClose: 2000 });
//   }
// }

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

function* onAddCampaignMember({ payload: campaignMember }) {
  try {
    const response = yield call(addCampaignMember, campaignMember);
    yield put(addCampaignMemberSuccess(response));
    toast.success("تم إضافة عضو للحملة الإنتخابية بنجاح", { autoClose: 2000 });
  } catch (error) {
    yield put(addCampaignMemberFail(error));
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

function* onAddCampaignGuarantee({ payload: campaignGuarantee }) {
  try {
    const response = yield call(addCampaignGuarantee, campaignGuarantee);
    yield put(addCampaignGuaranteeSuccess(response));
    toast.success("تم إضافة الضمان للحملة الإنتخابية بنجاح", { autoClose: 2000 });
  } catch (error) {
    yield put(addCampaignGuaranteeFail(error));
    toast.error("خطأ في إضافة الضمان للحملة الإنتخابية", { autoClose: 2000 });
  }
}

function* onUpdateCampaignGuarantee({ payload: campaignGuarantee }) {
  try {
    const response = yield call(updateCampaignGuarantee, campaignGuarantee);
    yield put(updateCampaignGuaranteeSuccess(response));
    toast.success("تم تحديث الضمان للحملة الإنتخابية بنجاح", {
      autoClose: 2000,
    });
  } catch (error) {
    yield put(updateCampaignGuaranteeFail(error));
    toast.error("خطأ في تحديث الضمان للحملة الإنتخابية", { autoClose: 2000 });
  }
}

function* onDeleteCampaignGuarantee({ payload: campaignGuarantee }) {
  try {
    const response = yield call(deleteCampaignGuarantee, campaignGuarantee);
    yield put(deleteCampaignGuaranteeSuccess({ campaignGuarantee, ...response }));
    toast.success("تم حذف الضمان للحملة الإنتخابية بنجاح", { autoClose: 2000 });
  } catch (error) {
    yield put(deleteCampaignGuaranteeFail(error));
    toast.error("خطأ في حذف الضمان للحملة الإنتخابية", { autoClose: 2000 });
  }
}


// CampaignGuaranteeGroups
function* getAllCampaignGuaranteeGroups({ payload: campaign }) {
  try {
    const response = yield call(getAllCampaignGuaranteeGroupsApi, campaign);
    yield put(
      CampaignApiResponseSuccess(GET_ALL_CAMPAIGN_GUARANTEE_GROUPS, response.data)
    );
  } catch (error) {
    yield put(CampaignApiResponseError(GET_ALL_CAMPAIGN_GUARANTEE_GROUPS, error));
  }
}

function* onAddCampaignGuaranteeGroup({ payload: campaignGuaranteeGroup }) {
  try {
    const response = yield call(addCampaignGuaranteeGroup, campaignGuaranteeGroup);
    yield put(addCampaignGuaranteeGroupSuccess(response));
    toast.success("تم إضافة الضمان للحملة الإنتخابية بنجاح", { autoClose: 2000 });
  } catch (error) {
    yield put(addCampaignGuaranteeGroupFail(error));
    toast.error("خطأ في إضافة الضمان للحملة الإنتخابية", { autoClose: 2000 });
  }
}

function* onUpdateCampaignGuaranteeGroup({ payload: campaignGuaranteeGroup }) {
  console.log("SAGA: campaignGuaranteeGroup: ", campaignGuaranteeGroup)
  try {
    const response = yield call(updateCampaignGuaranteeGroup, campaignGuaranteeGroup);
    yield put(updateCampaignGuaranteeGroupSuccess(response));
    toast.success("تم تحديث الضمان للحملة الإنتخابية بنجاح", {
      autoClose: 2000,
    });
  } catch (error) {
    yield put(updateCampaignGuaranteeGroupFail(error));
    toast.error("خطأ في تحديث الضمان للحملة الإنتخابية", { autoClose: 2000 });
  }
}

function* onDeleteCampaignGuaranteeGroup({ payload: campaignGuaranteeGroup }) {
  try {
    const response = yield call(deleteCampaignGuaranteeGroup, campaignGuaranteeGroup);
    yield put(
      deleteCampaignGuaranteeGroupSuccess({ campaignGuaranteeGroup, ...response })
    );
    toast.success("تم حذف الضمان للحملة الإنتخابية بنجاح", { autoClose: 2000 });
  } catch (error) {
    yield put(deleteCampaignGuaranteeGroupFail(error));
    toast.error("خطأ في حذف الضمان للحملة الإنتخابية", { autoClose: 2000 });
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

function* onAddCampaignAttendee({ payload: campaignAttendee }) {
  try {
    const response = yield call(addCampaignAttendee, campaignAttendee);
    yield put(addCampaignAttendeeSuccess(response));
    // toast.success("CampaignAttendee Added Successfully", { autoClose: 2000 });
  } catch (error) {
    yield put(addCampaignAttendeeFail(error));
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

function* getCampaignCommitteeSorting() {
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

export function* watchAddCampaign() {
  yield takeEvery(ADD_CAMPAIGN, onAddCampaign);
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

export function* watchAddCampaignMember() {
  yield takeEvery(ADD_CAMPAIGN_MEMBER, onAddCampaignMember);
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

export function* watchAddCampaignGuarantee() {
  yield takeEvery(ADD_CAMPAIGN_GUARANTEE, onAddCampaignGuarantee);
}

export function* watchUpdateCampaignGuarantee() {
  yield takeEvery(UPDATE_CAMPAIGN_GUARANTEE, onUpdateCampaignGuarantee);
}

export function* watchDeleteCampaignGuarantee() {
  yield takeEvery(DELETE_CAMPAIGN_GUARANTEE, onDeleteCampaignGuarantee);
}

// CampaignGuaranteeGroups Watchers
export function* watchGetAllCampaignGuaranteeGroups() {
  yield takeEvery(GET_ALL_CAMPAIGN_GUARANTEE_GROUPS, getAllCampaignGuaranteeGroups);
}

export function* watchAddCampaignGuaranteeGroup() {
  yield takeEvery(ADD_CAMPAIGN_GUARANTEE_GROUP, onAddCampaignGuaranteeGroup);
}

export function* watchUpdateCampaignGuaranteeGroup() {
  yield takeEvery(UPDATE_CAMPAIGN_GUARANTEE_GROUP, onUpdateCampaignGuaranteeGroup);
}

export function* watchDeleteCampaignGuaranteeGroup() {
  yield takeEvery(DELETE_CAMPAIGN_GUARANTEE_GROUP, onDeleteCampaignGuaranteeGroup);
}


// CampaignAttendees Watchers
export function* watchGetAllCampaignAttendees() {
  yield takeEvery(GET_CAMPAIGN_ATTENDEES, getAllCampaignAttendees);
}

export function* watchAddCampaignAttendee() {
  yield takeEvery(ADD_CAMPAIGN_ATTENDEE, onAddCampaignAttendee);
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
    fork(watchAddCampaign),
    fork(watchUpdateCampaign),
    fork(watchDeleteCampaign),

    // Campaign Members
    fork(watchGetAllCampaignMembers),
    // fork(watchGetCampaignMemberDetails),
    fork(watchAddCampaignMember),
    fork(watchUpdateCampaignMember),
    fork(watchDeleteCampaignMember),

    // CampaignGuarantees
    fork(watchGetAllCampaignGuarantees),
    // fork(watchGetCampaignGuaranteeDetails),
    fork(watchAddCampaignGuarantee),
    fork(watchUpdateCampaignGuarantee),
    fork(watchDeleteCampaignGuarantee),

    // CampaignGuaranteeGroups
    fork(watchGetAllCampaignGuaranteeGroups),
    // fork(watchGetCampaignGuaranteeGroupDetails),
    fork(watchAddCampaignGuaranteeGroup),
    fork(watchUpdateCampaignGuaranteeGroup),
    fork(watchDeleteCampaignGuaranteeGroup),

    // CampaignAttendees
    fork(watchGetAllCampaignAttendees),
    // fork(watchGetCampaignAttendeeDetails),
    fork(watchAddCampaignAttendee),
    fork(watchUpdateCampaignAttendee),
    fork(watchDeleteCampaignAttendee),

    // Campaign Sorting
    fork(watchGetAllCampaignSorting),
    fork(watchGetCampaignCommitteeSorting),
  ]);
}

export default campaignSaga;
