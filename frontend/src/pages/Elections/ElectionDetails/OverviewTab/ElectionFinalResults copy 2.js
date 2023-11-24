// React imports
import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { Loader, TableContainer, ImageCandidateWinnerCircle } from "components";

// Store & Selectors
import { electionSelector } from 'Selectors';

// UI & Utilities
import { Card, CardHeader, CardBody } from "reactstrap";
import { toast, ToastContainer } from "react-toastify";

const CandidatesTab = () => {

  const { election, electionCandidates, electionCommittees, error } = useSelector(electionSelector);

  // Constants
  const [electionCandidateList, setElectionCandidateList] = useState(electionCandidates);
  const electionType = election.electType;
  console.log ("electionType: ", electionType)
  const [showDetailedResults, setShowDetailedResults] = useState(false);
  const CampaignSlug = 'UmUXPn8A';
  const committeeId = 5;
  const [socket, setSocket] = useState(null);

  // Update the WebSocket from slug & url
  useEffect(() => {
    const wsUrl = `ws://127.0.0.1:8000/ws/campaigns/${CampaignSlug}/`;
    const newSocket = new WebSocket(wsUrl);

    newSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("WebSocket Data Received:", data); // Log the received data
      if (data.type === 'vote_update') {
        console.log(`Updating votes for candidate ${data.electionCandidateId} in committee ${data.electionCommitteeId} to ${data.votes}`);
        updateSortingData(data.electionCandidateId, data.votes, data.electionCommitteeId);
      }
    };

    setSocket(newSocket);

    return () => {
      if (newSocket) newSocket.close();
    };
  }, [CampaignSlug]);



  // Function to update sorting data for a specific candidate and committee
  const updateSortingData = (candidateId, newVotes, electionCommitteeId) => {
    setElectionCandidateList(prevCandidates => {
      return prevCandidates.map(candidate => {
        if (candidate.id === candidateId) {
          // Update the committeeSorting array with the new vote count for the specific committee
          const updatedCommitteeSorting = candidate.committeeSorting.map(committeeSort => {
            if (committeeSort.electionCommittee === electionCommitteeId) {
              return { ...committeeSort, votes: newVotes };
            }
            return committeeSort;
          });

          // Recalculate the total votes by summing up the votes from all committees
          const totalVotes = updatedCommitteeSorting.reduce((sum, sort) => sum + sort.votes, 0);

          // Return the candidate with the updated committeeSorting and total votes
          return { ...candidate, committeeSorting: updatedCommitteeSorting, votes: totalVotes };
        }
        return candidate;
      });
    });
  };

  
  

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
            // const committeeVotes = row.committeeVotes || [];
            // const committeeSorting = row.committeeSorting || [];
            const committeeVote = row.committeeSorting.find(sort => sort.electionCommittee === committee.id);
            return committeeVote ? committeeVote.votes : 0;
                  },
          Cell: (cellProps) => <strong>{cellProps.value}</strong>,
        });
      });
    }

    return baseColumns;
  }, [showDetailedResults, electionCommittees]);


  console.log("Current Election Candidate List:", electionCandidateList);

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
