// Selectors/electionSelectors.js
import { createSelector } from 'reselect';

const selectElectorState = state => state.Electors;

export const electorSelector = createSelector(
  selectElectorState,
  (electorsState) => ({
    // Election
    electionStatistics: electorsState.electionStatistics,

    // Election Selectors
    electorsByFamily: electorsState.electorsByFamily,
    electorsByArea: electorsState.electorsByArea,
    electorsByCommittee: electorsState.electorsByCommittee,
    electorsByCategories: electorsState.electorsByCategories,
    electorsByFamilyArea: electorsState.electorsByCategories?.electorsByFamily || [],
    


    // // Elections
    // electionCommittees: electionStatisticsState.electionCommittees,
    // // futureElections: electionStatisticsState.futureElections,


    voters: electorsState.voters,
    isElectorSuccess: electorsState.isElectorSuccess,
    isElectorerror: electorsState.error,

  })
);
