import React from "react";
import { useSelector } from "react-redux";
import { electionsSelector } from '../../../selectors/electionsSelector';

import { Link } from "react-router-dom";
import * as moment from "moment";

const handleValidDate = (duedate) => {
  const formattedDate = moment(duedate).format("YYYY-MM-DD");
  return formattedDate;
};

const Id = (cell) => {
  return (
    <React.Fragment>
      <Link
        to={`/elections/${cell.row.original.id}`}
        className="fw-medium link-primary"
      >
        {cell.value}
      </Link>{" "}
    </React.Fragment>
  );
};

const Name = (cell) => {
  return (
    <React.Fragment>
      <Link
        to={`/elections/${cell.row.original.id}`}
        className="fw-medium link-primary"
      >
        {cell.value}
      </Link>{" "}
    </React.Fragment>
  );
};

const CandidateCount = (cell) => {
  return (
    <React.Fragment>
      <b>{cell.value}</b>
    </React.Fragment>
  );
};

const DueDate = (cell) => {
  return <React.Fragment>{handleValidDate(cell.value)}</React.Fragment>;
};

const Category = ({ category, subCategory }) => {
  const {
    categories,
    subCategories,
  } = useSelector(electionsSelector);

  const categoryName =
    categories.find((cat) => cat.id === category)?.name || "";
  const subCategoryName =
    subCategories.find((subCat) => subCat.id === subCategory)?.name || "";

  return (
    <React.Fragment>
      <p>
        <b>{categoryName}</b>
        <br />- {subCategoryName}
      </p>
    </React.Fragment>
  );
};

const Status = ({ status }) => {
  let badgeClass;
  let statusName;

  switch (status) {
    case 1:
      statusName = "Published";
      badgeClass = "badge-soft-success";
      break;
    case 2:
      statusName = "Private";
      badgeClass = "badge-soft-secondary";
      break;
    case 3:
      statusName = "Pending Approval";
      badgeClass = "badge-soft-warning";
      break;
    case 4:
      statusName = "Missing Data";
      badgeClass = "badge-soft-warning";
      break;
    case 5:
      statusName = "Inprogress";
      statusName = "Inprogress";
      break;
    case 6:
      statusName = "New";
      badgeClass = "badge-soft-info";
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
    <span className={`badge ${badgeClass} text-uppercase`}>
      {statusName}
    </span>
  );
};


const Priority = ({ value }) => {
  let badgeClass;
  let priorityName;

  switch (value) {
    case 3:
      priorityName = "High";
      badgeClass = "badge bg-danger";
      break;
    case 2:
      priorityName = "Medium";
      badgeClass = "badge bg-warning";
      break;
    case 1:
      priorityName = "Low";
      badgeClass = "badge bg-success";
      break;
    default:
      priorityName = "Unknown";
      badgeClass = "badge bg-primary";
      break;
  }

  return (
    <span className={`${badgeClass} text-uppercase`}>
      {priorityName}
    </span>
  );
};



const Moderators = (cell) => {
  const moderators = Array.isArray(cell.value) ? cell.value : [];

  return (
    <React.Fragment>
      <div className="avatar-group">
        {moderators.map((moderator, index) => (
          <Link key={index} to="#" className="avatar-group-item">
            {moderator ? (
              <img
                src={process.env.REACT_APP_API_URL + moderator.img}
                alt={moderator.name}
                title={moderator.name} // Added title attribute for tooltip on hover
                className="rounded-circle avatar-xxs"
              />
            ) : (
              "No Moderator"
            )}
          </Link>
        ))}
      </div>
    </React.Fragment>
  );
};

const CreateBy = (cell) => {
  return <React.Fragment>{cell.value}</React.Fragment>;
};

const Actions = (props) => {
  const { cell, handleElectionClick, onClickDelete } = props;
  return (
    <React.Fragment>
      <div className="d-flex">
        <div className="flex-grow-1 elections_name">{cell.value}</div>
        <div className="hstack gap-2">
          <button
            to="#"
            className="btn btn-sm btn-soft-info edit-list"
            onClick={() => {
              const electionData = cell.row.original;
              handleElectionClick(electionData);
            }}
          >
            <i className="ri-pencil-fill align-bottom" />
          </button>
          <button
            to="#"
            className="btn btn-sm btn-soft-danger remove-list"
            onClick={() => {
              const electionData = cell.row.original;
              onClickDelete(electionData);
            }}
          >
            <i className="ri-delete-bin-5-fill align-bottom" />
          </button>
        </div>
      </div>
    </React.Fragment>
  );
};
export {
  Id,
  Name,
  CandidateCount,
  DueDate,
  Status,
  Priority,
  Category,
  Moderators,
  CreateBy,
  Actions,
};
