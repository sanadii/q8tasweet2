import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Row, Col, Card, CardBody } from 'reactstrap';
import CountUp from 'react-countup';
import { electionSelector, campaignSelector } from 'selectors';
import { DashboardCharts } from './DashboardCharts';

// Helper component for Committee Details
const CommitteeSiteDetails = ({ committeeSite }) => {
  console.log("committeeSite: ", committeeSite);

  return (
    <>
      <div class="mini-stats-wid d-flex align-items-center mt-3">
        <div class="flex-shrink-0 avatar-sm">
          <span className={`mini-stat-icon avatar-title rounded-circle text-white bg-${committeeSite.gender === 1 ? 'info' : 'pink'}`}>
            {committeeSite.id}
          </span>
        </div>
        <div class="flex-grow-1 ms-3">
          <b><span className={`text-${committeeSite.gender === 1 ? 'info' : 'pink'}`}>{committeeSite.areaName} - {committeeSite.gender === 1 ? 'ذكور' : 'إناث'}</span></b>
          <h6 class="mb-1">{committeeSite.name}</h6>
        </div>
        <div class="flex-shrink-0">
        </div>
      </div>
      <div className="d-flex align-items-center">
        <div className="flex-grow-1 overflow-hidden">

          <h4 className="fs-22 fw-semibold ff-secondary mb-0">
            <span className="counter-value" data-target="36894">
              {committeeSite.electorCount} ناخب
            </span>
          </h4>
          <p className="text-uppercase fw-medium text-muted text-truncate mb-3">
            <span className="text-info">عدد اللجان: {committeeSite?.committees?.length}</span>
          </p>
        </div>
        <DashboardCharts seriesData={committeeSite.series} colors={committeeSite.color} />
      </div>
    </>
  )
}
  ;



// Helper component for SubCommittee details
const CommitteeDetails = ({ committeeSite, committee }) => (
  <Col xl={4}>
    <Card className={`card-animate bg-soft-${committeeSite.gender === 1 ? 'info' : 'pink'}`}>
      <CardBody>
        <div className="d-flex justify-content-between">
          <div>
            <div className="d-flex align-items-center py-2">
              <div class="avatar-xs me-2">
                <span class={`avatar-title rounded-circle bg-white text-${committeeSite.gender === 1 ? 'info' : 'pink'}`}>
                  {committee.id}
                </span>
              </div>
              <span className="fw-medium fw-semibold text-black mb-0">
                {committeeSite.areaName} - {committee.type}
              </span>
            </div>
            <h4 className="fw-semibold text-black">
              {committee.letters}

            </h4>
            {/* <p className="mb-0 text-muted"><span className="badge bg-light text-danger mb-0">
              <i className="ri-arrow-down-line align-middle"></i> 0.24 %
            </span> vs. previous month</p> */}
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
  const { electionCommitteeSites } = useSelector(electionSelector);
  const { campaignElectionCommitteeSites } = useSelector(campaignSelector);
  const [selectedCommitteesite, setSelectedCommitteeSite] = useState(null);


  const committeeSites = electionCommitteeSites.length > 0 ? electionCommitteeSites : campaignElectionCommitteeSites
  const toggleCommitteeSite = (committeeSiteId) => setSelectedCommitteeSite(
    prev => (prev === committeeSiteId ? null : committeeSiteId)
  );

  return (
    <React.Fragment>
      <div className="d-flex flex-column h-100">
        <Row>
          {committeeSites && committeeSites.map((committeeSite, index) => (
            <Col xl={selectedCommitteesite === committeeSite.id ? 12 : 3} md={6} key={index}>
              <Card
                className={`card-animate overflow-hidden ${selectedCommitteesite === committeeSite.id ? "full-width-card" : ""}`}
                onClick={() => toggleCommitteeSite(committeeSite.id)}
              >
                <CardBody>
                  <CommitteeSiteDetails committeeSite={committeeSite} />
                  {selectedCommitteesite === committeeSite.id && (
                    <div>
                      <hr />
                      <p>اللجان الأصلية والفرعية</p>
                      <Row>
                        {committeeSite.committees.map((committee, idx) => (
                          <CommitteeDetails key={idx} committeeSite={committeeSite} committee={committee} />
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
