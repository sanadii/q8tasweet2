import {
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,
  GET_ALL_ELECTORS,
  GET_ELECTORS,
  ADD_ELECTOR_SUCCESS,
  ADD_ELECTOR_FAIL,
  UPDATE_ELECTOR_SUCCESS,
  UPDATE_ELECTOR_FAIL,
  DELETE_ELECTOR_SUCCESS,
  DELETE_ELECTOR_FAIL,
} from "./actionType";

const initialState = {
  allElectors: [],
  electors: [],
  totalElectorsCount: [],
  nextPageUrl: [],
  previousPageUrl: {},
};

const Electors = (state = initialState, action) => {
  switch (action.type) {
    case API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case GET_ALL_ELECTORS:
          return {
            ...state,
            allElectors: action.payload.data.allElectors,
          };
        case GET_ELECTORS:
          return {
            ...state,
            electors: action.payload.data.electors,
            count: action.payload.data.count,
            nextPageUrl: action.payload.data.nextPageUrl,
            previousPageUrl: action.payload.data.previousPageUrl,
          };
        default:
          return { ...state };
      }
    case API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case GET_ALL_ELECTORS:
          return {
            ...state,
            error: action.payload.error,
          };
        case GET_ELECTORS:
          return {
            ...state,
            error: action.payload.error,
          };
        default:
          return { ...state };
      }

    case ADD_ELECTOR_SUCCESS:
      return {
        ...state,
        electorList: [...state.electorList, action.payload],
      };

    case ADD_ELECTOR_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_ELECTOR_SUCCESS:
      return {
        ...state,
        electorList: state.electorList.map((elector) =>
          elector.id.toString() === action.payload.id.toString()
            ? { ...elector, ...action.payload }
            : elector
        ),
      };

    case UPDATE_ELECTOR_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_ELECTOR_SUCCESS:
      return {
        ...state,
        electorList: state.electorList.filter(
          (elector) => elector.id.toString() !== action.payload.id.toString()
        ),
      };

    case DELETE_ELECTOR_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return { ...state };
  }
};

export default Electors;
