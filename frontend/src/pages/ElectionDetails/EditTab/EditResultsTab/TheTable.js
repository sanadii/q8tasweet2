import React, { useMemo } from "react";
import DataTable from "./MyTable";
import "./styles.css";

export default function TheTable() {
  const data = [
    {
      date: "2021-01-01",
      options: [
        { isFirst: "y", name: "john" },
        { isFirst: "n", name: "Sam" }
      ]
    },
    {
      date: "2021-11-01",
      options: [
        { isFirst: "n", name: "TY" },
        { isFirst: "n", name: "joe" }
      ]
    }
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
      }
    ],
    []
  );

  return (
    <div className="App">
      {data.map((d, index) => (
        <DataTable key={index} date={d.date} data={d.options} columns={columns} />
      ))}
    </div>
  );
}
