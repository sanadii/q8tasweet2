import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Row, Col, Card, CardBody } from 'reactstrap';
import FeatherIcon from 'feather-icons-react';
import CountUp from 'react-countup';
import { electionSelector } from 'selectors';
import { DashboardCharts } from './DashboardCharts';


import { GenderOptions } from "shared/constants"

const GenderColorAvatar = ({ genderId }) => {
  const gender = Object.values(GenderOptions).find(g => g.id === genderId);

  return (
    <span className={`avatar-title rounded-circle text-white bg-${gender.color}`}>
      {/* Display ID or gender symbol here */}
    </span>
  );
};

// Helper component for Committee Details
const CommitteeDetails = ({ committee }) => (

  <>
    <div class="mini-stats-wid d-flex align-items-center mt-3">
      <div class="flex-shrink-0 avatar-sm">
        <span className={`mini-stat-icon avatar-title rounded-circle text-white bg-${committee.gender === "1" ? 'info' : 'pink'}`}>
          {committee.id}
        </span>
      </div>
      <div class="flex-grow-1 ms-3">
        <b><span className={`text-${committee.gender === "1" ? 'info' : 'pink'}`}>{committee.areaName} - {committee.gender === "1" ? 'ذكور' : 'إناث'}</span></b>
        <h6 class="mb-1">{committee.name}</h6>
      </div>
      <div class="flex-shrink-0">
      </div>
    </div>
    <div className="d-flex align-items-center">
      <div className="flex-grow-1 overflow-hidden">

        <h4 className="fs-22 fw-semibold ff-secondary mb-0">
          <span className="counter-value" data-target="36894">
            {committee.voterCount} ناخب
          </span>
        </h4>
        <p className="text-uppercase fw-medium text-muted text-truncate mb-3">
          <span className="text-info">عدد اللجان: {committee.committeeCount}</span>
        </p>
      </div>
      <DashboardCharts seriesData={committee.series} colors={committee.color} />
    </div>
  </>
);



// Helper component for SubCommittee details
const SubCommitteeDetails = ({ committee, subCommittee }) => (
  <Col xl={4}>
    <Card className={`card-animate bg-soft-${committee.gender === "1" ? 'info' : 'pink'}`}>
      <CardBody>
        <div className="d-flex justify-content-between">
          <div>
            <div className="d-flex align-items-center py-2">
              <div class="avatar-xs me-2">
                <span class={`avatar-title rounded-circle bg-white text-${committee.gender === "1" ? 'info' : 'pink'}`}>
                  {subCommittee.id}
                </span>
              </div>
              <span className="fw-medium fw-semibold text-black mb-0">
                {subCommittee.areaName} - {subCommittee.type}
              </span>
            </div>
            <h4 className="fw-semibold text-black">
              {subCommittee.letters}

            </h4>
            <p className="mb-0 text-muted"><span className="badge bg-light text-danger mb-0">
              <i className="ri-arrow-down-line align-middle"></i> 0.24 %
            </span> vs. previous month</p>
          </div>

        </div>
      </CardBody>
    </Card>
  </Col>

);

// Counter animation component
const Counters = ({ duration, startValue, endValue }) => (
  <h2 className="mt-4 fw-semibold text-white">
    <CountUp start={0} end={startValue} duration={duration} />m{' '}
    <CountUp start={0} end={endValue} duration={duration} />sec
  </h2>
);

const CommitteesTab = () => {
  const { electionCommittees } = useSelector(electionSelector);
  const [selectedCommittee, setSelectedCommittee] = useState(null);

  const toggleCommittee = (committeeId) => setSelectedCommittee(
    prev => (prev === committeeId ? null : committeeId)
  );

  return (
    <React.Fragment>
      <div className="d-flex flex-column h-100">
        <Row>
          {electionCommittees && electionCommittees.map((committee, index) => (
            <Col xl={selectedCommittee === committee.committeeId ? 12 : 3} md={6} key={index}>
              <Card
                className={`card-animate overflow-hidden ${selectedCommittee === committee.committeeId ? "full-width-card" : ""}`}
                onClick={() => toggleCommittee(committee.committeeId)}
              >
                <CardBody>
                  <CommitteeDetails committee={committee} />
                  {selectedCommittee === committee.committeeId && (
                    <div>
                      <hr />
                      <p>اللجان الأصلية والفرعية</p>
                      <Row>
                        {committee.committeeSubsets.map((sub, idx) => (
                          <SubCommitteeDetails key={idx} committee={committee} subCommittee={sub} />
                        ))}
                      </Row>
                    </div>
                  )}
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </React.Fragment>
  );
};

export default CommitteesTab;
