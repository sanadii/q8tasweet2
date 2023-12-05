import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { campaignSelector, userSelector } from 'Selectors';
import { getCampaignDetails } from "store/actions";
import { isEmpty } from "lodash";
import { useParams } from "react-router-dom";

export function useCampaignMenu(iscurrentState, setIscurrentState) {
  const dispatch = useDispatch();
  const history = useNavigate();
  const { currentUserCampaigns } = useSelector(userSelector);
  const { campaign } = useSelector(campaignSelector);
  const { slug } = useParams();

  useEffect(() => {
    document.title = "الانتخابات | كويت تصويت";
    if (slug && (isEmpty(campaign) || slug !== campaign.slug)) {
      dispatch(getCampaignDetails(slug));
    }
  }, [dispatch, slug, campaign]);

  useEffect(() => {
    if (iscurrentState === "campaigns") {
      history("/campaigns");
      document.body.classList.add("twocolumn-panel");
    }
  }, [history, iscurrentState]);

  const createMenuItem = (campaign) => [
    {
      label: campaign.candidate?.name || 'Campaign',
      isHeader: true,
    },
    {
      id: campaign.id, // You can use a unique identifier here
      label: "الرئيسية", // Display campaign name
      icon: "ri-honour-line",
      link: `/dashboard/campaigns/${campaign.slug}/overview`, // Link to campaign details
      click: function (e) {
        e.preventDefault();
      },
    },
    {
      id: campaign.id, // You can use a unique identifier here
      label: "فريق العمل", // Display campaign name
      icon: "ri-honour-line",
      link: `/dashboard/campaigns/${campaign.slug}/members`, // Link to campaign details
      click: function (e) {
        e.preventDefault();
      },
    },
    {
      id: campaign.id, // You can use a unique identifier here
      label: "جميع المضامين", // Display campaign name
      icon: "ri-honour-line",
      link: `/dashboard/campaigns/${campaign.slug}/guarantees`, // Link to campaign details
      click: function (e) {
        e.preventDefault();
      },
    },
    {
      id: campaign.id, // You can use a unique identifier here
      label: "مضاميني", // Display campaign name
      icon: "ri-honour-line",
      link: `/dashboard/campaigns/${campaign.slug}/guarantees`, // Link to campaign details
      click: function (e) {
        e.preventDefault();
      },
    },
    {
      id: campaign.id, // You can use a unique identifier here
      label: "الحضور", // Display campaign name
      icon: "ri-honour-line",
      link: `/dashboard/campaigns/${campaign.slug}/attendees`, // Link to campaign details
      click: function (e) {
        e.preventDefault();
      },
    },
    {
      label: "إعدادات الحملة", // Display campaign name
      isHeader: true,
    },
    {
      id: campaign.id, // You can use a unique identifier here
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
