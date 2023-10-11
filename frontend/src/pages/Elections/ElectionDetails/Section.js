import React, { useState } from "react";
import { useSelector } from "react-redux";

import { electionSelector, categorySelector } from 'Selectors';

import { ImageMedium } from "../../../Components/Common";
import { Card, CardBody, CardFooter, Col, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";
import classnames from "classnames";

//import images
import ElectionDetailsWidget from "./ElectionDetailsWidget";
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

const Section = () => {

  const { electionDetails, electionCandidates, electionCampaigns, electionCommittees } = useSelector(electionSelector);
  const { categories, subCategories } = useSelector(categorySelector);

  const election = electionDetails;
  const categoryId = election.category; // assuming election object has a categoryId property
  const category = categories.find(cat => cat.id === categoryId);
  const electionCategoryName = category ? category.name : 'Category Not Found';

  //Tab
  const [activeTab, setActiveTab] = useState("1");
  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  const [viewedProfileId, setViewedProfileId] = useState(null);

  const toggleProfileView = (campaignId) => {
    setViewedProfileId(viewedProfileId === campaignId ? null : campaignId);
  };

  // Passing it down to the child component

  const [isProfileView, setIsProfileView] = useState(false);

  return (
    <React.Fragment>
      <Row>
        <Col lg={12}>
          <Card className="mt-n4 mx-n4">
            <div className="bg-soft-warning">
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
                            {election.type}
                          </div>

                          <div className="badge bg-warning fs-12 me-3">
                            {election.votes} صوت
                          </div>

                          <div className="badge bg-warning fs-12 me-3">
                            {election.seats} مقاعد
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
                <Nav className="nav-tabs-custom border-bottom-0" role="tablist">
                  <NavItem>
                    <NavLink
                      className={classnames(
                        { active: activeTab === "1" },
                        "fw-semibold"
                      )}
                      onClick={() => {
                        toggleTab("1");
                      }}
                      href="#"
                    >
                      الملخص
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames(
                        { active: activeTab === "2" },
                        "fw-semibold"
                      )}
                      onClick={() => {
                        toggleTab("2");
                      }}
                      href="#"
                    >
                      المرشحين
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames(
                        { active: activeTab === "3" },
                        "fw-semibold"
                      )}
                      onClick={() => {
                        toggleTab("3");
                      }}
                      href="#"
                    >
                      اللجان
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames(
                        { active: activeTab === "4" },
                        "fw-semibold"
                      )}
                      onClick={() => {
                        toggleTab("4");
                      }}
                      href="#"
                    >
                      الحملات الإنتخابية
                    </NavLink>
                  </NavItem>

                  <NavItem>
                    <NavLink
                      className={classnames(
                        { active: activeTab === "5" },
                        "fw-semibold"
                      )}
                      onClick={() => {
                        toggleTab("5");
                      }}
                      href="#"
                    >
                      النتائج
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames(
                        { active: activeTab === "6" },
                        "fw-semibold"
                      )}
                      onClick={() => {
                        toggleTab("6");
                      }}
                      href="#"
                    >
                      عمليات المستخدم
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames(
                        { active: activeTab === "7" },
                        "fw-semibold"
                      )}
                      onClick={() => {
                        toggleTab("7");
                      }}
                      href="#"
                    >
                      تعديل
                    </NavLink>
                  </NavItem>
                </Nav>
              </CardBody>
              {activeTab.startsWith("4") && (
                <CardFooter>
                  <Nav
                    className="nav-tabs-custom border-bottom-0"
                    role="tablist"
                  >
                    <NavItem>
                      <NavLink
                        className={classnames(
                          { active: activeTab === "4" },
                          "fw-semibold"
                        )}
                        onClick={() => {
                          toggleTab("4");
                        }}
                        href="#"
                      >
                        Campaigns
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames(
                          { active: activeTab === "42" },
                          "fw-semibold"
                        )}
                        onClick={() => {
                          toggleTab("42");
                        }}
                        href="#"
                      >
                        Guarantees
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames(
                          { active: activeTab === "43" },
                          "fw-semibold"
                        )}
                        onClick={() => {
                          toggleTab("43");
                        }}
                        href="#"
                      >
                        Attendees
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames(
                          { active: activeTab === "44" },
                          "fw-semibold"
                        )}
                        onClick={() => {
                          toggleTab("44");
                        }}
                        href="#"
                      >
                        Sorting
                      </NavLink>
                    </NavItem>
                  </Nav>
                </CardFooter>
              )}
            </div>
          </Card>
        </Col>
      </Row>

      <ElectionDetailsWidget
        election={election}
        electionCandidates={electionCandidates}
      />
      <Row>
        <Col lg={12}>
          {viewedProfileId ? (
            <p>The campaign ID is {viewedProfileId}</p>
          ) : (
            <TabContent activeTab={activeTab} className="text-muted">
              <TabPane tabId="1">
                <OverviewTab
                  election={election}
                  electionCandidates={electionCandidates}
                />
              </TabPane>

              <TabPane tabId="2">
                <CandidatesTab
                  electionCandidates={electionCandidates}
                />
              </TabPane>

              <TabPane tabId="3">
                <CommitteesTab
                  electionCommittees={electionCommittees}
                  toggleProfileView={toggleProfileView}
                  viewedProfileId={viewedProfileId}
                />
              </TabPane>

              <TabPane tabId="4">
                <CampaignsTab
                  electionCampaigns={electionCampaigns}
                  toggleProfileView={toggleProfileView}
                  viewedProfileId={viewedProfileId}
                />
              </TabPane>
              <TabPane tabId="42">
                {/* <GuaranteesTab electionCandidates={electionCandidates} /> */}
              </TabPane>
              {/* <TabPane tabId="43">
              <AttendeesTab electionCandidates={electionCandidates} />
            </TabPane> */}
              {/* <TabPane tabId="44">
              <SortingTab electionCandidates={electionCandidates} />
            </TabPane> */}
              {/* <TabPane tabId="5">
                <ResultsTab election={election} />
              </TabPane> */}
              <TabPane tabId="6">
                <ActivitiesTab election={election} />
              </TabPane>
              <TabPane tabId="7">
                <EditTab election={election} />
              </TabPane>
            </TabContent>
          )}
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default Section;
