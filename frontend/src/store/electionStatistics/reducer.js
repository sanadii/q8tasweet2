import {
  // ElectionStatistic Success/Error
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,

  // Election Database
  ADD_ELECTION_DATABASE_SUCCESS,
  ADD_ELECTION_DATABASE_FAIL,

  // ElectionStatistics
  GET_ELECTION_STATISTICS,
  GET_ELECTORS_BY_FAMILY,


} from "./actionType";

const IntialState = {
  electorsByGender: [],
  electorsByFamily: [],
  electorsByArea: [],
  electionCommittees: [],
};

const ElectionStatistics = (state = IntialState, action) => {
  switch (action.type) {

    case API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case GET_ELECTION_STATISTICS:
          return {
            ...state,
            electorsByGender: action.payload.data.electorsByGender,
            electorsByFamily: action.payload.data.electorsByFamily,
            electorsByArea: action.payload.data.electorsByArea,


            // election
            electionCommittees: action.payload.data.electionCommittees,

            
            isElectionStatisticCreated: false,
            isElectionStatisticsuccess: true,
          };

        case GET_ELECTORS_BY_FAMILY:
          return {
            ...state,
            electorsByFamily: action.payload.data,
            isElectionStatisticCreated: false,
            isElectionStatisticsuccess: true,
          };

        default:
          return { ...state };
      }

    case API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case GET_ELECTION_STATISTICS:
          return {
            ...state,
            error: action.payload.error,
            isElectionStatisticCreated: false,
            isElectionStatisticsuccess: true,
          };

        case GET_ELECTORS_BY_FAMILY:
          return {
            ...state,
            error: action.payload.error,
            isElectorsByFamilyCreated: false,
            isElectorsByFamilySuccess: true,
          };


        default:
          return { ...state };
      }


    // Add Election Database
    case ADD_ELECTION_DATABASE_SUCCESS:
      return {
        ...state,
        isElectionCreated: true,
        // elections: [...state.elections, action.payload.data],
        isElectionDatabaseAdd: true,
        isElectionAddDatabaseFail: false,
      };
    case ADD_ELECTION_DATABASE_FAIL:
      return {
        ...state,
        error: action.payload,
        isElectionDatabaseAdd: false,
        isElectionAddDatabaseFail: true,
      };

    // Election Statistics
    case GET_ELECTION_STATISTICS: {
      return {
        ...state,
        isElectionStatisticCreated: false,
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

export default ElectionStatistics;
