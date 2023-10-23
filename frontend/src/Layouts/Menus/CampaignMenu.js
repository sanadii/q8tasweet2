// Layouts/Menus/CampaignMenu.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { campaignSelector } from "Selectors";

import { getCampaigns } from "store/actions";

export function useCampaignMenu(iscurrentState, setIscurrentState) {
  const dispatch = useDispatch();
  const history = useNavigate();

  const { campaigns } = useSelector(campaignSelector);

  // Campaign Data
  useEffect(() => {
    // Fetch campaigns if not already loaded
    if (!campaigns || campaigns.length === 0) {
      dispatch(getCampaigns());
    }
  }, [dispatch, campaigns]);

  useEffect(() => {
    // State management
    if (iscurrentState === "campaigns") {
      history("/campaigns");
      document.body.classList.add("twocolumn-panel");
    }
  }, [history, iscurrentState]);

  // Menu items with campaign data
  const menuItems = [
    {
      label: "الحملات الإنتخابية",
      isHeader: true,
    },
    // {
    //   id: "campaigns",
    //   label: campaign.candidate.name, // here is the name of the campaign from API
    //   icon: "ri-honour-line",
    //   link: `/campaign/${campaign.id}`, // Link to campaign details
    //   click: function (e) {
    //     e.preventDefault();
    //     setIscurrentState("campaigns");
    //   },
    // },
  ];

  // Add menu items for each campaign
  if (campaigns) {
    campaigns.forEach((campaign) => {
      menuItems.push({
        id: campaign.id, // You can use a unique identifier here
        label: campaign.candidate.name, // Display campaign name
        icon: "ri-honour-line",
        link: `/campaigns/${campaign.id}`, // Link to campaign details
        click: function (e) {
          e.preventDefault();
          // Handle clicking on a campaign menu item
          // You can navigate to the campaign details or perform other actions here
        },
      });
    });
  }

  return menuItems;
}
