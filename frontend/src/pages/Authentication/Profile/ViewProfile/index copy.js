import React, { useState, useEffect } from "react"; // Removed unnecessary imports
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { userSelector } from 'Selectors';

import { Card, CardHeader, CardBody, Col, Container, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";
import classnames from "classnames";
import SwiperCore, { Autoplay } from "swiper";

//Images
import profileBg from "assets/images/kuwait-bg.png";
import avatar1 from "assets/images/users/avatar-1.jpg";


// Tabs
import ProfileOverview from "./ProfileOverview";
import ProfileActivities from "./ProfileActivities";
import ProfileMember from "./ProfileMember";
import ProfileDocuments from "./ProfileDocuments";

const tabs = [
  { id: "1", title: "الملف الشخصي", icon: "fas fa-home", Component: ProfileOverview },
  { id: "2", title: "الأنشطة", icon: "far fa-user", Component: ProfileActivities },
  { id: "3", title: "المشاريع", icon: "far fa-envelope", Component: ProfileMember },
  { id: "4", title: "مستندات", icon: "far fa-envelope", Component: ProfileDocuments },
];


const ViewProfile = () => {
  const dispatch = useDispatch();
  // Getting the user data from Redux state
  const { user } = useSelector(userSelector);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (user && user.id) {
      setUserName(user.id);
    }
  }, [user]);
  SwiperCore.use([Autoplay]);

  const [activeTab, setActiveTab] = useState("1");

  const tabChange = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  // const toggleTab = (tab) => {
  //   if (activeTab !== tab) {
  //     setActiveTab(tab);
  //   }
  // };

  document.title = "Profile | Q8Tasweet - React Admin & Dashboard Template";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <div className="profile-foreground position-relative mx-n4 mt-n4">
            <div className="profile-wid-bg">
              <img src={profileBg} alt="" className="profile-wid-img" />
            </div>
          </div>
          <div className="pt-4 mb-4 mb-lg-3 pb-lg-4 profile-wrapper">
            <Row className="g-4">
              <div className="col-auto">
                <div className="avatar-lg">
                  <img
                    src={avatar1}
                    alt="user-img"
                    className="img-thumbnail rounded-circle"
                  />
                </div>
              </div>

              <Col>
                <div className="p-2">
                  <h3 className="text-white mb-1">{user.fullName}</h3>
                  <p className="text-white-75">{user.isStaff ? "مدير" : "مشترك"}</p>
                  <div className="hstack text-white-50 gap-1">
                    <div className="me-2">
                      <i className="ri-map-pin-user-line me-1 text-white-75 fs-16 align-middle"></i>
                      California, United States
                    </div>
                    <div>
                      <i className="ri-building-line me-1 text-white-75 fs-16 align-middle"></i>
                      Q8Vision
                    </div>
                  </div>
                </div>
              </Col>

              <Col xs={12} className="col-lg-auto order-last order-lg-0">
                <Row className="text text-white-50 text-center">
                  <Col lg={6} xs={4}>
                    <div className="p-2">
                      <h4 className="text-white mb-1">24.3K</h4>
                      <p className="fs-14 mb-0">Followers</p>
                    </div>
                  </Col>
                  <Col lg={6} xs={4}>
                    <div className="p-2">
                      <h4 className="text-white mb-1">1.3K</h4>
                      <p className="fs-14 mb-0">Following</p>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>

          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <Nav className="nav-tabs-custom rounded card-header-tabs border-bottom-0" role="tablist">
                    {tabs.map((tab) => (
                      <NavItem key={tab.id}>
                        <NavLink
                          className={classnames({ active: activeTab === tab.id })}
                          onClick={() => tabChange(tab.id)}
                          type="button"
                        >
                          <i className={tab.icon}></i>
                          {tab.title}
                        </NavLink>
                      </NavItem>
                    ))}
                  </Nav>
                </CardHeader>
                <CardBody className="p-4">
                  <TabContent activeTab={activeTab}>
                    {tabs.map((tab) => (
                      <TabPane tabId={tab.id} key={tab.id}>
                        <tab.Component />
                      </TabPane>
                    ))}
                  </TabContent>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ViewProfile;
