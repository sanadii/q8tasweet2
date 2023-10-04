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

  // Candidate Candidates
  GET_CANDIDATE_CANDIDATES,
  ADD_NEW_CANDIDATE_CANDIDATE,
  DELETE_CANDIDATE_CANDIDATE,
  UPDATE_CANDIDATE_CANDIDATE,
  // GET_CANDIDATE_CANDIDATE_DETAILS,

  // Candidate Campaign
  GET_CANDIDATE_CAMPAIGNS,
  ADD_NEW_CANDIDATE_CAMPAIGN,
  DELETE_CANDIDATE_CAMPAIGN,
  UPDATE_CANDIDATE_CAMPAIGN,
  GET_CANDIDATE_CAMPAIGN_DETAILS,

} from "./actionType";

import {
  UPLOAD_IMAGE_SUCCESS,
  UPLOAD_IMAGE_FAIL,
} from "../uploadImage/actionType";

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

  // Candidate Candidates
  addNewCandidateElectionSuccess,
  addNewCandidateElectionFail,
  updateCandidateElectionSuccess,
  updateCandidateElectionFail,
  deleteCandidateElectionSuccess,
  deleteCandidateElectionFail,

  // // Candidate Campaigns
  addNewCandidateCampaignSuccess,
  addNewCandidateCampaignFail,
  updateCandidateCampaignSuccess,
  updateCandidateCampaignFail,
  deleteCandidateCampaignSuccess,
  deleteCandidateCampaignFail,

} from "./action";

import { uploadNewImage } from "../uploadImage/action";

//Include Both Helper File with needed methods
import {
  getCandidates as getCandidatesApi,
  getCandidateDetails as getCandidateDetailsApi,
  addNewCandidate,
  updateCandidate,
  deleteCandidate,

  // Candidate Candidates
  getCandidateElections as getCandidateElectionsApi,
  // getCandidateElectionDetails as getCandidateElectionDetailsApi,
  addNewCandidateElection,
  updateCandidateElection,
  deleteCandidateElection,

  // Candidate Campaigns
  getCandidateCampaigns as getCandidateCampaignsApi,
  // getCandidateCampaignDetails as getCandidateCampaignDetailsApi,
  addNewCandidateCampaign,
  updateCandidateCampaign,
  deleteCandidateCampaign,
} from "../../helpers/backend_helper";

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

function* onAddCandidate({ payload: { candidate, formData } }) {
  try {
    // Check if formData contains an image
    if (formData && formData.get("image")) {
      // Dispatch the uploadNewImage action with the formData & Wait for the upload to succeed before proceeding
      yield put(uploadNewImage(formData));
      const { payload: uploadResponse } = yield take(UPLOAD_IMAGE_SUCCESS);

      // Replace backslashes in image URL with forward slashes & update the image field in candidate object with new url
      const formattedImageUrl = uploadResponse.url.replace(/\\/g, "/");
      const updatedCandidate = {
        ...candidate,
        image: formattedImageUrl,
      };

      // Call the API function to add a new candidate & Dispatch the addNewCandidateSuccess action with the received data
      const addNewCandidateResponse = yield call(addNewCandidate, updatedCandidate);
      yield put(addNewCandidateSuccess(addNewCandidateResponse));

      toast.success("Candidate Added Successfully", { autoClose: 2000 });
    } else {
      // Call the API function to add a new candidate without uploading an image
      const addNewCandidateResponse = yield call(addNewCandidate, candidate);
      yield put(addNewCandidateSuccess(addNewCandidateResponse));

      toast.success("Candidate Added Successfully", { autoClose: 2000 });
    }
  } catch (error) {
    yield put(addNewCandidateFail(error));
    toast.error("Candidate Added Failed", { autoClose: 2000 });
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

function* onUpdateCandidate({ payload: { candidate, formData } }) {
  try {
    let uploadResponse;

    // Check if an image is selected (formData contains a selected file)
    if (formData && formData.get("image")) {
      // Dispatch the uploadNewImage action with the formData & Wait for the upload to succeed before proceeding
      yield put(uploadNewImage(formData));
      const action = yield take([UPLOAD_IMAGE_SUCCESS, UPLOAD_IMAGE_FAIL]);
      if (action.type === UPLOAD_IMAGE_SUCCESS) {
        uploadResponse = action.payload;
      } else {
        throw new Error("Image Upload Failed");
      }
    }

    // Replace backslashes in image URL with forward slashes & update the image field in the candidate object with the new URL
    const formattedImageUrl = uploadResponse?.url?.replace(/\\/g, "/");
    const updatedCandidate = {
      ...candidate,
      image: formattedImageUrl,
    };

    // Call the API function to update the candidate & Dispatch the updateCandidateSuccess action with the received data
    const updateCandidateResponse = yield call(updateCandidate, updatedCandidate);
    yield put(updateCandidateSuccess(updateCandidateResponse));

    toast.success("Candidate Updated Successfully", { autoClose: 2000 });
  } catch (error) {
    yield put(updateCandidateFail(error));
    toast.error("Candidate Updated Failed", { autoClose: 2000 });
  }
}

// Candidate Candidates
function* getCandidateElections({ payload: candidate }) {
  try {
    const response = yield call(getCandidateElectionsApi, candidate);
    yield put(
      CandidateApiResponseSuccess(GET_CANDIDATE_CANDIDATES, response.data)
    );
  } catch (error) {
    yield put(CandidateApiResponseError(GET_CANDIDATE_CANDIDATES, error));
  }
}

function* onAddNewCandidateElection({ payload: candidateElection }) {
  try {
    const response = yield call(addNewCandidateElection, candidateElection);
    yield put(addNewCandidateElectionSuccess(response));
    toast.success("CandidateElection Added Successfully", { autoClose: 2000 });
  } catch (error) {
    yield put(addNewCandidateElectionFail(error));
    toast.error("CandidateElection Added Failed", { autoClose: 2000 });
  }
}

function* onDeleteCandidateElection({ payload: candidateElection }) {
  try {
    const response = yield call(deleteCandidateElection, candidateElection);
    yield put(
      deleteCandidateElectionSuccess({ candidateElection, ...response })
    );
    toast.success("CandidateElection Delete Successfully", { autoClose: 2000 });
  } catch (error) {
    yield put(deleteCandidateElectionFail(error));
    toast.error("CandidateElection Delete Failed", { autoClose: 2000 });
  }
}

function* onUpdateCandidateElection({ payload: candidateElection }) {
  try {
    const response = yield call(updateCandidateElection, candidateElection);
    yield put(updateCandidateElectionSuccess(response));
    toast.success("CandidateElection Updated Successfully", {
      autoClose: 2000,
    });
  } catch (error) {
    yield put(updateCandidateElectionFail(error));
    toast.error("CandidateElection Updated Failed", { autoClose: 2000 });
  }
}

// Candidate Campaigns
function* getCandidateCampaigns({ payload: candidate }) {
  try {
    const response = yield call(getCandidateCampaignsApi, candidate);
    yield put(
      CandidateApiResponseSuccess(GET_CANDIDATE_CAMPAIGNS, response.data)
    );
  } catch (error) {
    yield put(CandidateApiResponseError(GET_CANDIDATE_CAMPAIGNS, error));
  }
}

function* onAddNewCandidateCampaign({ payload: candidateCampaign }) {
  try {
    const response = yield call(addNewCandidateCampaign, candidateCampaign);
    yield put(addNewCandidateCampaignSuccess(response));
    toast.success("CandidateCampaign Added Successfully", { autoClose: 2000 });
  } catch (error) {
    yield put(addNewCandidateCampaignFail(error));
    toast.error("CandidateCampaign Added Failed", { autoClose: 2000 });
  }
}

function* onDeleteCandidateCampaign({ payload: candidateCampaign }) {
  try {
    const response = yield call(deleteCandidateCampaign, candidateCampaign);
    yield put(deleteCandidateCampaignSuccess({ candidateCampaign, ...response }));
    toast.success("CandidateCampaign Delete Successfully", { autoClose: 2000 });
  } catch (error) {
    yield put(deleteCandidateCampaignFail(error));
    toast.error("CandidateCampaign Delete Failed", { autoClose: 2000 });
  }
}

function* onUpdateCandidateCampaign({ payload: candidateCampaign }) {
  try {
    const response = yield call(updateCandidateCampaign, candidateCampaign);
    yield put(updateCandidateCampaignSuccess(response));
    toast.success("CandidateCampaign Updated Successfully", {
      autoClose: 2000,
    });
  } catch (error) {
    yield put(updateCandidateCampaignFail(error));
    toast.error("CandidateCampaign Updated Failed", { autoClose: 2000 });
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

// Candidate Candidates Watchers
export function* watchGetCandidateElections() {
  yield takeEvery(GET_CANDIDATE_CANDIDATES, getCandidateElections);
}

export function* watchAddNewCandidateElection() {
  yield takeEvery(ADD_NEW_CANDIDATE_CANDIDATE, onAddNewCandidateElection);
}

export function* watchUpdateCandidateElection() {
  yield takeEvery(UPDATE_CANDIDATE_CANDIDATE, onUpdateCandidateElection);
}

export function* watchDeleteCandidateElection() {
  yield takeEvery(DELETE_CANDIDATE_CANDIDATE, onDeleteCandidateElection);
}

// Candidate Campaigns Watchers
export function* watchGetCandidateCampaigns() {
  yield takeEvery(GET_CANDIDATE_CAMPAIGNS, getCandidateCampaigns);
}

export function* watchAddNewCandidateCampaign() {
  yield takeEvery(ADD_NEW_CANDIDATE_CAMPAIGN, onAddNewCandidateCampaign);
}

export function* watchUpdateCandidateCampaign() {
  yield takeEvery(UPDATE_CANDIDATE_CAMPAIGN, onUpdateCandidateCampaign);
}

export function* watchDeleteCandidateCampaign() {
  yield takeEvery(DELETE_CANDIDATE_CAMPAIGN, onDeleteCandidateCampaign);
}



function* candidateSaga() {
  yield all([

    // Candidates
    fork(watchGetCandidates),
    fork(watchAddNewCandidate),
    fork(watchUpdateCandidate),
    fork(watchDeleteCandidate),
    fork(watchGetCandidateDetails),

    // CandidateElections
    fork(watchGetCandidateElections),
    // fork(watchGetCandidateElectionDetails),
    fork(watchAddNewCandidateElection),
    fork(watchUpdateCandidateElection),
    fork(watchDeleteCandidateElection),

    // CandidateCampiagns
    fork(watchGetCandidateCampaigns),
    // fork(watchGetCandidateCampiagnDetails),
    fork(watchAddNewCandidateCampaign),
    fork(watchUpdateCandidateCampaign),
    fork(watchDeleteCandidateCampaign),

  ]);
}

export default candidateSaga;
