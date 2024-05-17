import React, { useState } from "react";

// Store & Selectors
import { useSelector } from "react-redux";
import { electionSelector, categorySelector } from 'selectors';

// Shared hooks
import { usePermission } from "shared/hooks"

// Import Tabs & Widgets
import SectionHeader from "./SectionHeader";
import OverviewTab from "./OverviewTab";
import StatisticsTab from "./StatisticsTab";
import ElectorSearchTab from "./ElectorSearchTab";
import ElectionDetailsWidget from "./OverviewTab/ElectionDetailsWidget";
import CandidatesTab from "./CandidatesTab";
import CampaignsTab from "./CampaignsTab";
import CommitteesTab from "./CommitteesTab";
import GuaranteesTab from "./GuaranteesTab";
import AttendeesTab from "./AttendeesTab";
// import SortingTab from "./SortingTab";
import EditResultsTab from "./EditTab/EditResultsTab";
import ActivitiesTab from "./ActivitiesTab";
import EditTab from "./EditTab/EditElectionTab";

// UI & Utilities
import { Col, Nav, NavItem, NavLink, Row, TabContent, TabPane, UncontrolledDropdown, Dropdown, DropdownMenu, DropdownToggle, DropdownItem } from "reactstrap";
import { Link } from "react-router-dom";
import classnames from "classnames";

const NavTabs = ({ tabs, activeTab, toggleTab }) => (
  <Nav
    pills
    className="animation-nav profile-nav gap-2 gap-lg-3 flex-grow-1"
    role="tablist"
  >
    {tabs.filter(Boolean).map((tab) => (
      <NavItem key={tab.id}>
        <NavLink
          className={classnames({ active: activeTab === tab.id }, "fw-semibold")}
          onClick={() => toggleTab(tab.id)}
          href="#"
        >
          <i className={`${tab.icon} d-inline-block d-md-none`}></i>
          <span className="d-none d-md-inline-block">{tab.title}</span>
        </NavLink>
      </NavItem>
    ))}
  </Nav>
);

const EditDropDownMenu = ({ mainButtons, toggleTab }) => {

  const [settings_Menu, setSettings_Menu] = useState(false);

  const toggleSettings = () => {
    setSettings_Menu(!settings_Menu);
  };

  return (
    <UncontrolledDropdown>
      <DropdownToggle
        href="#"
        className="btn btn-info btn-sm dropdown"
        tag="button"
      >
        <i className="ri-edit-fill align-middle pe-2"></i>
        تعديل

      </DropdownToggle>
      <DropdownMenu className="dropdown-menu-end">
        {mainButtons.map((button) => (
          <DropdownItem
            href="#"
            key={button.id}
            onClick={() => toggleTab(button.id)}
            className="dropdown-item"
          >
            <i className={`ri ${button.icon} align-bottom text-muted me-2`}></i>
            {button.title}
          </DropdownItem>
        ))}
      </DropdownMenu>

    </UncontrolledDropdown>
  );
};

const Section = ({ viewType }) => {
  // State for collapsible menus
  const [isCurrentState, setIsCurrentState] = useState("Dashboard");

  const {
    isActive,
    canChangeConfig,
    canViewCampaign,
    isContributor,
    isModerator,
    isSubscriber
  } = usePermission();

  const { election, electionCandidates, electionCampaigns, electionCommitteeSites } = useSelector(electionSelector);
  const { categories } = useSelector(categorySelector);
  const categoryId = election.category;
  const category = categories.find(cat => cat.id === categoryId);
  const electionMethod = election.electionMethod

  const electionCategoryName = category ? category.name : 'Category Not Found';

  const tabs = [
    {
      type: "mainTab",
      items: [
        {
          id: "1",
          href: '#electionOverview',
          icon: 'ri-activity-line',
          title: "المرشحين والنتائج",
          component: <OverviewTab />
        },
        {
          id: "2",
          href: '#electionStatistics',
          icon: 'ri-activity-line',
          title: "الناخبين - احصائيات",
          component: <StatisticsTab />
        },
        {
          id: "3",
          href: '#electionSearchTab',
          icon: 'ri-activity-line',
          title: "الناخبين - بحث",
          component: <ElectorSearchTab />
        },

        ...(election.electionResultView !== "total" ? [
          {
            id: "5",
            title: "اللجان الانتخابية",
            icon: 'ri-activity-line',
            component: <CommitteesTab />,
          }
        ] : []),
        //   ...(electionCampaigns.length !== 0 ? [{ id: "4", title: "الحملات الإنتخابية", icon: 'ri-activity-line' }] : [])
        // ] : []),
        // {
        //   id: "6",
        //   title: "النتائج التفصيلية",
        //   icon: 'ri-activity-line',
        //   component: <EditResultsTab />
        // },
        // { 
        //   id: "6",
        //    title: "عمليات المستخدم", 
        //    icon: 'ri-activity-line',
        //   component: <ActivitiesTab />
        //  },
        // { id: "7", title: "تعديل", icon: 'ri-activity-line', }
      ]
    },
    {
      type: "campaignTab",
      items: [
        {
          id: "4",
          title: "Campaigns",
          icon: 'ri-activity-line',
          component: <CampaignsTab />,
        },
        {
          id: "42",
          title: "Guarantees",
          icon: 'ri-activity-line',
          component: <GuaranteesTab electionCandidates={electionCandidates} />,
        },
        {
          id: "43",
          title: "Attendees",
          icon: 'ri-activity-line',
          component: <AttendeesTab electionCandidates={electionCandidates} />,
        },
        {
          id: "44",
          title: "Sorting",
          icon: 'ri-activity-line',
          // component: <SortingTab electionCandidates={electionCandidates} />,

        },
        // {
        //   id: "45",
        //   title: "Sorting",
        //   icon: 'ri-activity-line',
        //   component: <EditResultsTab />,
        // }
      ]
    },
    {
      type: "mainButton",
      items: [
        {
          id: "91",
          title: "الانتخابات",
          color: "info",
          icon: 'ri-activity-line',
          component: <EditTab />,
        },
        {
          id: "92",
          type: "button",
          title: election.electionMethod === "candidateOnly" ? "المرشحين" : "القوائم والمرشحين",
          color: "primary",
          icon: 'ri-activity-line',
          component: <CandidatesTab />
        },
        {
          id: "93",
          type: "button",
          title: "النتائج",
          color: "primary",
          icon: 'ri-activity-line',
          component: <EditResultsTab />,
        },

      ]
    }
  ];

  const [activeTab, setActiveTab] = useState("1");
  const mainTabs = tabs.find(tab => tab.type === "mainTab")?.items || [];
  const campaignTabs = tabs.find(tab => tab.type === "campaignTab")?.items || [];
  const mainButtons = tabs.find(tab => tab.type === "mainButton")?.items || [];

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  return (
    <React.Fragment>
      <SectionHeader />
      <Row>
        <Col lg={12}>
          <div className="d-flex profile-wrapper">
            <NavTabs tabs={mainTabs} activeTab={activeTab} toggleTab={toggleTab} />
            <div className="flex-shrink-0">
              <EditDropDownMenu mainButtons={mainButtons} toggleTab={toggleTab} />
            </div>
          </div>

          {activeTab.startsWith("4") && (
            <Row>
              <NavTabs tabs={campaignTabs} activeTab={activeTab} toggleTab={toggleTab} />
            </Row>
          )}

          <TabContent activeTab={activeTab} className="pt-4">
            {mainTabs.concat(campaignTabs).concat(mainButtons).filter(tab => activeTab === tab.id).map((tab) => (
              <TabPane tabId={tab.id} key={tab.id}>
                {tab.component}
              </TabPane>
            ))}
          </TabContent>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default Section;