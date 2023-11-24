import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { campaignSelector, userSelector } from 'Selectors';
import { TableContainer } from 'components';
import { Card, CardHeader, CardBody, Button, Row, Col } from "reactstrap";

const SortingTab = () => {
  const { campaign, campaignElectionCandidates, currentCampaignMember } = useSelector(campaignSelector);
  const { userId } = useSelector(userSelector);


  // Logic committee is not set by the campaign Moderators
  const memberCommitteeId = currentCampaignMember.committee;

  const committeeId = memberCommitteeId; // Assuming this is dynamically set or retrieved from somewhere
  const [candidatesData, setCandidatesData] = useState([]);
  const [socket, setSocket] = useState(null);

  // Consolidate candidate data with vote counts
  const consolidateCandidateData = () => {
    return campaignElectionCandidates.map(candidate => {
      const committeeSortingForCandidate = candidate.committeeSorting.find(sorting =>
        sorting.electionCommittee === committeeId);
  
      return {
        ...candidate,
        votesForCommittee: committeeSortingForCandidate ? committeeSortingForCandidate.votes : 0 // Numeric zero
      };
    });
  };
  

  // Update the WebSocket from slug & url
  useEffect(() => {
    const { slug } = campaign;
    const wsUrl = `ws://127.0.0.1:8000/ws/campaigns/${slug}/`;
    const newSocket = new WebSocket(wsUrl);
    setSocket(newSocket);

    return () => {
      if (newSocket) newSocket.close();
    };
  }, [campaign]);

  useEffect(() => {
    const consolidatedData = consolidateCandidateData();
    setCandidatesData(consolidatedData);
  }, [campaign, campaignElectionCandidates]);


  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === 'vote_update') {
          setCandidatesData(currentCandidates => {
            return currentCandidates.map(candidate => {
              if (candidate.id === message.electionCandidateId) {
                const updatedCommitteeSorting = candidate.committeeSorting.map(committeeSort => {
                  if (committeeSort.electionCommittee === message.electionCommitteeId) {
                    return { ...committeeSort, votes: message.votes };
                  }
                  return committeeSort;
                });
                return { ...candidate, committeeSorting: updatedCommitteeSorting };
              }
              return candidate;
            });
          });
        }
      };
    }
  }, [socket]);


  // Process the candidatesData to create the tableData with the correct structure
  const tableData = useMemo(() => candidatesData.map(candidate => {
    const committeeSort = candidate.committeeSorting.find(cs => cs.electionCommittee === committeeId);
    return { ...candidate, votesForCommittee: committeeSort ? committeeSort.votes : 0 }; // Numeric zero
  }), [candidatesData, committeeId]);
  

  const sendVoteUpdate = (candidateId, newVotes) => {
    if (socket) {
      const sortingEntry = candidatesData.find(c => c.id === candidateId)?.committeeSorting?.find(s => s.electionCommittee === committeeId);

      if (sortingEntry) {
        socket.send(JSON.stringify({
          type: 'vote_update',
          electionCandidateId: candidateId,
          votes: newVotes,
          electionCommitteeId: committeeId,
          sortingEntryId: sortingEntry.id, // This is the ID of the specific sorting entry being updated
        }));
      }
    }
  };


  const updateVotes = (candidateId, increment) => {
    setCandidatesData(candidatesData.map(candidate => {
      if (candidate.id === candidateId) {
        const currentVotes = candidate.votesForCommittee || 0; // Ensure numeric value
        const newVotes = increment ? currentVotes + 1 : Math.max(0, currentVotes - 1);
        sendVoteUpdate(candidateId, newVotes);
        return { ...candidate, votesForCommittee: newVotes };
      }
      return candidate;
    }));
  };
  
  
  const incrementVotes = candidateId => updateVotes(candidateId, true);
  const decrementVotes = candidateId => updateVotes(candidateId, false);

  const handleNotesChange = (candidateId, newNotes) => {
    setCandidatesData(candidatesData.map(candidate =>
      candidate.id === candidateId ? { ...candidate, notes: newNotes } : candidate
    ));
  };

  // Define columns for the table
  const columns = useMemo(() => {
    return [
      {
        Header: 'اسم المرشح',
        accessor: 'name',
        Cell: ({ value }) => <span style={{ whiteSpace: 'nowrap' }}>{value}</span>,
      },
      {
        Header: 'الأصوات',
        accessor: 'votesForCommittee',
        Cell: ({ row }) => {
          // Find the sorting entry for the specific committee
          const committeeSort = row.original.committeeSorting.find(cs => cs.electionCommittee === committeeId);
          const votesForCommittee = committeeSort ? committeeSort.votes : "0";

          return (
            <>
              <Button color="success" className="btn-icon" outline onClick={() => incrementVotes(row.original.id)}>
                <i className="ri-add-line" />
              </Button>
              {' '}
              <span style={{ margin: '0 10px', display: 'inline-block', width: '30px', textAlign: 'center' }}>
                {votesForCommittee}
              </span>
              {' '}
              <Button color="danger" className="btn-icon" outline onClick={() => decrementVotes(row.original.id)}>
                <i className="ri-subtract-line" />
              </Button>
            </>
          );
        },
      },
      {
        Header: 'إجراءات',
        Cell: () => (
          <>
            <button className="btn btn-sm btn-soft-warning edit-list me-2">
              <i className="ri-eye-fill align-bottom pe-2" /> تعديل
            </button>
            <button className="btn btn-sm btn-soft-info edit-list me-2">
              <i className="ri-pencil-fill align-bottom pe-2" /> ملاحضات
            </button>
          </>
        ),
      },
    ];
  }, [incrementVotes, decrementVotes]); // Add dependencies to useMemo


  return (
    <React.Fragment>
      <Row>
        <Col lg={12}>
          <Card>
            <CardHeader><h4><b>الفرز</b></h4></CardHeader>
            <CardBody>
              <TableContainer
                columns={columns}
                data={tableData}
                customPageSize={50}
                divClass="table-responsive table-card mb-3"
                tableClass="align-middle table-nowrap mb-0" theadClass="table-light table-nowrap"
                thClass="table-light text-muted"
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default SortingTab;
