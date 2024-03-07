// Layouts/LayoutMenuData.js
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux"; // Don't forget to import useSelector
import { useNavigate } from "react-router-dom";
import { updateIconSidebar } from './Menus/utils';  // adjust the path according to your directory structure
import { usePermission } from 'shared/hooks';
import { layoutSelector } from 'Selectors/layoutSelector';

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
  const AdminMenu = useAdminMenu(setIsCurrentState);
  const PublicMenu = usePublicMenu(setIsCurrentState);
  const CampaignMenu = useCampaignMenu(setIsCurrentState);
  const ModeratorMenu = useModeratorMenu(setIsCurrentState);
  const EditorMenu = useEditorMenu(setIsCurrentState);
  const ContributorMenu = useContributorMenu(setIsCurrentState);
  const SettingsMenu = useSettingsMenu(isCurrentState, setIsCurrentState, setIsSettings, isSettings);

  const menuItems = [
    ...(layoutType === 'vertical' && canChangeConfig ? [...AdminMenu, ...SettingsMenu] : []),
    // ...(isAdmin || isEditor ? EditorMenu : []),
    // ...(isAdmin || isModerator ? ModeratorMenu : []),
    // ...(isAdmin || isContributor ? ContributorMenu : []),
    ...(canViewCampaign || isSubscriber ? CampaignMenu : []),
    ...(CampaignMenu),
    ...(layoutType === 'horizontal' && PublicMenu),

  ];

  return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;