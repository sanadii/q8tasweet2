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
          // Checking before accessing Candidates to prevent error
          candidates: Array.isArray(state.candidates)
            ? state.candidates.map((candidate) =>
              candidate.id.toString() === action.payload.data.id.toString()
                ? { ...candidate, ...action.payload.data }
                : candidate
            )
            : state.candidates,
  
          // Checking before accessing Candidate Details to prevent error
          candidateDetails: state.candidateDetails
            ? {
              ...state.candidateDetails,
              ...(action.payload.data || {}),
            }
            : action.payload.data || null,
  
          isCampaignUpdate: true,
          isCampaignUpdateFail: false,
        };
  
  

    // return {
      //   ...state,
      //   // Checking before accessing Candidates to prevent error
      //   candidates: Array.isArray(state.candidates)
      //     ? state.candidates.map((candidate) =>
      //       candidate.id.toString() === action.payload.data.id.toString()
      //         ? { ...candidate, ...action.payload.data }
      //         : candidate
      //     )
      //     : state.candidates,

      //   // Checking before accessing Candidate Details to prevent error
      //   // candidateDetails: state.candidateDetails && state.candidateDetails.id.toString() === action.payload.data.id.toString()
      //   //   ? { ...state.candidateDetails, ...action.payload.data }
      //   //   : state.candidateDetails,

      //   // isCandidateUpdate: true,
      //   // isCandidateUpdateFail: false,
      // };

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
    default:
      return { ...state };
  }
};

export default Candidates;
