import {
  // API Response
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,

  // Users
  GET_USERS,
  GET_CURRENT_USER,
  GET_USER_DETAILS,
  GET_MODERATOR_USERS,
  ADD_NEW_USER,
  ADD_NEW_USER_SUCCESS,
  ADD_NEW_USER_FAIL,
  UPDATE_USER,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAIL,
  DELETE_USER,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAIL,

  // User Candidate
  GET_USER_CANDIDATES,
  ADD_NEW_USER_CANDIDATE,
  ADD_NEW_USER_CANDIDATE_SUCCESS,
  ADD_NEW_USER_CANDIDATE_FAIL,
  UPDATE_USER_CANDIDATE,
  UPDATE_USER_CANDIDATE_SUCCESS,
  UPDATE_USER_CANDIDATE_FAIL,
  DELETE_USER_CANDIDATE,
  DELETE_USER_CANDIDATE_SUCCESS,
  DELETE_USER_CANDIDATE_FAIL,

  // User Campaign
  GET_USER_CAMPAIGNS,
  ADD_NEW_USER_CAMPAIGN,
  ADD_NEW_USER_CAMPAIGN_SUCCESS,
  ADD_NEW_USER_CAMPAIGN_FAIL,
  UPDATE_USER_CAMPAIGN,
  UPDATE_USER_CAMPAIGN_SUCCESS,
  UPDATE_USER_CAMPAIGN_FAIL,
  DELETE_USER_CAMPAIGN,
  DELETE_USER_CAMPAIGN_SUCCESS,
  DELETE_USER_CAMPAIGN_FAIL,
} from "./actionType";

// User Success / Error
export const UserApiResponseSuccess = (actionType, data) => ({
  type: API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});

export const UserApiResponseError = (actionType, error) => ({
  type: API_RESPONSE_ERROR,
  payload: { actionType, error },
});

// Get Users
export const getUsers = () => ({
  type: GET_USERS,
});

export const getCurrentUser = (token) => ({
  type: GET_CURRENT_USER,
  payload: token,
});

export const getUserDetails = (user) => ({
  type: GET_USER_DETAILS,
  payload: user,
});

export const getModeratorUsers = () => ({
  type: GET_MODERATOR_USERS,
});

// Update User
export const updateUser = (user) => ({
  type: UPDATE_USER,
  payload: user,
});

export const updateUserSuccess = (user) => ({
  type: UPDATE_USER_SUCCESS,
  payload: user,
});

export const updateUserFail = (error) => ({
  type: UPDATE_USER_FAIL,
  payload: error,
});

// Add New User
export const addNewUser = (user) => ({
  type: ADD_NEW_USER,
  payload: user,
});

export const addNewUserSuccess = (user) => ({
  type: ADD_NEW_USER_SUCCESS,
  payload: user,
});

export const addNewUserFail = (error) => ({
  type: ADD_NEW_USER_FAIL,
  payload: error,
});

// Delete User
export const deleteUser = (user) => ({
  type: DELETE_USER,
  payload: user,
});

export const deleteUserSuccess = (user) => ({
  type: DELETE_USER_SUCCESS,
  payload: user,
});

export const deleteUserFail = (error) => ({
  type: DELETE_USER_FAIL,
  payload: error,
});

// USER CANIDATE
// User Candidates s
export const getUserCandidates = (user) => ({
  type: GET_USER_CANDIDATES,
  payload: user,
});

// User Candidates
export const updateUserCandidate = (userCandidate) => ({
  type: UPDATE_USER_CANDIDATE,
  payload: userCandidate,
});
export const updateUserCandidateSuccess = (userCandidate) => ({
  type: UPDATE_USER_CANDIDATE_SUCCESS,
  payload: userCandidate,
});
export const updateUserCandidateFail = (error) => ({
  type: UPDATE_USER_CANDIDATE_FAIL,
  payload: error,
});

export const addNewUserCandidate = (userCandidate) => ({
  type: ADD_NEW_USER_CANDIDATE,
  payload: userCandidate,
});

export const addNewUserCandidateSuccess = (userCandidate) => ({
  type: ADD_NEW_USER_CANDIDATE_SUCCESS,
  payload: userCandidate,
});

export const addNewUserCandidateFail = (error) => ({
  type: ADD_NEW_USER_CANDIDATE_FAIL,
  payload: error,
});

export const deleteUserCandidate = (userCandidate) => ({
  type: DELETE_USER_CANDIDATE,
  payload: userCandidate,
});

export const deleteUserCandidateSuccess = (userCandidate) => ({
  type: DELETE_USER_CANDIDATE_SUCCESS,
  payload: userCandidate,
});

export const deleteUserCandidateFail = (error) => ({
  type: DELETE_USER_CANDIDATE_FAIL,
  payload: error,
});

// USER CANIDATE
// User Campaigns s
export const getUserCampaigns = (user) => ({
  type: GET_USER_CAMPAIGNS,
  payload: user,
});

// User Campaigns
export const updateUserCampaign = (userCampaign) => ({
  type: UPDATE_USER_CAMPAIGN,
  payload: userCampaign,
});
export const updateUserCampaignSuccess = (userCampaign) => ({
  type: UPDATE_USER_CAMPAIGN_SUCCESS,
  payload: userCampaign,
});
export const updateUserCampaignFail = (error) => ({
  type: UPDATE_USER_CAMPAIGN_FAIL,
  payload: error,
});

export const addNewUserCampaign = (userCampaign) => ({
  type: ADD_NEW_USER_CAMPAIGN,
  payload: userCampaign,
});

export const addNewUserCampaignSuccess = (userCampaign) => ({
  type: ADD_NEW_USER_CAMPAIGN_SUCCESS,
  payload: userCampaign,
});

export const addNewUserCampaignFail = (error) => ({
  type: ADD_NEW_USER_CAMPAIGN_FAIL,
  payload: error,
});

export const deleteUserCampaign = (userCampaign) => ({
  type: DELETE_USER_CAMPAIGN,
  payload: userCampaign,
});

export const deleteUserCampaignSuccess = (userCampaign) => ({
  type: DELETE_USER_CAMPAIGN_SUCCESS,
  payload: userCampaign,
});

export const deleteUserCampaignFail = (error) => ({
  type: DELETE_USER_CAMPAIGN_FAIL,
  payload: error,
});
