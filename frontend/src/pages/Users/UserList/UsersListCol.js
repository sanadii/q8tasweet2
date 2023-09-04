import React from "react";
import { useSelector } from "react-redux";

import { Link } from "react-router-dom";
import * as moment from "moment";

const handleValidDate = (duedate) => {
  const formattedDate = moment(duedate).format("YYYY-MM-DD");
  return formattedDate;
};

const Id = (cell) => {
  return cell.value;
};

const Name = (cell) => {
  return (
    <React.Fragment>
      {/* <Link
        to={`/users/${cell.row.original.id}`}
        className="fw-medium link-primary"
      > */}
      <strong>{cell.value}</strong>
      {/* </Link>{" "} */}
    </React.Fragment>
  );
};

const Username = (cell) => {
  return (
    <React.Fragment>
      {/* <Link
        to={`/users/${cell.row.original.id}`}
        className="fw-medium link-primary"
      > */}
      <strong>{cell.value}</strong>
      {/* </Link>{" "} */}
    </React.Fragment>
  );
};

const Status = ({ status }) => {
  let badgeClass;
  let statusName;

  switch (status) {
    case 0:
      statusName = "New";
      badgeClass = "badge-soft-info";
      break;
    case 1:
      statusName = "Inprogress";
      statusName = "Inprogress";
      break;
    case 2:
      statusName = "Missing Data";
      badgeClass = "badge-soft-warning";
      break;
    case 3:
      statusName = "Pending Approval";
      badgeClass = "badge-soft-warning";
      break;
    case 7:
      statusName = "Private";
      badgeClass = "badge-soft-secondary";
      break;
    case 8:
      statusName = "Published";
      badgeClass = "badge-soft-success";
      break;
    case 9:
      statusName = "Deleted";
      badgeClass = "badge-soft-secondary";
      break;
    default:
      statusName = "Unknown";
      badgeClass = "badge-soft-primary";
      break;
  }

  return (
    <span className={`badge ${badgeClass} text-uppercase`}>{statusName}</span>
  );
};

const CreateBy = (cell) => {
  return <React.Fragment>{cell.value}</React.Fragment>;
};

const Actions = (props) => {
  const { cell, handleUserClick, onClickDelete } = props;
  return (
    <React.Fragment>
      <div className="d-flex">
        <div className="flex-grow-1 users_name">{cell.value}</div>
        <div className="hstack gap-2">
          <button
            to="#"
            className="btn btn-sm btn-soft-info edit-list"
            onClick={() => {
              const userData = cell.row.original;
              handleUserClick(userData);
            }}
          >
            <i className="ri-pencil-fill align-bottom" />
          </button>
          <button
            to="#"
            className="btn btn-sm btn-soft-danger remove-list"
            onClick={() => {
              const userData = cell.row.original;
              onClickDelete(userData);
            }}
          >
            <i className="ri-delete-bin-5-fill align-bottom" />
          </button>
        </div>
      </div>
    </React.Fragment>
  );
};
export { Id, Name, Status, Username, CreateBy, Actions };
