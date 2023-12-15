import {
  // Notification Success/Error
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,

  // User Notifications
  GET_USER_NOTIFICATIONS,
  GET_CAMPAIGN_NOTIFICATIONS,
} from "./actionType";

const IntialState = {
  userNotifications: [],
  campaignNotifications: [],
};

const UserNotifications = (state = IntialState, action) => {
  switch (action.type) {
    case API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case GET_USER_NOTIFICATIONS:
          return {
            ...state,
            userNotifications: action.payload.data,
            categories: action.payload.data.categories,
            isNotificationCreated: false,
            isNotificationSuccess: true,
          };

        case GET_CAMPAIGN_NOTIFICATIONS:
          return {
            ...state,
            campaignNotifications: action.payload.data,
            isNotificationCreated: false,
            isNotificationSuccess: true,
          };
        default:
          return { ...state };
      }

    case API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case GET_USER_NOTIFICATIONS:
          return {
            ...state,
            error: action.payload.error,
            isNotificationCreated: false,
            isNotificationSuccess: true,
          };
        case GET_CAMPAIGN_NOTIFICATIONS:
          return {
            ...state,
            error: action.payload.error,
            isNotificationCreated: false,
            isNotificationSuccess: true,
          };
        default:
          return { ...state };
      }

    case GET_USER_NOTIFICATIONS: {
      return {
        ...state,
        isNotificationCreated: false,
      };
    }
    case GET_CAMPAIGN_NOTIFICATIONS: {
      return {
        ...state,
        isNotificationCreated: false,
      };
    }
    default:
      return { ...state };
  }
};

export default UserNotifications;
