import React from "react";
import { useSelector } from "react-redux";
import { categorySelector } from 'selectors';
import { Link } from "react-router-dom";

// Component, Constants & Hooks
import { StatusOptions, getStatusBadge, PriorityOptions } from "shared/constants/";
import { getFieldStaticOptions, getOptionBadge } from "shared/hooks"
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

const Name = (cellProps) => {
  const { name, image, slug, dirName } = cellProps
  return (
    < AvatarList
      name={name}
      image={image}
      slug={slug}
      dirName={dirName}
    />
  );
};


const CandidateCount = (cellProps) => {
  <b>{cellProps.value}</b>
};


const DateTime = (cellProps) => (
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


const Actions = (props) => {
  const { cell, handleElectionClick, handleItemDeleteClick } = props;
  const electionData = cell.row.original;

  return (
    <React.Fragment>
      <div className="d-flex">
        <div className="flex-grow-1 elections_name">{cell.value}</div>
        <div className="hstack gap-2">
          <button
            to="#"
            className="btn btn-sm btn-soft-info edit-list"
            onClick={() => {
              handleElectionClick(electionData);
            }}
          >
            <i className="ri-pencil-fill align-bottom" />
          </button>
          <button
            to="#"
            className="btn btn-sm btn-soft-danger remove-list"
            onClick={() => {
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
  DateTime,
  Status,
  Priority,
  Category,
  Moderators,
  CreateBy,
  Actions,
};
