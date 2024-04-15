import {
  // API Response
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,

  // ElectionStatistics
  GET_ELECTION_STATISTICS,
} from "./actionType";

// ElectionStatistic Success / Error
export const ElectionStatisticApiResponseSuccess = (actionType, data) => ({
  type: API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});

export const ElectionStatisticApiResponseError = (actionType, error) => ({
  type: API_RESPONSE_ERROR,
  payload: { actionType, error },
});

// Get ElectionStatistics
export const getElectionStatistics = (election) => ({
  type: GET_ELECTION_STATISTICS,
  payload: election
});

