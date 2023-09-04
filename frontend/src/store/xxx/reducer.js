import {
  // User Success/Error
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,

  // User
  GET_USERS,
  GET_CURRENT_USER,
  GET_USER_DETAILS,
  GET_MODERATOR_USERS,

  ADD_NEW_USER_SUCCESS,
  ADD_NEW_USER_FAIL,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAIL,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAIL,
} from "./actionType";

const IntialState = {
  users: [],
  moderators: [],
  userDetails: [],
  userElections: [],
  userCampaigns: [],
  userCommittees: [],
  currentUser: [],

};

const Users = (state = IntialState, action) => {
  switch (action.type) {
    case API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case GET_USERS:
          console.log("GET_USERS LOGGING Payload:", action.payload); // Log the payload
          return {
            ...state,
            users: action.payload.data,
            isUserCreated: false,
            isUserSuccess: true,
          };
        case GET_USER_DETAILS:
          console.log("GET_USER_DETAILS LOGGING Payload:", action.payload); // Log the payload
          return {
            ...state,
            userDetails: action.payload.data.userDetails,
            userElections: action.payload.data.userElections,
            userCampaigns: action.payload.data.userCampaigns,
            userCommittees: action.payload.data.userCommittees,
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
        case GET_MODERATOR_USERS:
          return {
            ...state,
            moderators: action.payload.data,
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
        case GET_USER_DETAILS:
          console.log(
            "GET_USER_DETAILS ERROR LOGGING Payload:",
            action.payload
          ); // Log the payload

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
        case GET_MODERATOR_USERS:
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

    case ADD_NEW_USER_SUCCESS:
      return {
        ...state,
        isUserCreated: true,
        users: [...state.users, action.payload.data],
        isUserAdd: true,
        isUserAddFail: false,
      };
    case ADD_NEW_USER_FAIL:
      return {
        ...state,
        error: action.payload,
        isUserAdd: false,
        isUserAddFail: true,
      };
    case UPDATE_USER_SUCCESS:
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
    case UPDATE_USER_FAIL:
      return {
        ...state,
        error: action.payload,
        isUserUpdate: false,
        isUserUpdateFail: true,
      };
    case DELETE_USER_SUCCESS:
      return {
        ...state,
        users: state.users.filter(
          (user) =>
            user.id.toString() !== action.payload.user.toString()
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

    default:
      return { ...state };
  }
};

export default Users;
