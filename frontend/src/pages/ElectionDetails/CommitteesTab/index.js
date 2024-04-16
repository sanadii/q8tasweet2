// React imports
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { electionDataSelector } from 'selectors';
import { DashboardCharts } from "./DashboardCharts";


// Reactstrap (UI) imports
import { Col, Row, Card, CardBody } from "reactstrap";


const CommitteesTab = () => {
  const { electionCommittees } = useSelector(electionDataSelector);
  const [selectedCommittee, setSelectedCommittee] = useState(null);

  const toggleCommittee = (committeeId) => {
    setSelectedCommittee((prevCommittee) =>
      prevCommittee === committeeId ? null : committeeId
    );
  };

  return (
    <React.Fragment>
      <div className="d-flex flex-column h-100">
        <Row>
          {electionCommittees.map((committee, key) => (
            <Col xl={selectedCommittee === committee.committeeId ? 12 : 4} md={6} key={key}>
              <Card
                className={`card-animate overflow-hidden ${selectedCommittee === committee.committeeId && "full-width-card"
                  }`}
                onClick={() => toggleCommittee(committee.committeeId)}
              >
                <div
                  className="position-absolute start-0"
                  style={{ zIndex: "0" }}
                >
                  <svg
                    version="1.2"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 200 120"
                    width="200"
                    height="120"
                  >
                    <path
                      id="Shape 8"
                      style={{ opacity: ".05", fill: "rgb(11 152 93)" }}
                      d="m189.5-25.8c0 0 20.1 46.2-26.7 71.4 0 0-60 15.4-62.3 65.3-2.2 49.8-50.6 59.3-57.8 61.5-7.2 2.3-60.8 0-60.8 0l-11.9-199.4z"
                    />
                  </svg>
                </div>
                <CardBody style={{ zIndex: "1" }}>
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1 overflow-hidden">
                      <p className="text-uppercase fw-medium text-muted text-truncate mb-3">

                        <b><span className="text-info">{committee.committeeArea}</span></b>   <br />
                        {committee.committeeId}: <b>{committee.committeeName}</b>   <br />
                        <span className="text-info">عدد اللجان الفرعية: {committee.committeeCount}</span>
                      </p>
                      <h4 className="fs-22 fw-semibold ff-secondary mb-0">
                        <span className="counter-value" data-target="36894">
                          {committee.committeeVoterCount} ناخب
                        </span>
                      </h4>

                    </div>
                    <div className="flex-shrink-0">
                      <DashboardCharts
                        seriesData={committee.series}
                        colors={committee.color}
                      />
                    </div>
                  </div>
                  {selectedCommittee === committee.committeeId && (
                    <div>
                      <hr />
                      <p>اللجان الأصلية والفرعية</p>
                      {committee.subCommittees.map((subCommittee, key) => (
                        <div key={key}>
                          {/* Render details for each subcommittee */}
                          <p>اللجنة: أصلية {subCommittee.subCommitteeId}</p>
                          {/* Add more details here as needed */}
                        </div>
                      ))}
                    </div>
                  )}

                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </React.Fragment >

  );
};

export default CommitteesTab;
