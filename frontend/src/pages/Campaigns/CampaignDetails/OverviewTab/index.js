// Pages/Campaigns/campaign/index.js
// React & Redux core
import React from "react";
import { useSelector } from "react-redux";

// Store & Selectors
import { campaignSelector } from 'selectors';

// Components, Constants & Hooks
import { usePermission } from 'shared/hooks';
import Guarantors from "./Guarantors";
import OverviewSidebar from "./OverviewSidebar";

// Components, Constants & Hooks
import GuaranteeCals from "./GuaranteeCals"
import GuaranteeChart from "./GuaranteeChart"
import GuaranteeTarget from "./GuaranteeRadialBar"
import GuaranteeRadialBar from "./GuaranteeRadialBar"
import GuaranteeTargetBar from "./GuaranteeTargetBar"

import OverviewNotifications from "./OverviewNotifications";
import OverviewCandidate from "./OverviewCandidate";
import { calculateCampaignData } from 'shared/hooks';

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
      <div id="layout-wrapper">

        <Row>
          <Col lg={3}>
            <OverviewSidebar />
            <OverviewNotifications />

          </Col>
          <Col lg={9}>
            {/* Candidate */}
            <OverviewCandidate />

            {/* Guarantees */}
            {canViewCampaignGuarantee && campaign.election.previousElections &&
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
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
};

export default OverviewTab;
