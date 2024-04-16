import React, { useState } from "react";

// Store & Selectors
import { useSelector } from "react-redux";
import { electionSelector, categorySelector } from 'selectors';

// Shared hooks
import { usePermission } from "shared/hooks"

//import Tabs & Widges
import SectionHeader from "./SectionHeader";
import OverviewTab from "./OverviewTab";
import StatisticsTab from "./StatisticsTab";

import ElectionDetailsWidget from "./OverviewTab/ElectionDetailsWidget";
import CandidatesTab from "./CandidatesTab";
import CampaignsTab from "./CampaignsTab";
import CommitteesTab from "./CommitteesTab";
import GuaranteesTab from "./GuaranteesTab";
import AttendeesTab from "./AttendeesTab";
// import SortingTab from "./SortingTab";
import ResultsTab from "./ResultsTab";
import ActivitiesTab from "./ActivitiesTab";
import EditTab from "./EditTab";

// UI & Utilities
import { Col, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";
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

const Section = ({ viewType }) => {
  //state for collapsable menus
  const [isCurrentState, setIsCurrentState] = useState("Dashboard");

  const {
    isActive,
    canChangeConfig,
    canViewCampaign,
    isContributor,
    isModerator,
    isSubscriber
  } = usePermission();

  const { election, electionCandidates, electionCampaigns, electionCommittees } = useSelector(electionSelector);
  const { categories } = useSelector(categorySelector);
  const categoryId = election.category;
  const category = categories.find(cat => cat.id === categoryId);
  const electionMethod = election.electionMethod

  const electionCategoryName = category ? category.name : 'Category Not Found';


  // get Election Statistics if isStaff
  // useEffect () = {
  //   if isStaff {
  //     dispatchEvent(getElectionStatistics)
  //   }
  // }

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
          title: "احصائيات",
          component: <StatisticsTab />
        },

        // ...(viewType !== 'public' ? [
        //   {
        //     id: "2",
        //     title: election.electionMethod !== "candidateOnly" ? "القوائم والمرشحين" : "المرشحين",
        //     icon: 'ri-activity-line'
        // component: <CandidatesTab setActiveTab={setActiveTab} />
        //   },
        ...(election.electionResultView !== "total" ? [
          {
            id: "3",
            title: "اللجان",
            icon: 'ri-activity-line',
            component: <CommitteesTab />,
          }
        ] : []),
        //   ...(electionCampaigns.length !== 0 ? [{ id: "4", title: "الحملات الإنتخابية", icon: 'ri-activity-line' }] : [])
        // ] : []),
        // {
        // id: "5",
        // title: "النتائج التفصيلية",
        // icon: 'ri-activity-line', 
        // component: <ResultsTab/>

        //   },
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
        {
          id: "45",
          title: "Sorting",
          icon: 'ri-activity-line',
          component: <ResultsTab />,
        }
      ]
    },
    {
      type: "mainButton",
      items: [
        {
          id: "91",
          type: "button",
          title: "تحديث النتائج",
          color: "primary",
          icon: 'ri-activity-line',
          component: <ResultsTab />,
        },
        {
          id: "92",
          title: "تعديل",
          color: "info",
          icon: 'ri-activity-line',
          component: <EditTab />,
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
              {mainButtons.filter(Boolean).map((button) => (
                <Link
                  key={button.id}
                  className={`btn btn-${button.color} me-2 `}
                  onClick={() => toggleTab(button.id)}
                >
                  <i className="ri-edit-box-line align-bottom"></i>{button.title}
                </Link>
              ))}
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
