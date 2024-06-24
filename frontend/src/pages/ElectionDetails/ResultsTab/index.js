import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { SortingStatus, ImageCandidateWinnerCircle } from "shared/components";
import { electionSelector, campaignSelector } from 'selectors';
import { Card, CardHeader, CardBody } from "reactstrap";
import { ToastContainer } from "react-toastify";
import { useWebSocketContext } from 'shared/utils';
import ElectionResultCandidates from "./ElectionResultCandidates";
import ElectionResultParties from "./ElectionResultParties";

const ResultsTab = () => {
  const { election, electionMethod, electionResultSorting, error } = useSelector(electionSelector);
  const { currentElection, electionCommitteeSites } = useSelector(campaignSelector);

  const isDetailedResults = currentElection?.electionDetails?.isDetailedResults;
  const campaignCurrentElectionCandidates = currentElection.electionCandidates;

  const [displayDetailedResults, setDisplayDetailedResults] = useState(false);
  const [candidatesResult, setCandidatesResult] = useState([]);
  const [electionResultStatus, setElectionResultStatus] = useState("");

  const candidates = campaignCurrentElectionCandidates;
  const electionSeats = election.electSeats;


  // Candidate Committee Result and Sorting
  const calculateTotalVotes = useCallback((campaignSorting) => {
    return Object.values(campaignSorting).reduce((sum, currentVotes) => sum + currentVotes, 0);
  }, []);

  const sortAndUpdatePositions = (candidates) => {
    const sortedCandidates = [...candidates].sort((a, b) => b.votes - a.votes);
    sortedCandidates.forEach((candidate, index) => {
      candidate.position = index + 1;
      candidate.isWinner = index < electionSeats;
    });

    return sortedCandidates;
  };

  const calculateCommitteeResults = useCallback((candidate, isDetailedResults) => {
    const committeeResult = {};
    let totalVotes = 0;
    let electionVoteResults;
    let electionResultStatus;

    const candidateCommitteeResults = candidate?.campaignSorting;
    const candidateCommitteeSorting = candidate?.campaignSorting;

    if (electionResultSorting === "true") {
      electionVoteResults = candidate.committeeSorting;
      electionResultStatus = SortingStatus;
    } else {
      if (!isDetailedResults) {
        totalVotes = candidate.votes;
        electionResultStatus = "نتائج إجمالية";
      } else {
        if (isDetailedResults && candidateCommitteeResults) {
          electionVoteResults = candidateCommitteeResults;
          electionResultStatus = "نتائج تفصيلية";
        }
      }

      electionCommitteeSites.forEach(committeeSite => {
        committeeSite.committees.forEach(committee => {
          const votes = electionVoteResults ?
            electionVoteResults.find(cs => cs.committee === committee.id)?.votes || 0 : 0;
          committeeResult[committee.id] = votes;
        });
      });

      totalVotes = calculateTotalVotes(committeeResult);
    }

    return { committeeResult, totalVotes, electionResultStatus };
  }, [electionCommitteeSites, electionResultSorting, calculateTotalVotes]);

  useEffect(() => {
    const initialSortingData = candidates.map(candidate => {
      const { committeeResult, totalVotes, electionResultStatus } = calculateCommitteeResults(candidate, isDetailedResults);
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

    const sortedCandidates = sortAndUpdatePositions(initialSortingData, electionSeats);
    setCandidatesResult(sortedCandidates);
  }, [candidates, isDetailedResults, electionSeats, sortAndUpdatePositions, calculateCommitteeResults]);

  const updateSortingVotes = useCallback((candidateId, newVotes, committeeId) => {
    setCandidatesResult(prevSorting => {
      const updatedSorting = prevSorting.map(candidate => {
        if (candidate.candidateId === candidateId) {
          const updatedCommitteeVotes = { ...candidate.committeeResult, [committeeId]: newVotes };
          const totalVotes = Object.values(updatedCommitteeVotes).reduce((sum, currVotes) => sum + currVotes, 0);
          return { ...candidate, committeeResult: updatedCommitteeVotes, votes: totalVotes };
        }
        return candidate;
      });
      return sortAndUpdatePositions(updatedSorting);
    });
  }, [sortAndUpdatePositions]);


  const { messageHistory } = useWebSocketContext();
  const electioSortingHistory = messageHistory.electionSorting || [];

  useEffect(() => {
    electioSortingHistory.forEach(data => {
      const { electionCandidateId, votes, electionCommitteeId } = data;
      updateSortingVotes(electionCandidateId, votes, electionCommitteeId);
    });
  }, [candidates, electioSortingHistory, updateSortingVotes]);

  const toggleDetailedResults = () => {
    setDisplayDetailedResults((prev) => !prev);
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

    const getBackgroundColor = (gender) => {
      return gender === 1 ? 'info' : 'pink';
    };

    const committeeColumnHeader = (committeeSite, index) => {
      const textColorByGender = getBackgroundColor(committeeSite?.gender);

      return (
        <div
          key={`header-${index}`}
          className={`d-flex justify-content-center align-items-center text-${textColorByGender} text-center`}
        >
          {committeeSite.name}
        </div>
      );
    };

    if (displayDetailedResults) {
      electionCommitteeSites.forEach((committeeSite, index) => {
        baseColumns.push({
          Header: () => committeeColumnHeader(committeeSite, index),
          accessor: `committeeSite_${committeeSite.id}`,
          columns: committeeSite.committees.map((committee, subIndex) => ({
            Header: (
              <div key={`subheader-${subIndex}`}>
                لجنة {committee.id}
              </div>
            ),
            accessor: `committee_${committee.id}`, // Ensure unique accessor for each committee
            id: `committee_${committee.id}`, // Add unique id
            Cell: ({ row }) => {
              const candidate = row.original;
              const committeeVotes = candidate.committeeResult[committee.id] || 0;
              // const committeeSortingVotes = candidate.campaignSorting[committee.id] || 0;
              return <strong className="text-success">{committeeVotes}</strong>;
            }
          }))
        });
      });
    }

    return baseColumns;
  }, [displayDetailedResults, electionCommitteeSites]);

  return (
    <React.Fragment>
      <Card>
        <CardHeader>
          <div className="align-items-center d-flex">
            <h5 className="mb-0 flex-grow-1"><strong>المرشحين والنتائج</strong> - {electionResultStatus}</h5>
            <div className="flex-shrink-0">
              {
                isDetailedResults &&
                <button
                  type="button"
                  className="btn btn-soft-danger btn-md"
                  onClick={toggleDetailedResults}
                >
                  {(displayDetailedResults ? 'إخفاء النتائج التفصيلية' : 'عرض النتائج التفصيلية')}
                </button>
              }
            </div>
          </div>
        </CardHeader>
        <CardBody>
          {
            (electionMethod === "candidateOnly" || electionMethod === "partyCandidateOriented") ? (
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
    </React.Fragment>
  );
};

export default ResultsTab;
