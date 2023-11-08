import React from "react";
import { Container, Row } from "reactstrap";
import BreadCrumb from "components/Components/BreadCrumb";
import AllCandidates from "./AllCandidates";
import Widgets from "./Widgets";

const ElectionList = () => {
  document.title = "قائمة الإنتخابات | كويت تصويت";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="قائمة الإنتخابات" pageTitle="قائمة الإنتخابات" />
          <AllCandidates />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ElectionList;
