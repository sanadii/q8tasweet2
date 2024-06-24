import React from "react";
import { useSelector } from "react-redux";
import { categorySelector } from 'selectors';

import { Link } from "react-router-dom";
import * as moment from "moment";

// Component, Constants & Hooks
import { StatusOptions, PriorityOptions } from "shared/constants/";
import { AvatarList } from "shared/components";

const handleValidDate = (dueDate) => {
  const formattedDate = moment(dueDate).format("YYYY-MM-DD");
  return formattedDate;
};

const CheckboxHeader = ({ checkedAll }) => (
  <input
    type="checkbox"
    id="checkBoxAll"
    className="form-check-input"
    onClick={checkedAll}
  />
);


const CheckboxCell = ({ row, deleteCheckbox }) => (
  <input
    type="checkbox"
    className="checkboxSelector form-check-input"
    value={row.original.id}
    onChange={deleteCheckbox}
  />
);

const Id = (cellProps) => {
  return (
    <React.Fragment>
      <Link
        to={`/users/${cellProps.row.original.slug}`}
        className="fw-medium link-primary"
      >
        {cellProps.row.original.id}
      </Link>{" "}
    </React.Fragment>
  );
};

const Name = (cellProps) => (
  <AvatarList {...cellProps} dirName="users" />
);

const CandidateCount = (cell) => { <b>{cell.value}</b> };


const DateTime = (cellProps) => (handleValidDate(cellProps.row.original.dueDate));

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
  const { cell, handleUserClick, onDeleteCheckBoxClick } = props;
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
              onDeleteCheckBoxClick(userData);
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
  DateTime,
  Status,
  Priority,
  Category,
  Moderators,
  CreateBy,
  Actions,
};
