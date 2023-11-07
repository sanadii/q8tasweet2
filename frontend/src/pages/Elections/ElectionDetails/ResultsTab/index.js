// React Core and Hooks
import React, { useState, useMemo, useEffect } from "react";

// Redux Related Imports
import { useSelector } from "react-redux";
import { electionSelector } from 'Selectors';

// Component and UI Library Imports
import { TableContainer, TableContainerHeader } from "Common/Components";
import { ImageCandidateWinnerCircle } from "Common/Components";

import { transformCommitteeCandidateData, useSaveCommitteeResults, CommitteeVoteButton } from './CommitteeResultHelper'; // Importing the transformCommitteeCandidateData function
import { transformCandidateData, useSaveCandidateResults, CandidateVoteButton } from './CandidateResultHelper'; // Importing the transformCommitteeCandidateData function

// Utility and Third-Party Library Imports
import { Col, Row, Card, CardBody } from "reactstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResultsTab = () => {
  const { election, electionCandidates, electionCommittees } = useSelector(electionSelector);
  const electionResult = election.electResult;




  // Detailed Results: States -----------------------------------------------------------
  const [committeeEdited, setCommitteeEdited] = useState({}); // Can Carry Arrays
  const [committeeEditedData, setCommitteeEditedData] = useState({});

  // Detailed Results: Toggle Committee To Edit Mode
  const toggleCommitteeToEdit = (committeeId) => {
    setCommitteeEdited(prev => ({ ...prev, [committeeId]: !prev[committeeId] }));
  };

  // Detailed Results: Handle Editing Cells
  const handleCommitteeVoteChange = (candidateId, committeeId, newValue) => {
    setCommitteeEditedData(prev => ({
      ...prev,
      [committeeId]: { ...prev[committeeId], [candidateId]: newValue }
    }));
  };

  // Detailed Results: Transformed Data [Taking ElectionCommitteeResults together with the committeeEdited]
  const transformedCommitteeCandidateData = useMemo(
    () => transformCommitteeCandidateData(electionCandidates, electionCommittees, committeeEdited, handleCommitteeVoteChange, election),
    [electionCandidates, electionCommittees, committeeEdited, handleCommitteeVoteChange, election]
  );


  // Detailed Results: Handle Save Committee Results
  const handleSaveCommitteeResults = useSaveCommitteeResults(
    committeeEditedData,
    committeeEdited,
    setCommitteeEdited,
    setCommitteeEditedData,
    toggleCommitteeToEdit
  );



  // // Final Results: States -----------------------------------------------------------
  const [candidateEdited, setCandidateEdited] = useState(false); // Can Carry Arrays
  const [candidateEditedData, setCandidateEditedData] = useState({});


  // // Final Results: Toggle Committee To Edit Mode
  const toggleCandidateToEdit = () => {
    setCandidateEdited(prev => !prev);

  };


  // // Final Results: Handle Editing Cells
  const handleCandidateVoteChange = (candidateId, newValue) => {
    setCandidateEditedData(prev => ({
      ...prev, [candidateId]: newValue
    }));
  };

  // // Final Results: Transformed Data [Taking ElectionCommitteeResults together with the candidateEdited]
  const transformedCandidateData = useMemo(
    () => transformCandidateData(election, electionCandidates, candidateEdited, handleCandidateVoteChange),
    [election, electionCandidates, candidateEdited, handleCandidateVoteChange]
  );

  // // Final Results: Handle Save Committee Results
  const handleSaveCandidateResults = useSaveCandidateResults(
    candidateEditedData,
    candidateEdited,
    setCandidateEdited,
    setCandidateEditedData,
    toggleCommitteeToEdit
  );

  // 


  const createCommitteeCandidateVoteColumns = (data) => {
    const columns = [
      {
        Header: 'المركز',
        accessor: 'position',

      },
      {
        Header: "المرشح",
        // accessor: 'name',
        Cell: (cellProps) =>
          <ImageCandidateWinnerCircle
            gender={cellProps.row.original.gender}
            name={cellProps.row.original.name}
            imagePath={cellProps.row.original.image}
            isWinner={cellProps.row.original.isWinner}
          />,
      },

      // ResultDetailed: Table
      {
        Header: 'المجموع',
        accessor: 'total',
      },
    ];
    // Add columns for each committee
    electionCommittees.forEach((committee) => {
      columns.push({
        Header: () => (
          <CommitteeVoteButton
            committeeId={committee.id}
            committee={committee}
            isEdited={committeeEdited[committee.id]}
            hasChanges={committeeEditedData[committee.id] && Object.keys(committeeEditedData[committee.id]).length > 0}
            handleSaveCommitteeResults={handleSaveCommitteeResults}
            toggleCommitteeToEdit={toggleCommitteeToEdit}
          />
        ),
        accessor: `committee_${committee.id}`,
      });
    });
    return columns;
  }

  const createCandidateVoteColumns = (data) => {
    const columns = [
      {
        Header: 'المركز',
        accessor: 'position',
      },
      {
        Header: "المرشح",
        // accessor: 'name',
        Cell: (cellProps) =>
          <ImageCandidateWinnerCircle
            gender={cellProps.row.original.gender}
            name={cellProps.row.original.name}
            imagePath={cellProps.row.original.image}
            isWinner={cellProps.row.original.isWinner}
          />,
      },
    ];
    // Add the vote field / value
    columns.push({
      Header: () => (
        <CandidateVoteButton
          // candidateVotes={candidateVotes}
          isCandidateEdited={candidateEdited}
          hasChanges={candidateEditedData && Object.keys(candidateEditedData).length > 0}
          handleSaveCandidateResults={handleSaveCandidateResults}
          toggleCandidateToEdit={toggleCandidateToEdit}
          onChange={handleCandidateVoteChange}

        />
      ),
      accessor: 'votes',
    });
    return columns;
  }


  let electionCandidateList;

  if (electionResult === 1) {
    electionCandidateList = transformedCandidateData

    // isCandidateEdited = candidateEdited
    // hasChanges = candidateEditedData && Object.keys(candidateEditedData).length > 0
    // handleSaveCandidateResults = handleSaveCandidateResults
    // toggleCandidateToEdit = toggleCandidateToEdit
    // onChange = handleCandidateVoteChange


  } else if (electionResult === 2) {
    electionCandidateList = transformedCommitteeCandidateData;

    // committeeId = committee.id
    // committee = committee
    // isEdited = committeeEdited[committee.id]
    // hasChanges = committeeEditedData[committee.id] && Object.keys(committeeEditedData[committee.id]).length > 0
    // handleSaveCommitteeResults = handleSaveCommitteeResults
    // toggleCommitteeToEdit = toggleCommitteeToEdit
  }

  const columns = useMemo(() => {
    if (electionResult === 1) {
      return createCandidateVoteColumns();

    } if (electionResult === 2) {
      if (!electionCandidates) {
        return [];
      }
      return createCommitteeCandidateVoteColumns();

    } else {
      return [];
    }
  }, [electionCandidates, transformedCandidateData, transformedCommitteeCandidateData, committeeEdited, candidateEdited]);



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
