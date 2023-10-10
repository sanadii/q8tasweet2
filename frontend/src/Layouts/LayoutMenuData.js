import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux"; // Don't forget to import useSelector
import { useNavigate } from "react-router-dom";
import { useAdminMenu } from './Menus/AdminMenu';
import { useCampaignMenu } from './Menus/CampaignMenu';
import { useSettingsMenu } from './Menus/SettingsMenu';
import { updateIconSidebar } from './Menus/utils';  // adjust the path according to your directory structure


const Navdata = () => {
  const history = useNavigate();

  //state for collapsable menus
  const [iscurrentState, setIscurrentState] = useState("Dashboard");

  const currentUser = useSelector(state => state.Users.currentUser);
  const isStaff = currentUser?.isStaff;

  const [isSettings, setIsSettings] = useState(false);

  useEffect(() => {
    document.body.classList.remove("twocolumn-panel");

    if (iscurrentState !== "settings") {
      setIsSettings(false);
    }
  }, [history, iscurrentState, isSettings]);



  // Menus Constants
  const AdminMenu = useAdminMenu(setIscurrentState);
  const CampaignMenu = useCampaignMenu(setIscurrentState);
  const SettingsMenu = useSettingsMenu(setIscurrentState, setIsSettings, isSettings);


  const menuItems = [
    // {
    //   id: "settings",
    //   label: "الإعدادات",
    //   icon: "ri-apps-2-line",
    //   link: "/#",
    //   stateVariables: isSettings,
    //   click: function (e) {
    //     e.preventDefault();
    //     setIsSettings(!isSettings);
    //     setIscurrentState("settings");
    //     updateIconSidebar(e);
    //   },
    //   subItems: [
    //     {
    //       id: "options",
    //       label: "الإعدادات",
    //       link: "/settings",
    //       parentId: "settings",
    //       click: function (e) {
    //         e.preventDefault();
    //         setIscurrentState("options");
    //       },
    //     },
    //     {
    //       id: "categories",
    //       label: "المجموعات",
    //       link: "/settings/categories",
    //       parentId: "settings",
    //       click: function (e) {
    //         e.preventDefault();
    //         setIscurrentState("categories");
    //       },
    //     },
    //   ],
    // },
    ...(isStaff ? AdminMenu : []),
    ...(isStaff ? CampaignMenu : []),
    ...(isStaff ? SettingsMenu : []),
  ];


  return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;