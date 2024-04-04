// Layouts/LayoutMenuData.js
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux"; // Don't forget to import useSelector
import { useNavigate } from "react-router-dom";
import { updateIconSidebar } from './Menus/utils';  // adjust the path according to your directory structure
import { usePermission } from 'shared/hooks';

// Menus
import { useUserMenu } from './Menus/UserMenu';
import { useAdminMenu } from './Menus/AdminMenu';
import { useTestMenu } from './Menus/TestMenu';
import { usePublicMenu } from './Menus/PublicMenu';
import { useSettingsMenu } from './Menus/SettingsMenu';
import { useEditorMenu } from './Menus/EditorMenu';
import { useModeratorMenu } from './Menus/ModeratorMenu';
import { useContributorMenu } from './Menus/ContributorMenu';
import { useCampaignMenu } from './Menus/CampaignMenu';

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
  const TestMenu = useTestMenu(setIsCurrentState);
  const PublicMenu = usePublicMenu(setIsCurrentState);
  const CampaignMenu = useCampaignMenu(setIsCurrentState);
  const ModeratorMenu = useModeratorMenu(setIsCurrentState);
  const EditorMenu = useEditorMenu(setIsCurrentState);
  const ContributorMenu = useContributorMenu(setIsCurrentState);
  const SettingsMenu = useSettingsMenu(isCurrentState, setIsCurrentState, setIsSettings, isSettings);

  // console.log("CampaignMenu: ", CampaignMenu)
  const DashboardMenuData = [
    ...(canChangeConfig ? [...AdminMenu, ...SettingsMenu, ...TestMenu] : []),
    // ...(isAdmin || isEditor ? EditorMenu : []),
    // ...(isAdmin || isModerator ? ModeratorMenu : []),
    // ...(isAdmin || isContributor ? ContributorMenu : []),
    // ...(canViewCampaign || isSubscriber ? CampaignMenu : []),
    ...(!canChangeConfig ? [...CampaignMenu] : []),
    ...(PublicMenu), ...UserMenu
  ];


  const PublicMenuData = [
    ...(PublicMenu),

  ]

  return <React.Fragment>{DashboardMenuData}</React.Fragment>;
};

export default Navdata;