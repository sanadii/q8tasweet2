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
      id: "adminDashboard",
      label: "لوحة التحكم",
      icon: "mdi mdi-monitor-dashboard",
      link: "/dashboard",
      click: (e) => {
        e.preventDefault();
        handleNavigation("adminDashboard", "/dashboard");
      },
    },
    {
      id: "adminElections",
      label: "الإنتخابات",
      icon: "mdi mdi-vote",
      link: "/dashboard/elections",
      click: (e) => {
        e.preventDefault();
        handleNavigation("adminElections", "/dashboard/elections");
      },
    },
    {
      id: "adminCandidates",
      label: "المرشحين",
      icon: "mdi mdi-account-multiple",
      link: "/dashboard/candidates",
      click: function (e) {
        e.preventDefault();
        handleNavigation("adminCandidates", "/dashboard/candidates");
      },
    },
    {
      id: "adminParties",
      label: "القوائم الإنتخابية",
      icon: "mdi mdi-account-group",
      link: "/dashboard/parties",
      click: function (e) {
        e.preventDefault();
        handleNavigation("adminParties", "/dashboard/parties");
      },
    },
    {
      id: "adminCampaigns",
      label: "الحملات الإنتخابية",
      icon: "mdi mdi-police-badge",
      link: "/dashboard/campaigns",
      click: function (e) {
        e.preventDefault();
        handleNavigation("adminCampaigns", "/dashboard/campaigns");
      },
    },
    {
      id: "adminUsers",
      label: "المستخدمين",
      icon: "mdi mdi-account-cog",
      link: "/dashboard/users",
      click: function (e) {
        e.preventDefault();
        handleNavigation("adminUsers", "/dashboard/users");
      },
    },
  ];
}

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

export function useCampaignMenu(setIsCurrentState, currentCampaign) {
  const history = useNavigate();

  const handleNavigation = (state, path) => {
    setIsCurrentState(state);
    history(path);
    document.body.classList.add("twocolumn-panel");
  }

  return [
    {
      label: "الحملة الإنتخابية",
      isCampaign: true,
      image: currentCampaign.image,
      name: currentCampaign.name,
    },
    {
      label: "الحملة الإنتخابية",
      isHeader: true,
    },
    {
      id: "campaignDashboard",
      label: "الرئيسية",
      icon: "mdi mdi-account-circle",
      link: "/campaign/overview",
      click: (e) => {
        e.preventDefault();
        handleNavigation("campaignDashboard", "/campaign/overview");
      }
    },
    {
      id: "campaignTeam",
      label: "فريق العمل",
      icon: "ri-honour-line",
      link: "/campaign/members",
      click: (e) => {
        e.preventDefault();
        handleNavigation("campaignDashboard", "/campaign/members");
      }
    },
    {
      id: "campaignGuarantees",
      label: "المجاميع والضمانات",
      icon: "ri-honour-line",
      link: "/campaign/guarantees",
      click: function (e) {
        e.preventDefault();
        handleNavigation("campaignGuarantees", "/campaign/guarantees");

      },
    },
    {
      id: "campaignAttendance",
      label: "الحضور",
      icon: "ri-honour-line",
      link: `/campaign/attendees`,
      click: function (e) {
        e.preventDefault();
        setIsCurrentState("campaignAttendance", "/campaign/attendees");
      },
    },
    // {
    //   id: "campaignSorting",
    //   label: "الفرز",
    //   icon: "ri-honour-line",
    //   link: "/campaign/sorting",
    //   click: (e) => {
    //     e.preventDefault();
    //     handleNavigation("campaignSorting", "/campaign/sorting");
    //   }
    // },
    {
      id: "campaignVoters",
      label: "البحث",
      icon: "ri-honour-line",
      link: "/campaign/electors-search",
      click: (e) => {
        e.preventDefault();
        handleNavigation("campaignVoters", "/campaign/voters");
      }
    },
    // {
    //   id: "campaignCandidates",
    //   label: "المرشحين والنتائج",
    //   icon: "ri-honour-line",
    //   link: "/campaign/candidates",
    //   click: (e) => {
    //     e.preventDefault();
    //     handleNavigation("campaignCandidates", "/campaign/candidates");
    //   }
    // },
    {
      label: "الانتخابات",
      isHeader: true,
    },

    {
      id: "campaignCommittees",
      label: "اللجان",
      icon: "ri-honour-line",
      link: "/campaign/committees",
      click: (e) => {
        e.preventDefault();
        handleNavigation("campaignCommittees", "/campaign/committees");
      }
    },
    // {
    //   id: "campaignAddMember",
    //   label: "إضافة مستخدم",
    //   icon: "ri-honour-line",
    //   link: "/campaign/add-member",
    //   click: function (e) {
    //     e.preventDefault();
    //     setIsCurrentState("campaignAddMember", "/campaign/add-member");

    //   },
    // },
    // {
    //   id: "campaignEdit",
    //   label: "تعديل الحملة",
    //   icon: "ri-honour-line",
    //   link: `/campaign/edit-campaign`,
    //   click: function (e) {
    //     e.preventDefault();
    //     setIsCurrentState("campaignEdit", "/campaign/edit-campaign");

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
