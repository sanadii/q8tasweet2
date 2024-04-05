import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import { Card, CardBody, CardHeader, Container, Nav, NavItem, NavLink, TabContent, TabPane, Row, Col } from 'reactstrap';
import { userSelector } from 'selectors';
import classnames from "classnames";

import { uploadNewImage, getCurrentUser } from "store/actions";

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
    const dispatch = useDispatch();

    const { user } = useSelector(userSelector);
    const [activeTab, setActiveTab] = useState("1");
    const [userProfileImage, setUserProfileImage] = useState(null);

    useEffect(() => {
        if (!user || user?.length === 0) { dispatch(getCurrentUser()); }
    }, []);

    const tabChange = (tab) => {
        if (activeTab !== tab) setActiveTab(tab);
    };

    const onUploadImage = (e) => {
        if (userProfileImage) {
            e.preventDefault();
            const formData = new FormData();
            formData.append('folder', 'users');
            formData.append('image', userProfileImage || '');
            dispatch(uploadNewImage(formData));
        }
    }

    return (
        <React.Fragment>

            <Row>
                <Col xxl={3}>
                    <EditProfileImage userDetails={user} selectImage={(image) => { setUserProfileImage(image) }} />
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
                            onClick={onUploadImage}
                            className="btn btn-primary">تحديث</button>
                    </div>
                </Col>
            </Row>

        </React.Fragment >
    );
};

export default ProfileEdit;