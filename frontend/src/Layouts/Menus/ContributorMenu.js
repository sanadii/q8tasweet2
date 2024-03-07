// Layouts/Menus/CampaignMenu.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useContributorMenu(isCurrentState, setIsCurrentState) {
  const history = useNavigate();

  useEffect(() => {
    // State management
    //   if (isCurrentState === "campaigns") {
    //     history("/campaigns");
    //     document.body.classList.add("twocolumn-panel");
    //   }
  }, [history, isCurrentState]);

  return [
    {
      label: "قائمة المساهمين",
      isHeader: true,
    },
    {
      id: "campaigns",
      label: "المساهمين - تجربة",
      icon: "ri-honour-line",
      // link: "/campaigns",
      // click: function (e) {
      //   e.preventDefault();
      //   setIsCurrentState("campaigns");
      // },
    },
  ];
}
