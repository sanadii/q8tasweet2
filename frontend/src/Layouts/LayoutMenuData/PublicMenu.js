// Layouts/Menus/AdminMenu.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function usePublicMenu(isCurrentState, setIsCurrentState) {
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
      icon: "ri-home-8-line",
      link: "/",
      click: function (e) {
        e.preventDefault();
        setIsCurrentState("publicHome");
      },
    }, {
      id: "elections",
      label: "الإنتخابات",
      icon: "ri-archive-line",
      link: "/elections",
      click: function (e) {
        e.preventDefault();
        setIsCurrentState("publicElections");
      },
    },
    {
      id: "candidates",
      label: "المرشحين",
      icon: "ri-account-pin-box-line",
      link: "/candidates",
      click: function (e) {
        e.preventDefault();
        setIsCurrentState("publicCandidates");
      },
    },
    {
      id: "about-us",
      label: "من نحن",
      icon: "ri-bookmark-3-line",
      link: "/about-us",
      click: function (e) {
        e.preventDefault();
        setIsCurrentState("publicAboutUs");
      },
    },
    {
      id: "contact-us",
      label: "اتصل بنا",
      icon: "ri-wechat-line",
      link: "/contact-us",
      click: function (e) {
        e.preventDefault();
        setIsCurrentState("publicContactUs");
      },
    },
    {
      id: "contact-us",
      label: "الحملة الإنتخابية",
      icon: "ri-wechat-line",
      link: "/dashboard",
      click: function (e) {
        e.preventDefault();
        setIsCurrentState("dashboard");
      },
    },
  ];
}
