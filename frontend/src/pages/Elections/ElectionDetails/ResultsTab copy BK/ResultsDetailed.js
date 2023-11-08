// React Core and Hooks
import React, { useState, useMemo, useEffect } from "react";

// Redux Related Imports
import { useSelector } from "react-redux";
import { electionSelector } from 'Selectors';

// Component and UI Library Imports
import { TableContainer, TableContainerHeader } from "components";
import { ImageCandidateWinnerCircle } from "components";

import { transformData, useSaveCommitteeResults, CommitteeVoteButton } from './ResultHelper'; // Importing the transformData function

// Utility and Third-Party Library Imports
import { Col, Row, Card, CardBody } from "reactstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResultsDetailed = () => {
  const { election, electionCandidates, electionCommittees } = useSelector(electionSelector);

  // Detailed Results: States
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
  const transformedData = useMemo(
    () => transformData(electionCandidates, electionCommittees, committeeEdited, handleCommitteeVoteChange, election),
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


  const createColumns = (data) => {
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
      {
        Header: 'الأصوات',
        // accessor: 'votes',
        Cell: (electionCandidates) => (
          <>
            {electionCandidates.row.original.votes}
          </>
        ),
      }

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


  
  const columns = useMemo(() => {
    if (!electionCandidates) {
      return [];
    }
    return createColumns();
  }, [electionCandidates, transformedData, committeeEdited]);



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
