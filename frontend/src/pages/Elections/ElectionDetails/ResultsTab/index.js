// React Core and Hooks
import React, { useState, useMemo, useCallback } from "react";

// Redux Related Imports
import { useSelector } from "react-redux";
import { electionSelector } from 'Selectors';

// Component and UI Library Imports
import { TableContainer, TableContainerHeader, ImageCandidateWinnerCircle } from "components";
import { HeaderVoteButton, transformResultData, useSaveCommitteeResults } from './ResultHelper';

// Utility and Third-Party Library Imports
import { Col, Row, Card, CardBody } from "reactstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResultsTab = () => {
  const { election, electionCandidates, electionPartyCandidates, electionCommittees } = useSelector(electionSelector);
  const electionResult = election.electResult;

  // candidates based on election Type
  const candidates = election.electType !== 1 ? electionPartyCandidates : electionCandidates;

  // States
  const [columnEdited, setColumnEdited] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [voteFieldEditedData, setVoteFieldEditedData] = useState({});
  console.log("columnEdited? ", columnEdited, "hasChanges? ", hasChanges)


  // Toggle Vote Column To Edit / Save / Close Mode
  const toggleColumnToEdit = (committeeId) => {
    setColumnEdited(prev => ({
      ...prev,
      [committeeId]: !prev[committeeId], // Toggle the value for the specified committee
    }));

    setHasChanges(prev => ({
      ...prev,
      [committeeId]: false, // Set hasChanges to false for the specified committee
    }));

  };

  // Handle Editing Cells
  const handleVoteFieldChange = useCallback((committeeId, candidateId, newValue) => {
    setVoteFieldEditedData(prev => ({
      ...prev, [committeeId]: { ...(prev[committeeId] || {}), [candidateId]: newValue },
    }));

    // Set hasChanges for the specific committee to true
    setHasChanges(prev => ({
      ...prev,
      [committeeId]: true,
    }));

  }, []);


  // Transformed Data [Taking ElectionCommitteeResults together with the result Field Edited]
  const transformedResultData = useMemo(
    () => transformResultData(
      candidates,
      electionCommittees,
      columnEdited,
      handleVoteFieldChange,
      election
    ), [candidates, electionCommittees, columnEdited, handleVoteFieldChange, election]
  );


  // Handle Save Committee Results 
  const handleSaveResults = useSaveCommitteeResults(
    voteFieldEditedData,
    columnEdited,
    setColumnEdited,
    setVoteFieldEditedData,
    toggleColumnToEdit,
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
        accessor: 'name',
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
    const voteColumn = [
      {
        Header: () => (
          <HeaderVoteButton
            committeeId={"0"}
            committee={0}
            columnEdited={columnEdited}  // Need some work
            hasChanges={hasChanges}
            handleSaveResults={handleSaveResults}
            toggleColumnToEdit={toggleColumnToEdit}
          />
        ),
        accessor: 'votes',
      },
    ];

    const committeeColumns = electionCommittees.map(committee => ({
      Header: () => (
        <HeaderVoteButton
          committeeId={committee.id}
          committee={committee}
          columnEdited={columnEdited}
          hasChanges={hasChanges}
          handleSaveResults={handleSaveResults}
          toggleColumnToEdit={toggleColumnToEdit}
        />
      ),
      accessor: `committee_${committee.id}`,
    }));

    // Columns for when electionResult is 1
    if (result === 1) {
      return [
        ...baseColumns,
        ...voteColumn,
      ];
    }

    // Columns for when electionResult is 2
    if (result === 2 && candidates) {
      return [
        ...baseColumns,
        { Header: 'المجموع', accessor: 'total' },
        ...committeeColumns,
      ];
    }
    return [];
  };


  const columns = useMemo(() => {
    return createColumns(electionResult);
  }, [
    electionResult,
    candidates,
    electionCommittees,
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
                  data={transformedResultData}
                  customPageSize={50}
                  isTableContainerFooter={true}
                  sortBy="name"
                  sortAsc={true}

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
