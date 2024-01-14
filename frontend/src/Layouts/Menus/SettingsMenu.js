// Layouts/Menus/SettingsMenu.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateIconSidebar } from './utils';  // adjust the path according to your directory structure


export function useSettingsMenu(isCurrentState, setIscurrentState, setIsSettings, isSettings) {

  const history = useNavigate();

  useEffect(() => {
    if (isCurrentState === "options") {
      history("/dashboard/options");
      document.body.classList.add("twocolumn-panel");
    }
    if (isCurrentState === "categories") {
      history("/dashboard/categories");
      document.body.classList.add("twocolumn-panel");
    }
  }, [history, isCurrentState]);


  return [
    {
      label: "الإعدادات",
      isHeader: true,
    },
    {
      id: "adminDashboard",
      label: "الاشعارات",
      icon: "ri-dashboard-line",
      link: "/dashboard",
      click: function (e) {
        e.preventDefault();
        setIscurrentState("adminDashboard");
      },
    },
    {
      id: "adminControlPanel",
      label: "لوحة التحكم",
      icon: "ri-dashboard-line",
      link: "/control-panel",
      click: function (e) {
        e.preventDefault();
        setIscurrentState("adminControlPanel");
      },
    },
    {
      id: "options",
      label: "الإعدادات",
      link: "/dashboard/settings",
      click: function (e) {
        e.preventDefault();
        setIscurrentState("options");
      },
    },
    {
      id: "categories",
      label: "التصنيف",
      link: "/dashboard/settings/categories",
      click: function (e) {
        e.preventDefault();
        setIscurrentState("categories");
      },
    },
    {
      id: "groups",
      label: "المجموعات",
      link: "/dashboard/settings/groups",
      click: function (e) {
        e.preventDefault();
        setIscurrentState("groups");
      },
    },
    {
      id: "group-permissions",
      label: "الصلاحيات",
      link: "/dashboard/settings/group-permissions",
      click: function (e) {
        e.preventDefault();
        setIscurrentState("group-permissions");
      },
    },
  ];
}


