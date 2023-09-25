import { createSelector } from 'reselect';

const selectElectionsState = state => state.Elections;

export const electionsSelector = createSelector(
  selectElectionsState,
  electionsState => ({
    elections: electionsState.elections,
    electionDetails: electionsState.electionDetails,
    electionCommittees: electionsState.electionCommittees,
    electionCandidates: electionsState.electionCandidates,
    electionAttendees: electionsState.electionAttendees,
    electionCommitteeResults: electionsState.electionCommitteeResults,
    isElectionSuccess: electionsState.isElectionSuccess,
    error: electionsState.error,
  })
);

