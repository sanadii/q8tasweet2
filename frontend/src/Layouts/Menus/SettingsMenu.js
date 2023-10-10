// Layouts/Menus/SettingsMenu.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateIconSidebar } from './utils';  // adjust the path according to your directory structure


export function useSettingsMenu(iscurrentState, setIscurrentState, setIsSettings, isSettings) {
  const history = useNavigate();

  //state for collapsable Menus
  // const [isSettings, setIsSettings] = useState(false);

  return [
    {
      id: "settings",
      label: "الإعدادات",
      icon: "ri-apps-2-line",
      link: "/#",
      stateVariables: isSettings,
      click: function (e) {
        e.preventDefault();
        setIsSettings(!isSettings);
        setIscurrentState("settings");
        updateIconSidebar(e);
      },
      subItems: [
        {
          id: "options",
          label: "الإعدادات",
          link: "/settings",
          parentId: "settings",
          click: function (e) {
            e.preventDefault();
            setIscurrentState("options");
          },
        },
        {
          id: "categories",
          label: "المجموعات",
          link: "/settings/categories",
          parentId: "settings",
          click: function (e) {
            e.preventDefault();
            setIscurrentState("categories");
          },
        },
      ],
    },
  ];
}


