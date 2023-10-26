// Pages/Campaigns/campaign/index.js
// React & Redux core
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

// Store & Selectors
import { campaignSelector } from 'Selectors';

// UI & Utilities
import { Card, CardBody, Col, Row } from "reactstrap";

const OverviewCandidate = () => {
  const {
    campaign,
  } = useSelector(campaignSelector);

  document.title = "Campaign Overview | Q8Tasweet";

  return (
    <React.Fragment>
          <Card>
            <CardBody>
              <h5 className="card-title mb-3"><strong>عن المرشح</strong></h5>
              {campaign.description}
              <Row className="flex-d">
                <Col>
                  <div className="d-flex mt-4">
                    <div className="flex-shrink-0 avatar-xs align-self-center me-3">
                      <div className="avatar-title bg-light rounded-circle fs-16 text-primary">
                        <i className="ri-twitter-fill"></i>
                      </div>
                    </div>
                    <div className="flex-grow-1 overflow-hidden">
                      <p className="mb-1">تويتر :</p>
                      <h6 className="text-truncate mb-0">
                        <Link
                          to={`https://www.twitter.com/${campaign.twitter}`}
                          className="fw-semibold">
                          {campaign.twitter}
                        </Link>
                      </h6>
                    </div>
                  </div>
                </Col>
                <Col>
                  <div className="d-flex mt-4">
                    <div className="flex-shrink-0 avatar-xs align-self-center me-3">
                      <div className="avatar-title bg-light rounded-circle fs-16 text-primary">
                        <i className="ri-instagram-fill"></i>
                      </div>
                    </div>
                    <div className="flex-grow-1 overflow-hidden">
                      <p className="mb-1">انستقرام :</p>
                      <h6 className="text-truncate mb-0">
                        <Link
                          to={`https://www.instagram.com/${campaign.instagram}`}
                          className="fw-semibold">
                          {campaign.instagram}
                        </Link>
                      </h6>
                    </div>
                  </div>
                </Col>

                <Col>
                  <div className="d-flex mt-4">
                    <div className="flex-shrink-0 avatar-xs align-self-center me-3">
                      <div className="avatar-title bg-light rounded-circle fs-16 text-primary">
                        <i className="ri-global-line"></i>
                      </div>
                    </div>
                    <div className="flex-grow-1 overflow-hidden">
                      <p className="mb-1">الموقع الإلكتروني :</p>
                      <Link
                        to={campaign.website}
                        className="fw-semibold">
                        {campaign.website}
                      </Link>
                    </div>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
    </React.Fragment>
  );
};

export default OverviewCandidate;
