// Layouts/Menus/AdminMenu.js
import { useNavigate } from "react-router-dom";

export function useAdminMenu(isCurrentState, setIsCurrentState) {
  const history = useNavigate();

  const handleNavigation = (state, path) => {
    setIsCurrentState(state);
    history(path);
    document.body.classList.add("twocolumn-panel");
  }

  return [
    {
      label: "قائمة الإدارة",
      isHeader: true,
    },
    {
      id: "adminElections",
      label: "الإنتخابات",
      icon: "ri-dashboard-line",
      link: "/dashboard/elections",
      click: (e) => {
        e.preventDefault();
        handleNavigation("adminElections", "/dashboard/elections");
      },
    },
    {
      id: "adminCandidates",
      label: "المرشحين",
      icon: "ri-account-pin-box-line",
      link: "/dashboard/candidates",
      click: function (e) {
        e.preventDefault();
        handleNavigation("adminCandidates", "/dashboard/candidates");
      },
    },
    {
      id: "adminParties",
      label: "القوائم الإنتخابية",
      icon: "ri-account-pin-box-line",
      link: "/dashboard/parties",
      click: function (e) {
        e.preventDefault();
        handleNavigation("adminParties", "/dashboard/parties");
      },
    },
    {
      id: "adminCampaigns",
      label: "الحملات الإنتخابية",
      icon: "ri-honour-line",
      link: "/dashboard/campaigns",
      click: function (e) {
        e.preventDefault();
        handleNavigation("adminCampaigns", "/dashboard/campaigns");
      },
    },
    {
      id: "adminUsers",
      label: "المستخدمين",
      icon: "ri-honour-line",
      link: "/dashboard/users",
      click: function (e) {
        e.preventDefault();
        handleNavigation("adminUsers", "/dashboard/users");
      },
    },
  ];
}
