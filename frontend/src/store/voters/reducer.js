import {
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,
  GET_ALL_VOTERS,
  GET_VOTERS,
  ADD_VOTER_SUCCESS,
  ADD_VOTER_FAIL,
  UPDATE_VOTER_SUCCESS,
  UPDATE_VOTER_FAIL,
  DELETE_VOTER_SUCCESS,
  DELETE_VOTER_FAIL,
} from "./actionType";

const initialState = {
  allVoters: [],
  voters: [],
  totalVotersCount: [],
  nextPageUrl: [],
  previousPageUrl: {},
};

const Voters = (state = initialState, action) => {
  switch (action.type) {
    case API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case GET_ALL_VOTERS:
          return {
            ...state,
            allVoters: action.payload.data.allVoters,
          };
        case GET_VOTERS:
          return {
            ...state,
            voters: action.payload.data.voters,
            count: action.payload.data.count,
            nextPageUrl: action.payload.data.nextPageUrl,
            previousPageUrl: action.payload.data.previousPageUrl,
          };
        default:
          return { ...state };
      }
    case API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case GET_ALL_VOTERS:
          return {
            ...state,
            error: action.payload.error,
          };
        case GET_VOTERS:
          return {
            ...state,
            error: action.payload.error,
          };
        default:
          return { ...state };
      }

    case ADD_VOTER_SUCCESS:
      return {
        ...state,
        voterList: [...state.voterList, action.payload],
      };

    case ADD_VOTER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_VOTER_SUCCESS:
      return {
        ...state,
        voterList: state.voterList.map((voter) =>
          voter.id.toString() === action.payload.id.toString()
            ? { ...voter, ...action.payload }
            : voter
        ),
      };

    case UPDATE_VOTER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_VOTER_SUCCESS:
      return {
        ...state,
        voterList: state.voterList.filter(
          (voter) => voter.id.toString() !== action.payload.id.toString()
        ),
      };

    case DELETE_VOTER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return { ...state };
  }
};

export default Voters;
