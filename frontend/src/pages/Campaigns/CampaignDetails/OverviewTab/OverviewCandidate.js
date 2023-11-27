import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { campaignSelector } from 'Selectors';
import { Card, CardBody, Col, Row } from "reactstrap";

const OverviewCandidate = () => {
  const { campaign } = useSelector(campaignSelector);

  const candidateInfo = [
    {
      name: 'تويتر',
      value: campaign.twitter,
      url: `https://www.twitter.com/${campaign.twitter}`,
      icon: "ri-twitter-fill",
    },
    {
      name: 'انستقرام',
      value: campaign.instagram,
      url: `https://www.instagram.com/${campaign.instagram}`,
      icon: "ri-instagram-fill",
    },
    {
      name: 'الموقع الإلكتروني',
      value: campaign.website,
      url: campaign.website, // Assuming 'campaign.website' is a complete URL
      icon: "ri-global-line",
    },
  ];

  return (
    <React.Fragment>
      <Card>
        <CardBody>
          <h5 className="card-title mb-3"><strong>عن المرشح</strong></h5>
          {campaign.description}
          <Row className="flex-d">
            {candidateInfo.map(info => (
              <Col key={info.name}>
                <div className="d-flex mt-4">
                  <div className="flex-shrink-0 avatar-xs align-self-center me-3">
                    <div className="avatar-title bg-light rounded-circle fs-16 text-primary">
                      <i className={info.icon}></i>
                    </div>
                  </div>
                  <div className="flex-grow-1 overflow-hidden">
                    <p className="mb-1">{info.name} :</p>
                    <h6 className="text-truncate mb-0">
                      <Link to={info.url} className="fw-semibold">
                        {info.value}
                      </Link>
                    </h6>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default OverviewCandidate;
