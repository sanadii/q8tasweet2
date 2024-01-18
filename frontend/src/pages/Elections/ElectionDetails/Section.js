import React, { useState } from "react";
import { useSelector } from "react-redux";

// Store & Selectors
import { electionSelector, categorySelector } from 'Selectors';

// UI & Utilities
import { Col, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";
import { Link } from "react-router-dom";
import classnames from "classnames";

//import Tabs & Widges
import SectionHeader from "./SectionHeader";
import ElectionDetailsWidget from "./OverviewTab/ElectionDetailsWidget";
import OverviewTab from "./OverviewTab";
import CandidatesTab from "./CandidatesTab";
import CampaignsTab from "./CampaignsTab";
import CommitteesTab from "./CommitteesTab";
import GuaranteesTab from "./GuaranteesTab";
import AttendeesTab from "./AttendeesTab";
// import SortingTab from "./SortingTab";
import ResultsTab from "./ResultsTab";
import ActivitiesTab from "./ActivitiesTab";
import EditTab from "./EditTab";


const NavTabs = ({ tabs, activeTab, toggleTab }) => (
  <Nav
    pills
    className="animation-nav profile-nav gap-2 gap-lg-3 flex-grow-1"
    role="tablist"
  >
    {tabs.filter(Boolean).map((tab) => (  // Filter out falsy values before mapping
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
  const { election, electionCandidates, electionCampaigns, electionCommittees } = useSelector(electionSelector);
  const { categories } = useSelector(categorySelector);
  const categoryId = election.category; // assuming election object has a categoryId property
  const category = categories.find(cat => cat.id === categoryId);
  const electionMethod = election.electionMethod

  console.log('election tpe:', electionMethod)
  const electionCategoryName = category ? category.name : 'Category Not Found';

  const mainTabs = [
    { id: "1", title: "المرشحين والنتائج", icon: 'ri-activity-line', },
    // ...(election.electionResultView === "total" ? [{ id: "3", title: "اللجان", icon: 'ri-activity-line', }] : []),
    // ...(electionCampaigns.length !== 0 ? [{ id: "4", title: "الحملات الإنتخابية", icon: 'ri-activity-line', }] : []),
    // { id: "5", title: "النتائج التفصيلية", icon: 'ri-activity-line', },
    // { id: "6", title: "عمليات المستخدم", icon: 'ri-activity-line', },
    // { id: "7", title: "تعديل", icon: 'ri-activity-line', }
  ];

  console.log("viewType: ", viewType)
  // Conditionally add tabs based on viewType and other conditions
  if (viewType !== 'public') {
    // Check the electionMethod and set the title accordingly
    const candidatesTitle = election.electionMethod !== "candidateOnly" ? "القوائم والمرشحين" : "المرشحين";
    mainTabs.push({ id: "2", title: candidatesTitle, icon: 'ri-activity-line' });

    if (election.electionResultView !== "total") {
      mainTabs.push({ id: "3", title: "اللجان", icon: 'ri-activity-line' });
    }
    if (electionCampaigns.length !== 0) {
      mainTabs.push({ id: "4", title: "الحملات الإنتخابية", icon: 'ri-activity-line' });
    }
  }


  const mainButtons = [
    { id: "8", title: "تحديث النتائج", color: "primary", icon: 'ri-activity-line', },
    { id: "9", title: "تعديل", color: "info", icon: 'ri-activity-line', },
  ];

  const campaignTabs = [
    { id: "4", title: "Campaigns", icon: 'ri-activity-line', },
    { id: "42", title: "Guarantees", icon: 'ri-activity-line', },
    { id: "43", title: "Attendees", icon: 'ri-activity-line', },
    { id: "44", title: "Sorting", icon: 'ri-activity-line', },
  ];


  const [activeTab, setActiveTab] = useState("1");

  const tabComponents = {
    "1": <OverviewTab />,
    "2": <CandidatesTab setActiveTab={setActiveTab} />,
    "3": <CommitteesTab />,
    "4": <CampaignsTab />,
    // "42": <GuaranteesTab electionCandidates={electionCandidates} />,
    // "43": <AttendeesTab electionCandidates={electionCandidates} />,
    // "44": <SortingTab electionCandidates={electionCandidates} />,
    // "5": <ResultsTab />,
    // "6": <ActivitiesTab />,
    "8": <ResultsTab />,
    "9": <EditTab />,
  };

  const electionName = election.name;
  const electionImage = election.image;
  const electionStatus = election.task?.status || 0;
  const electionPriority = election.task?.priority || 0;

  //Tab
  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };
  return (
    <React.Fragment>
      <SectionHeader />
      <Row> {/* NavTab  */}
        <Col lg={12}>
          <div className="d-flex profile-wrapper">
            <NavTabs tabs={mainTabs} activeTab={activeTab} toggleTab={toggleTab} />
            <div className="flex-shrink-0">
              {mainButtons.filter(Boolean).map((button) => (  // Filter out falsy values before mapping
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
            {Object.entries(tabComponents).map(([key, component]) => (
              <TabPane tabId={key} key={key}>
                {component}
              </TabPane>
            ))}
          </TabContent>
        </Col >
      </Row >
    </React.Fragment >
  );
};

export default Section;
