import {
  // ElectionStatistic Success/Error
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,

  // Election Database
  ADD_ELECTOR_SUCCESS,
  ADD_ELECTOR_FAIL,

  // ElectionStatistics
  GET_ELECTORS_BY_CATEGORY,
  GET_ELECTOR_STATISTICS,
  GET_ELECTORS_BY_FAMILY,


  GET_ELECTOR_FAMILY_DIVISIONS,
} from "./actionType";

const IntialState = {
  electionStatistics: [],
  electorsByFamily: [],
  electorsByArea: [],
  electorsByCommittee: [],
  electionDataCategories: [],
  electorsByCategories: [],

  // 
  electorsByCategory: [],

};

const Electors = (state = IntialState, action) => {
  switch (action.type) {

    case API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case GET_ELECTOR_STATISTICS:
          return {
            ...state,
            electionStatistics: action.payload.data.electionStatistics,
            electorsByFamily: action.payload.data.electorsByFamily,
            electorsByArea: action.payload.data.electorsByArea,
            electorsByCommittee: action.payload.data.electorsByCommittee,
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

        case GET_ELECTORS_BY_FAMILY:
          return {
            ...state,
            electorsByFamily: action.payload.data,
            isElectionStatisticCreated: false,
            isElectionStatisticsuccess: true,
          };

        case GET_ELECTOR_FAMILY_DIVISIONS:
          return {
            ...state,
            electorsByCategory: action.payload.data,
            isElectorFamilyDivisionCreated: false,
            isElectorFamilyDivisionSuccess: true,
          }

        default:
          return { ...state };
      }

    case API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case GET_ELECTOR_STATISTICS:
          return {
            ...state,
            error: action.payload.error,
            isElectionStatisticCreated: false,
            isElectionStatisticsuccess: true,
          };

        case GET_ELECTORS_BY_CATEGORY:
          return {
            ...state,
            error: action.payload.error,
            isElectorsByCategoryCreated: false,
            isElectorsByCategorySuccess: true,
          };


        case GET_ELECTORS_BY_FAMILY:
          return {
            ...state,
            error: action.payload.error,
            isElectorsByFamilyCreated: false,
            isElectorsByFamilySuccess: true,
          };
        case GET_ELECTOR_FAMILY_DIVISIONS:
          return {
            ...state,
            error: action.payload.error,
            isElectorFamilyDivisionCreated: false,
            isElectorsFamilyDivisionSuccess: true,
          };
        default:
          return { ...state };
      }


    // Add Election Database
    case ADD_ELECTOR_SUCCESS:
      return {
        ...state,
        isElectionCreated: true,
        // elections: [...state.elections, action.payload.data],
        isElectorAdd: true,
        isElectionAddDatabaseFail: false,
      };
    case ADD_ELECTOR_FAIL:
      return {
        ...state,
        error: action.payload,
        isElectorAdd: false,
        isElectionAddDatabaseFail: true,
      };

    // Election Statistics
    case GET_ELECTOR_STATISTICS: {
      return {
        ...state,
        isElectionStatisticCreated: false,
      };
    }

    case GET_ELECTORS_BY_CATEGORY: {
      return {
        ...state,
        isElectorsByCategoryCreated: false,
      };
    }

    case GET_ELECTORS_BY_FAMILY: {
      return {
        ...state,
        isElectorsByFamilyCreated: false,
      };
    }

    default:
      return { ...state };
  }
};

export default Electors;
