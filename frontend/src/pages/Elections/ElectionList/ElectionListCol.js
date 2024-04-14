import React from "react";
import { useSelector } from "react-redux";
import { categorySelector } from 'selectors';
import { Link } from "react-router-dom";

// Component, Constants & Hooks
import { StatusOptions, PriorityOptions } from "shared/constants/";
import { AvatarList } from "shared/components";
import { handleValidDate } from "shared/utils";

const CheckboxHeader = ({ handleCheckAllClick }) => (
  <input
    type="checkbox"
    id="checkBoxAll"
    className="form-check-input"
    onClick={handleCheckAllClick}
  />
);

const CheckboxCell = ({ row, handleCheckCellClick }) => (
  <input
    type="checkbox"
    className="checkboxSelector form-check-input"
    value={row.original.id}
    onChange={handleCheckCellClick}
  />
);

const Id = (cellProps) => {
  return (
    <React.Fragment>
      <Link
        to={`/dashboard/elections/${cellProps.row.original.slug}`}
        className="fw-medium link-primary"
      >
        {cellProps.row.original.id}
      </Link>{" "}
    </React.Fragment>
  );
};

const Name = (cellProps) => (
  <AvatarList {...cellProps} dirName="elections" />
);

const CandidateCount = (cellProps) => {
  <b>{cellProps.value}</b>
};


const DueDate = (cellProps) => (
  handleValidDate(cellProps.row.original.dueDate)
);

const Category = ({ category }) => {
  const { categories } = useSelector(categorySelector);

  const categoryName =
    categories.find((cat) => cat.id === category)?.name || "";

  return (
    <React.Fragment>
      <b>{categoryName}</b>
    </React.Fragment>
  );
};

const Status = (cellProps) => {
  const statusMapping = StatusOptions.reduce((acc, curr) => {
    acc[curr.id] = curr;
    return acc;
  }, {});

  const { name, badgeClass } = statusMapping[cellProps.row.original.task.status] || {
    name: "غير معرف",
    badgeClass: "badge bg-primary",
  };

  return <span className={`${badgeClass} text-uppercase`}>{name}</span>;

};


const Priority = (cellProps) => {
  const priorityMapping = PriorityOptions.reduce((acc, curr) => {
    acc[curr.id] = curr;
    return acc;
  }, {});

  const { name, badgeClass } = priorityMapping[cellProps.row.original.task.priority] || {
    name: "غير معرف",
    badgeClass: "badge bg-primary",
  };

  return <span className={`${badgeClass} text-uppercase`}>{name}</span>;
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
  const { cell, handleElectionClick, handleItemDeleteClick } = props;
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
              handleItemDeleteClick(electionData);
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
  CheckboxHeader,
  CheckboxCell,
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
