// React & Redux core
import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import classnames from "classnames";

// Store & Selectors
import { electionsSelector } from '../../../Selectors/electionsSelector';

// UI & Utilities
import { Col, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";
import SwiperCore, { Autoplay } from "swiper";

// Components & Hooks
import { AvatarMedium, ImageCampaignBackground } from "../../../Components/Common";
import { MemberRankOptions } from "../../../Components/constants";
import useCampaignPermission from "../../../Components/Hooks/useCampaignPermission";

// Tabs
import OverviewTab from "./OverviewTab";
import MembersTab from "./MembersTab";
import GuaranteesTab from "./GuaranteesTab";
import AttendeesTab from "./AttendeesTab";
import SortingTab from "./SortingTab";
import ElectorsTab from "./ElectorsTab";
import ActivitiesTab from "./ActivitiesTab";
import EditTab from "./EditTab";

// const Section = ({ campaign, campaignCandidateList }) => {
const Section = () => {
  SwiperCore.use([Autoplay]);

  const {
    campaign,
    currentCampaignMember,
    campaignMembers,
    campaignGuarantees,
    campaignElectionCommittees,
    isCampaignSuccess
  } = useSelector(electionsSelector);

  // Permissions
  const { isAdmin, isContributor, isModerator, hasPermission } = useCampaignPermission();

  // Tabs
  const tabs = [
    { tabId: 1, permission: 'canViewCampaign', href: '#overview', icon: 'ri-overview-line', text: 'نظرة عامة' },
    { tabId: 2, permission: 'canViewCampaignMember', href: '#members', icon: 'ri-list-unordered', text: 'فريق العمل' },
    { tabId: 3, permission: 'canViewCampaignGuarantee', href: '#guarantees', icon: 'ri-shield-line', text: 'الضمانات' },
    { tabId: 4, permission: 'canViewCampaignAttendee', href: '#attendees', icon: 'ri-group-line', text: 'الحضور' },
    { tabId: 5, permission: 'canViewCampaignSorting', href: '#sorting', icon: 'ri-sort-line', text: 'الفرز' },
    { tabId: 6, permission: 'canViewElector', href: '#electors', icon: 'ri-user-voice-line', text: 'الناخبين' },
    { tabId: 7, permission: 'canViewActivitie', href: '#activities', icon: 'ri-activity-line', text: 'الأنشطة' },
    { tabId: 9, permission: 'canViewCampaign', href: '#edit', icon: 'ri-activity-line', text: 'تعديل' },
  ];

  const tabComponents = {
    1: <OverviewTab />,
    2: <MembersTab campaignMembers={campaignMembers} />,
    3: <GuaranteesTab campaignGuarantees={campaignGuarantees} campaignMembers={campaignMembers} />,
    4: <AttendeesTab />,
    5: <SortingTab />,
    6: <ElectorsTab />,
    7: <ActivitiesTab />,
    9: <EditTab />,
    // ... add other tabs similarly if they require props
  };

  const visibleTabs = useMemo(() => tabs.filter(tab => hasPermission(tab.permission)), [tabs, hasPermission]);

  const renderTabContent = (tabId) => {
    console.log(`Trying to render content for tab: ${tabId}`);
    return tabComponents[tabId] || null;
  };

  // Constants
  const [activeTab, setActiveTab] = useState(String(visibleTabs[0]?.tabId || 1));

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(String(tab));
    }
  };

  useEffect(() => {
    console.log('Active tab:', activeTab);
  }, [activeTab]);

  return (
    <React.Fragment>
      <ImageCampaignBackground imagePath={campaign?.election?.image} />
      <div className="pt-4 mb-4 mb-lg-3 pb-lg-4 profile-wrapper">
        <Row className="g-4">
          <div className="col-auto">
            <AvatarMedium imagePath={campaign?.candidate?.image} />
          </div>

          <Col>
            <div className="p-2">
              <h3 className="text-white mb-1">{campaign.candidate.name}</h3>
              <p className="text-white-75">{campaign.election.name}</p>
              <div className="hstack text-white gap-1">
                <div className="me-2">
                  <i className="ri-map-pin-user-line me-1 text-white-75 fs-16 align-middle"></i>
                  التاريخ: <strong >{campaign.election.duedate}</strong>
                </div>
              </div>
            </div>
          </Col>
          <Col xs={12} className="col-lg-auto order-last order-lg-0">
            <Row className="text text-white-50 text-center">
              <Col lg={6} xs={4}>
                <div className="p-2">
                <h4 className="text-white mb-1">
                  {campaignMembers?.length || 0}
                  </h4>
                  <p className="fs-14 mb-0">الفريق</p>
                </div>
              </Col>
              <Col lg={6} xs={4}>
                <div className="p-2">
                  <h4 className="text-white mb-1">
                    {campaignGuarantees?.length || 0}
                  </h4>
                  <p className="fs-14 mb-0">المضامين</p>
                </div>
              </Col>
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
                  <NavItem key={tab.tabId}>
                    <NavLink
                      href={tab.href}
                      className={classnames({ active: activeTab === tab.tabId })}
                      onClick={() => toggleTab(tab.tabId)}
                    >
                      <i className={`${tab.icon} d-inline-block d-md-none`}></i>
                      <span className="d-none d-md-inline-block">{tab.text}</span>
                    </NavLink>
                  </NavItem>
                ))
                }
              </Nav>

              {isAdmin && (
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
