// Selectors/electionSelectors.js
import { createSelector } from 'reselect';

const selectElectionsState = state => state.Elections;

export const electionSelector = createSelector(
  selectElectionsState,
  (electionsState) => ({
    // Election Selectors
    elections: electionsState.elections,

    election: electionsState.electionDetails,
    electionDetails: electionsState.electionDetails,
    previousElection: electionsState.electionDetails.previousElection,
    electionId: electionsState.electionDetails.id,
    electionCommittees: electionsState.electionCommittees,
    electionCandidates: electionsState.electionCandidates,
    electionCampaigns: electionsState.electionCampaigns,

    electionAttendees: electionsState.electionAttendees,
    electionCommitteeResults: electionsState.electionCommitteeResults,

    isElectionSuccess: electionsState.isElectionSuccess,
    error: electionsState.error,

  })
);
