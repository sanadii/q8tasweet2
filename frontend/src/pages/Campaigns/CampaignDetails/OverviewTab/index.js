// Pages/Campaigns/campaign/index.js
// React & Redux core
import React from "react";
import { useSelector } from "react-redux";

// Store & Selectors
import { campaignSelector } from 'Selectors';

// Components, Constants & Hooks
import { usePermission } from 'hooks';
import Guarantors from "./Guarantors";
import OverviewSidebar from "./OverviewSidebar";

// Components, Constants & Hooks
import GuaranteeCals from "./GuaranteeCals"
import GuaranteeChart from "./GuaranteeChart"
import GuaranteeTarget from "./GuaranteeRadialBar"
import GuaranteeRadialBar from "./GuaranteeRadialBar"
import GuaranteeTargetBar from "./GuaranteeTargetBar"


import OverviewCandidate from "./OverviewCandidate";
import { calculateCampaignData } from 'hooks/campaignCalculation';

// import OverviewNotifications from "./OverviewNotifications";

// UI & Utilities
import { Col, Row } from "reactstrap";


const OverviewTab = () => {
  document.title = "Campaign Overview | Q8Tasweet";

  const {
    campaign,
    campaignGuarantees,
  } = useSelector(campaignSelector);

  const results = calculateCampaignData(campaign, campaignGuarantees);

  const {
    canChangeCampaign,
    canViewCampaignGuarantee,
    isContributor,
    isModerator,
    isSubscriber
  } = usePermission();



  return (
    <React.Fragment>
      <Row>
        <Col lg={3}>
          <OverviewSidebar />
        </Col>
        <Col lg={9}>
          {/* Candidate */}
          <OverviewCandidate />

          {/* Guarantees */}
          {canViewCampaignGuarantee &&
            <GuaranteeTargetBar
              campaign={campaign}
              results={results}
            />
          }
          <Row>
            <Col sm={6}>
              <GuaranteeChart
                campaign={campaign}
                campaignGuarantees={campaignGuarantees}
                results={results}
              />
            </Col>
            <Col sm={6}>
              <GuaranteeRadialBar
                campaign={campaign}
                campaignGuarantees={campaignGuarantees}
                results={results}
              />
            </Col>
            {/* <Col sm={6}>
              <GuaranteeCals
                campaign={campaign}
                campaignGuarantees={campaignGuarantees}
                results={results}
              />
            </Col> */}
          </Row>
          {canViewCampaignGuarantee &&
            <Guarantors />
          }
          {/* <OverviewNotifications /> */}
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default OverviewTab;
