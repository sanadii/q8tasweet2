import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from "react-redux";
import { Col, Row, Card, CardHeader, CardBody, Button } from 'reactstrap';
import { campaignSelector } from 'Selectors';
import { TableContainer } from 'components';

const SortingTab = () => {
  const { campaign, campaignElectionCandidates } = useSelector(campaignSelector);

  const committeeId = 5; // or dynamically determined
  const [candidatesSorting, setCandidatesSorting] = useState([]);
  const [socket, setSocket] = useState(null);

  // Initialize candidatesSorting state and WebSocket
  useEffect(() => {
    const initialSortingData = campaignElectionCandidates.map(candidate => ({
      candidateId: candidate.id,
      name: candidate.name,
      committeeVote: candidate.committeeSorting.find(cs => cs.electionCommittee === committeeId)?.votes || 0
    }));
    setCandidatesSorting(initialSortingData);

    const wsUrl = `ws://127.0.0.1:8000/ws/campaigns/${campaign.slug}/`;
    const newSocket = new WebSocket(wsUrl);
    setSocket(newSocket);

    newSocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'vote_update' && message.electionCommitteeId === committeeId) {
        updateSortingVotes(message.electionCandidateId, message.votes);
      }
    };

    return () => newSocket.close();
  }, [campaign.slug, campaignElectionCandidates]);

  const updateSortingVotes = (candidateId, newVotes) => {
    setCandidatesSorting(prevSorting => prevSorting.map(sortItem => {
      if (sortItem.candidateId === candidateId) {
        return { ...sortItem, committeeVote: newVotes };
      }
      return sortItem;
    }));
  };

  const sendVoteUpdate = (candidateId, increment) => {
    const candidate = candidatesSorting.find(c => c.candidateId === candidateId);

    // Check if candidate exists and has committeeVote property
    if (candidate && typeof candidate.committeeVote !== 'undefined') {
      const newVotes = increment ? candidate.committeeVote + 1 : Math.max(0, candidate.committeeVote - 1);
      console.log(`newVotes:`, newVotes);

      if (socket) {
        socket.send(JSON.stringify({
          type: 'vote_update',
          electionCandidateId: candidateId,
          electionCommitteeId: committeeId,
          votes: newVotes
        }));
      }
    } else {
      console.error(`Candidate with ID ${candidateId} not found or committeeVote is undefined`);
    }
  };


  const columns = useMemo(() => [
    {
      Header: 'اسم المرشح',
      accessor: 'name',
    },
    {
      Header: 'الأصوات',
      accessor: 'committeeVote',
      Cell: ({ row }) => (
        <>
          <Button color="success" className="btn-icon" outline onClick={() => sendVoteUpdate(row.original.candidateId, true)}>
            <i className="ri-add-line" />
          </Button>
          {' '}
          <span style={{ margin: '0 10px', display: 'inline-block', width: '30px', textAlign: 'center' }}>
            {row.original.committeeVote}
          </span>
          {' '}
          <Button color="danger" className="btn-icon" outline onClick={() => sendVoteUpdate(row.original.candidateId, false)}>
            <i className="ri-subtract-line" />
          </Button>
        </>
      ),
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
    }
  ], []);

  console.log("candidatesSorting:", candidatesSorting)
  return (
    <React.Fragment>
      <Row>
        <Col lg={12}>
          <Card>
            <CardHeader><h4><b>الفرز</b></h4></CardHeader>
            <CardBody>
              <TableContainer
                columns={columns}
                data={candidatesSorting}
                customPageSize={50}
                divClass="table-responsive table-card mb-3"
                tableClass="align-middle table-nowrap mb-0"
                theadClass="table-light table-nowrap"
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
