import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Col, Row, Card, CardHeader, Table, Button, Input } from 'reactstrap';

import { campaignSelector, userSelector } from 'Selectors';

const SortingTab = ({ candidatesData }) => {
  const { campaign, campaignElectionCandidates, currentCampaignMember } = useSelector(campaignSelector);
  const { userId } = useSelector(userSelector);

  const committee = currentCampaignMember && currentCampaignMember.committee ? currentCampaignMember.committee : 0;
  const [candidates, setCandidates] = useState(campaignElectionCandidates);



  // State for WebSocket URL
  const [socketUrl, setSocketUrl] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Build the WebSocket URL
    const { slug } = campaign;
    const wsUrl = `ws://127.0.0.1:8000/ws/campaigns/${slug}/`;
    setSocketUrl(wsUrl);

    // Create and open the WebSocket connection
    const newSocket = new WebSocket(wsUrl);
    setSocket(newSocket);

    // Clean up on unmount
    return () => {
      if (newSocket) {
        newSocket.close();
      }
    };
  }, [campaign]);

  // Function to increment votes
  const incrementVotes = (candidateId) => {
    setCandidates(candidates.map(candidate =>
      candidate.id === candidateId ? { ...candidate, votes: candidate.votes + 1 } : candidate
    ));
  };

  // Function to decrement votes
  const decrementVotes = (candidateId) => {
    setCandidates(candidates.map(candidate =>
      candidate.id === candidateId ? { ...candidate, votes: Math.max(0, candidate.votes - 1) } : candidate
    ));
  };

  const handleNotesChange = (candidateId, newNotes) => {
    setCandidates(candidates.map(candidate =>
      candidate.id === candidateId ? { ...candidate, notes: newNotes } : candidate
    ));
  };


  const handleSubmit = (candidate) => {
    // Prepare data for channel submission
    const submissionData = {
      user: userId,
      electionCandidate: candidate.id,
      committee: committee.id,
      votes: candidate.votes,
      notes: candidate.notes,
    };

    // TODO: Submit data through channel
    console.log('Submitting:', submissionData);
  };


  document.title = "الفرز | كويت تصويت";

  return (
    <React.Fragment>
      <Row>
        <Col lg={12}>
          <Card>
            <CardHeader>
              <h4><b>الفرز</b></h4>
            </CardHeader>
            <div style={{ maxWidth: '100%', overflowX: 'auto' }}>
              <Table style={{ width: 'auto', minWidth: '300px' }}>
                <thead>
                  <tr>
                    <th style={{ whiteSpace: 'nowrap' }}>اسم المرشح</th>
                    <th style={{ width: '200px', textAlign: 'center', whiteSpace: 'nowrap' }}>الأصوات</th>
                    <th>ملاحضات</th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.map((candidate, index) => (
                    <tr key={index}>
                      <td style={{ whiteSpace: 'nowrap' }}>{candidate.name}</td>
                      <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                        <Button color="success" className="btn-icon" outline onClick={() => incrementVotes(candidate.id)}>
                          <i className="ri-add-line" />
                        </Button>
                        {' '}
                        <span style={{ margin: '0 10px', display: 'inline-block', width: '30px', textAlign: 'center' }}>
                          {candidate.votes}
                        </span>
                        {' '}
                        <Button color="danger" className="btn-icon" outline onClick={() => decrementVotes(candidate.id)}>
                          <i className="ri-subtract-line" />
                        </Button>
                      </td>
                      <td>
                        <Input
                          type="text"
                          value={candidate.notes || ''}  // Fallback to an empty string if notes is null/undefined
                          onChange={(e) => handleNotesChange(candidate.id, e.target.value)}
                          placeholder="Enter notes"
                        />

                      </td>
                      <td>
                        <Button onClick={() => handleSubmit(candidate)}>Submit</Button>
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
