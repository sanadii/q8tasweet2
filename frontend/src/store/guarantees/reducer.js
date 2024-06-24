import {
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,

  GET_ALL_CAMPAIGN_GUARANTEES,
  ADD_CAMPAIGN_GUARANTEEN_SUCCESS,
  ADD_CAMPAIGN_GUARANTEEN_FAIL,
  UPDATE_CAMPAIGN_GUARANTEE_SUCCESS,
  UPDATE_CAMPAIGN_GUARANTEE_FAIL,
  DELETE_CAMPAIGN_GUARANTEE_SUCCESS,
  DELETE_CAMPAIGN_GUARANTEE_FAIL,
} from "./actionType";

const initialState = {
  campaignGuarantees: [],
  subCampaignGuarantees: [],
  error: {},
};

const CampaignGuarantees = (state = initialState, action) => {

  switch (action.type) {
    case API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {

        case GET_ALL_CAMPAIGN_GUARANTEES:
          return {
            ...state,
            campaignGuarantees: action.payload.data.campaignGuarantees,
            subCampaignGuarantees: action.payload.data.subCampaignGuarantees,
          };
        default:
          return { ...state };
      }
    case API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case GET_ALL_CAMPAIGN_GUARANTEES:
          return {
            ...state,
            error: action.payload.error,
          };
        default:
          return { ...state };
      }

    case ADD_CAMPAIGN_GUARANTEEN_SUCCESS:
      return {
        ...state,
        campaignGuarantees: [...state.campaignGuarantees, action.payload],
      };

    case ADD_CAMPAIGN_GUARANTEEN_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_CAMPAIGN_GUARANTEE_SUCCESS:
      return {
        ...state,
        campaignGuarantees: state.campaignGuarantees.map(campaignGuarantees =>
          campaignGuarantees.id.toString() === action.payload.id.toString()
            ? { ...campaignGuarantees, ...action.payload }
            : campaignGuarantees
        ),
      };

    case UPDATE_CAMPAIGN_GUARANTEE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_CAMPAIGN_GUARANTEE_SUCCESS:
      return {
        ...state,
        campaignGuarantees: state.campaignGuarantees.filter(
          (campaignGuarantees) =>
            campaignGuarantees.id.toString()
          !== action.payload.campaignGuarantees.id.toString()
        ),
      };

    case DELETE_CAMPAIGN_GUARANTEE_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return { ...state };
  }
};

export default CampaignGuarantees;