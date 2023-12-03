// Layouts/Menus/AdminMenu.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function usePublicMenu(isCurrentState, setIscurrentState) {
  const history = useNavigate();

  useEffect(() => {
    if (isCurrentState === "publicElections") {
      history("/elections");
      document.body.classList.add("twocolumn-panel");
    }
    if (isCurrentState === "publicCandidates") {
      history("/candidates");
      document.body.classList.add("twocolumn-panel");
    }
    if (isCurrentState === "publicCampaigns") {
      history("/campaigns");
      document.body.classList.add("twocolumn-panel");
    }
    if (isCurrentState === "publicUsers") {
      history("/users");
      document.body.classList.add("twocolumn-panel");
    }
  }, [history, isCurrentState]);

  return [
    {
      id: "home",
      label: "الرئيسية",
      icon: "ri-dashboard-line",
      link: "/",
      click: function (e) {
        e.preventDefault();
        setIscurrentState("publicHome");
      },
    }, {
      id: "elections",
      label: "الإنتخابات",
      icon: "ri-dashboard-line",
      link: "/elections",
      click: function (e) {
        e.preventDefault();
        setIscurrentState("publicElections");
      },
    },
    {
      id: "candidates",
      label: "المرشحين",
      icon: "ri-account-pin-box-line",
      link: "/candidates",
      click: function (e) {
        e.preventDefault();
        setIscurrentState("publicCandidates");
      },
    },
    {
      id: "about-us",
      label: "من نحن",
      icon: "ri-account-pin-box-line",
      link: "/about-us",
      click: function (e) {
        e.preventDefault();
        setIscurrentState("publicAboutUs");
      },
    },
    {
      id: "contact-us",
      label: "اتصل بنا",
      icon: "ri-account-pin-box-line",
      link: "/contact-us",
      click: function (e) {
        e.preventDefault();
        setIscurrentState("publicContactUs");
      },
    },
  ];
}
