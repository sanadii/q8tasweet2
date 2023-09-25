import { createSelector } from 'reselect';

const selectUsersState = state => state.Users;

export const electionsSelector = createSelector(
    selectUsersState,
    usersState => ({
      moderators: usersState.moderators,
      currentUser: usersState.currentUser,
    })
  );
  