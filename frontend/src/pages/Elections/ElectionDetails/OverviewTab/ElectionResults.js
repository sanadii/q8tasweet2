// React imports
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { SortingStatus, ImageCandidateWinnerCircle } from "shared/components";

// Store & Selectors
import { electionSelector } from 'Selectors';

// UI & Utilities
import { Card, CardHeader, CardBody } from "reactstrap";
import { ToastContainer } from "react-toastify";
import { useWebSocketContext } from 'utils/WebSocketContext';
import ElectionResultCandidates from "./ElectionResultCandidates";
import ElectionResultParties from "./ElectionResultParties";


const ElectionResults = () => {

  // States & Constants
  const { election, electionMethod, electionResultView, electionResultParty, electionResultSorting, electionCandidates, electionPartyCandidates, electionCommittees, error } = useSelector(electionSelector);
  const [showDetailedResults, setShowDetailedResults] = useState(false);
  const [candidatesResult, setCandidatesResult] = useState([]);
  const [electionResultStatus, setElectionResultStatus] = useState("");

  // candidates based on election Type
  const candidates = electionMethod !== "candidateOnly" ? electionPartyCandidates : electionCandidates;

  const electionSeats = election.electSeats;
  const calculateTotalVotes = useCallback((committeeResults) => {
    return Object.values(committeeResults).reduce((sum, currentVotes) => sum + currentVotes, 0);
  }, []);


  const sortAndUpdatePositions = (candidates) => {
    const sortedCandidates = [...candidates].sort((a, b) => b.votes - a.votes);
    sortedCandidates.forEach((candidate, index) => {
      candidate.position = index + 1;
      candidate.isWinner = index < electionSeats;
    });

    return sortedCandidates;
  };

  // Initialize candidatesResult state and WebSocket
  const calculateCommitteeResults = useCallback((candidate, electionResultView) => {
    const committeeResult = {};
    let totalVotes = 0;
    let electionVoteResults;
    let electionResultStatus;

    console.log("electionResultSorting: ", electionResultSorting)
    if (electionResultSorting === "true") {
      electionVoteResults = candidate.committeeSorting;
      electionResultStatus = SortingStatus
    } else {
      if (electionResultView === "total") {
        totalVotes = candidate.votes;
        electionResultStatus = "نتائج إجمالية"
      } else {
        if (electionResultView === "detailed" && candidate.committeeVotes) {
          electionVoteResults = candidate.committeeVotes;
          electionResultStatus = "نتائج تفصيلية"
        }
      }

      electionCommittees.forEach(committee => {
        const votes = electionVoteResults ?
          electionVoteResults.find(cs => cs.electionCommittee === committee.id)?.votes || 0 : 0;
        committeeResult[committee.id] = votes;
      });

      totalVotes = calculateTotalVotes(committeeResult);
    }

    return { committeeResult, totalVotes, electionResultStatus };
  }, [electionCommittees, electionResultView, electionResultSorting, calculateTotalVotes]);

  useEffect(() => {
    const initialSortingData = candidates.map(candidate => {
      const { committeeResult, totalVotes, electionResultStatus } = calculateCommitteeResults(candidate, electionResultView);
      // Use the first status as the default for the entire election
      setElectionResultStatus(electionResultStatus);

      return {
        candidateId: candidate.id,
        name: candidate.name,
        gender: candidate.gender,
        image: candidate.image,
        isWinner: candidate.isWinner,
        committeeResult,
        votes: totalVotes
      };
    });

    // Use sortAndUpdatePositions and pass electionSeats from the election object
    const sortedCandidates = sortAndUpdatePositions(initialSortingData, electionSeats);
    setCandidatesResult(sortedCandidates);
  }, [candidates, electionCommittees, electionResultView, electionSeats]);


  const updateSortingVotes = (candidateId, newVotes, committeeId) => {
    setCandidatesResult(prevSorting => {
      const updatedSorting = prevSorting.map(candidate => {
        if (candidate.candidateId === candidateId) {
          // Update only the votes of the specific committee
          const updatedCommitteeVotes = { ...candidate.committeeResult, [committeeId]: newVotes };
          // Recalculate the total votes
          const totalVotes = Object.values(updatedCommitteeVotes).reduce((sum, currVotes) => sum + currVotes, 0);
          return { ...candidate, committeeResult: updatedCommitteeVotes, votes: totalVotes };
        }
        return candidate;
      });
      return sortAndUpdatePositions(updatedSorting);
    });
  };


  // Update the votes from electionSorting Socket
  const { messageHistory } = useWebSocketContext();

  const electioSortingHistory = messageHistory.electionSorting || [];

  useEffect(() => {
    // Access and process each object within the array
    electioSortingHistory.forEach(data => {
      const { electionCandidateId, votes, electionCommitteeId } = data;
      updateSortingVotes(electionCandidateId, votes, electionCommitteeId);
    });
  }, [candidates, electioSortingHistory, updateSortingVotes]);


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
            // For Sorting Results
            const committeeVote = row.committeeResult[committee.id];
            return committeeVote || 0;

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
            <h5 className="mb-0 flex-grow-1"><strong>المرشحين والنتائج</strong> - {electionResultStatus}</h5>
            <div className="flex-shrink-0">
              {
                (electionResultView === "detailed") &&
                <button
                  type="button"
                  className="btn btn-soft-danger btn-md"
                  onClick={toggleDetailedResults}
                >
                  {(showDetailedResults ? 'إخفاء النتائج التفصيلية' : 'عرض النتائج التفصيلية')}
                </button>
              }
            </div>
          </div>
        </CardHeader>
        <CardBody>

          {
            (electionMethod === "candidateOnly") ? (
              <ElectionResultCandidates
                candidatesResult={candidatesResult}
                columns={columns}
                error={error}
              />
            ) : (
              <ElectionResultParties
                candidatesResult={candidatesResult}
                columns={columns}
                error={error}
              />
            )
          }
          <ToastContainer closeButton={false} limit={1} />
        </CardBody>
      </Card>

    </React.Fragment >
  );
};

export default ElectionResults;
