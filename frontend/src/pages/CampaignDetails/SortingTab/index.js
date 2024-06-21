import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { campaignSelector, userSelector } from 'selectors';
import { TableContainer } from 'shared/components';
import { Card, CardHeader, CardBody, Button, ButtonGroup, Row, Col } from "reactstrap";
import { useWebSocketContext } from 'shared/utils';

const SortingTab = () => {
  const { campaign, currentElection, currentCampaignMember } = useSelector(campaignSelector);
  const { userId } = useSelector(userSelector);
  const committee = currentCampaignMember?.committee || {};
  const committeeId = committee.id || null;
  const committeeName = committee.name || 'Unknown Committee';
  const electionId = campaign?.election?.id;

  const [candidatesSorting, setCandidatesSorting] = useState([]);

  console.log("committeeId: ", committeeId)

  let initialSortingData;
  useEffect(() => {
    const initialSortingData = currentElection?.electionCandidates.map(candidate => ({
      electionId: electionId,
      candidateId: candidate.id,
      name: candidate.name,
      committeeVote: candidate?.campaignSorting?.find(cs => cs.committee === committeeId)?.votes || 0
    }));
    setCandidatesSorting(initialSortingData);
  }, [currentElection, electionId, committeeId]);

  console.log("initialSortingData: ", initialSortingData)


  const { sendMessage, lastMessage } = useWebSocketContext();

  useEffect(() => {
    if (lastMessage !== null) {
      try {
        const message = JSON.parse(lastMessage.data);
        if (message.dataType === 'electionSorting' && message.electionCommitteeId === committeeId) {
          updateSortingVotes(message.electionCandidateId, message.votes);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    }
  }, [lastMessage, committeeId]);

  const updateSortingVotes = useCallback((candidateId, newVotes) => {
    setCandidatesSorting(prevSorting => prevSorting.map(sortItem => {
      if (sortItem.candidateId === candidateId) {
        return { ...sortItem, committeeVote: newVotes };
      }
      return sortItem;
    }));
  }, []);

  const sendVoteUpdate = useCallback((candidateId, newVotes) => {
    sendMessage(JSON.stringify({
      dataType: 'electionSorting',
      electionId: electionId,
      electionCandidateId: candidateId,
      electionCommitteeId: committeeId,
      votes: newVotes
    }));
    updateSortingVotes(candidateId, newVotes);
  }, [sendMessage, electionId, committeeId, updateSortingVotes]);

  const updateVotes = useCallback((candidateId, increment) => {
    const candidate = candidatesSorting.find(c => c.candidateId === candidateId);
    if (candidate) {
      const newVotes = increment ? candidate.committeeVote + 1 : Math.max(0, candidate.committeeVote - 1);
      sendVoteUpdate(candidateId, newVotes);
    } else {
      console.error(`Candidate with ID ${candidateId} not found in candidatesSorting state`);
    }
  }, [candidatesSorting, sendVoteUpdate]);

  const incrementVotes = useCallback(candidateId => updateVotes(candidateId, true), [updateVotes]);
  const decrementVotes = useCallback(candidateId => updateVotes(candidateId, false), [updateVotes]);

  // Define columns for the table
  const columns = useMemo(() => {
    return [
      // {
      //   Header: 'candidateId',
      //   Cell: ({ row }) => <span className="nowrap">{row.original.candidateId}</span>,
      // },
      {
        Header: 'اسم المرشح',
        Cell: ({ row }) => (
          <VoteButton
            candidateId={row.original.candidateId}
            increment={incrementVotes}
            decrement={decrementVotes}
            name={row.original.name}
          />
        ),
      },
      {
        Header: 'الأصوات',
        Cell: ({ row }) => <span className="nowrap fs-16"><strong>{row.original.committeeVote}</strong></span>,
      },

    ];
  }, [incrementVotes, decrementVotes]);

  return (
    <React.Fragment>
      <Row>
        <Col lg={12}>
          <Card>
            <CardHeader>
              <h4><b>الفرز</b></h4>
              <p><strong> اللجنة: {committeeName}</strong></p>
            </CardHeader>
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

const VoteButton = ({ candidateId, increment, decrement, name }) => (
  <ButtonGroup className="pb-1 pe-2 w-100">
    <Button color="success" className="btn-label w-100" onClick={() => increment(candidateId)}>
      <i className="ri-add-line label-icon align-middle fs-16 me-2"></i>
      {name}
    </Button>
    <Button color="danger" className="btn-icon" outline onClick={() => decrement(candidateId)}>
      <i className="ri-subtract-line" />
    </Button>
  </ButtonGroup>
);


