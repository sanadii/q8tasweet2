import {
  // API Response
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,

  // Users
  GET_USERS,
  GET_USER_DETAILS,
  ADD_NEW_USER,
  ADD_NEW_USER_SUCCESS,
  ADD_NEW_USER_FAIL,
  UPDATE_USER_PROFILE,
  UPDATE_USER_PROFILE_SUCCESS,
  UPDATE_USER_PROFILE_FAIL,
  DELETE_USER,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAIL,

  CHANGE_USER_PASSWORD,
  CHANGE_USER_PASSWORD_SUCCESS,
  CHANGE_USER_PASSWORD_FAIL,


  // Specific Users
  GET_CURRENT_USER,
  GET_MODERATOR_USERS,
  GET_CAMPAIGN_MODERATORS,
  GET_CAMPAIGN_SORTERS,


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

export const getUserDetails = (user) => ({
  type: GET_USER_DETAILS,
  payload: user,
});

// Update User
export const updateUser = (user) => ({
  type: UPDATE_USER_PROFILE,
  payload: user,
});

export const updateUserSuccess = (user) => ({
  type: UPDATE_USER_PROFILE_SUCCESS,
  payload: user,
});

export const updateUserFail = (error) => ({
  type: UPDATE_USER_PROFILE_FAIL,
  payload: error,
});



// Update User
export const changeUserPassword = (user) => ({
  type: CHANGE_USER_PASSWORD,
  payload: user,
});

export const changeUserPasswordSuccess = (user) => ({
  type: CHANGE_USER_PASSWORD_SUCCESS,
  payload: user,
});

export const changeUserPasswordFail = (error) => ({
  type: CHANGE_USER_PASSWORD_FAIL,
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


// GET SPECIFIC USER(S)
export const getCurrentUser = (token) => ({
  type: GET_CURRENT_USER,
  payload: token,
});

export const getModeratorUsers = () => ({
  type: GET_MODERATOR_USERS,
});

export const getCampaignModerators = () => ({
  type: GET_CAMPAIGN_MODERATORS,
});

export const getCampaignSorters = () => ({
  type: GET_CAMPAIGN_SORTERS,
});


