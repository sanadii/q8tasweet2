import { call, put, takeEvery, all, fork } from "redux-saga/effects";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Invoice Redux States
import {

  GET_ALL_CAMPAIGN_GUARANTEES,
  ADD_NEW_CAMPAIGN_GUARANTEE,
  DELETE_CAMPAIGN_GUARANTEE,
  UPDATE_CAMPAIGN_GUARANTEE,
} from "./actionType";

import {
  campaignCampaignGuaranteesApiResponseSuccess,
  campaignCampaignGuaranteesApiResponseError,
  addNewCampaignGuaranteeSuccess,
  addNewCampaignGuaranteeFail,
  updateCampaignGuaranteeSuccess,
  updateCampaignGuaranteeFail,
  deleteCampaignGuaranteeSuccess,
  deleteCampaignGuaranteeFail
} from "./action";

//Include Both Helper CampaignGuarantee with needed methods
import {
  getAllCampaignGuarantees as getAllCampaignGuaranteesApi,
  addNewCampaignGuarantee,
  updateCampaignGuarantee,
  deleteCampaignGuarantee,
} from "../../helpers/backend_helper";


function* getAllCampaignGuarantees() {
  try {
    const response = yield call(getAllCampaignGuaranteesApi);
    yield put(campaignCampaignGuaranteesApiResponseSuccess(GET_ALL_CAMPAIGN_GUARANTEES, response.data));
  } catch (error) {
    yield put(campaignCampaignGuaranteesApiResponseError(GET_ALL_CAMPAIGN_GUARANTEES, error));
  }
}

function* onAddNewCampaignGuarantee({ payload: campaignCampaignGuarantee }) {

  try {
    const response = yield call(addNewCampaignGuarantee, campaignCampaignGuarantee);
    yield put(addNewCampaignGuaranteeSuccess(response));
    toast.success("CampaignGuarantee Added Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(addNewCampaignGuaranteeFail(error));
    toast.error("CampaignGuarantee Added Failed", { autoClose: 3000 });
  }
}

function* onUpdateCampaignGuarantee({ payload: campaignCampaignGuarantee }) {
  try {
    const response = yield call(updateCampaignGuarantee, campaignCampaignGuarantee);

    yield put(updateCampaignGuaranteeSuccess(response));
    toast.success("CampaignGuarantee Updated Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(updateCampaignGuaranteeFail(error));
    toast.error("CampaignGuarantee Updated Failed", { autoClose: 3000 });
  }
}

function* onDeleteCampaignGuarantee({ payload: campaignCampaignGuarantee }) {
  try {
    const response = yield call(deleteCampaignGuarantee, campaignCampaignGuarantee);
    yield put(deleteCampaignGuaranteeSuccess({ campaignCampaignGuarantee, ...response }));
    toast.success("CampaignGuarantee Delete Successfully", { autoClose: 3000 });
  } catch (error) {
    yield put(deleteCampaignGuaranteeFail(error));
    toast.error("CampaignGuarantee Delete Failed", { autoClose: 3000 });
  }
}



export function* watchGetCampaignGuarantees() {
  yield takeEvery(GET_ALL_CAMPAIGN_GUARANTEES, getAllCampaignGuarantees);
}

export function* watchUpdateCampaignGuarantee() {
  yield takeEvery(UPDATE_CAMPAIGN_GUARANTEE, onUpdateCampaignGuarantee);
}

export function* watchDeleteCampaignGuarantee() {
  yield takeEvery(DELETE_CAMPAIGN_GUARANTEE, onDeleteCampaignGuarantee);
}

export function* watchAddNewCampaignGuarantee() {
  yield takeEvery(ADD_NEW_CAMPAIGN_GUARANTEE, onAddNewCampaignGuarantee);
}

function* CampaignGuaranteeManager() {
  yield all([
    fork(watchGetCampaignGuarantees),
    fork(watchAddNewCampaignGuarantee),
    fork(watchUpdateCampaignGuarantee),
    fork(watchDeleteCampaignGuarantee),
  ]);
}

export default CampaignGuaranteeManager;