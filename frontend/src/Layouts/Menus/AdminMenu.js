// Layouts/Menus/AdminMenu.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useAdminMenu(iscurrentState, setIscurrentState) {
  const history = useNavigate();

  useEffect(() => {
    document.body.classList.remove("twocolumn-panel");

    // State management
    if (iscurrentState === "adminDashboard") {
      history("/dashboard");
      document.body.classList.add("twocolumn-panel");
    }
    if (iscurrentState === "adminElections") {
      history("/elections");
      document.body.classList.add("twocolumn-panel");
    }
    if (iscurrentState === "adminCandidates") {
      history("/candidates");
      document.body.classList.add("twocolumn-panel");
    }
    if (iscurrentState === "adminCampaigns") {
      history("/campaigns");
      document.body.classList.add("twocolumn-panel");
    }
    if (iscurrentState === "adminUsers") {
      history("/admin/users");
      document.body.classList.add("twocolumn-panel");
    }
  }, [history, iscurrentState]);

  return [
    {
      label: "قائمة الإدارة",
      isHeader: true,
    },
    {
      id: "adminDashboard",
      label: "لوحة التحكم",
      icon: "ri-dashboard-line",
      link: "/dashboard",
      click: function (e) {
        e.preventDefault();
        setIscurrentState("adminDashboard");
      },
    },
    {
      id: "elections",
      label: "الإنتخابات",
      icon: "ri-dashboard-line",
      link: "/admin/elections",
      click: function (e) {
        e.preventDefault();
        setIscurrentState("adminElections");
      },
    },
    {
      id: "candidates",
      label: "المرشحين",
      icon: "ri-account-pin-box-line",
      link: "/admin/candidates",
      click: function (e) {
        e.preventDefault();
        setIscurrentState("adminCandidates");
      },
    },
    {
      id: "campaigns",
      label: "الحملات الإنتخابية",
      icon: "ri-honour-line",
      link: "/admin/campaigns",
      click: function (e) {
        e.preventDefault();
        setIscurrentState("adminCampaigns");
      },
    },
    {
      id: "users",
      label: "المستخدمين",
      icon: "ri-honour-line",
      link: "/admin/users",
      click: function (e) {
        e.preventDefault();
        setIscurrentState("adminUsers");
      },
    },
  ];
}
