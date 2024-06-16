import {
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,

  GET_ALL_CAMPAIGN_GUARANTEES,
<<<<<<< HEAD
  ADD_NEW_CAMPAIGN_GUARANTEEN_SUCCESS,
  ADD_NEW_CAMPAIGN_GUARANTEEN_FAIL,
=======
  ADD_CAMPAIGN_GUARANTEEN_SUCCESS,
  ADD_CAMPAIGN_GUARANTEEN_FAIL,
>>>>>>> sanad
  UPDATE_CAMPAIGN_GUARANTEE_SUCCESS,
  UPDATE_CAMPAIGN_GUARANTEE_FAIL,
  DELETE_CAMPAIGN_GUARANTEE_SUCCESS,
  DELETE_CAMPAIGN_GUARANTEE_FAIL,
} from "./actionType";

const initialState = {
<<<<<<< HEAD
  campaignCampaignGuarantees: [],
=======
  campaignGuarantees: [],
>>>>>>> sanad
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
<<<<<<< HEAD
            campaignCampaignGuarantees: action.payload.data.campaignCampaignGuarantees,
=======
            campaignGuarantees: action.payload.data.campaignGuarantees,
>>>>>>> sanad
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

<<<<<<< HEAD
    case ADD_NEW_CAMPAIGN_GUARANTEEN_SUCCESS:
      return {
        ...state,
        campaignCampaignGuaranteeList: [...state.campaignCampaignGuaranteeList, action.payload],
      };

    case ADD_NEW_CAMPAIGN_GUARANTEEN_FAIL:
=======
    case ADD_CAMPAIGN_GUARANTEEN_SUCCESS:
      return {
        ...state,
        campaignGuarantees: [...state.campaignGuarantees, action.payload],
      };

    case ADD_CAMPAIGN_GUARANTEEN_FAIL:
>>>>>>> sanad
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_CAMPAIGN_GUARANTEE_SUCCESS:
      return {
        ...state,
<<<<<<< HEAD
        campaignCampaignGuaranteeList: state.campaignCampaignGuaranteeList.map(campaignCampaignGuarantee =>
          campaignCampaignGuarantee.id.toString() === action.payload.id.toString()
            ? { ...campaignCampaignGuarantee, ...action.payload }
            : campaignCampaignGuarantee
=======
        campaignGuarantees: state.campaignGuarantees.map(campaignGuarantees =>
          campaignGuarantees.id.toString() === action.payload.id.toString()
            ? { ...campaignGuarantees, ...action.payload }
            : campaignGuarantees
>>>>>>> sanad
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
<<<<<<< HEAD
        campaignCampaignGuaranteeList: state.campaignCampaignGuaranteeList.filter(
          campaignCampaignGuarantee => campaignCampaignGuarantee.id.toString() !== action.payload.id.toString()
=======
        campaignGuarantees: state.campaignGuarantees.filter(
          (campaignGuarantees) =>
            campaignGuarantees.id.toString()
          !== action.payload.campaignGuarantees.id.toString()
>>>>>>> sanad
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