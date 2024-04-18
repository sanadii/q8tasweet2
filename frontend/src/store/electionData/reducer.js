import {
  // ElectionData Success/Error
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,

  // ElectionData
  GET_ELECTION_DATA,
  GET_ELECTION_DATA_DETAILS,
  ADD_ELECTION_DATA_SUCCESS,
  ADD_ELECTION_DATA_FAIL,
  UPDATE_ELECTION_DATA_SUCCESS,
  UPDATE_ELECTION_DATA_FAIL,
  DELETE_ELECTION_DATA_SUCCESS,
  DELETE_ELECTION_DATA_FAIL,
} from "./actionType";

const IntialState = {
  electionDatas: [],
  electionDataDetails: [],
  electionDataElections: [],
  electionDataCampaigns: [],
  electionDataCommittees: [],
};

const ElectionDatas = (state = IntialState, action) => {
  switch (action.type) {
    case API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case GET_ELECTION_DATA:
          return {
            ...state,
            electionDatas: action.payload.data,
            isElectionDataCreated: false,
            isElectionDataSuccess: true,
          };
        case GET_ELECTION_DATA_DETAILS:
          return {
            ...state,
            electionDataDetails: action.payload.data.electionDataDetails,
            electionDataElections: action.payload.data.electionDataElections,
            electionDataCampaigns: action.payload.data.electionDataCampaigns,
            electionDataCommittees: action.payload.data.electionDataCommittees,
            isElectionDataCreated: false,
            isElectionDataSuccess: true,
          };
        default:
          return { ...state };
      }

    case API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case GET_ELECTION_DATA:
          return {
            ...state,
            error: action.payload.error,
            isElectionDataCreated: false,
            isElectionDataSuccess: true,
          };
        case GET_ELECTION_DATA_DETAILS:
          return {
            ...state,
            error: action.payload.error,
            isElectionDataCreated: false,
            isElectionDataSuccess: true,
          };
        default:
          return { ...state };
      }

    case GET_ELECTION_DATA: {
      return {
        ...state,
        isElectionDataCreated: false,
      };
    }

    case GET_ELECTION_DATA_DETAILS: {
      return {
        ...state,
        electionDataDetails: action.payload,
        isElectionDataCreated: false,
      };
    }

    case ADD_ELECTION_DATA_SUCCESS:
      return {
        ...state,
        isElectionDataCreated: true,
        electionDatas: [...state.electionDatas, action.payload.data],
        isElectionDataAdd: true,
        isElectionDataAddFail: false,
      };
    case ADD_ELECTION_DATA_FAIL:
      return {
        ...state,
        error: action.payload,
        isElectionDataAdd: false,
        isElectionDataAddFail: true,
      };
    case UPDATE_ELECTION_DATA_SUCCESS:
      return {
        ...state,
        // Checking before accessing ElectionDatas to prevent error
        electionDatas: Array.isArray(state.electionDatas)
          ? state.electionDatas.map((electionData) =>
            electionData.id.toString() === action.payload.data.id.toString()
              ? { ...electionData, ...action.payload.data }
              : electionData
          )
          : state.electionDatas,

        // Checking before accessing ElectionData Details to prevent error
        electionDataDetails: state.electionDataDetails
          ? {
            ...state.electionDataDetails,
            ...(action.payload.data || {}),
          }
          : action.payload.data || null,

        isCampaignUpdate: true,
        isCampaignUpdateFail: false,
      };



    // return {
    //   ...state,
    //   // Checking before accessing ElectionDatas to prevent error
    //   electionDatas: Array.isArray(state.electionDatas)
    //     ? state.electionDatas.map((electionData) =>
    //       electionData.id.toString() === action.payload.data.id.toString()
    //         ? { ...electionData, ...action.payload.data }
    //         : electionData
    //     )
    //     : state.electionDatas,

    //   // Checking before accessing ElectionData Details to prevent error
    //   // electionDataDetails: state.electionDataDetails && state.electionDataDetails.id.toString() === action.payload.data.id.toString()
    //   //   ? { ...state.electionDataDetails, ...action.payload.data }
    //   //   : state.electionDataDetails,

    //   // isElectionDataUpdate: true,
    //   // isElectionDataUpdateFail: false,
    // };

    case UPDATE_ELECTION_DATA_FAIL:
      return {
        ...state,
        error: action.payload,
        isElectionDataUpdate: false,
        isElectionDataUpdateFail: true,
      };
    case DELETE_ELECTION_DATA_SUCCESS:
      return {
        ...state,
        electionDatas: state.electionDatas.filter(
          (electionData) =>
            electionData.id.toString() !== action.payload.electionData.toString()
        ),
        isElectionDataDelete: true,
        isElectionDataDeleteFail: false,
      };
    case DELETE_ELECTION_DATA_FAIL:
      return {
        ...state,
        error: action.payload,
        isElectionDataDelete: false,
        isElectionDataDeleteFail: true,
      };
    default:
      return { ...state };
  }
};

export default ElectionDatas;
