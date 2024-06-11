// Pages/Campaigns/campaign/index.js
// React & Redux core
import React from "react";
import { useSelector } from "react-redux";

// Store & Selectors
import { campaignSelector } from 'selectors';

// Components, Constants & Hooks
import { usePermission } from 'shared/hooks';
import Guarantors from "./OverviewGuarantees/Guarantors";

// Components, Constants & Hooks
import OverviewCandidate from "./OverviewGuarantees/OverviewCandidate";
import CampaignWidgets from "./OverviewWidgets"
import ChartMapWidgets from "./ChartMapWidgets"
import OverviewGuarantees from "./OverviewGuarantees"

import GuaranteeCals from "./OverviewGuarantees/GuaranteeCals"
import GuaranteeChart from "./OverviewGuarantees/GuaranteeChart"
import GuaranteeTarget from "./OverviewGuarantees/GuaranteeRadialBar"
import GuaranteeRadialBar from "./OverviewGuarantees/GuaranteeRadialBar"
import GuaranteeTargetBar from "./OverviewGuarantees/GuaranteeTargetBar"

import OverviewNotifications from "./OverViewNotifications";
import { calculateCampaignData } from 'shared/hooks';

// UI & Utilities
import { Col, Row } from "reactstrap";


const OverviewTab = () => {
  document.title = "Campaign Overview | Q8Tasweet";

  // States
  const {
    campaign,
    electionSlug,
    campaignGuarantees,
    campaignMembers,
    campaignGuaranteeGroups,
    isCampaignGuaranteeSuccess,
    error
  } = useSelector(campaignSelector);

  const results = calculateCampaignData(campaign, campaignGuarantees);

  const {
    canChangeCampaign,
    canViewCampaignGuarantee,
    isContributor,
    isModerator,
    isSubscriber
  } = usePermission();


  console.log("campaignMembers: ", campaignMembers)

  return (
    <React.Fragment>
      <div id="layout-wrapper">
        <OverviewCandidate />
        {/* <ChartMapWidgets /> */}

        <CampaignWidgets />
        <OverviewGuarantees
          campaign={campaign}
          campaignGuarantees={campaignGuarantees}
          campaignMembers={campaignMembers}
        />

        {/*
        <OverviewNotifications /> */}


      </div>
    </React.Fragment>
  );
};

export default OverviewTab;
