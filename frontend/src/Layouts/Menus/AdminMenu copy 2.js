const getAdminMenu = () => ([
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
        // setIscurrentState("adminElections");
      },
    },
    // ... other items and subItems ...
  ]);
  
  export default getAdminMenu;
  