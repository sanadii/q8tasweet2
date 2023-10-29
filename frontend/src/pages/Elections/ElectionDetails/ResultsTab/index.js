// React Core and Hooks
import React, { useState, useMemo, useEffect } from "react";

// Redux Related Imports
import { useSelector } from "react-redux";
import { electionSelector } from 'Selectors';

// Component and UI Library Imports
import { TableContainer, TableContainerHeader } from "Common/Components";
import { Id, Position, Name, Total } from "./ResultsCol";
import { CommitteeButton } from "./FormComponents";
import { transformData } from './transformData'; // Importing the transformData function
import useSaveCommitteeResults from './handleSaveCommitteeResults';

// Utility and Third-Party Library Imports
import { Col, Row, Card, CardBody } from "reactstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResultsTab = () => {
  const { election, electionCandidates, electionCommittees } = useSelector(electionSelector);
  const [committeeEdited, setCommitteeEdited] = useState({}); // Can Carry Arrays
  const [committeeEditedData, setCommitteeEditedData] = useState({});


  // Toggle Committee To Edit Mode
  const toggleCommitteeToEdit = (committeeId) => {
    setCommitteeEdited(prev => ({ ...prev, [committeeId]: !prev[committeeId] }));
  };

  // Handle Editing Cells
  const handleEditCell = (candidateId, committeeId, value) => {
    setCommitteeEditedData(prev => ({
      ...prev,
      [committeeId]: { ...prev[committeeId], [candidateId]: value }
    }));
  };


  // Transformed Data [Taking ElectionCommitteeResults together with the committeeEdited]
  const transformedData = useMemo(
    () => transformData(
      electionCandidates,
      electionCommittees,
      committeeEdited,
      handleEditCell,
      election // Passing election as an argument
    ),
    [electionCandidates, electionCommittees, committeeEdited, handleEditCell, election]
  );


  // Handle Save Committee Results
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
        // Cell: (cellProps) => <Position {...cellProps} electionCandidates={electionCandidates} />
      },
      {
        Header: "المرشح",
        Cell: (cellProps) => <Name {...cellProps} electionCandidates={electionCandidates} />
      },
      {
        Header: 'المجموع',
        accessor: 'total',
      },
    ];

    // Add columns for each committee
    electionCommittees.forEach((committee) => {
      columns.push({
        Header: () => (
          <CommitteeButton
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

export default ResultsTab;

// WE ARE FINE HERE
