import {
  // API Response
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,

  // Groups
  GET_GROUPS,
  GET_MODERATOR_GROUPS,
  ADD_GROUP,
  ADD_GROUP_SUCCESS,
  ADD_GROUP_FAIL,
  UPDATE_GROUP,
  UPDATE_GROUP_SUCCESS,
  UPDATE_GROUP_FAIL,
  DELETE_GROUP,
  DELETE_GROUP_SUCCESS,
  DELETE_GROUP_FAIL,
} from "./actionType";

// Group Success / Error
export const GroupApiResponseSuccess = (actionType, data) => ({
  type: API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});

export const GroupApiResponseError = (actionType, error) => ({
  type: API_RESPONSE_ERROR,
  payload: { actionType, error },
});

// Get Groups
export const getGroups = () => ({
  type: GET_GROUPS,
});

export const getModeratorGroups = () => ({
  type: GET_MODERATOR_GROUPS,
});

// Update Group
export const updateGroup = (group) => ({
  type: UPDATE_GROUP,
  payload: group,
});

export const updateGroupSuccess = (group) => ({
  type: UPDATE_GROUP_SUCCESS,
  payload: group,
});

export const updateGroupFail = (error) => ({
  type: UPDATE_GROUP_FAIL,
  payload: error,
});

// Add New Group
export const addGroup = (group) => ({
  type: ADD_GROUP,
  payload: group,
});

export const addGroupSuccess = (group) => ({
  type: ADD_GROUP_SUCCESS,
  payload: group,
});

export const addGroupFail = (error) => ({
  type: ADD_GROUP_FAIL,
  payload: error,
});

// Delete Group
export const deleteGroup = (group) => ({
  type: DELETE_GROUP,
  payload: group,
});

export const deleteGroupSuccess = (group) => ({
  type: DELETE_GROUP_SUCCESS,
  payload: group,
});

export const deleteGroupFail = (error) => ({
  type: DELETE_GROUP_FAIL,
  payload: error,
});

