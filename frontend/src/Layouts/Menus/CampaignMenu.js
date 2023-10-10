// Layouts/Menus/CampaignMenu.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useCampaignMenu(iscurrentState, setIscurrentState) {
  const history = useNavigate();

  useEffect(() => {
    document.body.classList.remove("twocolumn-panel");

    // State management
    if (iscurrentState === "campaigns") {
      history("/campaigns");
      document.body.classList.add("twocolumn-panel");
    }
  }, [history, iscurrentState]);

  return [
    {
        label: "قائمة المستخدم",
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
