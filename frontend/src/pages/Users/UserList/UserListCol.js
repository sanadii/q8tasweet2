import React from "react";
import { useSelector } from "react-redux";

import { Link } from "react-router-dom";
import * as moment from "moment";


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
const Id = (cellProps) => {
  return (
    <React.Fragment>
      {cellProps.row.original.id}
    </React.Fragment>
  );
};

<<<<<<< HEAD
const CheckboxHeader = ({ checkedAll }) => (
  <input
    type="checkbox"
    id="checkBoxAll"
    className="form-check-input"
    onClick={checkedAll}
  />
);





const CheckboxCell = (props) => {
  const { cell, deleteCheckbox } = props;
  return (
    <input
      type="checkbox"
      className="checkboxSelector form-check-input"
      value={cell.row.id}
      onChange={deleteCheckbox}
    />
  );
};

=======
>>>>>>> sanad

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


const CreateBy = (cell) => {
  return <React.Fragment>{cell.value}</React.Fragment>;
};

const Actions = (props) => {
<<<<<<< HEAD
  const { cell, handleUserClick, onClickDelete } = props;
=======
  const { cell, handleUserClick, handleItemDeleteClick } = props;
  const userData = cell.row.original;

>>>>>>> sanad
  return (
    <React.Fragment>
      <div className="d-flex">
        <div className="flex-grow-1 users_name">{cell.value}</div>
        <div className="hstack gap-2">
          <button
            to="#"
            className="btn btn-sm btn-soft-info edit-list"
<<<<<<< HEAD
            onClick={() => {
              const userData = cell.row.original;
              handleUserClick(userData);
            }}
=======
            onClick={() => { handleUserClick(userData); }}
>>>>>>> sanad
          >
            <i className="ri-pencil-fill align-bottom" />
          </button>
          {/* <button
            to="#"
            className="btn btn-sm btn-soft-warning edit-list"
            onClick={() => {
              const userData = cell.row.original;
              handleUserClick(userData);
            }}
          >
            <i className="ri-lock-fill align-bottom" />
          </button> */}
          <button
            to="#"
            className="btn btn-sm btn-soft-danger remove-list"
<<<<<<< HEAD
            onClick={() => {
              const userData = cell.row.original;
              onClickDelete(userData);
            }}
=======
            onClick={() => { handleItemDeleteClick(userData); }}
>>>>>>> sanad
          >
            <i className="ri-delete-bin-5-fill align-bottom" />
          </button>
        </div>
      </div>
    </React.Fragment>
  );
};
export { Id, CheckboxHeader, CheckboxCell, Name, Username, Actions };
