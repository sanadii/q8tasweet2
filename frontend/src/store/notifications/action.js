import {
  // API Response
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,

  // UserNotifications
  GET_USER_NOTIFICATIONS,
  GET_CAMPAIGN_NOTIFICATIONS,
} from "./actionType";

// UserNotification Success / Error
export const UserNotificationApiResponseSuccess = (actionType, data) => ({
  type: API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});

export const UserNotificationApiResponseError = (actionType, error) => ({
  type: API_RESPONSE_ERROR,
  payload: { actionType, error },
});

// Get UserNotifications
export const getUserNotifications = () => ({
  type: GET_USER_NOTIFICATIONS,
});

export const getCampaignNotifications = () => ({
  type: GET_CAMPAIGN_NOTIFICATIONS,
});

