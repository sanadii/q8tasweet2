import {
  // API Response
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,

  // ElectionSchemas
  GET_ELECTION_SCHEMAS,
  ADD_SCHEMA_TABLES,


  ADD_ELECTION_SCHEMA,
  ADD_ELECTION_SCHEMA_SUCCESS,
  ADD_ELECTION_SCHEMA_FAIL,


  UPDATE_ELECTION_SCHEMA,
  UPDATE_ELECTION_SCHEMA_SUCCESS,
  UPDATE_ELECTION_SCHEMA_FAIL,
  DELETE_ELECTION_SCHEMA,
  DELETE_ELECTION_SCHEMA_SUCCESS,
  DELETE_ELECTION_SCHEMA_FAIL,

  // ElectionSchema Details
  GET_ELECTION_SCHEMA_DETAILS,
} from "./actionType";

// ElectionSchema Success / Error
export const ElectionSchemaApiResponseSuccess = (actionType, data) => ({
  type: API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});

export const ElectionSchemaApiResponseError = (actionType, error) => ({
  type: API_RESPONSE_ERROR,
  payload: { actionType, error },
});


// Get ElectionSchemas
export const getElectionSchemas = () => ({
  type: GET_ELECTION_SCHEMAS,
});

export const addSchemaTables = (electionSchema) => ({
  type: ADD_SCHEMA_TABLES,
  payload: electionSchema,
});


// ElectionSchema Details
export const getElectionSchemaDetails = (electionSchema) => ({
  type: GET_ELECTION_SCHEMA_DETAILS,
  payload: electionSchema,
});


// Add  ElectionSchema
export const addElectionSchema = (electionSchema) => ({
  type: ADD_ELECTION_SCHEMA,
  payload: electionSchema,
});

export const addElectionSchemaSuccess = (electionSchema) => ({
  type: ADD_ELECTION_SCHEMA_SUCCESS,
  payload: electionSchema,
});

export const addElectionSchemaFail = (error) => ({
  type: ADD_ELECTION_SCHEMA_FAIL,
  payload: error,
});



// Update ElectionSchema
// export const updateElectionSchemaSuccess = (electionSchema) => ({
//   type: UPDATE_ELECTION_SCHEMA_SUCCESS,
//   payload: electionSchema,
// });

// export const updateElectionSchema = (electionSchema) => {
//   console.log("ElectionSchema in updateElectionSchema:", electionSchema);

//   return {
//     type: UPDATE_ELECTION_SCHEMA,
//     payload: electionSchema,
//   };
// };

// Update ElectionSchema
export const updateElectionSchema = (electionSchema) => ({
  type: UPDATE_ELECTION_SCHEMA,
  payload: electionSchema,
});

export const updateElectionSchemaSuccess = (electionSchema) => ({
  type: UPDATE_ELECTION_SCHEMA_SUCCESS,
  payload: electionSchema,
});


export const updateElectionSchemaFail = (error) => ({
  type: UPDATE_ELECTION_SCHEMA_FAIL,
  payload: error,
});

// Delete ElectionSchema
export const deleteElectionSchema = (electionSchema) => ({
  type: DELETE_ELECTION_SCHEMA,
  payload: electionSchema,
});

export const deleteElectionSchemaSuccess = (electionSchema) => ({
  type: DELETE_ELECTION_SCHEMA_SUCCESS,
  payload: electionSchema,
});

export const deleteElectionSchemaFail = (error) => ({
  type: DELETE_ELECTION_SCHEMA_FAIL,
  payload: error,
});

