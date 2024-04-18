// Selectors/electionSelectors.js
import { createSelector } from 'reselect';

const selectElectionDataState = state => state.ElectionData;

export const electionDataSelector = createSelector(
  selectElectionDataState,
  (electionStatisticsState) => ({
    // Election Selectors
    electorsByFamily: electionStatisticsState.electorsByFamily,
    electorsByGender: electionStatisticsState.electorsByGender,
    electorsByArea: electionStatisticsState.electorsByArea,



    // Elections
    electionCommittees: electionStatisticsState.electionCommittees,
    // futureElections: electionStatisticsState.futureElections,

    isElectionSuccess: electionStatisticsState.isElectionSuccess,
    error: electionStatisticsState.error,

  })
);

