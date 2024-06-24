import { createSelector } from 'reselect';

const selectLayoutState = state => state.Layout;

export const layoutSelector = createSelector(
  selectLayoutState,
  (layoutState) => ({
    layoutType: layoutState.layoutType,
    leftSidebarType: layoutState.leftSidebarType,
    layoutModeType: layoutState.layoutModeType,
    layoutWidthType: layoutState.layoutWidthType,
    layoutPositionType: layoutState.layoutPositionType,
    topbarThemeType: layoutState.topbarThemeType,
    leftsidbarSizeType: layoutState.leftsidbarSizeType,
    leftSidebarViewType: layoutState.leftSidebarViewType,
    leftSidebarImageType: layoutState.leftSidebarImageType,
    sidebarVisibilitytype: layoutState.sidebarVisibilitytype
  })
);
