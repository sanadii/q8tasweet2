import React from "react";
import { Container, Row } from "reactstrap";
import BreadCrumb from "../../../Components/Common/Components/BreadCrumb";
import AllElections from "./AllElections";
import Widgets from "./Widgets";

const ElectionList = () => {
  document.title = "Elections List | Q8Tasweet - React Admin & Dashboard Template";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Elections List" pageTitle="Elections" />
          {/* <Widgets /> */}
          <AllElections />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ElectionList;
