import { createSelector } from 'reselect';

const selectGroupSelectorsState = state => state.Groups;

export const groupSelector = createSelector(
  selectGroupSelectorsState,
  GroupState => ({
    categories: GroupState.categories,
    contentTypes: GroupState.contentTypes,
    groups: GroupState.groups,
    error: GroupState.error,
  })
);
