// React Core and Hooks
import React, { useState, useMemo } from "react";

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
  const { electionCandidates, electionCommittees, electionCommitteeResults } = useSelector(electionSelector);
  const [committeeEdited, setCommitteeEdited] = useState({}); // Can Carry Arrays
  const [committeeEditedData, setCommitteeEditedData] = useState({});

  console.log("committeeEditedData:", committeeEditedData)


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
    () => transformData(electionCandidates, electionCommitteeResults, committeeEdited, handleEditCell),
    [electionCommitteeResults, committeeEdited, electionCandidates, handleEditCell]
  );
  console.log("transformedData:", transformedData)


  // Handle Save Committee Results
  const handleSaveCommitteeResults = useSaveCommitteeResults(committeeEditedData, committeeEdited, setCommitteeEdited, setCommitteeEditedData, toggleCommitteeToEdit);


  const createColumns = (data) => {
    // Guard clause to handle undefined or null electionCommitteeResults
    if (electionCommitteeResults === undefined || electionCommitteeResults === null) {
      return null; // or render a loading indicator, error message, or empty state
    }
    const columns = [
      {
        Header: 'المركز',
        accessor: 'position',
        Cell: (cellProps) => <Position {...cellProps} electionCandidates={electionCandidates} />
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
    const committeeKeys = Object.keys(data);
    committeeKeys.forEach(committeeKey => {
      const committeeId = committeeKey.replace("committee_", "");
      const committee = electionCommittees.find((comm) => comm.id.toString() === committeeId);

      columns.push({
        Header: () => <CommitteeButton
          committeeId={committeeId}
          committee={committee}
          isEdited={committeeEdited[committeeId]}
          hasChanges={committeeEditedData[committeeId] && Object.keys(committeeEditedData[committeeId]).length > 0}
          handleSaveCommitteeResults={handleSaveCommitteeResults}
          toggleCommitteeToEdit={toggleCommitteeToEdit}
        />,
        accessor: `committee_${committeeId}`, // Define accessor here
      });
    });

    return columns;
  }

  const columns = useMemo(() => {
    if (!electionCommitteeResults) {
      return []; // Return an empty array or handle the case as needed
    }
    return createColumns(electionCommitteeResults);
  }, [electionCommitteeResults, transformedData, committeeEdited]);

  const reversedData = [...transformedData].reverse();

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
                  data={reversedData}
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
