// Layouts/Menus/AdminMenu.js
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
      link: "/dashboard/notifications",
      click: (e) => {
        e.preventDefault();
        handleNavigation("adminNotifications", "/dashboard/notifications");
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

export function useUserMenu(isCurrentState, setIsCurrentState) {
  const history = useNavigate();

  const handleNavigation = (state, path) => {
    setIsCurrentState(state);
    history(path);
    document.body.classList.add("twocolumn-panel");
  }

  return [
    // {
    //   label: "الملف الشخصي",
    //   isHeader: true,
    // },
    // {
    //   id: "userProfile",
    //   label: "الملف الشخصي",
    //   icon: "mdi mdi-account-circle",
    //   link: "/dashboard/profile",
    //   click: (e) => {
    //     e.preventDefault();
    //     handleNavigation("userProfile", "/dashboard/profile");
    //   },
    // },
  ];
}




export function useContributorMenu(isCurrentState, setIsCurrentState) {
  const history = useNavigate();

  const handleNavigation = (state, path) => {
    setIsCurrentState(state);
    history(path);
    document.body.classList.add("twocolumn-panel");
  }

  return [
    {
      label: "قائمة المساهمين",
      isHeader: true,
    },
    {
      id: "contributerDashboard",
      label: "المساهمين - تجربة",
      icon: "ri-honour-line",
      link: "/dashboard/contributer",
      click: (e) => {
        e.preventDefault();
        handleNavigation("contributerDashboard", "/dashboard/contributer");
      },
    },
  ];
}

export function useEditorMenu(isCurrentState, setIsCurrentState) {
  const history = useNavigate();

  const handleNavigation = (state, path) => {
    setIsCurrentState(state);
    history(path);
    document.body.classList.add("twocolumn-panel");
  }

  return [
    {
      label: "قائمة المحرر",
      isHeader: true,
    },
    {
      id: "editorDashboard",
      label: "المحرر - تجربة",
      icon: "ri-honour-line",
      link: "/dashboard/editor",
      click: (e) => {
        e.preventDefault();
        handleNavigation("editorDashboard", "/dashboard/editor");
      },
    },
  ];
}

export function useModeratorMenu(isCurrentState, setIsCurrentState) {
  const history = useNavigate();

  const handleNavigation = (state, path) => {
    setIsCurrentState(state);
    history(path);
    document.body.classList.add("twocolumn-panel");
  }

  return [
    {
      label: "قائمة الوكيل العام",
      isHeader: true,
    },
    {
      id: "moderatorDashboard",
      label: "الوكيل العام - تجربة",
      icon: "ri-honour-line",
      link: "/dashboard/moderator",
      click: (e) => {
        e.preventDefault();
        handleNavigation("moderatorDashboard", "/dashboard/moderator");
      },
    },
  ];
}
