import React from "react";
import { useSelector } from "react-redux";

import { Link } from "react-router-dom";
import * as moment from "moment";

const handleValidDate = (duedate) => {
  const formattedDate = moment(duedate).format("YYYY-MM-DD");
  return formattedDate;
};

<<<<<<< HEAD
=======
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

>>>>>>> sanad
const Id = (cell) => {
  return (
    <React.Fragment>
      <Link
        to={`/dashboard/campaigns/${cell.row.original.id}`}
        className="fw-medium link-primary"
      >
        {cell.value}
      </Link>{" "}
    </React.Fragment>
  );
};

<<<<<<< HEAD
const Name = (cell) => {
  return (
    <React.Fragment>
      <Link
        to={`/dashboard/campaigns/${cell.row.original.slug}`}
        className="fw-medium link-primary"
      >
        {cell.value}
=======
const Name = ({ name, slug, urlDir, }) => {
  return (
    <React.Fragment>
      <Link
        to={`/dashboard/${urlDir}/${slug}`}
        className="fw-medium link-primary"
      >
        {name}
>>>>>>> sanad
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

<<<<<<< HEAD
const DueDate = (cell) => {
=======
const DateTime = (cell) => {
>>>>>>> sanad
  return <React.Fragment>{handleValidDate(cell.value)}</React.Fragment>;
};

const Category = ({ category, subCategory }) => {
  const { categories, subCategories } = useSelector((state) => ({
    categories: state.Categories.categories,
    subCategories: state.Categories.subCategories,
  }));

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
  switch (status) {
    case "New":
      return (
        <span className="badge badge-soft-info text-uppercase">{status}</span>
      );
    case "Pending":
      return (
        <span className="badge badge-soft-warning text-uppercase">
          {status}
        </span>
      );
    case "Inprogress":
      return (
        <span className="badge badge-soft-warning text-uppercase">
          {status}
        </span>
      );
    case "Published":
      return (
        <span className="badge badge-soft-success text-uppercase">
          {status}
        </span>
      );
    case "Private":
      return (
        <span className="badge badge-soft-secondary text-uppercase">
          {status}
        </span>
      );
    case "Deleted":
      return (
        <span className="badge badge-soft-secondary text-uppercase">
          {status}
        </span>
      );
    default:
      return (
        <span className="badge badge-soft-primary text-uppercase">
          {status}
        </span>
      );
  }
};

const Priority = (cell) => {
  return (
    <React.Fragment>
      {cell.value === "Medium" ? (
        <span className="badge bg-warning text-uppercase">{cell.value}</span>
      ) : cell.value === "High" ? (
        <span className="badge bg-danger text-uppercase">{cell.value}</span>
      ) : cell.value === "Low" ? (
        <span className="badge bg-success text-uppercase">{cell.value}</span>
      ) : null}
    </React.Fragment>
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
<<<<<<< HEAD
  const { cell, handleCampaignClick, onClickDelete } = props;
=======
  const { cell, handleCampaignClick, handleItemDeleteClick } = props;
  const campaignData = cell.row.original;

>>>>>>> sanad
  return (
    <React.Fragment>
      <div className="d-flex">
        <div className="flex-grow-1 campaigns_name">{cell.value}</div>
        <div className="hstack gap-2">
<<<<<<< HEAD
=======

          {/* View */}
>>>>>>> sanad
          <button
            to="#"
            className="btn btn-sm btn-soft-info edit-list"
            onClick={() => {
<<<<<<< HEAD
              const campaignData = cell.row.original;
              handleCampaignClick(campaignData);
=======
              handleCampaignClick(campaignData, "viewGuaranteeGroup");
>>>>>>> sanad
            }}
          >
            <i className="ri-pencil-fill align-bottom" />
          </button>
<<<<<<< HEAD
=======

          {/* Update */}
          <button
            to="#"
            className="btn btn-sm btn-soft-info edit-list"
            onClick={() => {
              handleCampaignClick(campaignData, "updateGuaranteeGroup");
            }}
          >
            <i className="ri-pencil-fill align-bottom" />
          </button>
          {/* Delete */}
>>>>>>> sanad
          <button
            to="#"
            className="btn btn-sm btn-soft-danger remove-list"
            onClick={() => {
<<<<<<< HEAD
              const campaignData = cell.row.original;
              onClickDelete(campaignData);
=======
              handleItemDeleteClick(campaignData);
>>>>>>> sanad
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
<<<<<<< HEAD
  Id,
  Name,
  CandidateCount,
  DueDate,
=======
  CheckboxHeader,
  CheckboxCell,
  Id,
  Name,
  CandidateCount,
  DateTime,
>>>>>>> sanad
  Status,
  Priority,
  Category,
  Moderators,
  CreateBy,
  Actions,
};
