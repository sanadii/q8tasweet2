import {
<<<<<<< HEAD
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
=======
  // ElectionStatistic Success/Error
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,

  // Election Database
  ADD_ELECTOR_SUCCESS,
  ADD_ELECTOR_FAIL,

  // ElectionStatistics
  GET_ELECTORS_BY_CATEGORY,
  GET_ELECTORS_BY_ALL,
  GET_ELECTORS_BY_SEARCH,
  GET_ELECTOR_RELATED_ELECTORS,
} from "./actionType";

const IntialState = {
  electionStatistics: [],
  electorsByFamily: [],
  electorsByArea: [],
  electorsByCommittee: [],
  electionDataCategories: [],
  electorsByCategories: [],
  electorsByAll: [],
  electorsBySearch: [],
  electorRelatedElectors: [],

};

const Electors = (state = IntialState, action) => {
  switch (action.type) {

    case API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case GET_ELECTORS_BY_ALL:
          return {
            ...state,
            electorsByAll: action.payload.data,
            isElectionStatisticCreated: false,
            isElectionStatisticsuccess: true,
          };
        case GET_ELECTORS_BY_CATEGORY:
          return {
            ...state,
            electorsByCategory: action.payload.data,
            isElectionSCategoryCreated: false,
            isElectionCategorySuccess: true,
          };

        case GET_ELECTORS_BY_SEARCH:
          return {
            ...state,
            electorsBySearch: action.payload.data,
            isElectionStatisticCreated: false,
            isElectionStatisticsuccess: true,
          };
        case GET_ELECTOR_RELATED_ELECTORS:
          return {
            ...state,
            electorRelatedElectors: action.payload.data,
            isElectionStatisticCreated: false,
            isElectionStatisticsuccess: true,
          };


        default:
          return { ...state };
      }

    case API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case GET_ELECTORS_BY_ALL:
          return {
            ...state,
            error: action.payload.error,
            isElectorByAllCreated: false,
            isElectorByAllSuccess: true,
          };

        case GET_ELECTORS_BY_CATEGORY:
          return {
            ...state,
            error: action.payload.error,
            isElectorsByCategoryCreated: false,
            isElectorsByCategorySuccess: true,
          };

        case GET_ELECTORS_BY_SEARCH:
          return {
            ...state,
            error: action.payload.error,
            isElectorsByFamilyCreated: false,
            isElectorsByFamilySuccess: true,
          };

        case GET_ELECTOR_RELATED_ELECTORS:
          return {
            ...state,
            error: action.payload.error,
            isElectorRelatedElectorsCreated: false,
            isElectorRelatedElectorsSuccess: true,
>>>>>>> sanad
          };
        default:
          return { ...state };
      }

<<<<<<< HEAD
    case ADD_ELECTOR_SUCCESS:
      return {
        ...state,
        electorList: [...state.electorList, action.payload],
      };

=======

    // Add Election Database
    case ADD_ELECTOR_SUCCESS:
      return {
        ...state,
        isElectionCreated: true,
        // elections: [...state.elections, action.payload.data],
        isElectorAdd: true,
        isElectionAddDatabaseFail: false,
      };
>>>>>>> sanad
    case ADD_ELECTOR_FAIL:
      return {
        ...state,
        error: action.payload,
<<<<<<< HEAD
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
=======
        isElectorAdd: false,
        isElectionAddDatabaseFail: true,
      };

    // Election Statistics
    // case GET_ELECTORS_BY_ALL: {
    //   return {
    //     ...state,
    //     isElectionStatisticCreated: false,
    //   };
    // }

    case GET_ELECTORS_BY_CATEGORY: {
      return {
        ...state,
        isElectorsByCategoryCreated: false,
      };
    }

    case GET_ELECTORS_BY_SEARCH: {
      return {
        ...state,
        isElectorsByFamilyCreated: false,
      };
    }
>>>>>>> sanad

    default:
      return { ...state };
  }
};

export default Electors;
