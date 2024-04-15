import {
  // ElectionStatistic Success/Error
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,

  // ElectionStatistics
  GET_ELECTION_STATISTICS,



} from "./actionType";

const IntialState = {
  electionStatistics: [],
};

const ElectionStatistics = (state = IntialState, action) => {
  switch (action.type) {
    case API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case GET_ELECTION_STATISTICS:
          return {
            ...state,
            electionStatistics: action.payload.data.electionStatistics,
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

        default:
          return { ...state };
      }

    case GET_ELECTION_STATISTICS: {
      return {
        ...state,
        isElectionStatisticCreated: false,
      };
    }

    default:
      return { ...state };
  }
};

export default ElectionStatistics;
