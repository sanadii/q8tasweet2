import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  Label,
  Nav,
  NavItem,
  NavLink,
  Pagination,
  PaginationItem,
  PaginationLink,
  Progress,
  Row,
  TabContent,
  Table,
  TabPane,
  UncontrolledCollapse,
  UncontrolledDropdown,
} from "reactstrap";
import classnames from "classnames";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay } from "swiper";

//Images
import profileBg from "../../../assets/images/profile-bg.jpg";
import avatar1 from "../../../assets/images/users/avatar-1.jpg";
import avatar2 from "../../../assets/images/users/avatar-2.jpg";
import avatar3 from "../../../assets/images/users/avatar-3.jpg";
import avatar4 from "../../../assets/images/users/avatar-4.jpg";
import avatar5 from "../../../assets/images/users/avatar-5.jpg";
import avatar6 from "../../../assets/images/users/avatar-6.jpg";
import avatar7 from "../../../assets/images/users/avatar-7.jpg";
import avatar8 from "../../../assets/images/users/avatar-8.jpg";

import smallImage2 from "../../../assets/images/small/img-2.jpg";
import smallImage3 from "../../../assets/images/small/img-3.jpg";
import smallImage4 from "../../../assets/images/small/img-4.jpg";
import smallImage5 from "../../../assets/images/small/img-5.jpg";
import smallImage6 from "../../../assets/images/small/img-6.jpg";
import smallImage7 from "../../../assets/images/small/img-7.jpg";
import smallImage9 from "../../../assets/images/small/img-9.jpg";


const EditTab = () => {
  document.title = "Starter | Q8Tasweet - React Admin & Dashboard Template";
  return (
    <React.Fragment>
      <Card>
        <CardBody>
          <div className="d-flex align-items-center mb-4">
            <h5 className="card-title flex-grow-1 mb-0">Documents</h5>
            <h4>Tab 4</h4>
          </div>
          <Row>
            <p>Tab 4</p>
          </Row>
        </CardBody>
      </Card>{" "}
    </React.Fragment>
  );
};

export default EditTab;
