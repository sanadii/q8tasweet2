// Layouts/Menus/AdminMenu.js
import { useNavigate } from "react-router-dom";

export function useUserMenu(isCurrentState, setIsCurrentState) {
    const history = useNavigate();

    const handleNavigation = (state, path) => {
        setIsCurrentState(state);
        history(path);
        document.body.classList.add("twocolumn-panel");
    }

    return [
        {
            label: "الملف الشخصي",
            isHeader: true,
        },
        {
            id: "userProfile",
            label: "الملف الشخصي",
            icon: "ri-dashboard-line",
            link: "/dashboard/profile",
            click: (e) => {
                e.preventDefault();
                handleNavigation("userProfile", "/dashboard/profile");
            },
        },
        {
            id: "userProfileEdit",
            label: "تعديل الملف الشخصي",
            icon: "ri-dashboard-line",
            link: "/dashboard/profile-edit",
            click: (e) => {
                e.preventDefault();
                handleNavigation("userProfileEdit", "/dashboard/profile-edit");
            },
        },
    ];
}
