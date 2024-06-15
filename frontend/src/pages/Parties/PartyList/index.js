import React from "react";
import { Container, Row } from "reactstrap";
import { BreadCrumb } from "shared/components";
import AllParties from "./AllParties";
import Widgets from "./Widgets";

<<<<<<< HEAD
const ElectionList = () => {
=======
const Elections = () => {
>>>>>>> sanad
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

<<<<<<< HEAD
export default ElectionList;
=======
export default Elections;
>>>>>>> sanad
