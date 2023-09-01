import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  TabContent,
  Table,
  UncontrolledCollapse,
} from "reactstrap";
import { MemberRankOptions } from "../../../Components/constants";

//Images
import avatar2 from "../../../assets/images/users/avatar-2.jpg";
import avatar5 from "../../../assets/images/users/avatar-5.jpg";
import avatar7 from "../../../assets/images/users/avatar-7.jpg";

const OverviewTab = () => {
  const {
    campaignDetails,
    currentCampaignMember,
    campaignMembers,
    campaignGuarantees,
    campaignAttendees,
    electionCommittees,
    electionCandidates,
  } = useSelector((state) => ({
    currentCampaignMember: state.Campaigns.currentCampaignMember,
    campaignDetails: state.Campaigns.campaignDetails,
    campaignMembers: state.Campaigns.campaignMembers,
    campaignGuarantees: state.Campaigns.campaignGuarantees,
    campaignAttendees: state.Campaigns.campaignAttendees,
    electionCandidates: state.Campaigns.electionCandidates,
    electionCommittees: state.Campaigns.electionCommittees,
  }));

  document.title = "Campaign Overview | Q8Tasweet";

  const committeeObj = electionCommittees.find(
    (committee) => committee.id === currentCampaignMember.committee
  );
  const committeeName = committeeObj ? committeeObj.name : "Unknown";

  const rankObj = MemberRankOptions.find(
    (rank) => rank.id === currentCampaignMember.rank
  );
  const rankName = rankObj ? rankObj.name : "Unknown";


  return (
    <React.Fragment>
      <Row>
        <Col lg={3}>
          {/* <Card>
            <CardBody>
              <h5 className="card-title mb-5">Complete Your Profile</h5>
              <Progress
                value={30}
                color="danger"
                className="animated-progess custom-progress progress-label"
              >
                <div className="label">30%</div>{" "}
              </Progress>
            </CardBody>
          </Card> */}

          <Card>
            <CardBody>
              <h5 className="card-title mb-3">Member Info</h5>
              <ul>
                <li><i className="ri-barcode-line"></i> {currentCampaignMember.id}</li>
                <li><i className="ri-user-line"></i> {currentCampaignMember.fullName}</li>
                <li><i className="ri-badge-line"></i> {rankName}</li>
                <li><i className="ri-group-line"></i> {committeeName}</li>
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h5 className="card-title mb-3"><strong>Election Info</strong></h5>
              <ul>
                <li><i className="ri-barcode-line"></i> {campaignDetails.election.id}</li>
                <li><i className="ri-file-text-line"></i> {campaignDetails.election.name}</li>
                <li><i className="ri-user-3-line"></i> {electionCandidates.length} Candidates</li>
                <li><i className="ri-seat-line"></i> {campaignDetails.election.seats} Seats</li>
                <li><i className="ri-ballot-line"></i> {campaignDetails.election.votes} Votes</li>
                <li><i className="ri-building-2-line"></i> {electionCommittees.length} Committees</li>
              </ul>
            </CardBody>
          </Card>


        </Col>
        <Col lg={9}>
          <Card>
            <CardBody>
              <h5 className="card-title mb-3">About</h5>
              {campaignDetails.candidate.description}
              <Row>
                <Col xs={6} md={4}>
                  <div className="d-flex mt-4">
                    <div className="flex-shrink-0 avatar-xs align-self-center me-3">
                      <div className="avatar-title bg-light rounded-circle fs-16 text-primary">
                        <i className="ri-user-2-fill"></i>
                      </div>
                    </div>
                    <div className="flex-grow-1 overflow-hidden">
                      <p className="mb-1">Candidate :</p>
                      <h6 className="text-truncate mb-0">
                        {campaignDetails.candidate.name}
                      </h6>
                    </div>
                  </div>
                </Col>

                <Col xs={6} md={4}>
                  <div className="d-flex mt-4">
                    <div className="flex-shrink-0 avatar-xs align-self-center me-3">
                      <div className="avatar-title bg-light rounded-circle fs-16 text-primary">
                        <i className="ri-global-line"></i>
                      </div>
                    </div>
                    <div className="flex-grow-1 overflow-hidden">
                      <p className="mb-1">Website :</p>
                      <Link to="#" className="fw-semibold">
                        www.Q8Tasweet.com
                      </Link>
                    </div>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>

          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader className="align-items-center d-flex">
                  <h4 className="card-title mb-0  me-2">Notifications</h4>
                </CardHeader>
                <CardBody>
                  <TabContent className="text-muted">
                    <div className="profile-timeline">
                      <div></div>
                      <div
                        className="accordion accordion-flush"
                        id="todayExample"
                      >
                        <div className="accordion-item border-0">
                          <div className="accordion-header">
                            <button
                              className="accordion-button p-2 shadow-none"
                              type="button"
                              id="headingOne"
                            >
                              <div className="d-flex">
                                <div className="flex-shrink-0">
                                  <img
                                    src={avatar2}
                                    alt=""
                                    className="avatar-xs rounded-circle"
                                  />
                                </div>
                                <div className="flex-grow-1 ms-3">
                                  <h6 className="fs-14 mb-1">
                                    Jacqueline Steve
                                  </h6>
                                  <small className="text-muted">
                                    We has changed 2 attributes on 05:16PM
                                  </small>
                                </div>
                              </div>
                            </button>
                          </div>
                          <UncontrolledCollapse
                            className="accordion-collapse"
                            toggler="#headingOne"
                            defaultOpen
                          >
                            <div className="accordion-body ms-2 ps-5">
                              In an awareness campaign, it is vital for people
                              to begin put 2 and 2 together and begin to
                              recognize your cause. Too much or too little
                              spacing, as in the example below, can make things
                              unpleasant for the reader. The goal is to make
                              your text as comfortable to read as possible. A
                              wonderful serenity has taken possession of my
                              entire soul, like these sweet mornings of spring
                              which I enjoy with my whole heart.
                            </div>
                          </UncontrolledCollapse>
                        </div>
                        <div className="accordion-item border-0">
                          <div className="accordion-header" id="headingTwo">
                            <Link
                              to="#"
                              className="accordion-button p-2 shadow-none"
                              id="collapseTwo"
                            >
                              <div className="d-flex">
                                <div className="flex-shrink-0 avatar-xs">
                                  <div className="avatar-title bg-light text-success rounded-circle">
                                    M
                                  </div>
                                </div>
                                <div className="flex-grow-1 ms-3">
                                  <h6 className="fs-14 mb-1">Megan Elmore</h6>
                                  <small className="text-muted">
                                    Adding a new event with attachments -
                                    04:45PM
                                  </small>
                                </div>
                              </div>
                            </Link>
                          </div>
                        </div>
                        <div className="accordion-item border-0">
                          <div className="accordion-header" id="headingThree">
                            <Link
                              to="#"
                              className="accordion-button p-2 shadow-none"
                            >
                              <div className="d-flex">
                                <div className="flex-shrink-0">
                                  <img
                                    src={avatar5}
                                    alt=""
                                    className="avatar-xs rounded-circle"
                                  />
                                </div>
                                <div className="flex-grow-1 ms-3">
                                  <h6 className="fs-14 mb-1">
                                    New ticket received
                                  </h6>
                                  <small className="text-muted mb-2">
                                    User
                                    <span className="text-secondary">
                                      Erica245
                                    </span>
                                    submitted a ticket - 02:33PM
                                  </small>
                                </div>
                              </div>
                            </Link>
                          </div>
                        </div>
                        <div className="accordion-item border-0">
                          <div className="accordion-header" id="headingFour">
                            <Link
                              to="#"
                              className="accordion-button p-2 shadow-none"
                              id="collapseFour"
                            >
                              <div className="d-flex">
                                <div className="flex-shrink-0 avatar-xs">
                                  <div className="avatar-title bg-light text-muted rounded-circle">
                                    <i className="ri-user-3-fill"></i>
                                  </div>
                                </div>
                                <div className="flex-grow-1 ms-3">
                                  <h6 className="fs-14 mb-1">Nancy Martino</h6>
                                  <small className="text-muted">
                                    Commented on 12:57PM
                                  </small>
                                </div>
                              </div>
                            </Link>
                          </div>
                          <UncontrolledCollapse
                            toggler="collapseFour"
                            defaultOpen
                          >
                            <div className="accordion-body ms-2 ps-5">
                              " A wonderful serenity has taken possession of my
                              entire soul, like these sweet mornings of spring
                              which I enjoy with my whole heart. Each design is
                              a new, unique piece of art birthed into this
                              world, and while you have the opportunity to be
                              creative and make your own style choices. "
                            </div>
                          </UncontrolledCollapse>
                        </div>
                        <div className="accordion-item border-0">
                          <div className="accordion-header" id="headingFive">
                            <Link
                              to="#"
                              className="accordion-button p-2 shadow-none"
                              id="collapseFive"
                            >
                              <div className="d-flex">
                                <div className="flex-shrink-0">
                                  <img
                                    src={avatar7}
                                    alt=""
                                    className="avatar-xs rounded-circle"
                                  />
                                </div>
                                <div className="flex-grow-1 ms-3">
                                  <h6 className="fs-14 mb-1">Lewis Arnold</h6>
                                  <small className="text-muted">
                                    Create new project buildng product - 10:05AM
                                  </small>
                                </div>
                              </div>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabContent>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default OverviewTab;
