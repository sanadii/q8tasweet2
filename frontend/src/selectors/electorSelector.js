// Selectors/electorSelector.js
import { createSelector } from 'reselect';

const selectElectorState = state => state.Electors;

export const electorSelector = createSelector(
    selectElectorState,
  (electorState) => ({
    // Election Selectors
    electors: electorState.electors,
    isElectorSuccess: electorState.isElectorSuccess,
    error: electorState.error,

  })
);
