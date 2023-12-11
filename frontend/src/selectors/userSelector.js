// Selectors/userSelectors.js
import { createSelector } from 'reselect';

const selectUsersState = state => state.Users;

export const userSelector = createSelector(
    selectUsersState,
    (usersState,) => ({
        // User Selectors
        isUserSuccess: usersState.isUserSuccess,
        error: usersState.error,
        users: usersState.users,
        moderators: usersState.moderators,

        user: usersState.currentUser,
        userId: usersState.currentUser.id,
        currentUser: usersState.currentUser,
        userCampaigns: usersState.currentUser.campaigns,
        currentUserCampaigns: usersState.currentUser.campaigns,
        campaignModerators: usersState.campaignModerators,
    })
);
