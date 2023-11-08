// React imports
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { ImageCandidateWinnerCircle } from "Common/Components";

// Store & Selectors
import { electionSelector } from 'Selectors';
// import { Id, CheckboxHeader, CheckboxCell, Name, Position, Votes, Actions } from "./CandidatesCol";

// Common Components
import { Loader, ExportCSVModal, TableContainer, TableContainerHeader } from "Common/Components";
// import { calculateCandidatePosition } from "./CandidateCalculations"
import { usePermission, useDelete } from "Common/Hooks";
import { transformResultData } from '../ResultsTab/ResultHelper'; // Importing the transformData function

// UI & Utilities
import { Col, Row, Card, CardHeader, CardBody, Nav, NavItem, NavLink } from "reactstrap";
import { isEmpty } from "lodash";
import { toast, ToastContainer } from "react-toastify";
import classnames from "classnames";

const CandidatesTab = () => {

  const { election, electionCandidates, electionCommittees, error } = useSelector(electionSelector);

  // Constants
  const [electionCandidate, setElectionCandidate] = useState([]);
  const [electionCandidateList, setElectionCandidateList] = useState(electionCandidates);

  const [electionCampaign, setElectionCampaign] = useState([]);
  const [electionCampaignList, setElectionCampaignList] = useState(electionCampaign);

  const [showDetailedResults, setShowDetailedResults] = useState(false);


  const transformedData = useMemo(
    () => transformResultData(
      electionCandidates,
      electionCommittees,
      // committeeEdited,
      // handleEditCell,
      election // Passing election as an argument
    ),
    [electionCandidates, electionCommittees, election]
  );

  // Sort List by Candidate Position
  useEffect(() => {
    const calculateCandidatePosition = (candidates) => {
      // Sort candidates by votes in desending order
      let sortedCandidates = [...candidates].sort((a, b) => b.votes - a.votes);

      // Assign positions
      for (let i = 0; i < sortedCandidates.length; i++) {
        sortedCandidates[i].position = i + 1;
      }

      // Set isWinner property based on electSeats
      const electSeats = election.electSeats || 0;
      sortedCandidates = sortedCandidates.map(candidate => ({
        ...candidate,
        isWinner: candidate.position <= electSeats
      }));

      // Sort candidates by positions in ascending order (issue in react its always reversing)
      sortedCandidates = sortedCandidates.sort((a, b) => b.position - a.position);
      return sortedCandidates;
    };

    const sortedCandidates = calculateCandidatePosition(electionCandidates);
    setElectionCandidateList(sortedCandidates);

  }, [electionCandidates, election.electSeats]);


  const toggleDetailedResults = () => {
    setShowDetailedResults((prev) => !prev);
  };
  const columns = useMemo(() => {
    const baseColumns = [
      {
        Header: "المركز",
        accessor: "position",
        Cell: (cellProps) => <strong>{cellProps.row.original.position}</strong>,
      },
      {
        Header: "المرشح",
        filterable: true,
        Cell: (cellProps) =>
          <ImageCandidateWinnerCircle
            gender={cellProps.row.original.gender}
            name={cellProps.row.original.name}
            imagePath={cellProps.row.original.image}
            isWinner={cellProps.row.original.isWinner}
          />,
      },
      {
        Header: 'المجموع',
        accessor: "votes",
        Cell: (cellProps) => <strong className="text-success">{cellProps.row.original.votes}</strong>,
      },
    ];
    if (showDetailedResults) {
      electionCommittees.forEach((committee) => {
        baseColumns.push({
          Header: committee.name,
          accessor: (row) => {
            const committeeVotes = row.committeeVotes || [];
            const committeeVote = committeeVotes.find((vote) => vote.electionCommittee === committee.id);
            return committeeVote ? committeeVote.votes : 0;
          },
          Cell: (cellProps) => <strong>{cellProps.value}</strong>,
        });
      });
    }

    return baseColumns;
  }, [showDetailedResults, electionCommittees]);



  return (
    <React.Fragment>
      <Card>
        <CardHeader>
          <div className="align-items-center d-flex">
            <h5 className="mb-0 flex-grow-1"><strong>المرشحين والنتائج</strong></h5>
            <div className="flex-shrink-0">
              <button
                type="button"
                className="btn btn-soft-danger btn-md"
                onClick={toggleDetailedResults}
              >
                {showDetailedResults ? 'إخفاء النتائج التفصيلية' : 'عرض النتائج التفصيلية'}
              </button>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          {electionCandidateList && electionCandidateList.length ? (
            <TableContainer
              // Data
              columns={columns}
              data={electionCandidateList || []}
              customPageSize={50}

              // Styling
              divClass="table-responsive table-card mb-3"
              tableClass="align-middle table-nowrap mb-0"
              theadClass="table-light table-nowrap"
              thClass="table-light text-muted"
            />
          ) : (
            <Loader error={error} />
          )}
          <ToastContainer closeButton={false} limit={1} />
        </CardBody>
      </Card>

    </React.Fragment >
  );
};

export default CandidatesTab;
