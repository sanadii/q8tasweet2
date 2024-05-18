import {
  // ElectionSchema Success/Error
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,

  // ElectionSchema
  GET_ELECTION_SCHEMAS,
  ADD_SCHEMA_TABLES,
  GET_ELECTION_SCHEMA_DETAILS,
  ADD_ELECTION_SCHEMA_SUCCESS,
  ADD_ELECTION_SCHEMA_FAIL,
  UPDATE_ELECTION_SCHEMA_SUCCESS,
  UPDATE_ELECTION_SCHEMA_FAIL,
  DELETE_ELECTION_SCHEMA_SUCCESS,
  DELETE_ELECTION_SCHEMA_FAIL,
} from "./actionType";

const IntialState = {
  electionSchemas: [],
  electionSchemaDetails: [],
  electionSchemaElections: [],
  electionSchemaCampaigns: [],
  electionSchemaCommittees: [],
};

const ElectionSchemas = (state = IntialState, action) => {
  switch (action.type) {
    case API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case GET_ELECTION_SCHEMAS:
          return {
            ...state,
            electionSchemas: action.payload.data,
            isElectionSchemaCreated: false,
            isElectionSchemaSuccess: true,
          };
        case ADD_SCHEMA_TABLES:
          return {
            ...state,
            schemaTables: action.payload.data,
            isSchemaTableCreated: false,
            isSchemaTableSuccess: true,
          };
        case GET_ELECTION_SCHEMA_DETAILS:
          return {
            ...state,
            electionSchemaDetails: action.payload.data,
            // electionSchemaTables: action.payload.data.schemaTables,
            isElectionSchemaCreated: false,
            isElectionSchemaSuccess: true,
          };
        default:
          return { ...state };
      }

    case API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case GET_ELECTION_SCHEMAS:
          return {
            ...state,
            error: action.payload.error,
            isElectionSchemaCreated: false,
            isElectionSchemaSuccess: true,
          };
        case ADD_SCHEMA_TABLES:
          return {
            ...state,
            error: action.payload.error,
            isSchemaTableCreated: false,
            isSchemaTableSuccess: true,
          };
        case GET_ELECTION_SCHEMA_DETAILS:
          return {
            ...state,
            error: action.payload.error,
            isElectionSchemaCreated: false,
            isElectionSchemaSuccess: true,
          };
        default:
          return { ...state };
      }

    case GET_ELECTION_SCHEMAS: {
      return {
        ...state,
        isElectionSchemaCreated: false,
      };
    }

    case ADD_SCHEMA_TABLES: {
      return {
        ...state,
        isSchemaTableCreated: false,
      };
    }

    case GET_ELECTION_SCHEMA_DETAILS: {
      return {
        ...state,
        electionSchemaDetails: action.payload,
        isElectionSchemaCreated: false,
      };
    }

    case ADD_ELECTION_SCHEMA_SUCCESS:
      return {
        ...state,
        isElectionSchemaCreated: true,
        electionSchemas: [...state.electionSchemas, action.payload.data],
        isElectionSchemaAdd: true,
        isElectionSchemaAddFail: false,
      };
    case ADD_ELECTION_SCHEMA_FAIL:
      return {
        ...state,
        error: action.payload,
        isElectionSchemaAdd: false,
        isElectionSchemaAddFail: true,
      };
    case UPDATE_ELECTION_SCHEMA_SUCCESS:
      return {
        ...state,
        // Checking before accessing ElectionSchemas to prevent error
        electionSchemas: Array.isArray(state.electionSchemas)
          ? state.electionSchemas.map((electionSchema) =>
            electionSchema.id.toString() === action.payload.data.id.toString()
              ? { ...electionSchema, ...action.payload.data }
              : electionSchema
          )
          : state.electionSchemas,

        // Checking before accessing ElectionSchema Details to prevent error
        electionSchemaDetails: state.electionSchemaDetails
          ? {
            ...state.electionSchemaDetails,
            ...(action.payload.data || {}),
          }
          : action.payload.data || null,

        isCampaignUpdate: true,
        isCampaignUpdateFail: false,
      };



    // return {
    //   ...state,
    //   // Checking before accessing ElectionSchemas to prevent error
    //   electionSchemas: Array.isArray(state.electionSchemas)
    //     ? state.electionSchemas.map((electionSchema) =>
    //       electionSchema.id.toString() === action.payload.data.id.toString()
    //         ? { ...electionSchema, ...action.payload.data }
    //         : electionSchema
    //     )
    //     : state.electionSchemas,

    //   // Checking before accessing ElectionSchema Details to prevent error
    //   // electionSchemaDetails: state.electionSchemaDetails && state.electionSchemaDetails.id.toString() === action.payload.data.id.toString()
    //   //   ? { ...state.electionSchemaDetails, ...action.payload.data }
    //   //   : state.electionSchemaDetails,

    //   // isElectionSchemaUpdate: true,
    //   // isElectionSchemaUpdateFail: false,
    // };

    case UPDATE_ELECTION_SCHEMA_FAIL:
      return {
        ...state,
        error: action.payload,
        isElectionSchemaUpdate: false,
        isElectionSchemaUpdateFail: true,
      };
    case DELETE_ELECTION_SCHEMA_SUCCESS:
      return {
        ...state,
        electionSchemas: state.electionSchemas.filter(
          (electionSchema) =>
            electionSchema.id.toString() !== action.payload.electionSchema.toString()
        ),
        isElectionSchemaDelete: true,
        isElectionSchemaDeleteFail: false,
      };
    case DELETE_ELECTION_SCHEMA_FAIL:
      return {
        ...state,
        error: action.payload,
        isElectionSchemaDelete: false,
        isElectionSchemaDeleteFail: true,
      };
    default:
      return { ...state };
  }
};

export default ElectionSchemas;
