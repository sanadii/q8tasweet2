// Layouts/Menus/CampaignMenu.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useCampaignMenu(iscurrentState, setIscurrentState) {
  const history = useNavigate();

  useEffect(() => {
    // State management
    if (iscurrentState === "campaigns") {
      history("/campaigns");
      document.body.classList.add("twocolumn-panel");
    }
  }, [history, iscurrentState]);

  return [
    {
        label: "الحملة الإنتخابية",
        isHeader: true,
      },
      {
        id: "campaigns",
        label: "الحملات الإنتخابية",
        icon: "ri-honour-line",
        link: "/campaigns",
        click: function (e) {
          e.preventDefault();
          setIscurrentState("campaigns");
        },
      },
    ];
}
