// Selectors/electionSelectors.js
import { createSelector } from 'reselect';

const selectElectionsState = state => state.Elections;

export const electionSelector = createSelector(
  selectElectionsState,
  (electionsState) => ({
    
    // Election Selectors
    elections: electionsState.elections || [],
    recentElections: electionsState.recentElections || [],
    futureElections: electionsState.futureElections || [],

    election: electionsState.electionDetails,
    electionId: electionsState.electionDetails.id,
    electionSlug: electionsState.electionDetails?.slug,
    electionMethod: electionsState.electionDetails.electionMethod,

    electionDetails: electionsState.electionDetails,
    previousElection: electionsState.electionDetails.previousElection,


    electionCandidates: electionsState.electionCandidates || [],
    electionParties: electionsState.electionParties || [],
    electionPartyCandidates: electionsState.electionPartyCandidates || [],

    electionCampaigns: electionsState.electionCampaigns || [],
    electionAttendees: electionsState.electionAttendees || [],
    // electionResult: electionsState.electionDetails.electionResult,
    electionResultView: electionsState.electionDetails.electionResultView,
    electionResultParty: electionsState.electionDetails.electionResultParty,
    electionResultSorting: electionsState.electionDetails.electionResultSorting,
    // electionResultView: electionsState.electionDetails.electionResult.View,
    // partyResult: electionsState.electionDetails.electionResult.,
    // SortingResult: electionsState.electionDetails.electionResult.,


    electionSorters: electionsState.electionSorters || [],


    // From Schema
    electionAreas: electionsState.electionAreas,
    electionCommitteeSites: electionsState.electionCommitteeSites,
    schemaDetails: electionsState.schemaDetails,

    // Success / Error
    isElectionSuccess: electionsState.isElectionSuccess,
    error: electionsState.error,

  })
);

