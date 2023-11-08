// ResultsTab.js
import React, { useState, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { electionSelector } from 'Selectors';
import { TableContainer, TableContainerHeader, ImageCandidateWinnerCircle } from "components";
import { Button, Col, Row, Card, CardBody } from "reactstrap";
import { toast, ToastContainer } from "react-toastify";
import { updateElectionCandidateVotes } from "store/actions";

import { ResultInputField } from './ResultHelper';

const ResultsFinal = () => {
  const dispatch = useDispatch();
  const { election, electionCandidates, electionCommittees } = useSelector(electionSelector);

  // Final Result: States
  const [electionCandidateVotes, setElectionCandidateVotes] = useState({});


  // Final Result: handleSaveCandidateResults
  const handleSaveCandidateResults = useCallback(() => {
    dispatch(updateElectionCandidateVotes(electionCandidateVotes));
    setElectionCandidateVotes({});
  }, [dispatch, electionCandidateVotes]);

  // Final Result: handleCandidateVoteChange
  const handleCandidateVoteChange = useCallback((candidateId, newValue) => {
    setElectionCandidateVotes((prevVotes) => ({
      ...prevVotes, [candidateId]: newValue
    }));
  }, []);


  const columns = useMemo(() => {
    return [
      {
        Header: 'المركز',
        accessor: 'position',
      },
      {
        Header: "المرشح",
        accessor: 'name',
        Cell: (cellProps) => (
          <ImageCandidateWinnerCircle
            gender={cellProps.row.original.gender}
            name={cellProps.row.original.name}
            imagePath={cellProps.row.original.image}
            isWinner={cellProps.row.original.isWinner}
          />
        ),
      },

      // ResultFinal: Table
      {
        Header: "النتائج",
        accessor: 'votes',
        Cell: ({ row }) => (
          <ResultInputField
            candidateId={row.original.id}
            value={electionCandidateVotes[row.original.id] || row.original.votes}
            onChange={handleCandidateVoteChange}
          />
        ),
      },
    ];
  }, [electionCandidateVotes, handleCandidateVoteChange]);

  return (
    <React.Fragment>
      <Row>
        <Col lg={12}>
          <Card id="electionCandidatesList">
            <CardBody>
              <TableContainerHeader
                ContainerHeaderTitle="النتائج النهائية"
              />
              <Button color="primary" onClick={handleSaveCandidateResults}>
                حفظ
              </Button>
              <TableContainer
                columns={columns}
                data={electionCandidates}
                customPageSize={50}
                isTableContainerFooter={true}
                divClass="table-responsive table-card mb-3"
                tableClass="align-middle table-nowrap mb-0"
                theadClass="table-light table-nowrap"
                thClass="table-light text-muted"
              />
              <ToastContainer closeButton={false} limit={1} />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default ResultsFinal;



