// Layouts/Menus/CampaignMenu.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useContributorMenu(iscurrentState, setIscurrentState) {
  const history = useNavigate();

  useEffect(() => {
    // State management
    //   if (iscurrentState === "campaigns") {
    //     history("/campaigns");
    //     document.body.classList.add("twocolumn-panel");
    //   }
  }, [history, iscurrentState]);

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
      //   setIscurrentState("campaigns");
      // },
    },
  ];
}
