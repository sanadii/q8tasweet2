// Pages/Campaigns/CampaignDetails/index.js
// React & Redux core
import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import classnames from "classnames";

// Store & Selectors
import { campaignSelector } from 'selectors';

// UI & Utilities
import { Col, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";
import SwiperCore, { Autoplay } from "swiper";

// Components & Hooks
import { usePermission } from 'shared/hooks';
import { Loader } from "shared/components";

//import Tabs & Widges
import SectionHeader from "./SectionHeader"
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
    { tabId: 1, permission: 'canViewCampaign', href: '#overview', icon: 'ri-overview-line', title: 'الملخص' },
    { tabId: 2, permission: 'canViewCampaignMember', href: '#members', icon: 'ri-list-unordered', title: 'فريق العمل' },
    { tabId: 3, permission: 'canViewCampaignGuarantee', href: '#guarantees', icon: 'ri-shield-line', title: 'الضمانات' },
    { tabId: 4, permission: 'canViewCampaignAttendee', href: '#attendees', icon: 'ri-group-line', title: 'الحضور' },
    { tabId: 5, permission: 'canViewCampaign', href: '#sorting', icon: 'ri-sort-line', title: 'الفرز' },
    { tabId: 6, permission: 'canViewElector', href: '#electors', icon: 'ri-user-voice-line', title: 'الناخبين' },
    { tabId: 7, permission: 'canViewActivitie', href: '#activities', icon: 'ri-activity-line', title: 'الأنشطة' },
    { tabId: 9, permission: 'canViewCampaign', href: '#edit', icon: 'ri-activity-line', title: 'تعديل' },
  ];

  const tabComponents = {
    1: <OverviewTab />,
    2: <MembersTab />,
    3: <GuaranteesTab campaignGuarantees={campaignGuarantees} campaignMembers={campaignMembers} />,
    4: <AttendeesTab />,
    5: <SortingTab />,
    6: <ElectorsTab />,
    7: <ActivitiesTab />,
    9: <EditTab />,
    // ... add other tabs similarly if they require props
  };

  const permissions = usePermission();

  // Tabs & visibility
  const visibleTabs = useMemo(() => tabs.filter(tab => !!permissions[tab.permission]), [tabs, permissions]);

  const renderTabContent = (tabId) => {
    return tabComponents[tabId] || null;
  };
  const [activeTab, setActiveTab] = useState(String(visibleTabs[0]?.tabId || 1));

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(String(tab));
    }
  };

  if (!campaign.name) {
    return <Loader />;
  }

  return (
    <React.Fragment>
      <SectionHeader campaign={campaign} campaignMembers={campaignMembers} campaignGuarantees={campaignGuarantees} />

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
                  <NavItem key={tab.tabId}>
                    <NavLink
                      href={tab.href}
                      className={classnames({ active: activeTab === tab.tabId })}
                      onClick={() => toggleTab(tab.tabId)}
                    >
                      <i className={`${tab.icon} d-inline-block d-md-none`}></i>
                      <span className="d-none d-md-inline-block">{tab.title}</span>
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
            <TabContent activeTab={activeTab} className="pt-4">
              {tabs.map(tab => (
                <TabPane key={tab.tabId} tabId={String(tab.tabId)}>
                  {activeTab === String(tab.tabId) && renderTabContent(tab.tabId)}
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
