// React imports
import React, { useMemo } from "react";
import { Loader, TableContainer } from "shared/components";

// Redux & Selector
import { useSelector } from "react-redux";
import { ImageCandidateWinnerCircle } from "shared/components";
import { electionSelector } from 'selectors';

import { Id, CandidateName, Position, Votes } from "./ElectionResultCol";

const ElectionResultCandidates = () => {
  const { electionCandidates, error } = useSelector(electionSelector);

  const columns = useMemo(() => [
    {
      Header: "المركز",
      accessor: "position",
      Cell: (cellProps) => <Position {...cellProps} />,
      sortType: 'alphanumeric'

    },
    {
      Header: "المرشح",
      accessor: "candidate",
      Cell: (cellProps) => <CandidateName {...cellProps} />,
    },
    {
      Header: 'المجموع',
      accessor: "votes",
      Cell: (cellProps) => <Votes {...cellProps} />,
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
