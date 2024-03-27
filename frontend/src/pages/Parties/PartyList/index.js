import React from "react";
import { Container, Row } from "reactstrap";
import { BreadCrumb } from "shared/components";
import AllParties from "./AllParties";
import Widgets from "./Widgets";

const ElectionList = () => {
  document.title = "قائمة الإنتخابات | كويت تصويت";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="قائمة الإنتخابات" pageTitle="قائمة الإنتخابات" />
          <AllParties />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ElectionList;
