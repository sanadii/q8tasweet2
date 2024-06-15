// Layouts/Menus/CampaignMenu.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { userSelector } from "selectors";

export function useCampaignMenu(isCurrentState, setIsCurrentState) {
  const history = useNavigate();

  const { currentUserCampaigns } = useSelector(userSelector);

  useEffect(() => {
    // State management
    if (isCurrentState === "campaigns") {
      history("/campaigns");
      document.body.classList.add("twocolumn-panel");
    }
  }, [history, isCurrentState]);
  
  useEffect(() => {
    // State management
    if (isCurrentState === "campaigns") {
      history("/campaigns");
      document.body.classList.add("twocolumn-panel");
    }
  }, [history, isCurrentState]);

  // Menu items with campaign data
  const menuItems = [
    {
      label: "الحملات الإنتخابية",
      isHeader: true,
    },
  ];

  // Add menu items for each campaign
  if (currentUserCampaigns) {
    currentUserCampaigns.forEach((campaign) => {
      menuItems.push({
        id: campaign.id, // You can use a unique identifier here
        label: campaign.candidate.name, // Display campaign name
        icon: "ri-honour-line",
        link: `/campaigns/${campaign.slug}`, // Link to campaign details
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
