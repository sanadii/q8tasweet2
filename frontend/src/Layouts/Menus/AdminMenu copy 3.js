const adminItems = [

  {
    label: "قائمة الإدارة",
    isHeader: true,
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

  {
    id: "settings",
    label: "الإعدادات",
    icon: "ri-apps-2-line",
    link: "/#",
    click: function (e) {
      e.preventDefault();
      setIsSetting(!isSetting);
      setIscurrentState("Setting");
      updateIconSidebar(e);
    },
    stateVariables: isSetting,
    subItems: [
      {
        id: "settings",
        label: "الإعدادات",
        link: "/settings",
        parentId: "Setting",
      },
      {
        id: "categories",
        label: "المجموعات",
        link: "/settings/categories",
        parentId: "Setting",
      },
      // {
      //   id: "PrivecyPolicy",
      //   label: "Ecommerce",
      //   link: "/ecommerce",
      //   parentId: "Setting",
      //   badgeColor: "success",
      //   badgeName: "New",
      // },
      {
        id: "terms-conditions",
        label: "سياسة الإستخدام",
        link: "/#",
        parentId: "Setting",
        badgeColor: "success",
        badgeName: "New",
      },
    ],
  },
]