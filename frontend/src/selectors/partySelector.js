// Selectors/partySelectors.js
import { createSelector } from 'reselect';

const selectPartiesState = state => state.Parties;

export const partySelector = createSelector(
    selectPartiesState,
    (partyState,) => ({
        parties: partyState.parties,
        partyDetails: partyState.partyDetails,
        partyId: partyState.partyDetails.id,
        party: partyState.partyDetails,


        isPartySuccess: partyState.isPartySuccess,
        error: partyState.error,
    })
);
