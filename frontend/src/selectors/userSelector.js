// Selectors/userSelectors.js
import { createSelector } from 'reselect';

const selectUsersState = state => state.Users;

export const userSelector = createSelector(
    selectUsersState,
    (usersState,) => ({
        // User Selectors
        users: usersState.users,
        moderators: usersState.moderators,
        currentUser: usersState.currentUser,
    })
);
