import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import BreadCrumb from "../../components/Components/BreadCrumb";
import { ImageCampaignCard } from "../../components";
import { Link } from "react-router-dom";
import { getElections } from "../../store/actions";

const ElectionGrid = () => {
  const dispatch = useDispatch();

  document.title = "Elections - Q8 TASWEET APP";

  const { elections, isElectionSuccess, error } = useSelector((state) => ({
    elections: state.Elections.elections,
    isElectionSuccess: state.Elections.isElectionSuccess,
    error: state.Elections.error,
  }));

  const [electionList, setElectionList] = useState([]);
  const [election, setElection] = useState([]);
  const [electionCandidates, setElectionCandidates] = useState([]);

  // Election Data
  useEffect(() => {
    if (!isElectionSuccess) {
      dispatch(getElections());
    }
  }, [dispatch, isElectionSuccess]);

  useEffect(() => {
    // Filter elections with status "publish"
    const publishedElections = elections.filter((item) => item.status === 1);
    setElectionList(publishedElections);
  }, [elections]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="الإنتخابات" pageTitle="الإنتخابات" />

          <Row>
            <Col lg={12}>
              <div className="d-lg-flex align-items-center mb-4">
                <div className="flex-grow-1">
                  <h5 className="card-title mb-0 fw-semibold fs-16">
                    Elections
                  </h5>
                </div>
              </div>
            </Col>
          </Row>

          <Row className="row-cols-xl-5 row-cols-lg-3 row-cols-md-2 row-cols-1">
            {electionList.map((item, key) => (
              <Col key={key}>
                <Card className="explore-box card-animate">
                  <ImageCampaignCard
                    imagePath={item.image}
                    urlPath={`elections/${item.id}`}
                  />
                  <CardBody>
                    <h2 className="mb-1">
                      <Link to={`elections/${item.id}`}>
                        {item.name}
                      </Link>
                    </h2>
                    <h5 className="text-muted mb-0">
                      <b>{item.name}</b>
                    </h5>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ElectionGrid;
