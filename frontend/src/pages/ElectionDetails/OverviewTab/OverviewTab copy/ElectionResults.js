import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { SortingStatus, ImageCandidateWinnerCircle } from "shared/components";
import { electionSelector } from 'selectors';
import { Card, CardHeader, CardBody } from "reactstrap";
import { ToastContainer } from "react-toastify";

import ElectionResultCandidates from "./ElectionResultCandidates";
import ElectionResultParties from "./ElectionResultParties";

const ElectionResults = () => {
  const { election, electionMethod, electionCandidates,  error } = useSelector(electionSelector);
  const [showDetailedResults, setShowDetailedResults] = useState(false); // Currently unused, consider removing if not needed
  const [electionResultStatus, setElectionResultStatus] = useState(""); // Also appears to be unused, consider its purpose

  // Define columns for React-Table, memoized to prevent unnecessary re-renders
  const columns = useMemo(() => [
    {
      Header: "المركز",
      accessor: "position",
      Cell: ({ row }) => <strong>{row.original.position}</strong>,
    },
    {
      Header: "المرشح",
      accessor: "candidate",
      Cell: ({ row }) => (
        <ImageCandidateWinnerCircle
          gender={row.original.gender}
          name={row.original.name}
          imagePath={row.original.image}
          isWinner={row.original.isWinner}
        />
      ),
    },
    {
      Header: 'المجموع',
      accessor: "votes",
      Cell: ({ row }) => <strong className="text-success">{row.original.votes}</strong>,
    },
  ], []);

  // Conditional rendering based on electionMethod
  const ElectionResultComponent = electionMethod === "candidateOnly"
    ? ElectionResultCandidates
    : ElectionResultParties;


    console.log("CONSOLE: columns: ", columns)
    console.log("CONSOLE: electionMethod: ", electionMethod)
    console.log("CONSOLE: candidatesResult: ", electionCandidates)
  
  return (
    <React.Fragment>
      <Card>
        <CardHeader>
          <h5 className="mb-0 d-flex align-items-center justify-content-between">
            <strong>المرشحين والنتائج</strong> - {electionResultStatus}
          </h5>
        </CardHeader>
        <CardBody>
          <ElectionResultComponent
            candidatesResult={electionCandidates}
            columns={columns}
            error={error}
          />
          <ToastContainer closeButton={false} limit={1} />
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default ElectionResults;
