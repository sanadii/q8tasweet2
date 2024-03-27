import {
  // Group Success/Error
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,

  // Group s
  GET_GROUPS,

  ADD_NEW_GROUP_SUCCESS,
  ADD_NEW_GROUP_FAIL,
  UPDATE_GROUP_SUCCESS,
  UPDATE_GROUP_FAIL,
  DELETE_GROUP_SUCCESS,
  DELETE_GROUP_FAIL,


} from "./actionType";

const IntialState = {
  groups: [],
  categories: [],
};

const Groups = (state = IntialState, action) => {
  switch (action.type) {
    case API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case GET_GROUPS:
          return {
            ...state,
            groups: action.payload.data.groups,
            categories: action.payload.data.categories,
            isGroupCreated: false,
            isGroupSuccess: true,
          };

        default:
          return { ...state };
      }

    case API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case GET_GROUPS:
          return {
            ...state,
            error: action.payload.error,
            isGroupCreated: false,
            isGroupSuccess: true,
          };

        default:
          return { ...state };
      }

    case GET_GROUPS: {
      return {
        ...state,
        isGroupCreated: false,
      };
    }

    case ADD_NEW_GROUP_SUCCESS:
      return {
        ...state,
        isGroupCreated: true,
        groups: [...state.groups, action.payload.data.groups],
        isGroupAdd: true,
        isGroupAddFail: false,
      };
    case ADD_NEW_GROUP_FAIL:
      return {
        ...state,
        error: action.payload,
        isGroupAdd: false,
        isGroupAddFail: true,
      };
    case UPDATE_GROUP_SUCCESS:
      return {
        ...state,
        groups: state.groups.map((group) =>
          group.id.toString() === action.payload.data.id.toString()
            ? { ...group, ...action.payload.data }
            : group
        ),
        isGroupUpdate: true,
        isGroupUpdateFail: false,
      };
    case UPDATE_GROUP_FAIL:
      return {
        ...state,
        error: action.payload,
        isGroupUpdate: false,
        isGroupUpdateFail: true,
      };
    case DELETE_GROUP_SUCCESS:
      return {
        ...state,
        groups: state.groups.filter(
          (group) => group.id.toString() !== action.payload.group.toString()
        ),
        isGroupDelete: true,
        isGroupDeleteFail: false,
      };
    case DELETE_GROUP_FAIL:
      return {
        ...state,
        error: action.payload,
        isGroupDelete: false,
        isGroupDeleteFail: true,
      };



    default:
      return { ...state };
  }
};

export default Groups;
