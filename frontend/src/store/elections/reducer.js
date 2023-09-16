import {
  // Election Success/Error
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,

  // Election ---------------
  GET_ELECTIONS,
  GET_ELECTION_DETAILS,
  ADD_ELECTION_SUCCESS,
  ADD_ELECTION_FAIL,
  UPDATE_ELECTION_SUCCESS,
  UPDATE_ELECTION_FAIL,
  DELETE_ELECTION_SUCCESS,
  DELETE_ELECTION_FAIL,

  // Election Candidates ---------------
  GET_ELECTION_CANDIDATES,
  // GET_ELECTION_CANDIDATE_DETAILS,
  ADD_ELECTION_CANDIDATE_SUCCESS,
  ADD_ELECTION_CANDIDATE_FAIL,
  UPDATE_ELECTION_CANDIDATE_SUCCESS,
  UPDATE_ELECTION_CANDIDATE_FAIL,
  DELETE_ELECTION_CANDIDATE_SUCCESS,
  DELETE_ELECTION_CANDIDATE_FAIL,

  // Election Committees ---------------
  GET_ELECTION_COMMITTEES,
  // GET_ELECTION_COMMITTEE_DETAILS,
  ADD_ELECTION_COMMITTEE_SUCCESS,
  ADD_ELECTION_COMMITTEE_FAIL,
  UPDATE_ELECTION_COMMITTEE_SUCCESS,
  UPDATE_ELECTION_COMMITTEE_FAIL,
  DELETE_ELECTION_COMMITTEE_SUCCESS,
  DELETE_ELECTION_COMMITTEE_FAIL,

  // Election Committee Results ----------------
  UPDATE_ELECTION_COMMITTEE_RESULTS,
  UPDATE_ELECTION_COMMITTEE_RESULTS_FAIL,

  // Election Campaigns ---------------
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
  electionCommitteeResults: [],
};

const Elections = (state = IntialState, action) => {
  switch (action.type) {
    case API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case GET_ELECTIONS:
          return {
            ...state,
            elections: action.payload.data,
            isElectionCreated: false,
            isElectionSuccess: true,
          };
        case GET_ELECTION_DETAILS:
          return {
            ...state,
            electionDetails: action.payload.data.electionDetails,
            electionCandidates: action.payload.data.electionCandidates,
            electionCampaigns: action.payload.data.electionCampaigns,
            electionCommittees: action.payload.data.electionCommittees,
            electionCommitteeResults: action.payload.data.electionCommitteeResults,
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
        case GET_ELECTION_CANDIDATES:
          return {
            ...state,
            electionCandidates: action.payload.data,
            isElectionCandidateCreated: false,
            isElectionCandidateSuccess: true,
          };
        case GET_ELECTION_COMMITTEES:
          return {
            ...state,
            electionCommittee: action.payload.data,
            isElectionCommitteeCreated: false,
            isElectionCommitteeSuccess: true,
          };
        case UPDATE_ELECTION_COMMITTEE_RESULTS:
          return {
            ...state,
            electionCommitteeResults: action.payload.data,
            isElectionCampaignUpdate: true,
            isElectionCampaignUpdateFail: false,
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
        case GET_ELECTION_COMMITTEES: {
          return {
            ...state,
            error: action.payload.error,
            isElectionCommitteeCreated: false,
            isElectionCommitteeSuccess: true,
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

    // Election Candidates ---------------
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

    // Election Committees ---------------
    case GET_ELECTION_COMMITTEES: {
      return {
        ...state,
        error: action.payload.error,
        isElectionCommitteeCreated: false,
        isElectionCommitteeSuccess: true,
      };
    }

    case ADD_ELECTION_COMMITTEE_SUCCESS:
      return {
        ...state,
        isElectionCommitteeCreated: true,
        electionCommittees: [...state.electionCommittees, action.payload.data],
        isElectionCommitteeAdd: true,
        isElectionCommitteeAddFail: false,
      };

    case ADD_ELECTION_COMMITTEE_FAIL:
      return {
        ...state,
        error: action.payload,
        isElectionCommitteeAdd: false,
        isElectionCommitteeAddFail: true,
      };
    case UPDATE_ELECTION_COMMITTEE_SUCCESS:
      return {
        ...state,
        electionCommittees: state.electionCommittees.map(
          (electionCommittee) =>
            electionCommittee.id.toString() === action.payload.data.id.toString()
              ? { ...electionCommittee, ...action.payload.data }
              : electionCommittee
        ),
        isElectionCommitteeUpdate: true,
        isElectionCommitteeUpdateFail: false,
      };
    case UPDATE_ELECTION_COMMITTEE_FAIL:
      return {
        ...state,
        error: action.payload,
        isElectionCommitteeUpdate: false,
        isElectionCommitteeUpdateFail: true,
      };
    case DELETE_ELECTION_COMMITTEE_SUCCESS:
      return {
        ...state,
        electionCommittees: state.electionCommittees.filter(
          (electionCommittee) =>
            electionCommittee.id.toString() !==
            action.payload.electionCommittee.toString()
        ),
        isElectionCommitteeDelete: true,
        isElectionCommitteeDeleteFail: false,
      };
    case DELETE_ELECTION_COMMITTEE_FAIL:
      return {
        ...state,
        error: action.payload,
        isElectionCommitteeDelete: false,
        isElectionCommitteeDeleteFail: true,
      };

    // Election Committee Results


    // Election Campaigns ---------------
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
