import { useNavigate } from "react-router-dom";

export function useSettingsMenu(isCurrentState, setIsCurrentState, setIsSettings, isSettings) {

    const history = useNavigate();
  
    const handleNavigation = (state, path) => {
      setIsCurrentState(state);
      history(path);
      document.body.classList.add("twocolumn-panel");
    }
  
  
    return [
      {
        label: "الإعدادات",
        isHeader: true,
      },
      {
        id: "adminNotifications",
        label: "الاشعارات",
        icon: "mdi mdi-message-alert",
        link: "/dashboard/control/notifications",
        click: (e) => {
          e.preventDefault();
          handleNavigation("adminNotifications", "/dashboard/control/notifications");
        },
      },
      {
        id: "adminControlPanel",
        label: "لوحة التحكم",
        icon: "mdi mdi-tablet-dashboard",
        link: "/dashboard/control-panel",
        click: (e) => {
          e.preventDefault();
          handleNavigation("adminControlPanel", "/dashboard/control-panel");
        },
      },
      {
        id: "adminSettings",
        label: "الإعدادات",
        icon: "mdi mdi-tune-vertical-variant",
        link: "/dashboard/settings",
        click: (e) => {
          e.preventDefault();
          handleNavigation("adminSettings", "/dashboard/settings");
        },
      },
      {
        id: "adminCategories",
        label: "التصنيف",
        icon: "mdi mdi-format-list-group",
        link: "/dashboard/settings/categories",
        click: (e) => {
          e.preventDefault();
          handleNavigation("adminCategories", "/dashboard/settings/categories");
        },
      },
      {
        id: "adminGroups",
        label: "المجموعات",
        icon: "mdi mdi-ungroup",
        link: "/dashboard/groups",
        click: (e) => {
          e.preventDefault();
          handleNavigation("adminGroups", "/dashboard/groups");
        },
      },
      {
        id: "adminPermissions",
        label: "الصلاحيات",
        icon: "mdi mdi-security",
        link: "/dashboard/permissions",
        click: (e) => {
          e.preventDefault();
          handleNavigation("adminPermissions", "/dashboard/permissions");
        },
      },
    ];
  }