// Selectors/electionSelectors.js
import { createSelector } from 'reselect';

const selectElectionsState = state => state.Elections;

export const electionSelector = createSelector(
  selectElectionsState,
  (electionsState) => ({
    // Election Selectors
    elections: electionsState.elections,
    electionDetails: electionsState.electionDetails,
    electionCommittees: electionsState.electionCommittees,
    electionCandidates: electionsState.electionCandidates,
    electionCampaigns: electionsState.electionCampaigns,

    electionAttendees: electionsState.electionAttendees,
    electionResults: electionsState.electionResults,

    isElectionSuccess: electionsState.isElectionSuccess,
    error: electionsState.error,

  })
);
