import React from "react";
import { useSelector } from "react-redux";
import { categorySelector } from 'Selectors';

import { Link } from "react-router-dom";
import * as moment from "moment";

// Component, Constants & Hooks
import { StatusOptions, PriorityOptions } from 'Common/Constants';
import { AvatarSmall } from "Common/Components";

const handleValidDate = (duedate) => {
  const formattedDate = moment(duedate).format("YYYY-MM-DD");
  return formattedDate;
};

const Id = (cell) => {
  return (
    <React.Fragment>
      <Link
        to={`/elections/${cell.row.original.slug}`}
        className="fw-medium link-primary"
      >
        {cell.value}
      </Link>{" "}
    </React.Fragment>
  );
};

const Name = (cellProps) => {
  return (
    <React.Fragment>
      <AvatarSmall row={cellProps.row} />
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
  const { categories, subCategories } = useSelector(categorySelector);

  const categoryName =
    categories.find((cat) => cat.id === category)?.name || "";

  return (
    <React.Fragment>
      <b>{categoryName}</b>
    </React.Fragment>
  );
};

const Status = ({ status }) => {
  const statusMapping = StatusOptions.reduce((acc, curr) => {
    acc[curr.id] = curr;
    return acc;
  }, {});

  const { name, badgeClass } = statusMapping[status] || {
    name: "غير معرف",
    badgeClass: "badge bg-primary",
  };

  return <span className={`${badgeClass} text-uppercase`}>{name}</span>;

};


const Priority = ({ value }) => {
  const priorityMapping = PriorityOptions.reduce((acc, curr) => {
    acc[curr.id] = curr;
    return acc;
  }, {});

  const { name, badgeClass } = priorityMapping[value] || {
    name: "غير معرف",
    badgeClass: "badge bg-primary",
  };

  return <span className={`${badgeClass} text-uppercase`}>{name}</span>;
};

export default Priority;




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
