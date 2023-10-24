import React from "react";
import { Container, Row } from "reactstrap";
import BreadCrumb from "../../../Common/Components/Components/BreadCrumb";
import AllCampaigns from "./AllCampaigns";
import Widgets from "./Widgets";

const CampaignList = () => {
  document.title = "Campaigns List | Q8Tasweet - React Admin & Dashboard Template";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Campaigns List" pageTitle="Campaigns" />
          <Widgets />
          <AllCampaigns />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default CampaignList;
