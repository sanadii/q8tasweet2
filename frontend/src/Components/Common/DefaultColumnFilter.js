import React, { useState } from "react";
import {
  Col,
  Row,
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
} from "reactstrap";
import { Link } from "react-router-dom";
import Flatpickr from "react-flatpickr";
import Select from "react-select";

const ElectionColumnFilter = ({
  column: { filterValue, setFilter, preFilteredRows, id },
}) => {
  const options = React.useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach((row) => {
      options.add(row.values[id]);
    });
    return [...options.values()];
  }, [id, preFilteredRows]);

  return (
    <select
      className="form-control"
      value={filterValue}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
    >
      <option value="">All {id}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export { ElectionColumnFilter };
