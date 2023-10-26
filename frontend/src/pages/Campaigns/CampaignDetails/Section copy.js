// Pages/Campaigns/CampaignDetails/index.js
// React & Redux core
import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import classnames from "classnames";

// Store & Selectors
import { campaignSelector } from 'Selectors';

// UI & Utilities
import { Col, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";
import SwiperCore, { Autoplay } from "swiper";

// Components & Hooks
import { ImageLarge, SectionBackagroundImage } from "Common/Components";
import usePermission from "Common/Hooks/usePermission";
import Loader from "Common/Components/Components/Loader";

//import Tabs & Widges
import OverviewTab from "./OverviewTab";
import MembersTab from "./MembersTab";
import GuaranteesTab from "./GuaranteesTab";
import AttendeesTab from "./AttendeesTab";
import SortingTab from "./SortingTab";
import ElectorsTab from "./ElectorsTab";
import ActivitiesTab from "./ActivitiesTab";
import EditTab from "./EditTab";


const Section = () => {
  SwiperCore.use([Autoplay]);

  const {
    campaign,
    campaignMembers,
    campaignRoles,
    campaignGuarantees,
    campaignAttendees,
  } = useSelector(campaignSelector);

  // Permissions
  const {
    canChangeCampaign,
    canViewCampaignMember,
    canViewCampaignGuarantee,
    // canViewCampaignAttendees,
  } = usePermission();

  // Tabs
  const tabs = [
    { id: "1", permission: 'canViewCampaign', href: '#overview', icon: 'ri-overview-line', text: 'الملخص' },
    { id: "2", permission: 'canViewCampaignMember', href: '#members', icon: 'ri-list-unordered', text: 'فريق العمل' },
    { id: "3", permission: 'canViewCampaignGuarantee', href: '#guarantees', icon: 'ri-shield-line', text: 'الضمانات' },
    { id: "4", permission: 'canViewCampaignAttendee', href: '#attendees', icon: 'ri-group-line', text: 'الحضور' },
    { id: "5", permission: 'canViewCampaignSorting', href: '#sorting', icon: 'ri-sort-line', text: 'الفرز' },
    { id: "6", permission: 'canViewElector', href: '#electors', icon: 'ri-user-voice-line', text: 'الناخبين' },
    { id: "7", permission: 'canViewActivitie', href: '#activities', icon: 'ri-activity-line', text: 'الأنشطة' },
    { id: "9", permission: 'canViewCampaign', href: '#edit', icon: 'ri-activity-line', text: 'تعديل' },
  ];

  const tabComponents = {
    "1": <OverviewTab />,
    "2": <MembersTab campaignMembers={campaignMembers} />,
    "3": <GuaranteesTab campaignGuarantees={campaignGuarantees} campaignMembers={campaignMembers} />,
    "4": <AttendeesTab />,
    "5": <SortingTab />,
    "6": <ElectorsTab />,
    "7": <ActivitiesTab />,
    "9": <EditTab />,
    // ... add other tabs similarly if they require props
  };

  const permissions = usePermission();

  // Tabs & visibility
  const visibleTabs = useMemo(() => tabs.filter(tab => !!permissions[tab.permission]), [tabs, permissions]);

  const [activeTab, setActiveTab] = useState(visibleTabs[""]?.id || "1");

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  if (!campaign.candidate) {
    return <Loader />;
  }

  return (
    <React.Fragment>
      <SectionBackagroundImage imagePath={campaign.election.image} />
      <div className="pt-4 mb-4 mb-lg-3 pb-lg-2 profile-wrapper">
        <Row className="g-4">
          <div className="col-auto">
            <ImageLarge imagePath={campaign.candidate.image} />
          </div>

          <Col>
            <div className="p-2">
              <h3 className="text-white mb-1">{campaign.candidate.name}</h3>
              <p className="text-white-75">{campaign.election.name}</p>
              <div className="hstack text-white gap-1">
                <div className="me-2">
                  <i className="ri-map-pin-user-line me-1 text-white-75 fs-16 align-middle"></i>
                  التاريخ: <strong >{campaign.election.dueDate}</strong>
                </div>

              </div>

            </div>
          </Col>
          <Col xs={12} className="col-lg-auto order-last order-lg-0">
            <Row className="text text-white-50 text-center">
              {canViewCampaignMember &&
                <Col lg={6} xs={4}>
                  <div className="p-2">
                    <h4 className="text-white mb-1">
                      {campaignMembers?.length || 0}
                    </h4>
                    <p className="fs-14 mb-0">الفريق</p>
                  </div>
                </Col>
              }
              {canViewCampaignGuarantee &&
                <Col lg={6} xs={4}>
                  <div className="p-2">
                    <h4 className="text-white mb-1">
                      {campaignGuarantees?.length || 0}
                    </h4>
                    <p className="fs-14 mb-0">المضامين</p>
                  </div>
                </Col>
              }
              {/* {canViewCampaignAttendees &&
                <Col lg={6} xs={4}>
                  <div className="p-2">
                    <h4 className="text-white mb-1">
                      {campaignAttendees?.length || 0}
                    </h4>
                    <p className="fs-14 mb-0">الحضور</p>
                  </div>
                </Col>
              } */}
            </Row>
          </Col>
        </Row>
      </div>
      <Row>
        <Col lg={12}>
          <div>
            <div className="d-flex profile-wrapper">
              <Nav
                pills
                className="animation-nav profile-nav gap-2 gap-lg-3 flex-grow-1"
                role="tablist"
              >
                {visibleTabs.map((tab) => (
                  <NavItem key={tab.id}>
                    <NavLink
                      href={tab.href}
                      className={classnames({ active: activeTab === tab.id }, "fw-semibold")}
                      onClick={() => toggleTab(tab.id)}
                    >
                      <i className={`${tab.icon} d-inline-block d-md-none`}></i>
                      <span className="d-none d-md-inline-block">{tab.text}</span>
                    </NavLink>
                  </NavItem>
                ))
                }
              </Nav>

              {canChangeCampaign && (
                <NavItem className="btn btn-success">
                  <NavLink
                    href="#edit"
                    className={classnames({ active: activeTab === "9" })}
                    onClick={() => {
                      toggleTab("9");
                    }}
                  >
                    <i className="ri-edit-box-line align-bottom me-2"></i>
                    <span className="d-none d-md-inline-block">
                      تعديل
                    </span>
                  </NavLink>
                </NavItem>
              )}

            </div >
            <TabContent activeTab={activeTab} className="text-muted pt-2">
              {Object.entries(tabComponents).map(([key, component]) => (
                <TabPane tabId={key} key={key}>
                  {component}
                </TabPane>
              ))}
            </TabContent>
          </div >
        </Col >
      </Row >
    </React.Fragment >
  );
};

export default Section;
