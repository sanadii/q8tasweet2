import {
  // Party Success/Error
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,

  // Party
  GET_PARTIES,
  GET_PARTY_DETAILS,
  ADD_PARTY_SUCCESS,
  ADD_PARTY_FAIL,
  UPDATE_PARTY_SUCCESS,
  UPDATE_PARTY_FAIL,
  DELETE_PARTY_SUCCESS,
  DELETE_PARTY_FAIL,
} from "./actionType";

const IntialState = {
  parties: [],
  partyDetails: [],
  partyElections: [],
  partyCampaigns: [],
  partyCommittees: [],
};

const Parties = (state = IntialState, action) => {
  switch (action.type) {
    case API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case GET_PARTIES:
          return {
            ...state,
            parties: action.payload.data,
            isPartyCreated: false,
            isPartySuccess: true,
          };
        case GET_PARTY_DETAILS:
          return {
            ...state,
            partyDetails: action.payload.data.partyDetails,
            partyElections: action.payload.data.partyElections,
            partyCampaigns: action.payload.data.partyCampaigns,
            partyCommittees: action.payload.data.partyCommittees,
            isPartyCreated: false,
            isPartySuccess: true,
          };
        default:
          return { ...state };
      }

    case API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case GET_PARTIES:
          return {
            ...state,
            error: action.payload.error,
            isPartyCreated: false,
            isPartySuccess: true,
          };
        case GET_PARTY_DETAILS:
          return {
            ...state,
            error: action.payload.error,
            isPartyCreated: false,
            isPartySuccess: true,
          };
        default:
          return { ...state };
      }

    case GET_PARTIES: {
      return {
        ...state,
        isPartyCreated: false,
      };
    }

    case GET_PARTY_DETAILS: {
      return {
        ...state,
        partyDetails: action.payload,
        isPartyCreated: false,
      };
    }

    case ADD_PARTY_SUCCESS:
      return {
        ...state,
        isPartyCreated: true,
        parties: [...state.parties, action.payload.data],
        isPartyAdd: true,
        isPartyAddFail: false,
      };
    case ADD_PARTY_FAIL:
      return {
        ...state,
        error: action.payload,
        isPartyAdd: false,
        isPartyAddFail: true,
      };
    case UPDATE_PARTY_SUCCESS:
      return {
        ...state,
        // Checking before accessing Parties to prevent error
        parties: Array.isArray(state.parties)
          ? state.parties.map((party) =>
            party.id.toString() === action.payload.data.id.toString()
              ? { ...party, ...action.payload.data }
              : party
          )
          : state.parties,

        // Checking before accessing Party Details to prevent error
        partyDetails: state.partyDetails
          ? {
            ...state.partyDetails,
            ...(action.payload.data || {}),
          }
          : action.payload.data || null,

        isCampaignUpdate: true,
        isCampaignUpdateFail: false,
      };



    // return {
    //   ...state,
    //   // Checking before accessing Parties to prevent error
    //   parties: Array.isArray(state.parties)
    //     ? state.parties.map((party) =>
    //       party.id.toString() === action.payload.data.id.toString()
    //         ? { ...party, ...action.payload.data }
    //         : party
    //     )
    //     : state.parties,

    //   // Checking before accessing Party Details to prevent error
    //   // partyDetails: state.partyDetails && state.partyDetails.id.toString() === action.payload.data.id.toString()
    //   //   ? { ...state.partyDetails, ...action.payload.data }
    //   //   : state.partyDetails,

    //   // isPartyUpdate: true,
    //   // isPartyUpdateFail: false,
    // };

    case UPDATE_PARTY_FAIL:
      return {
        ...state,
        error: action.payload,
        isPartyUpdate: false,
        isPartyUpdateFail: true,
      };
    case DELETE_PARTY_SUCCESS:
      return {
        ...state,
        parties: state.parties.filter(
          (party) =>
            party.id.toString() !== action.payload.party.id.toString()
        ),
        isPartyDelete: true,
        isPartyDeleteFail: false,
      };
    case DELETE_PARTY_FAIL:
      return {
        ...state,
        error: action.payload,
        isPartyDelete: false,
        isPartyDeleteFail: true,
      };
    default:
      return { ...state };
  }
};

export default Parties;
