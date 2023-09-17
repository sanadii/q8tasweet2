import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Col, Nav, NavItem, NavLink, Row, TabContent, TabPane, Card, CardBody, } from "reactstrap";
import classnames from "classnames";

// --------------- Component, Constants, Hooks Imports ---------------
import { ImageLargeCircle, ImageCampaignBackground, TableContainer } from "../../Components/Common";
import { Container } from "reactstrap";
import { useParams } from "react-router-dom";
import {
  getElectionDetails,
  // getElectionCandidates,
  getElectionCampaigns,
} from "../../store/actions";
import { isEmpty } from "lodash";

const ElectionDetails = () => {
  useEffect(() => {
    document.title =
      "Election Details | Q8Tasweet - React Admin & Dashboard Template";
  }, []);

  const [election, setElection] = useState({
    id: useParams().id,
  });

  const { electionDetails, electionCandidates, electionCampaigns, electionCommittees } =
    useSelector((state) => ({
      electionDetails: state.Elections.electionDetails,
      electionCandidates: state.Elections.electionCandidates,
      electionCampaigns: state.Elections.electionCampaigns,
      electionCommittees: state.Elections.electionCommittees,
      // error: state.Elections.error,
    }));

  const dispatch = useDispatch();

  useEffect(() => {
    if (election.id && !isEmpty(election)) {
      dispatch(getElectionDetails(election));
    }
  }, [dispatch, election, election.id]);


  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <ImageCampaignBackground imagePath={election.image} />
          <div className="pt-4 mb-4 mb-lg-3 pb-lg-4 profile-wrapper">
            <Row className="g-4">
              <div className="col-auto">
                <ImageLargeCircle imagePath={election.image} />
              </div>

              <Col>
                <div className="p-2">
                  <h3 className="text-white mb-1">{election.name}</h3>
                  <p className="text-white-75">{election.name}</p>
                  <div className="hstack text-white-50 gap-1">
                    <div className="me-2">
                      <i className="ri-map-pin-user-line me-1 text-white-75 fs-16 align-middle"></i>
                      Date: {election.duedate}
                    </div>
                  </div>
                </div>
              </Col>
              <Col xs={12} className="col-lg-auto order-last order-lg-0">
                <Row className="text text-white-50 text-center">
                  <Col lg={6} xs={4}>
                    <div className="p-2">
                      {/* <h4 className="text-white mb-1">{campaignMembers.length}</h4> */}
                      <p className="fs-14 mb-0">Team</p>
                    </div>
                  </Col>
                  <Col lg={6} xs={4}>
                    <div className="p-2">
                      <h4 className="text-white mb-1">
                        {/* {campaignGuarantees.length} */}
                      </h4>
                      <p className="fs-14 mb-0">Guarantees</p>
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
                </div >

                <TabContent className="pt-4">
                  <Row>
                    <Col>
                      <Card>
                        <CardBody>
                          <h5 className="card-title mb-3">النتائج</h5>
                          {election.description}
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
                                    {election.name}
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
                    </Col>
                  </Row>
                </TabContent >
              </div >
            </Col >
          </Row >
        </Container>
      </div>
    </React.Fragment >
  );
};

export default ElectionDetails;
