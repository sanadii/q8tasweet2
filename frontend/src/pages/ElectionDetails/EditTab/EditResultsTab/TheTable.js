import React, { useMemo } from "react";
import DataTable from "./MyTable";
import "./styles.css";
import { TableContainer } from "shared/components";

export default function TheTable() {
  const data = [
    { isFirst: "y", name: "john", age: 67, address: "SSC" },
    { isFirst: "n", name: "Sam", age: 22, address: "ABC" },
    { isFirst: "n", name: "xse", age: 42, address: "SEA" },
  ];

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        columns: [
          {
            Header: "Name",
            accessor: "name"
          },
          {
            Header: "First One",
            accessor: "isFirst"
          }
        ]
      },
      {
        Header: "Info",
        columns: [
          {
            Header: "Age",
            accessor: "age"
          },
          {
            Header: "Address",
            accessor: "address"
          }
        ]
      }
    ],
    []
  );

  return (
    <div className="App">
      <DataTable data={data} columns={columns} />

      <TableContainer

        // Data
        columns={columns}
        data={data}
        customPageSize={50}
        isTableFooter={false}

      />


    </div>
  );
}
