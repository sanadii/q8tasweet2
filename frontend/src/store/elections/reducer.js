import {
  // Election Success/Error
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,

  // Election
  GET_ELECTIONS,
  ADD_ELECTION_SUCCESS,
  ADD_ELECTION_FAIL,
  UPDATE_ELECTION_SUCCESS,
  UPDATE_ELECTION_FAIL,
  DELETE_ELECTION_SUCCESS,
  DELETE_ELECTION_FAIL,

  // Election Details
  GET_ELECTION_DETAILS,

  // Election Candidates
  GET_ELECTION_CANDIDATES,
  // GET_ELECTION_CANDIDATE_DETAILS,
  ADD_ELECTION_CANDIDATE_SUCCESS,
  ADD_ELECTION_CANDIDATE_FAIL,
  UPDATE_ELECTION_CANDIDATE_SUCCESS,
  UPDATE_ELECTION_CANDIDATE_FAIL,
  DELETE_ELECTION_CANDIDATE_SUCCESS,
  DELETE_ELECTION_CANDIDATE_FAIL,

  // Election Campaigns
  GET_ELECTION_CAMPAIGNS,
  // GET_ELECTION_CAMPAIGN_DETAILS,
  ADD_ELECTION_CAMPAIGN_SUCCESS,
  ADD_ELECTION_CAMPAIGN_FAIL,
  UPDATE_ELECTION_CAMPAIGN_SUCCESS,
  UPDATE_ELECTION_CAMPAIGN_FAIL,
  DELETE_ELECTION_CAMPAIGN_SUCCESS,
  DELETE_ELECTION_CAMPAIGN_FAIL,
} from "./actionType";

const IntialState = {
  elections: [],
  electionDetails: [],
  electionCandidates: [],
  electionCampaigns: [],
  electionCommittees: [],
};

const Elections = (state = IntialState, action) => {
  switch (action.type) {
    case API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case GET_ELECTIONS:
          console.log("GET_ELECTIONS LOGGING Payload:", action.payload); // Log the payload
          return {
            ...state,
            elections: action.payload.data,
            isElectionCreated: false,
            isElectionSuccess: true,
          };
        case GET_ELECTION_DETAILS:
          console.log("GET_ELECTION_DETAILS LOGGING Payload:", action.payload); // Log the payload
          return {
            ...state,
            electionDetails: action.payload.data.electionDetails,
            electionCandidates: action.payload.data.electionCandidates,
            electionCampaigns: action.payload.data.electionCampaigns,
            electionCommittees: action.payload.data.electionCommittees,
            isElectionCreated: false,
            isElectionSuccess: true,
          };
        case GET_ELECTION_CANDIDATES:
          return {
            ...state,
            electionCandidates: action.payload.data,
            isElectionCandidateCreated: false,
            isElectionCandidateSuccess: true,
          };
        case GET_ELECTION_CAMPAIGNS:
          return {
            ...state,
            electionCampaigns: action.payload.data,
            isElectionCampaignCreated: false,
            isElectionCampaignSuccess: true,
          };

        default:
          return { ...state };
      }

    case API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case GET_ELECTIONS:
          return {
            ...state,
            error: action.payload.error,
            isElectionCreated: false,
            isElectionSuccess: true,
          };
        case GET_ELECTION_DETAILS:
          console.log(
            "GET_ELECTION_DETAILS ERROR LOGGING Payload:",
            action.payload
          ); // Log the payload

          return {
            ...state,
            error: action.payload.error,
            isElectionCreated: false,
            isElectionSuccess: true,
          };
        case GET_ELECTION_CANDIDATES: {
          return {
            ...state,
            error: action.payload.error,
            isElectionCandidateCreated: false,
            isElectionCandidateSuccess: true,
          };
        }

        case GET_ELECTION_CAMPAIGNS: {
          return {
            ...state,
            error: action.payload.error,
            isElectionCampaignCreated: false,
            isElectionCampaignSuccess: true,
          };
        }
        default:
          return { ...state };
      }

    case GET_ELECTIONS: {
      return {
        ...state,
        isElectionCreated: false,
      };
    }

    case GET_ELECTION_DETAILS: {
      return {
        ...state,
        electionDetails: action.payload,
        isElectionCreated: false,
      };
    }

    case ADD_ELECTION_SUCCESS:
      return {
        ...state,
        isElectionCreated: true,
        elections: [...state.elections, action.payload.data],
        isElectionAdd: true,
        isElectionAddFail: false,
      };
    case ADD_ELECTION_FAIL:
      return {
        ...state,
        error: action.payload,
        isElectionAdd: false,
        isElectionAddFail: true,
      };
    case UPDATE_ELECTION_SUCCESS:
      return {
        ...state,
        elections: state.elections.map((election) =>
          election.id.toString() === action.payload.data.id.toString()
            ? { ...election, ...action.payload.data }
            : election
        ),
        isElectionUpdate: true,
        isElectionUpdateFail: false,
      };
    case UPDATE_ELECTION_FAIL:
      return {
        ...state,
        error: action.payload,
        isElectionUpdate: false,
        isElectionUpdateFail: true,
      };
    case DELETE_ELECTION_SUCCESS:
      return {
        ...state,
        elections: state.elections.filter(
          (election) =>
            election.id.toString() !== action.payload.election.toString()
        ),
        isElectionDelete: true,
        isElectionDeleteFail: false,
      };
    case DELETE_ELECTION_FAIL:
      return {
        ...state,
        error: action.payload,
        isElectionDelete: false,
        isElectionDeleteFail: true,
      };

    // Election Candidates
    case GET_ELECTION_CANDIDATES: {
      return {
        ...state,
        error: action.payload.error,
        isElectionCandidateCreated: false,
        isElectionCandidateSuccess: true,
      };
    }

    case ADD_ELECTION_CANDIDATE_SUCCESS:
      return {
        ...state,
        isElectionCandidateCreated: true,
        electionCandidates: [...state.electionCandidates, action.payload.data],
        isElectionCandidateAdd: true,
        isElectionCandidateAddFail: false,
      };

    case ADD_ELECTION_CANDIDATE_FAIL:
      return {
        ...state,
        error: action.payload,
        isElectionCandidateAdd: false,
        isElectionCandidateAddFail: true,
      };
    case UPDATE_ELECTION_CANDIDATE_SUCCESS:
      return {
        ...state,
        electionCandidates: state.electionCandidates.map(
          (electionCandidate) =>
            electionCandidate.id.toString() === action.payload.data.id.toString()
              ? { ...electionCandidate, ...action.payload.data }
              : electionCandidate
        ),
        isElectionCandidateUpdate: true,
        isElectionCandidateUpdateFail: false,
      };
    case UPDATE_ELECTION_CANDIDATE_FAIL:
      return {
        ...state,
        error: action.payload,
        isElectionCandidateUpdate: false,
        isElectionCandidateUpdateFail: true,
      };
    case DELETE_ELECTION_CANDIDATE_SUCCESS:
      return {
        ...state,
        electionCandidates: state.electionCandidates.filter(
          (electionCandidate) =>
            electionCandidate.id.toString() !==
            action.payload.electionCandidate.toString()
        ),
        isElectionCandidateDelete: true,
        isElectionCandidateDeleteFail: false,
      };
    case DELETE_ELECTION_CANDIDATE_FAIL:
      return {
        ...state,
        error: action.payload,
        isElectionCandidateDelete: false,
        isElectionCandidateDeleteFail: true,
      };

    // Election Campaigns
    case GET_ELECTION_CAMPAIGNS: {
      return {
        ...state,
        error: action.payload.error,
        isElectionCampaignCreated: false,
        isElectionCampaignSuccess: true,
      };
    }

    case ADD_ELECTION_CAMPAIGN_SUCCESS:
      return {
        ...state,
        isElectionCampaignCreated: true,
        electionCampaigns: [
          ...state.electionCampaigns,
          action.payload.data,
        ],
        isElectionCampaignAdd: true,
        isElectionCampaignAddFail: false,
      };

    case ADD_ELECTION_CAMPAIGN_FAIL:
      return {
        ...state,
        error: action.payload,
        isElectionCampaignAdd: false,
        isElectionCampaignAddFail: true,
      };
    case UPDATE_ELECTION_CAMPAIGN_SUCCESS:
      return {
        ...state,
        electionCampaigns: state.electionCampaigns.map(
          (electionCampaign) =>
            electionCampaign.id.toString() ===
              action.payload.data.id.toString()
              ? { ...electionCampaign, ...action.payload.data }
              : electionCampaign
        ),
        isElectionCampaignUpdate: true,
        isElectionCampaignUpdateFail: false,
      };
    case UPDATE_ELECTION_CAMPAIGN_FAIL:
      return {
        ...state,
        error: action.payload,
        isElectionCampaignUpdate: false,
        isElectionCampaignUpdateFail: true,
      };
    case DELETE_ELECTION_CAMPAIGN_SUCCESS:
      return {
        ...state,
        electionCampaigns: state.electionCampaigns.filter(
          (electionCampaign) =>
            electionCampaign.id.toString() !==
            action.payload.electionCampaign.toString()
        ),
        isElectionCampaignDelete: true,
        isElectionCampaignDeleteFail: false,
      };
    case DELETE_ELECTION_CAMPAIGN_FAIL:
      return {
        ...state,
        error: action.payload,
        isElectionCampaignDelete: false,
        isElectionCampaignDeleteFail: true,
      };

    default:
      return { ...state };
  }
};

export default Elections;
