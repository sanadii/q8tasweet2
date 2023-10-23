import React from "react";
import { Container, Row } from "reactstrap";
import BreadCrumb from "../../../Components/Common/Components/BreadCrumb";
import AllCandidates from "./AllCandidates";
import Widgets from "./Widgets";

const ElectionList = () => {
  document.title = "قائمة الإنتخابات | كويت تصويت";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="قائمة الإنتخابات" pageTitle="قائمة الإنتخابات" />
          <Widgets />
          <AllCandidates />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ElectionList;
