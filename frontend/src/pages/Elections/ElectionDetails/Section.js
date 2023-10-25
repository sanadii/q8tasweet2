// Pages/Elections/ElectionDetails/index.js
// React & Redux core
import React, { useState } from "react";
import { useSelector } from "react-redux";

// Store & Selectors
import { electionSelector, categorySelector } from 'Selectors';

// Components & Hooks
import { ImageMedium } from "Common/Components";

// UI & Utilities
import { Card, CardBody, CardFooter, Col, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";
import classnames from "classnames";

//import Tabs & Widges
import ElectionDetailsWidget from "./OverviewTab/ElectionDetailsWidget";
import OverviewTab from "./OverviewTab";
import CandidatesTab from "./CandidatesTab";
import CampaignsTab from "./CampaignsTab";
import CommitteesTab from "./CommitteesTab";
import GuaranteesTab from "./GuaranteesTab";
import AttendeesTab from "./AttendeesTab";
import SortingTab from "./SortingTab";
// import ResultsTab from "./ResultsTab";
import ActivitiesTab from "./ActivitiesTab";
import EditTab from "./EditTab";



const NavTabs = ({ tabs, activeTab, toggleTab }) => (
  <Nav className="nav-tabs-custom border-bottom-0" role="tablist">
    {tabs.filter(Boolean).map((tab) => (  // Filter out falsy values before mapping
      <NavItem key={tab.id}>
        <NavLink
          className={classnames({ active: activeTab === tab.id }, "fw-semibold")}
          onClick={() => toggleTab(tab.id)}
          href="#"
        >
          {tab.title}
        </NavLink>
      </NavItem>
    ))}
  </Nav>
);



const Section = () => {

  const { electionDetails, electionCandidates, electionCampaigns, electionCommittees } = useSelector(electionSelector);
  const { categories } = useSelector(categorySelector);

  const election = electionDetails;
  const categoryId = election.category; // assuming election object has a categoryId property
  const category = categories.find(cat => cat.id === categoryId);
  const electionCategoryName = category ? category.name : 'Category Not Found';

  const mainTabs = [
    { id: "1", title: "الملخص" },
    { id: "2", title: "المرشحين" },
    ...(election.electionResult === 2 ? [{ id: "3", title: "اللجان" }] : []),
    ...(electionCampaigns.length !== 0 ? [{ id: "4", title: "الحملات الإنتخابية" }] : []),
    { id: "5", title: "الفرز" },
    // { id: "6", title: "عمليات المستخدم" },
    { id: "7", title: "تعديل" }
  ];

  const campaignTabs = [
    { id: "4", title: "Campaigns" },
    { id: "42", title: "Guarantees" },
    { id: "43", title: "Attendees" },
    { id: "44", title: "Sorting" },
  ];

  const tabComponents = {
    "1": <OverviewTab />,
    "2": <CandidatesTab />,
    "3": <CommitteesTab />,
    "4": <CampaignsTab />,
    // "42": <GuaranteesTab electionCandidates={electionCandidates} />,
    // "43": <AttendeesTab electionCandidates={electionCandidates} />,
    // "44": <SortingTab electionCandidates={electionCandidates} />,
    // "5": <ResultsTab />,
    // "6": <ActivitiesTab />,
    "7": <EditTab />,
  };

  //Tab
  const [activeTab, setActiveTab] = useState("1");
  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  return (
    <React.Fragment>
      <Row>
        <Col lg={12}>
          <Card className="mt-n4 mx-n4">
            <div className="bg-soft-info">
              <CardBody className="pb-0 px-4">
                <Row className="mb-3">
                  <div className="col-md">
                    <Row className="align-items-center g-3">
                      <div className="col-md-auto">
                        <div className="avatar-md">
                          <div className="avatar-title bg-white rounded-circle">
                            <ImageMedium
                              imagePath={election.image}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-md">
                        <div>
                          <h4 className="fw-bold">
                            {election.name}
                          </h4>
                          <div className="hstack gap-3 flex-wrap">
                            <div>
                              <i className="ri-building-line align-bottom me-1"></i>
                              {electionCategoryName}
                            </div>
                            <div className="vr"></div>
                            <div>
                              يوم الإقتراع: &nbsp;
                              <span className="fw-medium">
                                <strong>
                                  {election.dueDate}
                                </strong>
                              </span>
                            </div>
                            <div className="vr"></div>
                            <div>
                              الرمز: &nbsp;
                              <span className="fw-medium">
                                <strong>
                                  {election.id}
                                </strong>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="badge bg-danger fs-12 me-3">
                            {election.electType}
                          </div>

                          <div className="badge bg-warning fs-12 me-3">
                            {election.electVotes} صوت
                          </div>

                          <div className="badge bg-warning fs-12 me-3">
                            {election.electSeats} مقاعد
                          </div>
                        </div>
                      </div>
                    </Row>


                  </div>
                  <div className="col-md-auto">
                    <div className="hstack gap-1 flex-wrap">
                      <button
                        type="button"
                        className="btn py-0 fs-16 favourite-btn active"
                      >
                        <i className="ri-star-fill"></i>
                      </button>
                      <button
                        type="button"
                        className="btn py-0 fs-16 text-body"
                      >
                        <i className="ri-share-line"></i>
                      </button>
                      <button
                        type="button"
                        className="btn py-0 fs-16 text-body"
                      >
                        <i className="ri-flag-line"></i>
                      </button>
                    </div>
                    <div className="hstack gap-3 flex-wrap">
                      <div className="badge rounded-pill bg-info fs-12">
                        {election.status}
                      </div>
                      <div className="badge rounded-pill bg-danger fs-12">
                        {election.priority}
                      </div>
                    </div>
                  </div>
                </Row>
              </CardBody>
              <NavTabs tabs={mainTabs} activeTab={activeTab} toggleTab={toggleTab} />
              {activeTab.startsWith("4") && (
                <CardFooter>
                  <NavTabs tabs={campaignTabs} activeTab={activeTab} toggleTab={toggleTab} />
                </CardFooter>
              )}
            </div>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <TabContent activeTab={activeTab} className="text-muted">
            {Object.entries(tabComponents).map(([key, component]) => (
              <TabPane tabId={key} key={key}>
                {component}
              </TabPane>
            ))}
          </TabContent>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default Section;
