// Pages/Campaigns/campaign/index.js
// React & Redux core
import React from "react";
import { useSelector } from "react-redux";

// Store & Selectors
import { campaignSelector } from 'Selectors';

// Components, Constants & Hooks
import usePermission from "Common/Hooks/usePermission";
import OverViewGuarantees from "./OverViewGuarantees";
import OverviewSidebar from "./OverviewSidebar";
import OverviewCandidate from "./OverviewCandidate";
// import OverViewNotifications from "./Components/OverViewNotifications";

// UI & Utilities
import { Col, Row } from "reactstrap";

const OverviewTab = () => {
  const {
    campaign,
  } = useSelector(campaignSelector);

  document.title = "Campaign Overview | Q8Tasweet";

  return (
    <React.Fragment>
      <Row>
        <Col lg={3}>
          <OverviewSidebar />
        </Col>
        <Col lg={9}>
          <OverviewCandidate />
          <OverViewGuarantees />
          {/* <OverViewNotifications /> */}
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default OverviewTab;
