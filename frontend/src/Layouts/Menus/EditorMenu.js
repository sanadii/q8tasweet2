// Layouts/Menus/CampaignMenu.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useEditorMenu(isCurrentState, setIsCurrentState) {
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
      label: "قائمة المحرر",
      isHeader: true,
    },
    {
      id: "editor",
      label: "المحرر - تجربة",
      icon: "ri-honour-line",
      // link: "/campaigns",
      // click: function (e) {
      //   e.preventDefault();
      //   setIsCurrentState("campaigns");
      // },
    },
  ];
}
