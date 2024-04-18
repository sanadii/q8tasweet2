// Selectors/electionSelectors.js
import { createSelector } from 'reselect';

const selectElectionSchemaState = state => state.ElectionSchema;

export const electionSchemaSelector = createSelector(
  selectElectionSchemaState,
  (electionSchemaState) => ({
    // Election Selectors
    electionSchemaName: electionSchemaState.electionSchemaDetails?.schemaName,
    electionSchemaTables: electionSchemaState.electionSchemaDetails?.schemaTables,

    isElectionSchemaSuccess: electionSchemaState.isElectionSuccess,
    isElectionSchemaError: electionSchemaState.error,

  })
);

