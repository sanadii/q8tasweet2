import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
  UncontrolledDropdown,
} from "reactstrap";

const ElectionDetailsWidget = ({ candidate, Candidates }) => {
  const moderators = Array.isArray(candidate.moderators)
    ? candidate.moderators
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

  const remainingDays = calculateRemainingDays(candidate.duedate);
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

  const maleCandidates = Candidates.filter(
    (candidate) => candidate.gender === 1
  ).length;
  const femaleCandidates = Candidates.filter(
    (candidate) => candidate.gender === 2
  ).length;

  return (
    <React.Fragment>
      <Row>
        <div className="col-md-6 col-lg-3">
          <div className="card">
            <div className="card-body bg-secondary">
              <div className="d-flex align-items-center">
                <div className="avatar-sm flex-shrink-0">
                  <span className="avatar-title bg-light text-primary rounded-circle fs-3">
                    <i className="align-middle ri-user-follow-line"></i>{" "}
                  </span>
                </div>
                <div className="flex-grow-1 ms-3">
                  <p className="text-uppercase fw-semibold fs-12 text-white mb-1">
                    Candidates
                  </p>
                  <h4 className="mb-0">{Candidates.length}</h4>
                  <p>
                    <b className="text-white mb-1">{maleCandidates} M / </b>{" "}
                    <b className="text-white mb-1">{femaleCandidates} F </b>
                  </p>
                </div>
                <div className="flex-shrink-0 align-self-end">
                  <span className="badge bg-white-subtle text-white">
                    <i className="align-middle me-1 ri-arrow-up-s-fill"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-3">
          <div className="card">
            <div className="card-body bg-soft-danger">
              <div className="d-flex align-items-center">
                <div className="avatar-sm flex-shrink-0">
                  <span className="avatar-title bg-light text-primary rounded-circle fs-3">
                    <i className="align-middle ri-money-dollar-circle-fill"></i>
                  </span>
                </div>
                <div className="flex-grow-1 ms-3">
                  <p className="text-uppercase fw-semibold fs-12 text-muted mb-1">
<<<<<<< HEAD
                    Electors
                  </p>
                  <h4 className=" mb-0">
                    <span>{candidate.electors}</span>
                  </h4>
                  <p>
                    / <b className="text-danger mb-1">{candidate.electors}</b>
=======
                    Voters
                  </p>
                  <h4 className=" mb-0">
                    <span>{candidate.voters}</span>
                  </h4>
                  <p>
                    / <b className="text-danger mb-1">{candidate.voters}</b>
>>>>>>> sanad
                  </p>
                </div>
                <div className="flex-shrink-0 align-self-end">
                  <span className="badge bg-success-subtle text-success">
                    <i className="align-middle me-1 ri-arrow-up-s-fill"></i>
                    6.24 %
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="avatar-sm flex-shrink-0">
                  <span className="avatar-title bg-light text-primary rounded-circle fs-3">
                    <i className="align-middle ri-money-dollar-circle-fill"></i>
                  </span>
                </div>
                <div className="flex-grow-1 ms-3">
                  <p className="text-uppercase fw-semibold fs-12 text-muted mb-1">
                    Attendees
                  </p>
                  <h4 className=" mb-0">
                    <span>{candidate.attendees}</span>
                  </h4>
                  <p>
<<<<<<< HEAD
                    / <b className="text-danger mb-1">{candidate.electors}</b>
=======
                    / <b className="text-danger mb-1">{candidate.voters}</b>
>>>>>>> sanad
                  </p>
                </div>
                <div className="flex-shrink-0 bg-successalign-self-end">
                  <span className="badge bg-success-subtle text-success">
                    <i className="align-middle me-1 ri-arrow-up-s-fill"></i>
<<<<<<< HEAD
                    {candidate.electors
                      ? (
                          (candidate.attendees / candidate.electors) *
=======
                    {candidate.voters
                      ? (
                          (candidate.attendees / candidate.voters) *
>>>>>>> sanad
                          100
                        ).toFixed(2)
                      : 0}{" "}
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card bg-success text-white">
            {/* Added text-white to change the text color */}
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="avatar-sm flex-shrink-0">
                  <span className="avatar-title bg-light text-success rounded-circle fs-3">
                    {/* Changed icon color to text-success */}
                    <i className="align-middle ri-check-line"></i>{" "}
                    {/* Changed icon to a checkmark */}
                  </span>
                </div>
                <div className="flex-grow-1 ms-3">
                  <p className="text-uppercase fw-semibold fs-12 text-white mb-1">
                    Candidate Date
                  </p>
                  <h4 className="mb-0">
                    <span>{candidate.duedate}</span>
                  </h4>
                  <p>
                    <b className="text-warning mb-1">{status}</b>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Row>
    </React.Fragment>
  );
};

export default ElectionDetailsWidget;
