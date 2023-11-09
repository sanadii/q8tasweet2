// React Core and Hooks
import React, { useState, useMemo, useEffect, useCallback } from "react";

// Redux Related Imports
import { useSelector } from "react-redux";
import { electionSelector } from 'Selectors';

// Component and UI Library Imports
import { TableContainer, TableContainerHeader } from "Common/Components";
import { ImageCandidateWinnerCircle } from "Common/Components";

import {
  HeaderVoteButton,
  transformResultData,
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
  const [columnEdited, setColumnEdited] = useState({});
  const [candidateVoteFieldEdited, setCandidateVoteFieldEdited] = useState(false);
  const [voteFieldEditedData, setVoteFieldEditedData] = useState({});

  console.log("index: columnEdited: ", columnEdited)
  console.log("index: candidateVoteFieldEdited: ", candidateVoteFieldEdited)
  console.log("index: voteFieldEditedData: ", voteFieldEditedData)

  // Results: Toggle Vote Column To Edit / Save / Close Mode
  const toggleColumnToEdit = (committeeId) => {
    if (committeeId !== undefined) { // or simply `if (committeeId)` if `committeeId` is never 0 or null
      setColumnEdited(prev => ({ ...prev, [committeeId]: !prev[committeeId] }));

    } else {
      setCandidateVoteFieldEdited(prev => !prev);
      console.log("are we awake?")
    }
  };


  // Results: Handle Editing Cells
  const handleVoteFieldChange = useCallback((candidateId, committeeId, newValue) => {
    // console.log("handleVoteFieldChange", { candidateId, committeeId, newValue });

    setVoteFieldEditedData(prev => {
      // If election Result is Detailed (committeeId is provided)
      if (committeeId) {
        // console.log("we have been toggled, voteFieldEditedData: ", voteFieldEditedData)

        return {
          ...prev, [committeeId]: {
            ...(prev[committeeId] || {}), [candidateId]: newValue
          },
        };

      }
      // If election Result is Final(committeeId is not provided)
      else {
        return {
          ...prev, [candidateId]: newValue,
        };
      }
    });
  }, []);


  // console.log("Index: candidateVoteFieldEdited:", candidateVoteFieldEdited)


  // Detailed Results: Transformed Data [Taking ElectionCommitteeResults together with the result Field Edited]
  const transformedResultData = useMemo(
    () => transformResultData(
      electionCandidates,
      electionCommittees,
      candidateVoteFieldEdited,
      columnEdited,
      handleVoteFieldChange,
      election
    ),
    [
      electionCandidates,
      electionCommittees,
      columnEdited,
      handleVoteFieldChange,
      election
    ]
  );


  // Detailed Results: Handle Save Committee Results --------------------
  const handleSaveResults = useSaveCommitteeResults(
    voteFieldEditedData,
    columnEdited,
    candidateVoteFieldEdited,
    setCandidateVoteFieldEdited,
    setColumnEdited,
    setVoteFieldEditedData,
    toggleColumnToEdit
  );



  // Creating the columns for both Final and Detailed Results
  const createColumns = (result) => {
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
              // candidateVoteFieldEdited={candidateVoteFieldEdited}
              isEdited={candidateVoteFieldEdited}
              hasChanges={voteFieldEditedData && Object.keys(voteFieldEditedData).length > 0}
              handleSaveResults={handleSaveResults}
              toggleColumnToEdit={toggleColumnToEdit}
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
            isEdited={columnEdited[committee.id]}
            // columnEdited={columnEdited[committee.id]}
            hasChanges={voteFieldEditedData[committee.id] && Object.keys(voteFieldEditedData[committee.id]).length > 0}
            handleSaveResults={handleSaveResults}
            toggleColumnToEdit={toggleColumnToEdit}
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
    ? transformedResultData
    : electionResult === 2
      ? transformedResultData
      : [];

  const columns = useMemo(() => {
    return createColumns(electionResult);
  }, [
    electionResult,
    electionCandidates,
    electionCommittees,
    candidateVoteFieldEdited,
    columnEdited,
    voteFieldEditedData,
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
