// React Core and Hooks
import React, { useState, useMemo, useEffect } from "react";

// Redux Related Imports
import { useSelector } from "react-redux";
import { electionSelector } from 'Selectors';

// Component and UI Library Imports
import { TableContainer, TableContainerHeader } from "Common/Components";
import { ImageCandidateWinnerCircle } from "Common/Components";

import {
  HeaderVoteButton,
  transformResulteData,
  useSaveCommitteeResults,
} from './ResultHelper';


// Utility and Third-Party Library Imports
import { Col, Row, Card, CardBody } from "reactstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResultsTab = () => {
  const { election, electionCandidates, electionCommittees } = useSelector(electionSelector);
  const electionResult = election.electResult;

  // Results: States
  const [resultFieldEdited, setResultFieldEdited] = useState({});
  const [resultFieldEditedData, setResultFieldEditedData] = useState({});


  // Results: Toggle Vote Column To Edit / Save / Close Mode
  const toggleRowToEdit = (committeeId) => {
    if (committeeId !== undefined) { // or simply `if (committeeId)` if `committeeId` is never 0 or null
      setResultFieldEdited(prev => ({ ...prev, [committeeId]: !prev[committeeId] }));
    } else {
      setResultFieldEdited(prev => !prev);
    }
  };


  // Results: Handle Editing Cells
  const handleResultVoteChange = (candidateId, newValue, committeeId) => {
    console.log("committeeId:", committeeId, "candidateId:", candidateId, "newValue:", newValue)
    setResultFieldEditedData(prev => {
      // Check if the committeeId is provided
      if (committeeId !== undefined) { // or simply `if (committeeId)` if `committeeId` is never 0 or null
        return {
          ...prev, [committeeId]: { ...(prev[committeeId] || {}), [candidateId]: newValue }
        };
      } else {
        return {
          ...prev, [candidateId]: newValue
        };
      }
    });
  };


  // Detailed Results: Transformed Data [Taking ElectionCommitteeResults together with the result Field Edited]
  const transformedCommitteeCandidateData = useMemo(
    () => transformResulteData(
      electionCandidates,
      electionCommittees,
      resultFieldEdited,
      handleResultVoteChange,
      election
    ),
    [
      electionCandidates,
      electionCommittees,
      resultFieldEdited,
      handleResultVoteChange,
      election]
  );


  // Detailed Results: Handle Save Committee Results --------------------
  const handleSavResults = useSaveCommitteeResults(
    resultFieldEditedData,
    resultFieldEdited,
    setResultFieldEdited,
    setResultFieldEditedData,
    toggleRowToEdit
  );



  // Creating the columns for both Final and Detailed Results
  const createColumnsBasedOnElectionResult = (result) => {
    // Base columns that are always present
    const baseColumns = [
      {
        Header: 'المركز',
        accessor: 'position',
      },
      {
        Header: 'المرشح',
        Cell: ({ row }) => (
          <ImageCandidateWinnerCircle
            gender={row.original.gender}
            name={row.original.name}
            imagePath={row.original.image}
            isWinner={row.original.isWinner}
          />
        ),
      },
    ];

    // Columns for when electionResult is 1
    if (result === 1) {
      return [
        ...baseColumns,
        {
          Header: () => (
            <HeaderVoteButton
              isCandidateEdited={resultFieldEdited}
              hasChanges={resultFieldEditedData && Object.keys(resultFieldEditedData).length > 0}
              handleSavResults={handleSavResults}
              toggleRowToEdit={toggleRowToEdit}
            />
          ),
          accessor: 'votes',
        },
      ];
    }

    // Columns for when electionResult is 2
    if (result === 2 && electionCandidates) {
      const committeeColumns = electionCommittees.map(committee => ({
        Header: () => (
          <HeaderVoteButton
            committeeId={committee.id}
            committee={committee}
            isCommitteeEdited={resultFieldEdited[committee.id]}
            hasChanges={resultFieldEditedData[committee.id] && Object.keys(resultFieldEditedData[committee.id]).length > 0}
            handleSavResults={handleSavResults}
            toggleRowToEdit={toggleRowToEdit}
          />
        ),
        accessor: `committee_${committee.id}`,
      }));

      return [
        ...baseColumns,
        { Header: 'المجموع', accessor: 'total' },
        ...committeeColumns,
      ];
    }

    return [];
  };

  const electionCandidateList = electionResult === 1
    ? transformedCommitteeCandidateData
    : electionResult === 2
      ? transformedCommitteeCandidateData
      : [];

  const columns = useMemo(() => {
    return createColumnsBasedOnElectionResult(electionResult);
  }, [
    electionResult,
    electionCandidates,
    electionCommittees,
    resultFieldEdited,
    resultFieldEditedData,
  ]);




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
                <TableContainer

                  // Data
                  columns={columns}
                  data={electionCandidateList}
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

export default ResultsTab;
