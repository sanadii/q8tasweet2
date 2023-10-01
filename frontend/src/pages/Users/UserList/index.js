import React from "react";
import { Container, Row } from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import AllUsers from "./AllUsers";
import Widgets from "./Widgets";

const UserList = () => {
  document.title = "Elections List | Q8Tasweet - React Admin & Dashboard Template";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Elections List" pageTitle="Elections" />
          {/* <Widgets /> */}
          <AllUsers />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default UserList;
