import { useNavigate } from "react-router-dom";

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