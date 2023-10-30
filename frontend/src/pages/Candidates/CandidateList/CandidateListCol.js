import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { StatusOptions, PriorityOptions } from 'Common/Constants';
import { AvatarList } from "Common/Components";



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
    <Link
      to={`/candidate/${cellProps.row.original.id}`}
      className="fw-medium link-primary"
    >
      {cellProps.row.original.id}
    </Link>
  );
};

const Name = (cellProps) => (
  <AvatarList {...cellProps} dirName="candidates" />
);




const Status = (cellProps) => {
  const statusMapping = StatusOptions.reduce((acc, curr) => {
    acc[curr.id] = curr;
    return acc;
  }, {});


  const { name, badgeClass } = statusMapping[cellProps.row.original.status] || {

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

  const { name, badgeClass } = priorityMapping[cellProps.row.original.priority] || {
    name: "غير معرف",
    badgeClass: "badge bg-primary",
  };

  return <span className={`${badgeClass} text-uppercase`}>{name}</span>;
};

export default Priority;


const CreateBy = (cell) => {
  return <React.Fragment>{cell.value}</React.Fragment>;
};

const Actions = (props) => {
  const { cell, handleCandidateClick, onClickDelete } = props;
  return (
    <React.Fragment>
      <div className="d-flex">
        <div className="flex-grow-1 candidates_name">{cell.value}</div>
        <div className="hstack gap-2">
          <button
            to="#"
            className="btn btn-sm btn-soft-info edit-list"
            onClick={() => {
              const candidateData = cell.row.original;
              handleCandidateClick(candidateData);
            }}
          >
            <i className="ri-pencil-fill align-bottom" />
          </button>
          <button
            to="#"
            className="btn btn-sm btn-soft-danger remove-list"
            onClick={() => {
              const candidateData = cell.row.original;
              onClickDelete(candidateData);
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
  Status,
  Priority,
  CreateBy,
  Actions,
};
