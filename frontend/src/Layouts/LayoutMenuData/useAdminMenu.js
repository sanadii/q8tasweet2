// Layouts/Menus/useAdminMenu.js
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