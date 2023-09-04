import {
  // Candidate Success/Error
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,

  // Candidate
  GET_CANDIDATES,
  ADD_NEW_CANDIDATE_SUCCESS,
  ADD_NEW_CANDIDATE_FAIL,
  UPDATE_CANDIDATE_SUCCESS,
  UPDATE_CANDIDATE_FAIL,
  DELETE_CANDIDATE_SUCCESS,
  DELETE_CANDIDATE_FAIL,

  // Candidate Details
  GET_CANDIDATE_DETAILS,

  // Candidate Candidates
  GET_CANDIDATE_CANDIDATES,
  // GET_CANDIDATE_CANDIDATE_DETAILS,
  ADD_NEW_CANDIDATE_CANDIDATE_SUCCESS,
  ADD_NEW_CANDIDATE_CANDIDATE_FAIL,
  UPDATE_CANDIDATE_CANDIDATE_SUCCESS,
  UPDATE_CANDIDATE_CANDIDATE_FAIL,
  DELETE_CANDIDATE_CANDIDATE_SUCCESS,
  DELETE_CANDIDATE_CANDIDATE_FAIL,

  // Candidate Campaigns
  GET_CANDIDATE_CAMPAIGNS,
  // GET_CANDIDATE_CAMPAIGN_DETAILS,
  ADD_NEW_CANDIDATE_CAMPAIGN_SUCCESS,
  ADD_NEW_CANDIDATE_CAMPAIGN_FAIL,
  UPDATE_CANDIDATE_CAMPAIGN_SUCCESS,
  UPDATE_CANDIDATE_CAMPAIGN_FAIL,
  DELETE_CANDIDATE_CAMPAIGN_SUCCESS,
  DELETE_CANDIDATE_CAMPAIGN_FAIL,
} from "./actionType";

const IntialState = {
  candidates: [],
  candidateDetails: [],
  candidateElections: [],
  candidateCampaigns: [],
  candidateCommittees: [],
};

const Candidates = (state = IntialState, action) => {
  switch (action.type) {
    case API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case GET_CANDIDATES:
          console.log("GET_CANDIDATES LOGGING Payload:", action.payload); // Log the payload
          return {
            ...state,
            candidates: action.payload.data,
            isCandidateCreated: false,
            isCandidateSuccess: true,
          };
        case GET_CANDIDATE_DETAILS:
          console.log("GET_CANDIDATE_DETAILS LOGGING Payload:", action.payload); // Log the payload
          return {
            ...state,
            candidateDetails: action.payload.data.candidateDetails,
            candidateElections: action.payload.data.candidateElections,
            candidateCampaigns: action.payload.data.candidateCampaigns,
            candidateCommittees: action.payload.data.candidateCommittees,
            isCandidateCreated: false,
            isCandidateSuccess: true,
          };
        case GET_CANDIDATE_CANDIDATES:
          return {
            ...state,
            candidateElections: action.payload.data,
            isCandidateElectionCreated: false,
            isCandidateElectionSuccess: true,
          };
        case GET_CANDIDATE_CAMPAIGNS:
          return {
            ...state,
            candidateCampaigns: action.payload.data,
            isCandidateCampaignCreated: false,
            isCandidateCampaignSuccess: true,
          };

        default:
          return { ...state };
      }

    case API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case GET_CANDIDATES:
          return {
            ...state,
            error: action.payload.error,
            isCandidateCreated: false,
            isCandidateSuccess: true,
          };
        case GET_CANDIDATE_DETAILS:
          console.log(
            "GET_CANDIDATE_DETAILS ERROR LOGGING Payload:",
            action.payload
          ); // Log the payload

          return {
            ...state,
            error: action.payload.error,
            isCandidateCreated: false,
            isCandidateSuccess: true,
          };
        case GET_CANDIDATE_CANDIDATES: {
          return {
            ...state,
            error: action.payload.error,
            isCandidateElectionCreated: false,
            isCandidateElectionSuccess: true,
          };
        }

        case GET_CANDIDATE_CAMPAIGNS: {
          return {
            ...state,
            error: action.payload.error,
            isCandidateCampaignCreated: false,
            isCandidateCampaignSuccess: true,
          };
        }
        default:
          return { ...state };
      }

    case GET_CANDIDATES: {
      return {
        ...state,
        isCandidateCreated: false,
      };
    }

    case GET_CANDIDATE_DETAILS: {
      return {
        ...state,
        candidateDetails: action.payload,
        isCandidateCreated: false,
      };
    }

    case ADD_NEW_CANDIDATE_SUCCESS:
      return {
        ...state,
        isCandidateCreated: true,
        candidates: [...state.candidates, action.payload.data],
        isCandidateAdd: true,
        isCandidateAddFail: false,
      };
    case ADD_NEW_CANDIDATE_FAIL:
      return {
        ...state,
        error: action.payload,
        isCandidateAdd: false,
        isCandidateAddFail: true,
      };
    case UPDATE_CANDIDATE_SUCCESS:
      return {
        ...state,
        candidates: state.candidates.map((candidate) =>
          candidate.id.toString() === action.payload.data.id.toString()
            ? { ...candidate, ...action.payload.data }
            : candidate
        ),
        isCandidateUpdate: true,
        isCandidateUpdateFail: false,
      };
    case UPDATE_CANDIDATE_FAIL:
      return {
        ...state,
        error: action.payload,
        isCandidateUpdate: false,
        isCandidateUpdateFail: true,
      };
    case DELETE_CANDIDATE_SUCCESS:
      return {
        ...state,
        candidates: state.candidates.filter(
          (candidate) =>
            candidate.id.toString() !== action.payload.candidate.toString()
        ),
        isCandidateDelete: true,
        isCandidateDeleteFail: false,
      };
    case DELETE_CANDIDATE_FAIL:
      return {
        ...state,
        error: action.payload,
        isCandidateDelete: false,
        isCandidateDeleteFail: true,
      };

    // Candidate Candidates
    case GET_CANDIDATE_CANDIDATES: {
      return {
        ...state,
        error: action.payload.error,
        isCandidateElectionCreated: false,
        isCandidateElectionSuccess: true,
      };
    }

    case ADD_NEW_CANDIDATE_CANDIDATE_SUCCESS:
      return {
        ...state,
        isCandidateElectionCreated: true,
        candidateElections: [...state.candidateElections, action.payload.data],
        isCandidateElectionAdd: true,
        isCandidateElectionAddFail: false,
      };

    case ADD_NEW_CANDIDATE_CANDIDATE_FAIL:
      return {
        ...state,
        error: action.payload,
        isCandidateElectionAdd: false,
        isCandidateElectionAddFail: true,
      };
    case UPDATE_CANDIDATE_CANDIDATE_SUCCESS:
      return {
        ...state,
        candidateElections: state.candidateElections.map(
          (candidateElection) =>
            candidateElection.id.toString() === action.payload.data.id.toString()
              ? { ...candidateElection, ...action.payload.data }
              : candidateElection
        ),
        isCandidateElectionUpdate: true,
        isCandidateElectionUpdateFail: false,
      };
    case UPDATE_CANDIDATE_CANDIDATE_FAIL:
      return {
        ...state,
        error: action.payload,
        isCandidateElectionUpdate: false,
        isCandidateElectionUpdateFail: true,
      };
    case DELETE_CANDIDATE_CANDIDATE_SUCCESS:
      return {
        ...state,
        candidateElections: state.candidateElections.filter(
          (candidateElection) =>
            candidateElection.id.toString() !==
            action.payload.candidateElection.toString()
        ),
        isCandidateElectionDelete: true,
        isCandidateElectionDeleteFail: false,
      };
    case DELETE_CANDIDATE_CANDIDATE_FAIL:
      return {
        ...state,
        error: action.payload,
        isCandidateElectionDelete: false,
        isCandidateElectionDeleteFail: true,
      };

    // Candidate Campaigns
    case GET_CANDIDATE_CAMPAIGNS: {
      return {
        ...state,
        error: action.payload.error,
        isCandidateCampaignCreated: false,
        isCandidateCampaignSuccess: true,
      };
    }

    case ADD_NEW_CANDIDATE_CAMPAIGN_SUCCESS:
      return {
        ...state,
        isCandidateCampaignCreated: true,
        candidateCampaigns: [
          ...state.candidateCampaigns,
          action.payload.data,
        ],
        isCandidateCampaignAdd: true,
        isCandidateCampaignAddFail: false,
      };

    case ADD_NEW_CANDIDATE_CAMPAIGN_FAIL:
      return {
        ...state,
        error: action.payload,
        isCandidateCampaignAdd: false,
        isCandidateCampaignAddFail: true,
      };
    case UPDATE_CANDIDATE_CAMPAIGN_SUCCESS:
      return {
        ...state,
        candidateCampaigns: state.candidateCampaigns.map(
          (candidateCampaign) =>
            candidateCampaign.id.toString() ===
              action.payload.data.id.toString()
              ? { ...candidateCampaign, ...action.payload.data }
              : candidateCampaign
        ),
        isCandidateCampaignUpdate: true,
        isCandidateCampaignUpdateFail: false,
      };
    case UPDATE_CANDIDATE_CAMPAIGN_FAIL:
      return {
        ...state,
        error: action.payload,
        isCandidateCampaignUpdate: false,
        isCandidateCampaignUpdateFail: true,
      };
    case DELETE_CANDIDATE_CAMPAIGN_SUCCESS:
      return {
        ...state,
        candidateCampaigns: state.candidateCampaigns.filter(
          (candidateCampaign) =>
            candidateCampaign.id.toString() !==
            action.payload.candidateCampaign.toString()
        ),
        isCandidateCampaignDelete: true,
        isCandidateCampaignDeleteFail: false,
      };
    case DELETE_CANDIDATE_CAMPAIGN_FAIL:
      return {
        ...state,
        error: action.payload,
        isCandidateCampaignDelete: false,
        isCandidateCampaignDeleteFail: true,
      };

    default:
      return { ...state };
  }
};

export default Candidates;
