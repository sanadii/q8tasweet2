import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { ImageCampaignCard } from "../../Components/Common";

import { Link } from "react-router-dom";

import { getElections, getModeratorUsers, getCategories } from "../../store/actions";


const ElectionGrid = () => {
  const dispatch = useDispatch();

  document.title = "Elections - Q8 TASWEET APPS";

  const {
    elections,
    moderators,
    categories,
    subCategories,
    isElectionSuccess,
    error,
  } = useSelector((state) => ({
    elections: state.Elections.elections,
    isElectionSuccess: state.Elections.isElectionSuccess,
    error: state.Elections.error,
  }));

  const [electionList, setElectionList] = useState(elections);
  const [election, setElection] = useState([]);
  const [category, setCategory] = useState([]);
  const [electionCandidates, setElectionCandidates] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

  // Election Data
  useEffect(() => {
    if (elections && !elections.length) {
      dispatch(getElections());
    }
    // console.log("Elections:", elections); // log elections
  }, [dispatch, elections]);

  useEffect(() => {
    setElectionList(elections);
    // console.log("Election List:", electionList); // log electionList
  }, [elections]);

  // Moderators
  useEffect(() => {
    if (moderators && !moderators.length) {
      dispatch(getModeratorUsers());
    }
  }, [dispatch, moderators]);


  const favouriteBtn = (ele) => {
    if (ele.closest("button").classList.contains("active")) {
      ele.closest("button").classList.remove("active");
    } else {
      ele.closest("button").classList.add("active");
    }
  };
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
                    urlPath={`public/elections/${item.id}`}
                  />
                  <CardBody>
                    <h2 className="mb-1">
                      <Link to={`/elections/${item.id}`}>
                        {item.name}
                      </Link>
                    </h2>
                    <h5 className="text-muted mb-0">
                      <b>{item.name}</b>
                    </h5>
                  </CardBody>
                  <div className="card-footer border-top border-top-dashed">
                    <div className="d-flex align-items-center">
                      <div className="flex-grow-1 fs-14">
                        <i className="ri-price-tag-3-fill text-warning align-bottom me-1"></i>{" "}
                        {item.category}
                      </div>
                      <h5 className="flex-shrink-0 fs-14 text-primary mb-0">
                        {item.subCategory}
                      </h5>
                    </div>
                  </div>
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
