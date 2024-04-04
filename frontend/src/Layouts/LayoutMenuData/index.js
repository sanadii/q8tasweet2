// Layouts/LayoutMenuData.js
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux"; // Don't forget to import useSelector
import { useNavigate } from "react-router-dom";
import { updateIconSidebar } from './utils';  // adjust the path according to your directory structure
import { usePermission } from 'shared/hooks';
import { layoutSelector } from 'selectors/layoutSelector';

// Menus
import { useUserMenu } from './UserMenu';
import { useAdminMenu } from './AdminMenu';
import { usePublicMenu } from './PublicMenu';
import { useSettingsMenu } from './SettingsMenu';
import { useEditorMenu } from './EditorMenu';
import { useModeratorMenu } from './ModeratorMenu';
import { useContributorMenu } from './ContributorMenu';
import { useCampaignMenu } from './CampaignMenu';

const Navdata = () => {
  const history = useNavigate();
  //state for collapsable menus
  const [isCurrentState, setIsCurrentState] = useState("Dashboard");

  const {
    canChangeConfig,
    canViewCampaign,
    isContributor,
    isModerator,
    isSubscriber
  } = usePermission();

  const {
    layoutType,
    leftSidebarType,
    layoutModeType,
    layoutWidthType,
    layoutPositionType,
    topbarThemeType,
    leftsidbarSizeType,
    leftSidebarViewType,
    leftSidebarImageType,
    sidebarVisibilitytype
  } = useSelector(layoutSelector);
  const [isSettings, setIsSettings] = useState(false);

  useEffect(() => {
    document.body.classList.remove("twocolumn-panel");

    if (isCurrentState !== "settings") {
      setIsSettings(false);
    }
  }, [history, isCurrentState, isSettings]);

  // Menus Constants
  const UserMenu = useUserMenu(setIsCurrentState);
  const AdminMenu = useAdminMenu(setIsCurrentState);
  const PublicMenu = usePublicMenu(setIsCurrentState);
  const CampaignMenu = useCampaignMenu(setIsCurrentState);
  const ModeratorMenu = useModeratorMenu(setIsCurrentState);
  const EditorMenu = useEditorMenu(setIsCurrentState);
  const ContributorMenu = useContributorMenu(setIsCurrentState);
  const SettingsMenu = useSettingsMenu(isCurrentState, setIsCurrentState, setIsSettings, isSettings);


  // If Layout is vertical
  // Public                               ==> Menu

  // If Layout is Horizontal - Can Access Dashboard
  // // If user is Admin                  ==> Admin Menu, User Menu
  // // If user isModeratpr               ==> Moderator Menu, User Menu
  // // If user is CampaignMember         ==> Campaign, User Menu           [More Details]
  // // If user is User (loggedIn)        ==> Admin Menu, User Menu

  const menuItems = [];

  if (layoutType === 'horizontal') {
    menuItems.push(...PublicMenu);
  } else if (layoutType === 'vertical') {
    if (canChangeConfig) {
      menuItems.push(...AdminMenu, ...SettingsMenu, ...UserMenu);
    } else if (canViewCampaign) {
      menuItems.push(...CampaignMenu, ...UserMenu);
    } else if (isSubscriber) {
      menuItems.push(...AdminMenu, ...UserMenu);
    }
  }

  

  // const menuItems = [
  //   if (layoutType === 'vertical') {
  //   ...( canChangeConfig ? [...AdminMenu, ...SettingsMenu] : []),}
  //   ...(isAdmin || isEditor ? EditorMenu : []),
  //   // ...(isAdmin || isModerator ? ModeratorMenu : []),
  //   // ...(isAdmin || isContributor ? ContributorMenu : []),
  //   ...(canViewCampaign || isSubscriber ? CampaignMenu : []),
  //   ...(CampaignMenu),
  //   ...UserMenu,

  //   ...(layoutType === 'horizontal' && PublicMenu),

  // ];

  return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;