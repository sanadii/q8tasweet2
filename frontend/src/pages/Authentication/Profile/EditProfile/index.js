import React, { useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { Card, CardBody, CardHeader, Container, Nav, NavItem, NavLink, TabContent, TabPane, Row, Col } from 'reactstrap';
import { userSelector } from 'Selectors';
import classnames from "classnames";


//import images
import EditProfileImage from "./EditProfileImage"
import EditCompleteProfile from "./EditCompleteProfile"
import EditSocialMedia from "./EditSocialMedia"

//import images
import progileBg from 'assets/images/kuwait-bg.png';

// Tabs
import EditPersonalDetails from "./EditPersonalDetails"
import EditChangePassword from "./EditChangePassword"
import EditExperience from "./EditExperience"
import EditPrivacyPolicy from "./EditPrivacyPolicy"

const tabs = [
    { id: "1", title: "الملف الشخصي", icon: "fas fa-home", Component: EditPersonalDetails },
    { id: "2", title: "تغيير كلمة المرور", icon: "far fa-user", Component: EditChangePassword },
    // { id: "3", title: "Experience", icon: "far fa-envelope", Component: EditExperience },
    // { id: "4", title: "Privacy Policy", icon: "far fa-envelope", Component: EditPrivacyPolicy },
];
const ProfileEdit = () => {
    document.title = "Profile Settings | Q8Tasweet - React Admin & Dashboard Template";
    const { user } = useSelector(userSelector);
    const [activeTab, setActiveTab] = useState("1");

    const tabChange = (tab) => {
        if (activeTab !== tab) setActiveTab(tab);
    };

    document.title = "Profile Settings | Q8Tasweet - React Admin & Dashboard Template";

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <div className="profile-foreground position-relative mx-n4 mt-n4">
                        <div className="profile-wid-bg">
                            {/* <img src={profileBg} alt="" className="profile-wid-img" /> */}
                        </div>
                    </div>
                    <div className="pt-4 mb-4 mb-lg-3 pb-lg-4 profile-wrapper">
                        <Row className="g-4">
                            <div className="col-auto">
                            </div>
                            <Col>
                                <div className="p-2">
                                    <h3 className="text-white mb-1">{user.fullName}</h3>
                                    <p className="text-white-75">{user.isStaff ? "مدير" : "مشترك"}</p>
                                </div>
                            </Col>
                            <Col xs={12} className="col-lg-auto order-last order-lg-0">
                            </Col>
                        </Row>
                        <Row className="g-4">
                            <div className="col-auto">
                            </div>
                            <Col>
                            </Col>
                            <Col xs={12} className="col-lg-auto order-last order-lg-0">
                                <div className="flex-shrink-0">
                                    <Link
                                        to="/profile"
                                        className="btn btn-success"
                                    >
                                        <i className="ri-edit-box-line align-bottom"></i>الملف الشخصي
                                    </Link>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <Row className="mt-xxl-n4">
                        <Col xxl={3}>
                            <EditProfileImage />
                            {/* <EditCompleteProfile /> */}
                            <EditSocialMedia />
                        </Col>
                        <Col xxl={9}>
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
                    <Row>
                        <Col lg={12}>
                            <div className="hstack gap-2 justify-content-end">
                                <button type="button"
                                    className="btn btn-primary">تحديث</button>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default ProfileEdit;