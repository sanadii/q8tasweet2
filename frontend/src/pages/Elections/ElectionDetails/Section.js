import React, { useState } from "react";
import { useSelector } from "react-redux";

// Store & Selectors
import { electionSelector, categorySelector } from 'Selectors';

// Components & Hooks
import { ImageMedium } from "Common/Components";
import { ImageLarge, SectionBackagroundImage } from "Common/Components";
import { StatusBadge, PriorityBadge } from "Common/Constants";

// UI & Utilities
import { Card, CardBody, CardFooter, Col, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";
import { Link } from "react-router-dom";
import classnames from "classnames";

//import Tabs & Widges
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


const Section = () => {
  const { election, electionCandidates, electionCampaigns, electionCommittees } = useSelector(electionSelector);
  const { categories } = useSelector(categorySelector);

  const categoryId = election.category; // assuming election object has a categoryId property
  const category = categories.find(cat => cat.id === categoryId);
  const electionCategoryName = category ? category.name : 'Category Not Found';

  const mainTabs = [
    { id: "1", title: "الملخص", icon: 'ri-activity-line', },
    { id: "2", title: "المرشحين", icon: 'ri-activity-line', },
    ...(election.electResult === 2 ? [{ id: "3", title: "اللجان", icon: 'ri-activity-line', }] : []),
    ...(electionCampaigns.length !== 0 ? [{ id: "4", title: "الحملات الإنتخابية", icon: 'ri-activity-line', }] : []),
    // { id: "5", title: "النتائج التفصيلية", icon: 'ri-activity-line', },
    // { id: "6", title: "عمليات المستخدم", icon: 'ri-activity-line', },
    // { id: "7", title: "تعديل", icon: 'ri-activity-line', }
  ];

  const mainButtons = [
    { id: "8", title: "تحديث النتائج", color: "primary",icon: 'ri-activity-line', },
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
      <SectionBackagroundImage imagePath={electionImage} />
      <div className="pt-4 mb-4 mb-lg-3 pb-lg-2 profile-wrapper">
        <Row className="g-4">
          <div className="col-auto">
            <ImageMedium imagePath={electionImage} />
          </div>
          <Col>
            <div className="p-2">
              <h3 className="text-white mb-1">{electionName}</h3>
              {/* <p className="text-white-75">{campaign.election.name}</p> */}
              <div className="hstack text-white gap-1">
                <div className="me-2">
                  <i className="ri-map-pin-user-line me-1 text-white-75 fs-16 align-middle"></i>
                  التاريخ: <strong >{election.dueDate}</strong>
                </div>
                <div className="me-2">
                  <i className="ri-map-pin-user-line me-1 text-white-75 fs-16 align-middle"></i>
                  الرمز: <strong >{election.id}</strong>
                </div>
              </div>
            </div>
            <div className="col-md-auto">
              <div className="hstack gap-3 flex-wrap">
                <StatusBadge status={electionStatus} />
                <PriorityBadge priority={electionPriority} />
              </div>
            </div>
          </Col>
          <Col xs={12} className="col-lg-auto order-last order-lg-0">
            <Row className="text text-white-50 text-center">
              <Col lg={6} xs={6}>
                <div className="p-2">
                  <h4 className="text-white mb-1">
                    {electionCandidates?.length || 0}
                  </h4>
                  <p className="fs-14 mb-0">المرشحين</p>
                </div>
              </Col>
              <Col lg={6} xs={6}>
                <div className="p-2">
                  <h4 className="text-white mb-1">
                    {election.electSeats || 0}
                  </h4>
                  <p className="fs-14 mb-0">المقاعد</p>
                </div>
              </Col>
            </Row>
            {/* <Row>
              <div className="col-md-auto">
                <div className="hstack gap-1 flex-wrap">
                  <button type="button" className="btn py-0 fs-16 text-white">
                    <i className="ri-star-fill"></i>
                  </button>
                  <button type="button" className="btn py-0 fs-16 text-white">
                    <i className="ri-share-line"></i>
                  </button>
                  <button type="button" className="btn py-0 fs-16 text-white">
                    <i className="ri-flag-line"></i>
                  </button>
                </div>
              </div>
            </Row> */}
          </Col>
        </Row>
      </div>
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
