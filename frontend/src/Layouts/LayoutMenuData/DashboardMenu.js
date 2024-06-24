// Layouts/Menus/AdminMenu.js
import { useNavigate } from "react-router-dom";

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
