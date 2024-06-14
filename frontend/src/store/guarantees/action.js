import {
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,
  
  GET_ALL_CAMPAIGN_GUARANTEES,
  UPDATE_CAMPAIGN_GUARANTEE,
  UPDATE_CAMPAIGN_GUARANTEE_SUCCESS,
  UPDATE_CAMPAIGN_GUARANTEE_FAIL,
<<<<<<< HEAD
  ADD_NEW_CAMPAIGN_GUARANTEE,
  ADD_NEW_CAMPAIGN_GUARANTEEN_SUCCESS,
  ADD_NEW_CAMPAIGN_GUARANTEEN_FAIL,
=======
  ADD_CAMPAIGN_GUARANTEE,
  ADD_CAMPAIGN_GUARANTEEN_SUCCESS,
  ADD_CAMPAIGN_GUARANTEEN_FAIL,
>>>>>>> sanad
  DELETE_CAMPAIGN_GUARANTEE,
  DELETE_CAMPAIGN_GUARANTEE_SUCCESS,
  DELETE_CAMPAIGN_GUARANTEE_FAIL,
} from "./actionType";

// common success
export const campaignCampaignGuaranteesApiResponseSuccess = (actionType, data) => ({
  type: API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});

// common error
export const campaignCampaignGuaranteesApiResponseError = (actionType, error) => ({
  type: API_RESPONSE_ERROR,
  payload: { actionType, error },
});

export const getAllCampaignGuarantees = () => ({
  type: GET_ALL_CAMPAIGN_GUARANTEES,
});

export const updateCampaignGuarantee = campaignCampaignGuarantee => ({
  type: UPDATE_CAMPAIGN_GUARANTEE,
  payload: campaignCampaignGuarantee,
});

export const updateCampaignGuaranteeSuccess = campaignCampaignGuarantee => ({
  type: UPDATE_CAMPAIGN_GUARANTEE_SUCCESS,
  payload: campaignCampaignGuarantee,
});

export const updateCampaignGuaranteeFail = error => ({
  type: UPDATE_CAMPAIGN_GUARANTEE_FAIL,
  payload: error,
});

<<<<<<< HEAD
export const addNewCampaignGuarantee = campaignCampaignGuarantee => ({
  type: ADD_NEW_CAMPAIGN_GUARANTEE,
  payload: campaignCampaignGuarantee,
});

export const addNewCampaignGuaranteeSuccess = campaignCampaignGuarantee => ({
  type: ADD_NEW_CAMPAIGN_GUARANTEEN_SUCCESS,
  payload: campaignCampaignGuarantee,
});

export const addNewCampaignGuaranteeFail = error => ({
  type: ADD_NEW_CAMPAIGN_GUARANTEEN_FAIL,
=======
export const addCampaignGuarantee = campaignCampaignGuarantee => ({
  type: ADD_CAMPAIGN_GUARANTEE,
  payload: campaignCampaignGuarantee,
});

export const addCampaignGuaranteeSuccess = campaignCampaignGuarantee => ({
  type: ADD_CAMPAIGN_GUARANTEEN_SUCCESS,
  payload: campaignCampaignGuarantee,
});

export const addCampaignGuaranteeFail = error => ({
  type: ADD_CAMPAIGN_GUARANTEEN_FAIL,
>>>>>>> sanad
  payload: error,
});

export const deleteCampaignGuarantee = campaignCampaignGuarantee => ({
  type: DELETE_CAMPAIGN_GUARANTEE,
  payload: campaignCampaignGuarantee,
});

export const deleteCampaignGuaranteeSuccess = campaignCampaignGuarantee => ({
  type: DELETE_CAMPAIGN_GUARANTEE_SUCCESS,
  payload: campaignCampaignGuarantee,
});

export const deleteCampaignGuaranteeFail = error => ({
  type: DELETE_CAMPAIGN_GUARANTEE_FAIL,
  payload: error,
});