import { createSelector } from 'reselect';

const selectgroupPermissionSelectorsState = state => state.GroupPermissions;

export const groupPermissionSelector = createSelector(
  selectgroupPermissionSelectorsState,
  GroupPermissionState => ({
    categories: GroupPermissionState.categories,
    contentTypes: GroupPermissionState.contentTypes,
    groups: GroupPermissionState.groups,
    permissions: GroupPermissionState.permissions,
    error: GroupPermissionState.error,
  })
);
