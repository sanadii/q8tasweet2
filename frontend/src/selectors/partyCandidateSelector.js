// Selectors/partyCandidateSelectors.js
import { createSelector } from 'reselect';

const selectPartyCandidatesState = state => state.PartyCandidates;

export const partyCandidateSelector = createSelector(
    selectPartyCandidatesState,
    (partyCandidateState,) => ({
        partyCandidates: partyCandidateState.partyCandidates,
        partyPpartyCandidateDetails: partyCandidateState.partyCandidateDetails,
        partyPpartyCandidateId: partyCandidateState.partyCandidateDetails.id,
        partyPpartyCandidate: partyCandidateState.partyCandidateDetails,


        isPartyCandidateSuccess: partyCandidateState.isPartyCandidateSuccess,
        error: partyCandidateState.error,
    })
);
