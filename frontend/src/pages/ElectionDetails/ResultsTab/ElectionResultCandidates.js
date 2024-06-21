// React imports
import React, { useMemo } from "react";
import { Loader, TableContainer } from "shared/components";

// Redux & Selector
import { useSelector } from "react-redux";
import { electionSelector } from 'selectors';

import { ResultCandidateName, CandidatePosition, CandidateVotes } from "shared/components";

const ElectionResultCandidates = () => {
  const { electionCandidates, error } = useSelector(electionSelector);

  

  const columns = useMemo(() => [
    {
      Header: "المركز",
      accessor: "position",
      Cell: (cellProps) =>
        <CandidatePosition
          position={cellProps.row.original.position}
        />,
      sortType: 'alphanumeric'

    },
    {
      Header: "المرشح",
      accessor: "candidate",
      Cell: (cellProps) =>
        <ResultCandidateName
          name={cellProps.row.original.name}
          image={cellProps.row.original.image}
          result={cellProps.row.original.result}
        />
    },
    {
      Header: 'المجموع',
      accessor: "votes",
      Cell: (cellProps) =>
        <CandidateVotes
          candidateVotes={cellProps.row.original.votes}
        />,
    },
  ], []);
  return (
    <React.Fragment>
      {electionCandidates && electionCandidates.length ? (
        <TableContainer
          // Data
          columns={columns}
          data={electionCandidates || []}
          customPageSize={50}
          sortBy="position"

          // Styling
          divClass="table-responsive table-card mb-3"
          tableClass="align-middle table-nowrap mb-0"
          theadClass="table-light table-nowrap"
          thClass="table-light text-muted"
        />
      ) : (
        <Loader error={error} />
      )}
    </React.Fragment >
  );
};

export default ElectionResultCandidates;
