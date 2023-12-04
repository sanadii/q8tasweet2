import {
  // GroupPermission Success/Error
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,

  // GroupPermission s
  GET_GROUP_PERMISSIONS,
  ADD_NEW_GROUP_PERMISSION_SUCCESS,
  ADD_NEW_GROUP_PERMISSION_FAIL,
  UPDATE_GROUP_PERMISSION_SUCCESS,
  UPDATE_GROUP_PERMISSION_FAIL,
  DELETE_GROUP_PERMISSION_SUCCESS,
  DELETE_GROUP_PERMISSION_FAIL,


} from "./actionType";

const IntialState = {
  contentTypes: [],
  groups: [],
  groupPermissions: [],
  categories: [],
};

const GroupPermissions = (state = IntialState, action) => {
  switch (action.type) {
    case API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case GET_GROUP_PERMISSIONS:
          return {
            ...state,
            contentTypes: action.payload.data.contentTypes,
            groups: action.payload.data.groups,
            permissions: action.payload.data.permissions,
            categories: action.payload.data.categories,
            isGroupPermissionCreated: false,
            isGroupPermissionSuccess: true,
          };

        default:
          return { ...state };
      }

    case API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case GET_GROUP_PERMISSIONS:
          return {
            ...state,
            error: action.payload.error,
            isGroupPermissionCreated: false,
            isGroupPermissionSuccess: true,
          };

        default:
          return { ...state };
      }

    case GET_GROUP_PERMISSIONS: {
      return {
        ...state,
        isGroupPermissionCreated: false,
      };
    }

    case ADD_NEW_GROUP_PERMISSION_SUCCESS:
      return {
        ...state,
        isGroupPermissionCreated: true,
        groupGroupPermissions: [...state.groupGroupPermissions, action.payload.data.groupGroupPermissions],
        isGroupPermissionAdd: true,
        isGroupPermissionAddFail: false,
      };
    case ADD_NEW_GROUP_PERMISSION_FAIL:
      return {
        ...state,
        error: action.payload,
        isGroupPermissionAdd: false,
        isGroupPermissionAddFail: true,
      };
    case UPDATE_GROUP_PERMISSION_SUCCESS:
      return {
        ...state,
        groupGroupPermissions: state.groupGroupPermissions.map((groupPermission) =>
          groupPermission.id.toString() === action.payload.data.id.toString()
            ? { ...groupPermission, ...action.payload.data }
            : groupPermission
        ),
        isGroupPermissionUpdate: true,
        isGroupPermissionUpdateFail: false,
      };
    case UPDATE_GROUP_PERMISSION_FAIL:
      return {
        ...state,
        error: action.payload,
        isGroupPermissionUpdate: false,
        isGroupPermissionUpdateFail: true,
      };
    case DELETE_GROUP_PERMISSION_SUCCESS:
      return {
        ...state,
        groupGroupPermissions: state.groupGroupPermissions.filter(
          (groupPermission) => groupPermission.id.toString() !== action.payload.groupPermission.toString()
        ),
        isGroupPermissionDelete: true,
        isGroupPermissionDeleteFail: false,
      };
    case DELETE_GROUP_PERMISSION_FAIL:
      return {
        ...state,
        error: action.payload,
        isGroupPermissionDelete: false,
        isGroupPermissionDeleteFail: true,
      };



    default:
      return { ...state };
  }
};

export default GroupPermissions;
