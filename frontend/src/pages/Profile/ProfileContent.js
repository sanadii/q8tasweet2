import React, { useState, useEffect } from "react"; // Removed unnecessary imports
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { userSelector } from 'selectors';

import { Card, CardBody, Col, Container, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";
import classnames from "classnames";
import SwiperCore, { Autoplay } from "swiper";

// Tabs
import ProfileOverview from "./ProfileOverview";
import ProfileCampaigns from "./ProfileCampaigns";
import ProfileMember from "./TabMember/ProfileMember";
import ProfileDocuments from "./TabDocuments/ProfileDocuments";
import EditProfile from "./EditProfile"

const ProfileContent = ({ user }) => {
    const [userName, setUserName] = useState("");
    const [isEditProfile, setIsEditProfile] = useState(false);

    const profileItems = [
        {
            id: "1",
            title: "الملف الشخصي",
            icon: "fas fa-home",
            href: "Profile-overview",
            Component: ProfileOverview,
            type: "tab",
            props: { user: user }
        },
        // { id: "2", title: "الحملات الإنتخابية", icon: "far fa-user", href: "Profile-activities", type: "tab", Component: ProfileCampaigns, props: { user: user } },
        // { id: "3", title: "المشاريع", icon: "far fa-envelope", href: "Profile-Member", type: "tab", Component: ProfileMember },
        // { id: "4", title: "مستندات", icon: "far fa-envelope", href: "Profile-documents", type: "tab", Component: ProfileDocuments },
        {
            id: "6",
            title: isEditProfile ? "مشاهدة الملف الشخصي" : "تعديل الملف الشخصي",
            icon: "fas fa-home",
            href: "Profile-overview",
            Component: EditProfile,
            props: { user: user },
            type: "button"
        },
    ];

    useEffect(() => {
        if (user && user.id) {
            setUserName(user.id);
        }
    }, [user]);
    SwiperCore.use([Autoplay]);

    const [activeTab, setActiveTab] = useState("1");


    const handleEditProfile = () => {
        if (isEditProfile) {
            setActiveTab("1");  // Go back to the profile overview
            setIsEditProfile(false);
        } else {
            setActiveTab("6");  // Switch to edit profile
            setIsEditProfile(true);
        }
    };

    const toggleTab = (tab) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
        }
    };


    return (
        <React.Fragment>
            <Row>
                <Col lg={12}>
                    <div className="d-flex profile-wrapper">
                        <Nav
                            pills
                            className="animation-nav profile-nav gap-2 gap-lg-3 flex-grow-1"
                            role="tablist"
                        >
                            {!isEditProfile && profileItems.filter(item => item.type === "tab").map((tab) => (
                                <NavItem key={tab.id}>
                                    <NavLink
                                        href={`#${tab.href}`}
                                        className={classnames({ active: activeTab === tab.id })}
                                        onClick={() => {
                                            toggleTab(tab.id);
                                        }}
                                    >
                                        <i className={`${tab.icon} line d-inline-block d-md-none`}></i>
                                        <span className="d-none d-md-inline-block">{tab.title}</span>
                                    </NavLink>
                                </NavItem>
                            ))}
                        </Nav>

                        <div className="flex-shrink-0">
                            {profileItems.filter(item => item.type === "button").map((button) => (
                                <button
                                    key={button.id}
                                    className="btn btn-success"
                                    onClick={handleEditProfile}
                                >
                                    <i className="ri-edit-box-line align-bottom"></i> {button.title}
                                </button>
                            ))}
                        </div>
                    </div>
                    <TabContent activeTab={activeTab} className="pt-4">
                        {profileItems.map((item) => (
                            <TabPane tabId={item.id} key={item.id}>
                                <item.Component {...item.props} />
                            </TabPane>
                        ))}
                    </TabContent>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default ProfileContent;



