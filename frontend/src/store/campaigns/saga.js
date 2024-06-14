import { call, put, takeEvery, all, fork, take } from "redux-saga/effects";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Campaign Redux States
import {
  GET_CAMPAIGNS,
  GET_CAMPAIGN_DETAILS,
<<<<<<< HEAD
  ADD_NEW_CAMPAIGN,
  DELETE_CAMPAIGN,
  UPDATE_CAMPAIGN,

  // Campaign Members
  GET_ALL_CAMPAIGN_MEMBERS,
  ADD_NEW_CAMPAIGN_MEMBER,
=======
  ADD_CAMPAIGN,
  DELETE_CAMPAIGN,
  UPDATE_CAMPAIGN,
  // Campaign Members
  GET_ALL_CAMPAIGN_MEMBERS,
  ADD_CAMPAIGN_MEMBER,
>>>>>>> sanad
  DELETE_CAMPAIGN_MEMBER,
  UPDATE_CAMPAIGN_MEMBER,
  GET_CAMPAIGN_MEMBER_DETAILS,

  // Campaign Guarantees
  GET_ALL_CAMPAIGN_GUARANTEES,
<<<<<<< HEAD
  ADD_NEW_CAMPAIGN_GUARANTEE,
=======
  ADD_CAMPAIGN_GUARANTEE,
>>>>>>> sanad
  DELETE_CAMPAIGN_GUARANTEE,
  UPDATE_CAMPAIGN_GUARANTEE,
  GET_CAMPAIGN_GUARANTEE_DETAILS,

<<<<<<< HEAD
  // Campaign Attendees
  GET_CAMPAIGN_ATTENDEES,
  ADD_NEW_CAMPAIGN_ATTENDEE,
=======
  // Campaign GuaranteeGroups
  GET_ALL_CAMPAIGN_GUARANTEE_GROUPS,
  ADD_CAMPAIGN_GUARANTEE_GROUP,
  DELETE_CAMPAIGN_GUARANTEE_GROUP,
  UPDATE_CAMPAIGN_GUARANTEE_GROUP,
  GET_CAMPAIGN_GUARANTEE_GROUP_DETAILS,

  // Campaign Attendees
  GET_CAMPAIGN_ATTENDEES,
  ADD_CAMPAIGN_ATTENDEE,
>>>>>>> sanad
  DELETE_CAMPAIGN_ATTENDEE,
  UPDATE_CAMPAIGN_ATTENDEE,
  GET_CAMPAIGN_ATTENDEE_DETAILS,

  // Campaign Sorting
  GET_ALL_CAMPAIGN_SORTING,
  GET_CAMPAIGN_COMMITTEE_SORTING,
} from "./actionType";

<<<<<<< HEAD
=======
import { UPDATE_ELECTION_CANDIDATE_SUCCESS, UPDATE_ELECTION_CANDIDATE_FAIL } from "../elections/actionType";
>>>>>>> sanad

import {
  // getCampaigns, getCampaignDetails,
  // API Response
  CampaignApiResponseSuccess,
  CampaignApiResponseError,

  // Campaigns
<<<<<<< HEAD
  addNewCampaignSuccess,
  addNewCampaignFail,
=======
  addCampaignSuccess,
  addCampaignFail,
>>>>>>> sanad
  updateCampaignSuccess,
  updateCampaignFail,
  deleteCampaignSuccess,
  deleteCampaignFail,

  // Campaign Members
<<<<<<< HEAD
  addNewCampaignMemberSuccess,
  addNewCampaignMemberFail,
=======
  addCampaignMemberSuccess,
  addCampaignMemberFail,
>>>>>>> sanad
  updateCampaignMemberSuccess,
  updateCampaignMemberFail,
  deleteCampaignMemberSuccess,
  deleteCampaignMemberFail,

  // Campaign Guarantees
<<<<<<< HEAD
  addNewCampaignGuaranteeSuccess,
  addNewCampaignGuaranteeFail,
=======
  addCampaignGuaranteeSuccess,
  addCampaignGuaranteeFail,
>>>>>>> sanad
  updateCampaignGuaranteeSuccess,
  updateCampaignGuaranteeFail,
  deleteCampaignGuaranteeSuccess,
  deleteCampaignGuaranteeFail,

<<<<<<< HEAD
  // Campaign Attendees
  addNewCampaignAttendeeSuccess,
  addNewCampaignAttendeeFail,
=======
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
>>>>>>> sanad
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

<<<<<<< HEAD
=======
import {
  updateElectionCandidateSuccess,
  updateElectionCandidateFail
} from "../elections/action"

>>>>>>> sanad
//Include Both Helper File with needed methods
import {
  getCampaigns as getCampaignsApi,
  getCampaignDetails as getCampaignDetailsApi,
<<<<<<< HEAD
  addNewCampaign,
=======
  addCampaign as addCampaignApi,
>>>>>>> sanad
  updateCampaign,
  deleteCampaign,

  // Campaign Members
  getAllCampaignMembers as getAllCampaignMembersApi,
<<<<<<< HEAD
  addNewCampaignMember,
=======
  addCampaignMember,
>>>>>>> sanad
  updateCampaignMember,
  deleteCampaignMember,

  // Campaign Guarantees
  getAllCampaignGuarantees as getAllCampaignGuaranteesApi,
<<<<<<< HEAD
  addNewCampaignGuarantee,
  updateCampaignGuarantee,
  deleteCampaignGuarantee,

  // Campaign Attendees
  getAllCampaignAttendees as getAllCampaignAttendeesApi,
  addNewCampaignAttendee,
=======
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
>>>>>>> sanad
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


<<<<<<< HEAD
function* onAddNewCampaign({ payload: campaign }) {
  try {
    const response = yield call(addNewCampaign, campaign);
    yield put(addNewCampaignSuccess(response));
    toast.success("تم إضافة الحملة الإنتخابية بنجاح", { autoClose: 2000 });
  } catch (error) {
    yield put(addNewCampaignFail(error));
=======
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
>>>>>>> sanad
    toast.error("خطأ في إضافة الحملة الإنتخابية", { autoClose: 2000 });
  }
}


<<<<<<< HEAD
=======


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

>>>>>>> sanad
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

<<<<<<< HEAD

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
=======
function* onAddCampaignMember({ payload: campaignMember }) {
  try {
    const response = yield call(addCampaignMember, campaignMember);
    yield put(addCampaignMemberSuccess(response));
    toast.success("تم إضافة عضو للحملة الإنتخابية بنجاح", { autoClose: 2000 });
  } catch (error) {
    yield put(addCampaignMemberFail(error));
>>>>>>> sanad
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
<<<<<<< HEAD
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

=======

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
>>>>>>> sanad

function* onUpdateCampaignGuarantee({ payload: campaignGuarantee }) {
  try {
    const response = yield call(updateCampaignGuarantee, campaignGuarantee);
    yield put(updateCampaignGuaranteeSuccess(response));
<<<<<<< HEAD
    toast.success("تم تحديث المضمون للحملة الإنتخابية بنجاح", {
=======
    toast.success("تم تحديث الضمان للحملة الإنتخابية بنجاح", {
>>>>>>> sanad
      autoClose: 2000,
    });
  } catch (error) {
    yield put(updateCampaignGuaranteeFail(error));
<<<<<<< HEAD
    toast.error("خطأ في تحديث المضمون للحملة الإنتخابية", { autoClose: 2000 });
=======
    toast.error("خطأ في تحديث الضمان للحملة الإنتخابية", { autoClose: 2000 });
>>>>>>> sanad
  }
}

function* onDeleteCampaignGuarantee({ payload: campaignGuarantee }) {
  try {
    const response = yield call(deleteCampaignGuarantee, campaignGuarantee);
<<<<<<< HEAD
    yield put(
      deleteCampaignGuaranteeSuccess({ campaignGuarantee, ...response })
    );
    toast.success("تم حذف المضمون للحملة الإنتخابية بنجاح", { autoClose: 2000 });
  } catch (error) {
    yield put(deleteCampaignGuaranteeFail(error));
    toast.error("خطأ في حذف المضمون للحملة الإنتخابية", { autoClose: 2000 });
=======
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
>>>>>>> sanad
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

<<<<<<< HEAD
function* onAddNewCampaignAttendee({ payload: campaignAttendee }) {
  try {
    const response = yield call(addNewCampaignAttendee, campaignAttendee);
    yield put(addNewCampaignAttendeeSuccess(response));
    // toast.success("CampaignAttendee Added Successfully", { autoClose: 2000 });
  } catch (error) {
    yield put(addNewCampaignAttendeeFail(error));
=======
function* onAddCampaignAttendee({ payload: campaignAttendee }) {
  try {
    const response = yield call(addCampaignAttendee, campaignAttendee);
    yield put(addCampaignAttendeeSuccess(response));
    // toast.success("CampaignAttendee Added Successfully", { autoClose: 2000 });
  } catch (error) {
    yield put(addCampaignAttendeeFail(error));
>>>>>>> sanad
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

<<<<<<< HEAD
function* getCampaignCommitteeSorting(){
=======
function* getCampaignCommitteeSorting() {
>>>>>>> sanad
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

<<<<<<< HEAD
export function* watchAddNewCampaign() {
  yield takeEvery(ADD_NEW_CAMPAIGN, onAddNewCampaign);
=======
export function* watchAddCampaign() {
  yield takeEvery(ADD_CAMPAIGN, onAddCampaign);
>>>>>>> sanad
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

<<<<<<< HEAD
export function* watchAddNewCampaignMember() {
  yield takeEvery(ADD_NEW_CAMPAIGN_MEMBER, onAddNewCampaignMember);
=======
export function* watchAddCampaignMember() {
  yield takeEvery(ADD_CAMPAIGN_MEMBER, onAddCampaignMember);
>>>>>>> sanad
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

<<<<<<< HEAD
export function* watchAddNewCampaignGuarantee() {
  yield takeEvery(ADD_NEW_CAMPAIGN_GUARANTEE, onAddNewCampaignGuarantee);
=======
export function* watchAddCampaignGuarantee() {
  yield takeEvery(ADD_CAMPAIGN_GUARANTEE, onAddCampaignGuarantee);
>>>>>>> sanad
}

export function* watchUpdateCampaignGuarantee() {
  yield takeEvery(UPDATE_CAMPAIGN_GUARANTEE, onUpdateCampaignGuarantee);
}

export function* watchDeleteCampaignGuarantee() {
  yield takeEvery(DELETE_CAMPAIGN_GUARANTEE, onDeleteCampaignGuarantee);
}

<<<<<<< HEAD
=======
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


>>>>>>> sanad
// CampaignAttendees Watchers
export function* watchGetAllCampaignAttendees() {
  yield takeEvery(GET_CAMPAIGN_ATTENDEES, getAllCampaignAttendees);
}

<<<<<<< HEAD
export function* watchAddNewCampaignAttendee() {
  yield takeEvery(ADD_NEW_CAMPAIGN_ATTENDEE, onAddNewCampaignAttendee);
=======
export function* watchAddCampaignAttendee() {
  yield takeEvery(ADD_CAMPAIGN_ATTENDEE, onAddCampaignAttendee);
>>>>>>> sanad
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
<<<<<<< HEAD
    fork(watchAddNewCampaign),
=======
    fork(watchAddCampaign),
>>>>>>> sanad
    fork(watchUpdateCampaign),
    fork(watchDeleteCampaign),

    // Campaign Members
    fork(watchGetAllCampaignMembers),
    // fork(watchGetCampaignMemberDetails),
<<<<<<< HEAD
    fork(watchAddNewCampaignMember),
=======
    fork(watchAddCampaignMember),
>>>>>>> sanad
    fork(watchUpdateCampaignMember),
    fork(watchDeleteCampaignMember),

    // CampaignGuarantees
    fork(watchGetAllCampaignGuarantees),
    // fork(watchGetCampaignGuaranteeDetails),
<<<<<<< HEAD
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
=======
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
>>>>>>> sanad
    fork(watchGetAllCampaignSorting),
    fork(watchGetCampaignCommitteeSorting),
  ]);
}

export default campaignSaga;
