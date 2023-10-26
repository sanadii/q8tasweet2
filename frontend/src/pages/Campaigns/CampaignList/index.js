import React from "react";
import { Container, Row } from "reactstrap";
import BreadCrumb from "../../../Common/Components/Components/BreadCrumb";
import AllCampaigns from "./AllCampaigns";
import Widgets from "./Widgets";

const CampaignList = () => {
  document.title = "الحملات الإنتخابية | كويت تصويت";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="الحملات الإنتخابية" pageTitle="الحملات الإنتخابية" />
          {/* <Widgets /> */}
          <AllCampaigns />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default CampaignList;
