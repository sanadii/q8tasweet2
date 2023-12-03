// Layouts/LayoutMenuData.js
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux"; // Don't forget to import useSelector
import { useNavigate } from "react-router-dom";
import { updateIconSidebar } from './Menus/utils';  // adjust the path according to your directory structure
import { usePermission } from 'hooks';

// Menus
import { useAdminMenu } from './Menus/AdminMenu';
import { usePublicMenu } from './Menus/PublicMenu';
import { useSettingsMenu } from './Menus/SettingsMenu';
import { useEditorMenu } from './Menus/EditorMenu';
import { useModeratorMenu } from './Menus/ModeratorMenu';
import { useContributorMenu } from './Menus/ContributorMenu';
import { useCampaignMenu } from './Menus/CampaignMenu';

const Navdata = () => {
  const history = useNavigate();
  //state for collapsable menus
  const [isCurrentState, setIscurrentState] = useState("Dashboard");

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
  const AdminMenu = useAdminMenu(setIscurrentState);
  const PublicMenu = usePublicMenu(setIscurrentState);
  const CampaignMenu = useCampaignMenu(setIscurrentState);
  const ModeratorMenu = useModeratorMenu(setIscurrentState);
  const EditorMenu = useEditorMenu(setIscurrentState);
  const ContributorMenu = useContributorMenu(setIscurrentState);
  const SettingsMenu = useSettingsMenu(isCurrentState, setIscurrentState, setIsSettings, isSettings);

  const menuItems = [
    ...(canChangeConfig ? [...AdminMenu, ...SettingsMenu] : []),
    // ...(isAdmin || isEditor ? EditorMenu : []),
    // ...(isAdmin || isModerator ? ModeratorMenu : []),
    // ...(isAdmin || isContributor ? ContributorMenu : []),
    // ...(canViewCampaign || isSubscriber ? CampaignMenu : []),
    // ...(CampaignMenu),
    // ...(PublicMenu),

  ];

  return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;