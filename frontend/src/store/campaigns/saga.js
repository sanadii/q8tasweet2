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
  GET_ELECTION_ATTENDEES,
  ADD_NEW_ELECTION_ATTENDEE,
  DELETE_ELECTION_ATTENDEE,
  UPDATE_ELECTION_ATTENDEE,
  GET_ELECTION_ATTENDEE_DETAILS,
} from "./actionType";

import {
  UPLOAD_IMAGE_SUCCESS,
  UPLOAD_IMAGE_FAIL,
} from "../uploadImage/actionType";

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
  addNewElectionAttendeeSuccess,
  addNewElectionAttendeeFail,
  updateElectionAttendeeSuccess,
  updateElectionAttendeeFail,
  deleteElectionAttendeeSuccess,
  deleteElectionAttendeeFail,

} from "./action";

import { uploadNewImage } from "../uploadImage/action";

//Include Both Helper File with needed methods
import {
  getCampaigns as getCampaignsApi,
  getCampaignDetails as getCampaignDetailsApi,
  addNewCampaign,
  updateCampaign,
  deleteCampaign,

  // Campaign Members
  getAllCampaignMembers as getAllCampaignMembersApi,
  // getCampaignMemberDetails as getCampaignMemberDetailsApi,
  addNewCampaignMember,
  updateCampaignMember,
  deleteCampaignMember,

  // Campaign Guarantees
  getAllCampaignGuarantees as getAllCampaignGuaranteesApi,
  // getCampaignGuaranteeDetails as getCampaignGuaranteeDetailsApi,
  addNewCampaignGuarantee,
  updateCampaignGuarantee,
  deleteCampaignGuarantee,

  // Campaign Attendees
  getAllElectionAttendees as getAllElectionAttendeesApi,
  // getElectionAttendeeDetails as getElectionAttendeeDetailsApi,
  addNewElectionAttendee,
  updateElectionAttendee,
  deleteElectionAttendee,

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
    toast.success("Campaign Added Successfully", { autoClose: 2000 });
  } catch (error) {
    yield put(addNewCampaignFail(error));
    toast.error("Campaign Added Failed", { autoClose: 2000 });
  }
}


function* onDeleteCampaign({ payload: campaign }) {
  try {
    const response = yield call(deleteCampaign, campaign);
    yield put(deleteCampaignSuccess({ campaign, ...response }));
    toast.success("Campaign Delete Successfully", { autoClose: 2000 });
  } catch (error) {
    yield put(deleteCampaignFail(error));
    toast.error("Campaign Delete Failed", { autoClose: 2000 });
  }
}

function* onUpdateCampaign({ payload: campaign }) {
  try {
    const response = yield call(updateCampaign, campaign);
    yield put(updateCampaignSuccess(response));
    toast.success("Campaign Updated Successfully", {
      autoClose: 2000,
    });
  } catch (error) {
    yield put(updateCampaignFail(error));
    toast.error("Campaign Updated Failed", { autoClose: 2000 });
  }
}


// Campaign Guarantees
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
    toast.success("CampaignMember Added Successfully", { autoClose: 2000 });
  } catch (error) {
    yield put(addNewCampaignMemberFail(error));
    toast.error("CampaignMember Added Failed", { autoClose: 2000 });
  }
}

function* onDeleteCampaignMember({ payload: campaignMember }) {
  try {
    const response = yield call(deleteCampaignMember, campaignMember);
    yield put(deleteCampaignMemberSuccess({ campaignMember, ...response }));
    toast.success("CampaignMember Delete Successfully", { autoClose: 2000 });
  } catch (error) {
    yield put(deleteCampaignMemberFail(error));
    toast.error("CampaignMember Delete Failed", { autoClose: 2000 });
  }
}

function* onUpdateCampaignMember({ payload: campaignMember }) {
  try {
    const response = yield call(updateCampaignMember, campaignMember);
    yield put(updateCampaignMemberSuccess(response));
    toast.success("CampaignMember Updated Successfully", {
      autoClose: 2000,
    });
  } catch (error) {
    yield put(updateCampaignMemberFail(error));
    toast.error("CampaignMember Updated Failed", { autoClose: 2000 });
  }
}

function* onAddNewCampaignGuarantee({ payload: campaignGuarantee }) {
  try {
    const response = yield call(addNewCampaignGuarantee, campaignGuarantee);
    yield put(addNewCampaignGuaranteeSuccess(response));
    // toast.success("CampaignGuarantee Added Successfully", { autoClose: 2000 });
  } catch (error) {
    yield put(addNewCampaignGuaranteeFail(error));
    // toast.error("CampaignGuarantee Added Failed", { autoClose: 2000 });
  }
}

function* onDeleteCampaignGuarantee({ payload: campaignGuarantee }) {
  try {
    const response = yield call(deleteCampaignGuarantee, campaignGuarantee);
    yield put(
      deleteCampaignGuaranteeSuccess({ campaignGuarantee, ...response })
    );
    toast.success("CampaignGuarantee Delete Successfully", { autoClose: 2000 });
  } catch (error) {
    yield put(deleteCampaignGuaranteeFail(error));
    toast.error("CampaignGuarantee Delete Failed", { autoClose: 2000 });
  }
}

function* onUpdateCampaignGuarantee({ payload: campaignGuarantee }) {
  try {
    const response = yield call(updateCampaignGuarantee, campaignGuarantee);
    yield put(updateCampaignGuaranteeSuccess(response));
    toast.success("CampaignGuarantee Updated Successfully", {
      autoClose: 2000,
    });
  } catch (error) {
    yield put(updateCampaignGuaranteeFail(error));
    toast.error("CampaignGuarantee Updated Failed", { autoClose: 2000 });
  }
}

// ElectionAttendees
function* getAllElectionAttendees({ payload: campaign }) {
  try {
    const response = yield call(getAllElectionAttendeesApi, campaign);
    yield put(
      CampaignApiResponseSuccess(GET_ELECTION_ATTENDEES, response.data)
    );
  } catch (error) {
    yield put(CampaignApiResponseError(GET_ELECTION_ATTENDEES, error));
  }
}

function* onAddNewElectionAttendee({ payload: electionAttendee }) {
  try {
    const response = yield call(addNewElectionAttendee, electionAttendee);
    yield put(addNewElectionAttendeeSuccess(response));
    // toast.success("ElectionAttendee Added Successfully", { autoClose: 2000 });
  } catch (error) {
    yield put(addNewElectionAttendeeFail(error));
    // toast.error("ElectionAttendee Added Failed", { autoClose: 2000 });
  }
}

function* onDeleteElectionAttendee({ payload: electionAttendee }) {
  try {
    const response = yield call(deleteElectionAttendee, electionAttendee);
    yield put(
      deleteElectionAttendeeSuccess({ electionAttendee, ...response })
    );
    toast.success("ElectionAttendee Delete Successfully", { autoClose: 2000 });
  } catch (error) {
    yield put(deleteElectionAttendeeFail(error));
    toast.error("ElectionAttendee Delete Failed", { autoClose: 2000 });
  }
}

function* onUpdateElectionAttendee({ payload: electionAttendee }) {
  try {
    const response = yield call(updateElectionAttendee, electionAttendee);
    yield put(updateElectionAttendeeSuccess(response));
    toast.success("ElectionAttendee Updated Successfully", {
      autoClose: 2000,
    });
  } catch (error) {
    yield put(updateElectionAttendeeFail(error));
    toast.error("ElectionAttendee Updated Failed", { autoClose: 2000 });
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

// ElectionAttendees Watchers
export function* watchGetAllElectionAttendees() {
  yield takeEvery(GET_ELECTION_ATTENDEES, getAllElectionAttendees);
}

export function* watchAddNewElectionAttendee() {
  yield takeEvery(ADD_NEW_ELECTION_ATTENDEE, onAddNewElectionAttendee);
}

export function* watchUpdateElectionAttendee() {
  yield takeEvery(UPDATE_ELECTION_ATTENDEE, onUpdateElectionAttendee);
}

export function* watchDeleteElectionAttendee() {
  yield takeEvery(DELETE_ELECTION_ATTENDEE, onDeleteElectionAttendee);
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

    // ElectionAttendees
    fork(watchGetAllElectionAttendees),
    // fork(watchGetElectionAttendeeDetails),
    fork(watchAddNewElectionAttendee),
    fork(watchUpdateElectionAttendee),
    fork(watchDeleteElectionAttendee),


  ]);
}

export default campaignSaga;
