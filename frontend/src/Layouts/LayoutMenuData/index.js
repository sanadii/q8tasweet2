// Layouts/LayoutMenuData.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateIconSidebar } from './utils';  // adjust the path according to your directory structure
import { usePermission } from 'shared/hooks';

// Redux
import { useSelector, useDispatch } from "react-redux";
import { layoutSelector, userSelector } from 'selectors';
import { getCampaignDetails } from "store/actions";

// Menus
import { useAdminMenu, useCampaignMenu, useContributorMenu, useModeratorMenu, useEditorMenu, useSettingsMenu, useUserMenu } from './DashboardMenu';
import { usePublicMenu } from './PublicMenu';

const Navdata = () => {
  const dispatch = useDispatch();
  const history = useNavigate();

  //state for collapsable menus
  const [isCurrentState, setIsCurrentState] = useState("Dashboard");

  const {
    isActive,
    canChangeConfig,
    canViewCampaign,
    isContributor,
    isModerator,
    isSubscriber
  } = usePermission();

  const { layoutType, } = useSelector(layoutSelector);
  const { currentUser } = useSelector(userSelector);
  const [isSettings, setIsSettings] = useState(false);
  // const [currentCampaign, setCurrentCampaign] = useState(currentUser?.campaigns[0]?.slug || "");

  let currentCampaign = '';
  // console.log("currentUser: ", currentUser)
  // console.log("currentCampaign: ", currentCampaign)

  // useEffect(() => {
  //   if (currentUser && currentCampaign) {
  //     console.log("dispatching: ", currentCampaign)
  //     setCurrentCampaign(currentUser?.campaigns[0]?.slug || null)

  //     console.log("dispatching: ", currentCampaign)
  //     dispatch(getCampaignDetails(currentCampaign))
  //   }
  // }, [dispatch, currentCampaign])

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
  const CampaignMenu = useCampaignMenu(setIsCurrentState, currentCampaign);
  const ModeratorMenu = useModeratorMenu(setIsCurrentState);
  const EditorMenu = useEditorMenu(setIsCurrentState);
  const ContributorMenu = useContributorMenu(setIsCurrentState);
  const SettingsMenu = useSettingsMenu(isCurrentState, setIsCurrentState, setIsSettings, isSettings);


  const menuItems = [];

  // Public
  if (layoutType === 'horizontal') {
    menuItems.push(...PublicMenu);

    // Dashboard
  } else if (layoutType === 'vertical') {

    // Admin
    if (canChangeConfig) {
      menuItems.push(...AdminMenu, ...SettingsMenu, ...UserMenu);
    }
    // Campaign
    else if (canViewCampaign) {
      menuItems.push(...CampaignMenu, ...UserMenu);
    }
    // User
    else if (isActive) {
      menuItems.push(...UserMenu);
    }
  }

  return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;