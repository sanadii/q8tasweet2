// Selectors/electionSelectors.js
import { createSelector } from 'reselect';

const selectElectionsState = state => state.Elections;

export const electionSelector = createSelector(
  selectElectionsState,
  (electionsState) => ({
    // Election Selectors
    elections: electionsState.elections,
    recentElections: electionsState.recentElections,
    futureElections: electionsState.futureElections,

    election: electionsState.electionDetails,
    electionType: electionsState.electionDetails.electType,

    electionDetails: electionsState.electionDetails,
    previousElection: electionsState.electionDetails.previousElection,
    electionId: electionsState.electionDetails.id,
    electionCommittees: electionsState.electionCommittees,

    electionCandidates: electionsState.electionCandidates,
    electionParties: electionsState.electionParties,
    electionPartyCandidates: electionsState.electionPartyCandidates,

    electionCampaigns: electionsState.electionCampaigns,
    electionAttendees: electionsState.electionAttendees,
    electionCommitteeResults: electionsState.electionCommitteeResults,


    electionSorters: electionsState.electionSorters,
    isElectionSuccess: electionsState.isElectionSuccess,
    error: electionsState.error,

  })
);
