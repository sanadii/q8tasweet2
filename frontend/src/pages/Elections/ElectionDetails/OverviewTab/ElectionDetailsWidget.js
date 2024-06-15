import React from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, CardHeader, Col, DropdownItem, DropdownMenu, DropdownToggle, Row, UncontrolledDropdown } from "reactstrap";
import DashboardCharts from "../DashboardCharts";
import { SimplePie, SimpleDonut, UpdateDonut, MonochromePie, GradientDonut, PatternedDonut, ImagePieChart } from '../PieCharts'

const ElectionDetailsWidget = ({ election, electionCandidates }) => {
  const moderators = Array.isArray(election.moderators)
    ? election.moderators
    : [];

  const calculateRemainingDays = (duedate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(duedate);
    dueDate.setHours(0, 0, 0, 0);
    const differenceInTime = dueDate.getTime() - today.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    return differenceInDays;
  };

  const remainingDays = calculateRemainingDays(election.duedate);
  let status = "";
  if (remainingDays === 0) {
    status = "today";
  } else if (remainingDays === 1) {
    status = "tomorrow";
  } else if (remainingDays === -1) {
    status = "yesterday";
  } else if (remainingDays < -1) {
    status = "finished";
  } else {
    status = `${Math.ceil(remainingDays)} days remaining`;
  }

  const maleCandidates = electionCandidates.filter(
    (candidate) => candidate.gender === 1
  ).length;
  const femaleCandidates = electionCandidates.filter(
    (candidate) => candidate.gender === 2
  ).length;

  const percentageAttendees = ((election.attendees / election.electors) * 100).toFixed(2);
  const percentageAttendeesMales = ((election.attendeesMales / election.electorsMales) * 100).toFixed(2);
  const percentageAttendeesFemales = ((election.attendeesFemales / election.electorsFemales) * 100).toFixed(2);

  return (
    <React.Fragment>
      <Card>
        <div className="card-animate overflow-hidden">
          <div
            className="position-absolute start-0"
            style={{ zIndex: "0" }}
          >
            <svg
              version="1.2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 200 120"
              width="200"
              height="140"
            >
              <path
                id="Shape 8"
                style={{ opacity: ".05", fill: "#0ab39c" }}
                d="m189.5-25.8c0 0 20.1 46.2-26.7 71.4 0 0-60 15.4-62.3 65.3-2.2 49.8-50.6 59.3-57.8 61.5-7.2 2.3-60.8 0-60.8 0l-11.9-199.4z"
              />
            </svg>
          </div>
          <CardBody style={{ zIndex: "1" }}>
            <div className="d-flex align-items-center">
              <div className="flex-grow-1 overflow-hidden">
                <p className="text-uppercase fw-medium text-muted text-truncate mb-3">
                  <strong>
                    المرشحين
                  </strong>
                </p>
                <h4 className="fs-22 fw-semibold ff-secondary mb-0">
                  <span className="counter-value" data-target="36894">
                    {electionCandidates.length}
                  </span>
                </h4>
                <p>رجال: 15 | نساء: 0</p>
              </div>
              <div className="flex-shrink-0">
                <DashboardCharts
                  seriesData={100}
                  colors="#3577f1"
                />
              </div>
            </div>
          </CardBody>
        </div>
        <div className="card-animate overflow-hidden">
          <div
            className="position-absolute start-0"
            style={{ zIndex: "0" }}
          >
            <svg
              version="1.2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 200 120"
              width="200"
              height="140"
            >
              <path
                id="Shape 8"
                style={{ opacity: ".05", fill: "#0ab39c" }}
                d="m189.5-25.8c0 0 20.1 46.2-26.7 71.4 0 0-60 15.4-62.3 65.3-2.2 49.8-50.6 59.3-57.8 61.5-7.2 2.3-60.8 0-60.8 0l-11.9-199.4z"
              />
            </svg>
          </div>
          <CardBody style={{ zIndex: "1" }}>
            <div className="d-flex align-items-center">
              <div className="flex-grow-1 overflow-hidden">
                <p className="text-uppercase fw-medium text-muted text-truncate mb-3">
                  <strong>
                    الناخبين
                  </strong>
                </p>
                <h4 className="fs-22 fw-semibold ff-secondary mb-0">
                  <span className="counter-value" data-target="36894">
                    {election.electors}
                  </span>
                </h4>
                <p>رجال: {election.electorsMales} | نساء: {election.electorsFemales}</p>

              </div>
              <div className="flex-shrink-0">
                {/* <SimplePie dataColors='["--vz-primary", "--vz-danger"]' chartWidth={350} chartHeight={350} /> */}
              </div>
            </div>
          </CardBody>
        </div>
        <div className="card-animate overflow-hidden">
          <div
            className="position-absolute start-0"
            style={{ zIndex: "0" }}
          >
            <svg
              version="1.2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 200 120"
              width="200"
              height="140"
            >
              <path
                id="Shape 8"
                style={{ opacity: ".05", fill: "#0ab39c" }}
                d="m189.5-25.8c0 0 20.1 46.2-26.7 71.4 0 0-60 15.4-62.3 65.3-2.2 49.8-50.6 59.3-57.8 61.5-7.2 2.3-60.8 0-60.8 0l-11.9-199.4z"
              />
            </svg>
          </div>
          <CardBody style={{ zIndex: "1" }}>
            <div className="d-flex align-items-center">
              <div className="flex-grow-1 overflow-hidden">
                <p className="text-uppercase fw-medium text-muted text-truncate mb-3">
                  <strong>
                    حضور الرجال
                  </strong>
                </p>
                <h4 className="fs-22 fw-semibold ff-secondary mb-0">
                  <span className="counter-value" data-target="36894">
                    {election.attendeesMales}
                  </span>
                </h4>
                <p>من إجمالي <strong>{election.electorsMales}</strong></p>

              </div>
              <div className="flex-shrink-0">
                <DashboardCharts
                  seriesData={percentageAttendeesMales}
                  colors="#299cdb"
                />
              </div>
            </div>
          </CardBody>
        </div>
        <div className="card-animate overflow-hidden">
          <div
            className="position-absolute start-0"
            style={{ zIndex: "0" }}
          >
            <svg
              version="1.2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 200 120"
              width="200"
              height="140"
            >
              <path
                id="Shape 8"
                style={{ opacity: ".05", fill: "#0ab39c" }}
                d="m189.5-25.8c0 0 20.1 46.2-26.7 71.4 0 0-60 15.4-62.3 65.3-2.2 49.8-50.6 59.3-57.8 61.5-7.2 2.3-60.8 0-60.8 0l-11.9-199.4z"
              />
            </svg>
          </div>
          <CardBody style={{ zIndex: "1" }}>
            <div className="d-flex align-items-center">
              <div className="flex-grow-1 overflow-hidden">
                <p className="text-uppercase fw-medium text-muted text-truncate mb-3">
                  <strong>
                    حضور النساء
                  </strong>
                </p>
                <h4 className="fs-22 fw-semibold ff-secondary mb-0">
                  <span className="counter-value" data-target="36894">
                    {election.attendeesFemales}
                  </span>
                </h4>
                <p>من إجمالي <strong>{election.electorsFemales}</strong></p>
              </div>
              <div className="flex-shrink-0">
                <DashboardCharts
                  seriesData={percentageAttendeesFemales}
                  colors="#f06548"
                />
              </div>
            </div>
          </CardBody>
        </div>
      </Card>
    </React.Fragment>
  );
};

export default ElectionDetailsWidget;
