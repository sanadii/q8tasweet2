// Selectors/candidateSelectors.js
import { createSelector } from 'reselect';

const selectCandidatesState = state => state.Candidates;

export const candidateSelector = createSelector(
    selectCandidatesState,
    (candidateState,) => ({
        candidates: candidateState.candidates,


        isCandidateSuccess: candidateState.isCandidateSuccess,
        error: candidateState.error,
    })
);
