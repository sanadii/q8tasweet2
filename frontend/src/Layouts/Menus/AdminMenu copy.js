// Layouts/Menus/AdminMenu.js
const AdminMenu = [
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
    // {
    //   label: "pages",
    //   isHeader: true,
    // },
    // {
    //   id: "authentication",
    //   label: "Authentication",
    //   icon: "ri-account-circle-line",
    //   link: "/#",
    //   click: function (e) {
    //     e.preventDefault();
    //     setIsAuth(!isAuth);
    //     setIscurrentState("Auth");
    //     updateIconSidebar(e);
    //   },
    //   stateVariables: isAuth,
    //   subItems: [
    //     {
    //       id: "signIn",
    //       label: "Sign In",
    //       link: "/#",
    //       isChildItem: true,
    //       click: function (e) {
    //         e.preventDefault();
    //         setIsSignIn(!isSignIn);
    //       },
    //       parentId: "authentication",
    //       stateVariables: isSignIn,
    //       childItems: [
    //         { id: 1, label: "Basic", link: "/auth-signin-basic" },
    //         { id: 2, label: "Cover", link: "/auth-signin-cover" },
    //       ],
    //     },
    //     {
    //       id: "signUp",
    //       label: "Sign Up",
    //       link: "/#",
    //       isChildItem: true,
    //       click: function (e) {
    //         e.preventDefault();
    //         setIsSignUp(!isSignUp);
    //       },
    //       parentId: "authentication",
    //       stateVariables: isSignUp,
    //       childItems: [
    //         { id: 1, label: "Basic", link: "/auth-signup-basic" },
    //         { id: 2, label: "Cover", link: "/auth-signup-cover" },
    //       ],
    //     },
    //     {
    //       id: "passwordReset",
    //       label: "Password Reset",
    //       link: "/#",
    //       isChildItem: true,
    //       click: function (e) {
    //         e.preventDefault();
    //         setIsPasswordReset(!isPasswordReset);
    //       },
    //       parentId: "authentication",
    //       stateVariables: isPasswordReset,
    //       childItems: [
    //         { id: 1, label: "Basic", link: "/auth-pass-reset-basic" },
    //         { id: 2, label: "Cover", link: "/auth-pass-reset-cover" },
    //       ],
    //     },
    //     {
    //       id: "passwordCreate",
    //       label: "Password Create",
    //       link: "/#",
    //       isChildItem: true,
    //       click: function (e) {
    //         e.preventDefault();
    //         setIsPasswordCreate(!isPasswordCreate);
    //       },
    //       parentId: "authentication",
    //       stateVariables: isPasswordCreate,
    //       childItems: [
    //         { id: 1, label: "Basic", link: "/auth-pass-change-basic" },
    //         { id: 2, label: "Cover", link: "/auth-pass-change-cover" },
    //       ],
    //     },
    //     {
    //       id: "lockScreen",
    //       label: "Lock Screen",
    //       link: "/#",
    //       isChildItem: true,
    //       click: function (e) {
    //         e.preventDefault();
    //         setIsLockScreen(!isLockScreen);
    //       },
    //       parentId: "authentication",
    //       stateVariables: isLockScreen,
    //       childItems: [
    //         { id: 1, label: "Basic", link: "/auth-lockscreen-basic" },
    //         { id: 2, label: "Cover", link: "/auth-lockscreen-cover" },
    //       ],
    //     },
    //     {
    //       id: "logout",
    //       label: "Logout",
    //       link: "/#",
    //       isChildItem: true,
    //       click: function (e) {
    //         e.preventDefault();
    //         setIsLogout(!isLogout);
    //       },
    //       parentId: "authentication",
    //       stateVariables: isLogout,
    //       childItems: [
    //         { id: 1, label: "Basic", link: "/auth-logout-basic" },
    //         { id: 2, label: "Cover", link: "/auth-logout-cover" },
    //       ],
    //     },
    //     {
    //       id: "successMessage",
    //       label: "Success Message",
    //       link: "/#",
    //       isChildItem: true,
    //       click: function (e) {
    //         e.preventDefault();
    //         setIsSuccessMessage(!isSuccessMessage);
    //       },
    //       parentId: "authentication",
    //       stateVariables: isSuccessMessage,
    //       childItems: [
    //         { id: 1, label: "Basic", link: "/auth-success-msg-basic" },
    //         { id: 2, label: "Cover", link: "/auth-success-msg-cover" },
    //       ],
    //     },
    //     {
    //       id: "twoStepVerification",
    //       label: "Two Step Verification",
    //       link: "/#",
    //       isChildItem: true,
    //       click: function (e) {
    //         e.preventDefault();
    //         setIsVerification(!isVerification);
    //       },
    //       parentId: "authentication",
    //       stateVariables: isVerification,
    //       childItems: [
    //         { id: 1, label: "Basic", link: "/auth-twostep-basic" },
    //         { id: 2, label: "Cover", link: "/auth-twostep-cover" },
    //       ],
    //     },
    //     {
    //       id: "errors",
    //       label: "Errors",
    //       link: "/#",
    //       isChildItem: true,
    //       click: function (e) {
    //         e.preventDefault();
    //         setIsError(!isError);
    //       },
    //       parentId: "authentication",
    //       stateVariables: isError,
    //       childItems: [
    //         { id: 1, label: "404 Basic", link: "/auth-404-basic" },
    //         { id: 2, label: "404 Cover", link: "/auth-404-cover" },
    //         { id: 3, label: "404 Alt", link: "/auth-404-alt" },
    //         { id: 4, label: "500", link: "/auth-500" },
    //         { id: 5, label: "Offline Page", link: "/auth-offline" },
    //       ],
    //     },
    //   ],
    // },
  ]

  export default AdminMenu;
