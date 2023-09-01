import {
  // User Success/Error
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,

  // User s
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


  // User Candidates
  GET_USER_CANDIDATES,
  // GET_USER_CANDIDATE_DETAILS,
  ADD_NEW_USER_CANDIDATE_SUCCESS,
  ADD_NEW_USER_CANDIDATE_FAIL,
  UPDATE_USER_CANDIDATE_SUCCESS,
  UPDATE_USER_CANDIDATE_FAIL,
  DELETE_USER_CANDIDATE_SUCCESS,
  DELETE_USER_CANDIDATE_FAIL,

  // User Campaigns
  GET_USER_CAMPAIGNS,
  // GET_USER_CAMPAIGN_DETAILS,
  ADD_NEW_USER_CAMPAIGN_SUCCESS,
  ADD_NEW_USER_CAMPAIGN_FAIL,
  UPDATE_USER_CAMPAIGN_SUCCESS,
  UPDATE_USER_CAMPAIGN_FAIL,
  DELETE_USER_CAMPAIGN_SUCCESS,
  DELETE_USER_CAMPAIGN_FAIL,
} from "./actionType";

const IntialState = {
  users: [],
  moderators: [],
  currentUser: [],
  userDetails: [],
  userCandidates: [],
  userCampaigns: [],
  // userCandidates: [],
  // userCampaigns: [],
  // userMembers: [],
  // userGuarantees: [],
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

        case GET_USER_CANDIDATES:
          return {
            ...state,
            userCandidates: action.payload.data,
            isUserCandidateCreated: false,
            isUserCandidateSuccess: true,
          };
        case GET_USER_CAMPAIGNS:
          return {
            ...state,
            userCampaigns: action.payload.data,
            isUserCampaignCreated: false,
            isUserCampaignSuccess: true,
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
        case GET_USER_CANDIDATES: {
          return {
            ...state,
            error: action.payload.error,
            isUserCandidateCreated: false,
            isUserCandidateSuccess: true,
          };
        }

        case GET_USER_CAMPAIGNS: {
          return {
            ...state,
            error: action.payload.error,
            isUserCampaignCreated: false,
            isUserCampaignSuccess: true,
          };
        }
        default:
          return { ...state };
      }

    case GET_USERS: {
      return {
        ...state,
        isUserCreated: false,
      };
    }
    case GET_CURRENT_USER: {
      return {
        ...state,
        currentUser: action.payload,
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
    case GET_MODERATOR_USERS: {
      return {
        ...state,
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
          (user) => user.id.toString() !== action.payload.user.toString()
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

    // User Candidates
    case GET_USER_CANDIDATES: {
      return {
        ...state,
        error: action.payload.error,
        isUserCandidateCreated: false,
        isUserCandidateSuccess: true,
      };
    }

    case ADD_NEW_USER_CANDIDATE_SUCCESS:
      return {
        ...state,
        isUserCandidateCreated: true,
        userCandidates: [...state.userCandidates, action.payload.data],
        isUserCandidateAdd: true,
        isUserCandidateAddFail: false,
      };

    case ADD_NEW_USER_CANDIDATE_FAIL:
      return {
        ...state,
        error: action.payload,
        isUserCandidateAdd: false,
        isUserCandidateAddFail: true,
      };
    case UPDATE_USER_CANDIDATE_SUCCESS:
      return {
        ...state,
        userCandidates: state.userCandidates.map((userCandidate) =>
          userCandidate.id.toString() === action.payload.data.id.toString()
            ? { ...userCandidate, ...action.payload.data }
            : userCandidate
        ),
        isUserCandidateUpdate: true,
        isUserCandidateUpdateFail: false,
      };
    case UPDATE_USER_CANDIDATE_FAIL:
      return {
        ...state,
        error: action.payload,
        isUserCandidateUpdate: false,
        isUserCandidateUpdateFail: true,
      };
    case DELETE_USER_CANDIDATE_SUCCESS:
      return {
        ...state,
        userCandidates: state.userCandidates.filter(
          (userCandidate) =>
            userCandidate.id.toString() !==
            action.payload.userCandidate.toString()
        ),
        isUserCandidateDelete: true,
        isUserCandidateDeleteFail: false,
      };
    case DELETE_USER_CANDIDATE_FAIL:
      return {
        ...state,
        error: action.payload,
        isUserCandidateDelete: false,
        isUserCandidateDeleteFail: true,
      };

    // User Campaigns
    case GET_USER_CAMPAIGNS: {
      return {
        ...state,
        error: action.payload.error,
        isUserCampaignCreated: false,
        isUserCampaignSuccess: true,
      };
    }

    case ADD_NEW_USER_CAMPAIGN_SUCCESS:
      return {
        ...state,
        isUserCampaignCreated: true,
        userCampaigns: [...state.userCampaigns, action.payload.data],
        isUserCampaignAdd: true,
        isUserCampaignAddFail: false,
      };

    case ADD_NEW_USER_CAMPAIGN_FAIL:
      return {
        ...state,
        error: action.payload,
        isUserCampaignAdd: false,
        isUserCampaignAddFail: true,
      };
    case UPDATE_USER_CAMPAIGN_SUCCESS:
      return {
        ...state,
        userCampaigns: state.userCampaigns.map((userCampaign) =>
          userCampaign.id.toString() === action.payload.data.id.toString()
            ? { ...userCampaign, ...action.payload.data }
            : userCampaign
        ),
        isUserCampaignUpdate: true,
        isUserCampaignUpdateFail: false,
      };
    case UPDATE_USER_CAMPAIGN_FAIL:
      return {
        ...state,
        error: action.payload,
        isUserCampaignUpdate: false,
        isUserCampaignUpdateFail: true,
      };
    case DELETE_USER_CAMPAIGN_SUCCESS:
      return {
        ...state,
        userCampaigns: state.userCampaigns.filter(
          (userCampaign) =>
            userCampaign.id.toString() !==
            action.payload.userCampaign.toString()
        ),
        isUserCampaignDelete: true,
        isUserCampaignDeleteFail: false,
      };
    case DELETE_USER_CAMPAIGN_FAIL:
      return {
        ...state,
        error: action.payload,
        isUserCampaignDelete: false,
        isUserCampaignDeleteFail: true,
      };

    default:
      return { ...state };
  }
};

export default Users;
