import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import { BreadCrumb } from "shared/components";
import { ImageCampaignCard } from "../../shared/components";
import { Link } from "react-router-dom";
import { getCandidates } from "../../store/actions";


import { candidateSelector, categorySelector } from 'selectors';

const CandidateGrid = () => {
  document.title = "المرشحين - كويت تصويت";

  const dispatch = useDispatch();
  const { candidates, isCandidateSuccess, error } = useSelector(candidateSelector);

  const [candidateList, setCandidateList] = useState([]);
  const [candidate, setCandidate] = useState([]);
  const [candidateCandidates, setCandidateCandidates] = useState([]);

  console.log("candidateList: ", candidateList);
  console.log("candidates: ", candidates);
  // Candidate Data
  useEffect(() => {
    if (!isCandidateSuccess) {
      dispatch(getCandidates());
    }
  }, [dispatch, isCandidateSuccess]);

  useEffect(() => {
    // Filter candidates with status "publish"
    const publishedCandidates = candidates.filter((item) => item.status === 1);
    setCandidateList(publishedCandidates);
  }, [candidates]);

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
                    Candidates
                  </h5>
                </div>
              </div>
            </Col>
          </Row>

          <Row className="row-cols-xl-5 row-cols-lg-3 row-cols-md-2 row-cols-1">
            {candidates.map((item, key) => (
              <Col key={key}>
                <Card className="explore-box card-animate">
                  <ImageCampaignCard
                    imagePath={item.image}
                    urlPath={`candidates/${item.id}`}
                  />
                  <CardBody>
                    <h2 className="mb-1">
                      <Link to={`candidates/${item.id}`}>
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

export default CandidateGrid;
