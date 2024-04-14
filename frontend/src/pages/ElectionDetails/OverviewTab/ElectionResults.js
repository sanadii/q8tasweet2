import React, { useState } from "react";
import { useSelector } from "react-redux";
import { electionSelector } from 'selectors';
import { Card, CardHeader, CardBody } from "reactstrap";
import { ToastContainer } from "react-toastify";

import ElectionResultCandidates from "./ElectionResultCandidates";
import ElectionResultParties from "./ElectionResultParties";

const ElectionResults = () => {
  const { electionMethod } = useSelector(electionSelector);
  const [electionResultStatus, setElectionResultStatus] = useState(""); // Also appears to be unused, consider its purpose

  return (
    <React.Fragment>
      <Card>
        <CardHeader>
          <h5 className="mb-0 d-flex align-items-center justify-content-between">
            <strong>المرشحين والنتائج</strong> - {electionResultStatus}
          </h5>
        </CardHeader>
        <CardBody>
          {electionMethod === "candidateOnly" ?
            <ElectionResultCandidates />
            :
            <ElectionResultParties />
          }
          <ToastContainer closeButton={false} limit={1} />
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default ElectionResults;
