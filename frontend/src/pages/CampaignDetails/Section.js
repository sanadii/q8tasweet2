// Pages/CampaignDetails/index.js
// React & Redux core
import React, { useState, useMemo } from "react";

// Store & Selectors
import { useSelector } from "react-redux";
import { campaignSelector } from 'selectors';

// UI & Utilities
import { Col, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";
import SwiperCore, { Autoplay } from "swiper";
import classnames from "classnames";

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
// import CandidatesTab from "./CandidatesTab";
import CandidatesTab from "../ElectionDetails/ResultsTab";

import ActivitiesTab from "./ActivitiesTab";
import EditTab from "./EditTab";
import ElectorSearchTab from "../Electors/SearchTab";


const Section = () => {
  SwiperCore.use([Autoplay]);

  const {
    campaign,
    electionDetails,
    campaignMembers,
    campaignRoles,
    campaignGuarantees,
    campaignAttendees,
  } = useSelector(campaignSelector);

  const electionSchema = electionDetails?.slug

  console.log("campaignMembers: ", campaignMembers)
  // Permissions
  const {
    canChangeCampaign,
    canViewCampaignMember,
    canViewCampaignGuarantee,
    // canViewCampaignAttendees,
  } = usePermission();

  const permissions = usePermission();

  // Tabs
  const tabs = useMemo(() => [
    {
      id: 1,
      permission: 'canViewCampaign',
      href: '#overview',
      icon: 'ri-overview-line',
      title: 'الملخص',
      component: <OverviewTab
        campaign={campaign}
        campaignGuarantees={campaignGuarantees}
        campaignMembers={campaignMembers}
      />
    },
    {
      id: 2,
      permission: 'canViewCampaignMember',
      href: '#members',
      icon: 'ri-list-unordered',
      title: 'فريق العمل',
      component: <MembersTab />
    },
    {
      id: 3,
      permission: 'canViewCampaignGuarantee',
      href: '#guarantees',
      icon: 'ri-shield-line',
      title: 'الضمانات',
      component: <GuaranteesTab />
    },
    {
      id: 4,
      permission: 'canViewCampaignAttendee',
      href: '#attendees',
      icon: 'ri-group-line',
      title: 'الحضور',
      component: <AttendeesTab />
    },
    {
      id: 5,
      permission: 'canViewCampaign',
      href: '#candidates',
      icon: 'ri-sort-line',
      title: 'النتائج',
      component: <CandidatesTab />
    },
    // {
    //   id: 5,
    //   permission: 'canViewCampaign',
    //   href: '#sorting',
    //   icon: 'ri-sort-line',
    //   title: 'الفرز',
    //   component: <SortingTab />
    // },
    {
      id: 6,
      permission: 'canViewElector',
      href: '#electors',
      icon: 'ri-user-voice-line',
      title: 'الناخبين',
      component: <ElectorSearchTab electionSchema={electionSchema} />
    },
    // {
    //   id: 7,
    //   permission: 'canViewActivitie',
    //   href: '#activities',
    //   icon: 'ri-activity-line',
    //   title: 'الأنشطة',
    //   component: <ActivitiesTab />
    // },
    {
      id: 9,
      permission: 'canViewCampaign',
      href: '#edit',
      icon: 'ri-edit-line',
      title: 'تعديل',
      component: <EditTab />
    },
  ], [campaignGuarantees, campaignMembers, electionSchema]);


  // Tabs & visibility

  const [activeTab, setActiveTab] = useState(1);
  console.log("activeTab: ", activeTab)
  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  if (!campaign) {
    return <Loader />;
  }

  return (
    <React.Fragment>
      <SectionHeader campaign={campaign} electionDetails={electionDetails} campaignMembers={campaignMembers} campaignGuarantees={campaignGuarantees} />

      <Row>
        <Col lg={12}>
          <div>
            <div className="d-flex profile-wrapper">
              <Nav
                pills
                className="animation-nav profile-nav gap-2 gap-lg-3 flex-grow-1"
                role="tablist"
              >
                {tabs.map((tab) => (
                  <NavItem key={tab.id}>
                    <NavLink
                      href={tab.href}
                      className={classnames({ active: activeTab === tab.id })}
                      onClick={() => toggleTab(tab.id)}
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
              {tabs.filter(tab => activeTab === tab.id).map((tab) => (
                <TabPane tabId={tab.id} key={tab.id}>
                  {tab.component}
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
