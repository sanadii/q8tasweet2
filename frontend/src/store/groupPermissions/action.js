import {
  // API Response
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,

  // GroupPermissions
  GET_GROUP_PERMISSIONS,
  GET_MODERATOR_GROUP_PERMISSIONS,
  ADD_NEW_GROUP_PERMISSION,
  ADD_NEW_GROUP_PERMISSION_SUCCESS,
  ADD_NEW_GROUP_PERMISSION_FAIL,
  UPDATE_GROUP_PERMISSION,
  UPDATE_GROUP_PERMISSION_SUCCESS,
  UPDATE_GROUP_PERMISSION_FAIL,
  DELETE_GROUP_PERMISSION,
  DELETE_GROUP_PERMISSION_SUCCESS,
  DELETE_GROUP_PERMISSION_FAIL,
} from "./actionType";

// GroupPermission Success / Error
export const GroupPermissionApiResponseSuccess = (actionType, data) => ({
  type: API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});

export const GroupPermissionApiResponseError = (actionType, error) => ({
  type: API_RESPONSE_ERROR,
  payload: { actionType, error },
});

// Get GroupPermissions
export const getGroupPermissions = () => ({
  type: GET_GROUP_PERMISSIONS,
});


export const getModeratorGroupPermissions = () => ({
  type: GET_MODERATOR_GROUP_PERMISSIONS,
});

// Update GroupPermission
export const updateGroupPermission = (groupPermission) => ({
  type: UPDATE_GROUP_PERMISSION,
  payload: groupPermission,
});

export const updateGroupPermissionSuccess = (groupPermission) => ({
  type: UPDATE_GROUP_PERMISSION_SUCCESS,
  payload: groupPermission,
});

export const updateGroupPermissionFail = (error) => ({
  type: UPDATE_GROUP_PERMISSION_FAIL,
  payload: error,
});

// Add New GroupPermission
export const addNewGroupPermission = (groupPermission) => ({
  type: ADD_NEW_GROUP_PERMISSION,
  payload: groupPermission,
});

export const addNewGroupPermissionSuccess = (groupPermission) => ({
  type: ADD_NEW_GROUP_PERMISSION_SUCCESS,
  payload: groupPermission,
});

export const addNewGroupPermissionFail = (error) => ({
  type: ADD_NEW_GROUP_PERMISSION_FAIL,
  payload: error,
});

// Delete GroupPermission
export const deleteGroupPermission = (groupPermission) => ({
  type: DELETE_GROUP_PERMISSION,
  payload: groupPermission,
});

export const deleteGroupPermissionSuccess = (groupPermission) => ({
  type: DELETE_GROUP_PERMISSION_SUCCESS,
  payload: groupPermission,
});

export const deleteGroupPermissionFail = (error) => ({
  type: DELETE_GROUP_PERMISSION_FAIL,
  payload: error,
});

