import React, { useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Card, CardBody, CardHeader, Container, Nav, NavItem, NavLink, Input, TabContent, TabPane, Label, Row, Col } from 'reactstrap';
import { userSelector } from 'Selectors';
import classnames from "classnames";


//import images
import EditProfileImage from "./EditProfileImage"
import EditCompleteProfile from "./EditCompleteProfile"
import EditProfilePortfolio from "./EditProfilePortfolio"

//import images
import progileBg from 'assets/images/profile-bg.jpg';

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
const ProfileSettings = () => {
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
                    <div className="position-relative mx-n4 mt-n4">
                        <div className="profile-wid-bg profile-setting-img">
                            <img src={progileBg} className="profile-wid-img" alt="" />
                            <div className="overlay-content">
                                <div className="text-end p-3">
                                    <div className="p-0 ms-auto rounded-circle profile-photo-edit">
                                        <Input id="profile-foreground-img-file-input" type="file"
                                            className="profile-foreground-img-file-input" />
                                        <Label htmlFor="profile-foreground-img-file-input"
                                            className="profile-photo-edit btn btn-light">
                                            <i className="ri-image-edit-line align-bottom me-1"></i> تغيير الخلفية
                                        </Label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Row>
                        <Col xxl={3}>
                            <EditProfileImage />
                            {/* <EditCompleteProfile /> */}
                            <EditProfilePortfolio />
                        </Col>
                        <Col xxl={9}>
                            <Card className="mt-xxl-n5">
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

export default ProfileSettings;