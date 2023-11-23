import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Col, Row, Card, CardHeader, Table, Button, Input } from 'reactstrap';
import { campaignSelector, userSelector } from 'Selectors';

const SortingTab = () => {
  const dispatch = useDispatch();
  const { campaign, campaignElectionCandidates, currentCampaignMember } = useSelector(campaignSelector);
  const { userId } = useSelector(userSelector);

  const committeeId = 5;
  const [candidatesData, setCandidatesData] = useState([]);
  const [socket, setSocket] = useState(null);

  // Consolidate candidate data with vote counts
  const consolidateCandidateData = () => {
    return campaignElectionCandidates.map(candidate => {
      const committeeSortingForCandidate = candidate.committeeSorting.find(sorting =>
        sorting.committee === committeeId && sorting.electionCandidate === candidate.id);

      return {
        ...candidate,
        votesForCommittee: committeeSortingForCandidate ? committeeSortingForCandidate.votes : 0
      };
    });
  };

  // Update the WebSocket from slug & url
  useEffect(() => {
    const { slug } = campaign;
    const wsUrl = `ws://127.0.0.1:8000/ws/campaigns/${slug}/`;
    const newSocket = new WebSocket(wsUrl);
    setSocket(newSocket);

    // Initial data setup
    setCandidatesData(consolidateCandidateData());

    return () => {
      if (newSocket) newSocket.close();
    };
  }, [campaign]);

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === 'vote_update') {
          setCandidatesData(candidatesData.map(candidate => {
            if (candidate.id === message.electionCandidate_id && message.committee === committeeId) {
              return { ...candidate, votesForCommittee: message.votes };
            }
            return candidate;
          }));
        }
      };
    }
  }, [socket, candidatesData]);

  const sendVoteUpdate = (candidateId, newVotes) => {
    if (socket) {
      socket.send(JSON.stringify({
        type: 'vote_update',
        electionCandidate_id: candidateId,
        votes: newVotes,
        committee: committeeId,
      }));
    }
  };

  const updateVotes = (candidateId, increment) => {
    setCandidatesData(candidatesData.map(candidate => {
      if (candidate.id === candidateId) {
        const newVotes = increment ? candidate.votesForCommittee + 1 : Math.max(0, candidate.votesForCommittee - 1);
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

  return (
    <React.Fragment>
      <Row>
        <Col lg={12}>
          <Card>
            <CardHeader><h4><b>الفرز</b></h4></CardHeader>
            <div style={{ maxWidth: '100%', overflowX: 'auto' }}>
              <Table style={{ width: 'auto', minWidth: '300px' }}>
                <thead>
                  <tr>
                    <th style={{ whiteSpace: 'nowrap' }}>اسم المرشح</th>
                    <th style={{ width: '200px', textAlign: 'center', whiteSpace: 'nowrap' }}>الأصوات</th>
                    <th>إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {candidatesData.map((candidate, index) => (
                    <tr key={index}>
                      <td style={{ whiteSpace: 'nowrap' }}>{candidate.name}</td>
                      <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                        <Button color="success" className="btn-icon" outline onClick={() => incrementVotes(candidate.id)}>
                          <i className="ri-add-line" />
                        </Button>
                        {' '}
                        <span style={{ margin: '0 10px', display: 'inline-block', width: '30px', textAlign: 'center' }}>
                          {candidate.votesForCommittee}
                        </span>
                        {' '}
                        <Button color="danger" className="btn-icon" outline onClick={() => decrementVotes(candidate.id)}>
                          <i className="ri-subtract-line" />
                        </Button>
                      </td>
                      <td>
                        <button
                          to="#"
                          className="btn btn-sm btn-soft-warning edit-list me-2"
                          onClick={() => {
                          }}
                        >
                          <i className="ri-eye-fill align-bottom pe-2" />
                          تعديل
                        </button>
                        <button
                          to="#"
                          className="btn btn-sm btn-soft-info edit-list me-2"
                          onClick={() => {
                          }}
                        >
                          <i className="ri-pencil-fill align-bottom pe-2" />
                          ملاحضات
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default SortingTab;
