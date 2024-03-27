// Selectors/authSelectors.js
import { createSelector } from 'reselect';

const selectGroupsState = state => state.Groups;

export const authSelector = createSelector(
  selectGroupsState,
  (groupsState,) => ({

    // Group
    groups: groupsState.groups,
    categories: groupsState.categories,

  })
);
