// React imports
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

import { updateElectionCommitteeResults } from "../../../store/actions";

// Utility and helper imports
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Custom component imports
import { ImageGenderCircle, Loader, ExportCSVModal, TableContainer, TableContainerHeader } from "../../../Components/Common";

// Reactstrap (UI) imports
import { Badge, Col, Container, Row, Card, CardBody } from "reactstrap";

// Additional package imports
import SimpleBar from "simplebar-react";

const ResultsTab = () => {
  const dispatch = useDispatch();

  const { electionCandidates, electionCommittees, electionCommitteeResults, error } = useSelector((state) => ({
    electionCandidates: state.Elections.electionCandidates,
    electionCommittees: state.Elections.electionCommittees,
    electionCommitteeResults: state.Elections.electionCommitteeResults,
    error: state.Elections.error,
  }));

  const [electionCommitteeResult, setElectionCommitteeResults] = useState(null);

  const [editedData, setEditedData] = useState({});
  const [modifiedData, setModifiedData] = useState({});

  useEffect(() => {
    // For every committee in edit mode, dispatch the changes to your backend or other desired location.
    for (const committeeId in editedData) {
      if (editedData[committeeId]) {
        // Save logic
        console.log("committeeId:", committeeId);

        // dispatch(updateElectionCommitteeResults(committeeId, modifiedData[committeeId]));
      }
    }
  }, [editedData]);


  const toggleEditMode = (committeeId) => {
    setEditedData(prevEditedData => ({
      ...prevEditedData,
      [committeeId]: !prevEditedData[committeeId]
    }));
  };


  const handleEditCell = (candidateId, committeeId, value) => {
    setModifiedData(prev => ({
      ...prev,
      [committeeId]: {
        ...prev[committeeId],
        [candidateId]: value
      }
    }));
  };


  const handleSaveCommitteeResults = (committeeId) => {
    if (modifiedData[committeeId]) {

      const updatedElectionCommitteeResults = {
        id: committeeId, // the committee ID
        data: modifiedData[committeeId] // the candidate-votes data for the committee
      };

      dispatch(updateElectionCommitteeResults(updatedElectionCommitteeResults));

      // Reset edited data for this specific committee
      const updatedEditedData = { ...editedData };
      delete updatedEditedData[committeeId];
      setEditedData(updatedEditedData);

      // Reset the modified data for this committee if needed
      const updatedModifiedData = { ...modifiedData };
      delete updatedModifiedData[committeeId];
      setModifiedData(updatedModifiedData);
    }
  };


  // Function to transform the data
  const transformData = (data) => {
    const transformed = [];

    // Collect all unique candidate IDs
    const allCandidates = new Set();
    for (const committeeVotes of Object.values(data)) {
      for (const candidateId of Object.keys(committeeVotes)) {
        allCandidates.add(parseInt(candidateId));
      }
    }

    // Organize the data for each candidate
    allCandidates.forEach(candidateId => {
      const row = { "candidate.id": candidateId };
      let totalVotesForCandidate = 0; // Initialize the total vote counter for each candidate

      for (const committeeId in data) {
        const isColumnInEditMode = editedData[committeeId]; // Check if column is in edit mode

        // Update the total vote count for this candidate
        totalVotesForCandidate += data[committeeId][candidateId] || 0;

        if (isColumnInEditMode) {
          // Render an editable input field in edit mode
          row[`committee_${committeeId}`] = (
            <input
              type="text"
              maxLength="3"
              pattern="\d*"  // Regular expression pattern to match only numbers
              inputMode="numeric"  // Suggests a numeric input mode
              style={{ width: "3em" }}  // Setting the width to limit the size of the input box
              value={modifiedData[committeeId] && modifiedData[committeeId][candidateId] ? modifiedData[committeeId][candidateId] : (data[committeeId][candidateId] || 0)}
              onChange={(e) => handleEditCell(candidateId, committeeId, e.target.value)}
            />
          );
        } else {
          // Render cell content in view mode
          row[`committee_${committeeId}`] = data[committeeId][candidateId] || 0;
        }
      }

      // Set the total vote count for this candidate to the row
      row['total'] = totalVotesForCandidate;

      transformed.push(row);
    });

    return transformed;
  };



  const createColumns = (data) => {
    const columns = [
      {
        Header: "Candidate",
        accessor: 'candidate.id',
        Cell: (cellProps) => {
          const candidateId = cellProps.row.original['candidate.id'];
          const candidate = electionCandidates.find((candidate) => candidate.id === candidateId);

          if (!candidate) {
            return <p className="text-danger"><strong>Not Found (ID: {candidateId})</strong></p>;
          }

          return (
            <>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  {candidate.image ? (
                    // Use the ImageGenderCircle component here
                    <ImageGenderCircle
                      genderValue={candidate.gender}
                      imagePath={candidate.image}
                    />
                  ) : (
                    <div className="flex-shrink-0 avatar-xs me-2">
                      <div className="avatar-title bg-soft-success text-success rounded-circle fs-13">
                        {candidate.name.charAt(0)}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex-grow-1 ms-2 name">
                  {candidate.name}{" "}
                  {candidate.is_winner ? (
                    <Badge color="success" className="badge-label">
                      <i className="mdi mdi-circle-medium"></i> Winner
                    </Badge>
                  ) : null}
                </div>
              </div>
            </>
          );
        },
      },
      {
        Header: 'المركز',
        accessor: 'position',
        Cell: (cellProps) => {
          const candidateId = cellProps.row.original['candidate.id'];
          const candidate = electionCandidates.find((candidate) => candidate.id === candidateId);

          if (!candidate) {
            return <p className="text-danger"><strong>Not Found (ID: {candidateId})</strong></p>;
          }

          return (
            <>
              {candidate.position}
            </>
          );
        },
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
        Header: committee ? committee.name : `Committee ${committeeId}`,
        accessor: `committee_${committeeId}`,
        Footer: () => (
          <button
            onClick={() => {
              if (editedData[committeeId]) {
                handleSaveCommitteeResults(committeeId);
              } else {
                toggleEditMode(committeeId);
              }
            }}
            className="btn btn-primary">
            {editedData[committeeId] ? "Save" : "Edit"}
          </button>
        )


      });
    });
    return columns;
  }




  // Inside your component
  const transformedData = transformData(electionCommitteeResults);
  const columns = createColumns(electionCommitteeResults);

  // Export Modal
  const [isExportCSV, setIsExportCSV] = useState(false);

  return (
    <React.Fragment>
      <ExportCSVModal
        show={isExportCSV}
        onCloseClick={() => setIsExportCSV(false)}
        data={electionCommitteeResults}
      />
      <Row>
        <Col lg={12}>
          <Card id="electionCommitteeList">
            <CardBody>
              <div>
                <TableContainerHeader
                  // Title
                  ContainerHeaderTitle="Election Committees"
                />

                <TableContainer
                  // Data
                  columns={columns}
                  data={transformedData}
                  customPageSize={50}

                  // Header
                  isTableContainerHeader={true}
                  ContainerHeaderTitle="Election Committees"
                  // Filters
                  isGlobalFilter={true}
                  isCommitteeGenderFilter={true}
                  SearchPlaceholder="Search for Election Committees..."
                  setElectionCommitteeResults={setElectionCommitteeResults}

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
