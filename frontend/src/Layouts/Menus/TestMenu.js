// Layouts/Menus/TestMenu.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useTestMenu(isCurrentState, setIsCurrentState) {
  const history = useNavigate();

  useEffect(() => {
    // State management
    if (isCurrentState === "test1") {
      history("/dashboard/test1");
      document.body.classList.add("twocolumn-panel");
    }
    if (isCurrentState === "test2") {
      history("/dashboard/test2");
      document.body.classList.add("twocolumn-panel");
    }
  }, [history, isCurrentState]);

  return [
    {
      label: "تجارب",
      isHeader: true,
    },
    {
      id: "test1",
      label: "Test 1",
      icon: "ri-dashboard-line",
      link: "/dashboard/test1",
      click: function (e) {
        e.preventDefault();
        setIsCurrentState("test1");
      },
    },
    {
      id: "test2",
      label: "Test 2",
      icon: "ri-dashboard-line",
      link: "/dashboard/test2",
      click: function (e) {
        e.preventDefault();
        setIsCurrentState("test2");
      },
    },
  ];
}
