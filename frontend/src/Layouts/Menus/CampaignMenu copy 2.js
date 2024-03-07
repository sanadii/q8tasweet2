import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { campaignSelector, userSelector } from 'Selectors';
import { getCampaignDetails } from "store/actions";
import { isEmpty } from "lodash";
import { useParams } from "react-router-dom";

export function useCampaignMenu(isCurrentState, setIsCurrentState,) {
  const dispatch = useDispatch();
  const history = useNavigate();
  const { currentUserCampaigns } = useSelector(userSelector);
  const { campaign } = useSelector(campaignSelector);

  // Use useEffect slug && 
  const { slug, campaignType } = useParams();
  const currentCampaign = { campaignType, slug, }

  console.log("isCurrentState: ", isCurrentState)
  // useEffect(() => {
  //   document.title = "الانتخابات | كويت تصويت";
  //   if (slug || slug !== currentCampaign) {
  //     dispatch(getCampaignDetails(currentCampaign));
  //   }
  // }, [dispatch, currentCampaign]);

  useEffect(() => {
    if (isCurrentState === "campaigns") {
      history(`/dashboard/campaigns/${campaign.slug}/campaigns`);
      document.body.classList.add("twocolumn-panel");
    }
    if (isCurrentState === "campaignOverview") {
      history(`/dashboard/campaigns/${campaign.slug}/overview`);
      document.body.classList.add("twocolumn-panel");
    }
    if (isCurrentState === "campaignTeam") {
      history(`/dashboard/campaigns/${campaign.slug}/team`);
      document.body.classList.add("twocolumn-panel");
    }
    if (isCurrentState === "campaignGuarantee") {
      history(`/dashboard/campaigns/${campaign.slug}/guarantee`);
      document.body.classList.add("twocolumn-panel");
    }
    if (isCurrentState === "campaignAttendee") {
      history(`/dashboard/campaigns/${campaign.slug}/attendee`);
      document.body.classList.add("twocolumn-panel");
    }
    if (isCurrentState === "campaignMyGuarantee") {
      history(`/dashboard/campaigns/${campaign.slug}/my-guarantee`);
      document.body.classList.add("twocolumn-panel");
    }
    if (isCurrentState === "campaignEdit") {
      history(`/dashboard/campaigns/${campaign.slug}/edit`);
      document.body.classList.add("twocolumn-panel");
    }
  }, [history, isCurrentState, campaign.slug]);

  const createMenuItem = (campaign) => [
    {
      id: campaign.id,
      label: campaign.name || 'Campaign',
    },
    {
      id: "overview", // You can use a unique identifier here
      label: "الرئيسية", // Display campaign name
      icon: "ri-honour-line",
      link: `/dashboard/campaigns/overview`, // Link to campaign details
      click: function (e) {
        e.preventDefault();
        setIsCurrentState("CampaignOverview");

      },
    },
    {
      id: "team", // You can use a unique identifier here
      label: "فريق العمل", // Display campaign name
      icon: "ri-honour-line",
      link: `/dashboard/campaigns/${campaign.slug}/members`, // Link to campaign details
      click: function (e) {
        e.preventDefault();
        setIsCurrentState("CampaignTeam");
      },
    },
    {
      id: "guarantees", // You can use a unique identifier here
      label: "جميع المضامين", // Display campaign name
      icon: "ri-honour-line",
      link: `/dashboard/campaigns/${campaign.slug}/guarantees`, // Link to campaign details
      click: function (e) {
        e.preventDefault();
        setIsCurrentState("campaignGuarantee");
      },
    },
    {
      id: "my-guarantees", // You can use a unique identifier here
      label: "مضاميني", // Display campaign name
      icon: "ri-honour-line",
      link: `/dashboard/campaigns/${campaign.slug}/my-guarantees`, // Link to campaign details
      click: function (e) {
        e.preventDefault();
        setIsCurrentState("campaignMyGuarantee");

      },
    },
    {
      id: "attendance", // You can use a unique identifier here
      label: "الحضور", // Display campaign name
      icon: "ri-honour-line",
      link: `/dashboard/campaigns/${campaign.slug}/attendees`, // Link to campaign details
      click: function (e) {
        e.preventDefault();
        setIsCurrentState("campaignAttendee");
      },
    },
    {
      label: "إعدادات الحملة", // Display campaign name
      isHeader: true,
    },
    {
      id: "campaignEdit", // You can use a unique identifier here
      label: "تعديل", // Display campaign name
      icon: "ri-honour-line",
      link: `/dashboard/campaigns/${campaign.slug}/edit`, // Link to campaign details
      click: function (e) {
        e.preventDefault();
      },
    },
  ];

const menuItems = currentUserCampaigns
  ? currentUserCampaigns.flatMap(campaign => createMenuItem(campaign))
  : [];

return menuItems;
}
