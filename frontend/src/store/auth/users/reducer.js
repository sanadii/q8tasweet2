import {
  // User Success/Error
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,

  // User s
  GET_USERS,
  GET_USER_DETAILS,

  ADD_USER_SUCCESS,
  ADD_USER_FAIL,
  UPDATE_USER_PROFILE_SUCCESS,
  UPDATE_USER_PROFILE_FAIL,
  CHANGE_USER_PASSWORD_SUCCESS,
  CHANGE_USER_PASSWORD_FAIL,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAIL,

  // Specific Users
  GET_CURRENT_USER,
  GET_MODERATOR_USERS,
  GET_CAMPAIGN_MODERATORS,
  GET_CAMPAIGN_SORTERS
} from "./actionType";

const IntialState = {
  users: [],
  moderators: [],
  currentUser: null,
  userDetails: [],
  campaignModerators: [],
};

const Users = (state = IntialState, action) => {
  switch (action.type) {
    case API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case GET_USERS:
          return {
            ...state,
            users: action.payload.data,
            isUserCreated: false,
            isUserSuccess: true,
          };
        case GET_CURRENT_USER:
          return {
            ...state,
            currentUser: action.payload.data,
            isUserCreated: false,
            isUserSuccess: true,
          };
        case GET_USER_DETAILS:
          return {
            ...state,
            userDetails: action.payload.data.details,
            userCandidates: action.payload.data.candidates,
            userCampaigns: action.payload.data.campaigns,
            isUserCreated: false,
            isUserSuccess: true,
          };
        case GET_MODERATOR_USERS:
          return {
            ...state,
            moderators: action.payload.data,
            isUserCreated: false,
            isUserSuccess: true,
          };
        case GET_CAMPAIGN_MODERATORS:
          return {
            ...state,
            campaignModerators: action.payload.data,
            isUserCreated: false,
            isUserSuccess: true,
          };
        case GET_CAMPAIGN_SORTERS:
          return {
            ...state,
            campaignSorters: action.payload.data,
            isUserCreated: false,
            isUserSuccess: true,
          };


        default:
          return { ...state };
      }

    case API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case GET_USERS:
          return {
            ...state,
            error: action.payload.error,
            isUserCreated: false,
            isUserSuccess: true,
          };
        case GET_CURRENT_USER:
          return {
            ...state,
            error: action.payload.error,
            isUserCreated: false,
            isUserSuccess: true,
          };
        case GET_USER_DETAILS:
          return {
            ...state,
            error: action.payload.error,
            isUserCreated: false,
            isUserSuccess: true,
          };

        case GET_MODERATOR_USERS:
          return {
            ...state,
            error: action.payload.error,
            isUserCreated: false,
            isUserSuccess: true,
          };
        case GET_CAMPAIGN_MODERATORS:
          return {
            ...state,
            error: action.payload.error,
            isUserCreated: false,
            isUserSuccess: true,
          };
        case GET_CAMPAIGN_SORTERS:
          return {
            ...state,
            error: action.payload.error,
            isUserCreated: false,
            isUserSuccess: true,
          };
        default:
          return { ...state };
      }

    case GET_USERS: {
      return {
        ...state,
        isUserCreated: false,
      };
    }
    case GET_USER_DETAILS: {
      return {
        ...state,
        userDetails: action.payload,
        isUserCreated: false,
      };
    }
    case ADD_USER_SUCCESS:
      return {
        ...state,
        isUserCreated: true,
        users: [...state.users, action.payload.data],
        isUserAdd: true,
        isUserAddFail: false,
      };
    case ADD_USER_FAIL:
      return {
        ...state,
        error: action.payload,
        isUserAdd: false,
        isUserAddFail: true,
      };
    case UPDATE_USER_PROFILE_SUCCESS:
      return {
        ...state,
        users: state.users.map((user) =>
          user.id.toString() === action.payload.data.id.toString()
            ? { ...user, ...action.payload.data }
            : user
        ),
        isUserUpdate: true,
        isUserUpdateFail: false,
      };

    case CHANGE_USER_PASSWORD_SUCCESS:
      return {
        ...state,
        users: state.users.map((user) =>
          user.id.toString() === action.payload.data.id.toString()
            ? { ...user, ...action.payload.data }
            : user
        ),
        isUserPasswordChange: true,
        isUserPasswordChangeFail: false,
      };
    case UPDATE_USER_PROFILE_FAIL:
      return {
        ...state,
        error: action.payload,
        isUserUpdate: false,
        isUserUpdateFail: true,
      };
    case CHANGE_USER_PASSWORD_FAIL:
      return {
        ...state,
        error: action.payload,
        isUserPasswordChange: false,
        isUserPasswordChangeFail: true,
      };
    case DELETE_USER_SUCCESS:
      return {
        ...state,
        users: state.users.filter(
          (user) => user.id.toString() !== action.payload.user.id.toString()
        ),
        isUserDelete: true,
        isUserDeleteFail: false,
      };
    case DELETE_USER_FAIL:
      return {
        ...state,
        error: action.payload,
        isUserDelete: false,
        isUserDeleteFail: true,
      };

    // Specific User(s)
    case GET_CURRENT_USER: {
      return {
        ...state,
        currentUser: action.payload,
        isUserCreated: false,
      };
    }
    case GET_MODERATOR_USERS: {
      return {
        ...state,
        isUserCreated: false,
      };
    }
    case GET_CAMPAIGN_MODERATORS: {
      return {
        ...state,
        isUserCreated: false,
      };
    }
    case GET_CAMPAIGN_SORTERS: {
      return {
        ...state,
        isUserCreated: false,
      };
    }
    default:
      return { ...state };
  }
};

export default Users;
