import React, { useState } from "react";
import { Link } from "react-router-dom";

import {
  Card,
  CardBody,
  CardFooter,
  Col,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from "reactstrap";
import classnames from "classnames";

//import images
import slack from "../../../assets/images/brands/slack.png";
import ElectionDetailsWidget from "./ElectionDetailsWidget";
import OverviewTab from "./OverviewTab";
import CandidatesTab from "./CandidatesTab";
import CampaignsTab from "./CampaignsTab";
import GuaranteesTab from "./GuaranteesTab";
import AttendeesTab from "./AttendeesTab";
import SortingTab from "./SortingTab";
import ResultsTab from "./ResultsTab";
import ActivitiesTab from "./ActivitiesTab";
import EditTab from "./EditTab";

const Section = ({ candidate, electionCampaigns, Candidates }) => {
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
                            {/* <img
                              src={
                                process.env.REACT_APP_API_URL + candidate.image
                              }
                              alt=""
                              className="avatar-xs"
                            /> */}
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
                        {candidate.status}
                      </div>
                      <div className="badge rounded-pill bg-danger fs-12">
                        {candidate.priority}
                      </div>
                    </div>
                  </div>
                </Row>

 
              </CardBody>
              {activeTab.startsWith("3") && (
                <CardFooter>
                  <Nav
                    className="nav-tabs-custom border-bottom-0"
                    role="tablist"
                  >
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
                        Campaigns
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames(
                          { active: activeTab === "32" },
                          "fw-semibold"
                        )}
                        onClick={() => {
                          toggleTab("32");
                        }}
                        href="#"
                      >
                        Guarantees
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames(
                          { active: activeTab === "33" },
                          "fw-semibold"
                        )}
                        onClick={() => {
                          toggleTab("33");
                        }}
                        href="#"
                      >
                        Attendees
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        className={classnames(
                          { active: activeTab === "34" },
                          "fw-semibold"
                        )}
                        onClick={() => {
                          toggleTab("34");
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
        candidate={candidate}
        Candidates={Candidates}
      />
 
    </React.Fragment>
  );
};

export default Section;
