// React Core and Hooks
import React, { useState, useMemo, useEffect, useCallback } from "react";

// Redux Related Imports
import { useSelector, useDispatch } from "react-redux";
import { electionSelector } from 'Selectors';
import { updateElectionCandidateVotes } from "store/actions";

// Component and UI Library Imports
import { TableContainer, TableContainerHeader } from "components";
import { ImageCandidateWinnerCircle } from "components";

import { ResultInputField, transformData, useSaveCommitteeResults, CommitteeVoteButton } from './ResultHelper'; // Importing the transformData function

// Utility and Third-Party Library Imports
import { Button, Col, Row, Card, CardBody } from "reactstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResultsDetailed = () => {
  const dispatch = useDispatch();

  const { election, electionCandidates, electionCommittees } = useSelector(electionSelector);

  // Final Result: States
  const [electionCandidateVotes, setElectionCandidateVotes] = useState({});
  console.log("electionCandidateVotes", electionCandidateVotes)
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
    console.log(`Vote changed for candidate ${candidateId}: ${newValue}`);

  }, []);


  // Detailed Results: States
  const [committeeEdited, setCommitteeEdited] = useState({});
  const [committeeEditedData, setCommitteeEditedData] = useState({});

  // Detailed Results: Toggle Committee To Edit Mode
  const toggleCommitteeToEdit = (committeeId) => {
    setCommitteeEdited(prev => ({ ...prev, [committeeId]: !prev[committeeId] }));
    console.log(`Toggle edit mode for committee ${committeeId}.`); // Logging the toggle action
  };

  // Detailed Results: Handle Editing Cells
  const handleCommitteeVoteChange = (candidateId, committeeId, newValue) => {
    setCommitteeEditedData(prev => ({
      ...prev,
      [committeeId]: { ...prev[committeeId], [candidateId]: newValue }
    }));
    console.log(`Committee ${committeeId} vote changed for candidate ${candidateId}: ${newValue}`); // Logging the vote change within a committee
  };

  // Detailed Results: Transformed Data [Taking ElectionCommitteeResults together with the committeeEdited]
  const transformedData = useMemo(
    () => transformData(electionCandidates, electionCommittees, committeeEdited, handleCommitteeVoteChange, election),
    [electionCandidates, electionCommittees, committeeEdited, handleCommitteeVoteChange, election]
  );

  console.log("Transformed Data: ", transformedData); // Logging the transformed data

  // Detailed Results: Handle Save Committee Results
  const handleSaveCommitteeResults = useSaveCommitteeResults(
    committeeEditedData,
    committeeEdited,
    setCommitteeEdited,
    setCommitteeEditedData,
    toggleCommitteeToEdit
  );

  const createColumns = (electionCandidates, electionCommittees, committeeEdited) => {
    let columns = [

      {
        Header: 'المركز',
        accessor: 'position',
      },
      {
        Header: "المرشح",
        Cell: (cellProps) => (
          <ImageCandidateWinnerCircle
            gender={cellProps.row.original.gender}
            name={cellProps.row.original.name}
            imagePath={cellProps.row.original.image}
            isWinner={cellProps.row.original.isWinner}
          />
        ),
      },
    ];

    // Conditional columns based on the type
    if (election.electResult === 1) {
      columns.push(
        {
          Header: "ID",
          accessor: 'id',
          Cell: (cellProps) => {
            // Accessing candidate.id and candidate.votes from cellProps
            const candidateId = cellProps.row.original['candidate.id'];
            const candidateVotes = cellProps.row.original.votes;

            // Logging candidate.id and candidate.votes
            console.log("Candidate ID:", candidateId);
            console.log("Candidate Votes:", candidateVotes);
            return (
              <p>{candidateVotes}</p>
            );
          },

        },
        {
          Header: "المجموع",
          accessor: 'votes',
          Cell: (cellProps) => {
            // Log the cellProps here
            console.log("THE CELLPROPS:", cellProps);
            return (
              <ResultInputField
                candidateId={cellProps.row.original.id}
                value={electionCandidateVotes[cellProps.row.original.id] || cellProps.row.original.votes}
                onChange={handleCandidateVoteChange}
              />
            );
          },
        }
      );


    } else if (election.electResult === 2) {
      columns.push(
        {
          Header: 'المجموع',
          accessor: 'total',
        },
      );
    }

    // Columns for each committee
    if (electionCommittees) {
      electionCommittees.forEach((committee) => {
        columns.push({
          Header: () => (
            <CommitteeVoteButton
              committeeId={committee.id}
              committee={committee}
              isEdited={committeeEdited[committee.id]}
              hasChanges={committeeEdited && committeeEdited[committee.id] && Object.keys(committeeEdited[committee.id]).length > 0}
              handleSaveCommitteeResults={handleSaveCommitteeResults}
              toggleCommitteeToEdit={toggleCommitteeToEdit}
            />
          ),
          accessor: `committee_${committee.id}`,
        });
        console.log("committeeEdited?", committeeEdited)
        console.log("committee.id?", committee.id)

      });
    }

    return columns;
  };

  const columns = useMemo(() => createColumns(
    electionCandidates,
    electionCommittees,
    committeeEdited), [electionCandidates, electionCommittees, committeeEdited, handleCandidateVoteChange]);



  return (
    <React.Fragment>
      <Row>
        <Col lg={12}>
          <Card id="electionCommitteeList">
            <CardBody>
              <div>
                <TableContainerHeader
                  // Title
                  ContainerHeaderTitle="النتائج التفصيلية"
                />
                <Button color="primary" onClick={handleSaveCandidateResults}>
                  حفظ
                </Button>

                <TableContainer
                  // Data
                  columns={columns}
                  data={transformedData}
                  customPageSize={50}
                  isTableContainerFooter={true}

                  // Styling
                  divClass="table-responsive table-card mb-3"
                  tableClass="align-middle table-nowrap mb-0"
                  theadClass="table-light table-nowrap"
                  thClass="table-light text-muted"
                />
              </div>
              <ToastContainer closeButton={false} limit={1} />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default ResultsDetailed;

// WE ARE FINE HERE
