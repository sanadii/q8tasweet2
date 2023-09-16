// React imports
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

import { deleteElectionCommittee } from "../../../store/actions";
import ElectionCommitteeModal from "./Modals/ElectionCommitteeModal";

// Utility and helper imports
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Custom component imports
import { ImageGenderCircle, Loader, DeleteModal, ExportCSVModal, TableContainer, TableContainerHeader } from "../../../Components/Common";

// Reactstrap (UI) imports
import { Badge, Col, Container, Row, Card, CardBody } from "reactstrap";

// Additional package imports
import SimpleBar from "simplebar-react";

const ResultsTab = () => {
  const dispatch = useDispatch();

  const { election_id, electionCandidates, electionCommittees, electionCommitteeResults, error } = useSelector((state) => ({
    election_id: state.Elections.electionDetails.id,
    electionCandidates: state.Elections.electionCandidates,
    electionCommittees: state.Elections.electionCommittees,
    electionCommitteeResults: state.Elections.electionCommitteeResults,
    error: state.Elections.error,
  }));

  const [electionCommitteeResult, setElectionCommitteeResults] = useState(null);

  const [isEditMode, setIsEditMode] = useState(false);
  const [editedData, setEditedData] = useState({}); // Keep track of edited data

  useEffect(() => {
    setElectionCommitteeResults(electionCommitteeResults);
  }, [electionCommitteeResults]);

  // Modals: Delete, Set, Edit
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  // Toggle for Add / Edit Models
  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setElectionCommitteeResults(null);
    } else {
      setModal(true);
    }
  }, [modal]);


  const handleElectionCommitteeClicks = () => {
    setElectionCommitteeResults("");
    setIsEdit(false);
    toggle();
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
      const row = { "candidate.id": candidateId }; // This will represent each row in the table
      for (const committeeId in data) {
        const isCellEditMode = editedData[candidateId] === committeeId; // Check if cell is in edit mode
        if (isCellEditMode) {
          // Render an editable input field in edit mode
          row[`committee_${committeeId}`] = (
            <input
              type="text"
              value={data[committeeId][candidateId] || 0}
              onChange={(e) => handleEditCell(candidateId, committeeId, e.target.value)}
            />
          );
        } else {
          // Render cell content in view mode
          row[`committee_${committeeId}`] = data[committeeId][candidateId] || 0;
        }
      }
      transformed.push(row);
    });

    return transformed;
  }

  // Function to handle editing a cell
  const handleEditCell = (candidateId, committeeId, value) => {
    // Update editedData with the edited value and set edit mode to false
    const updatedEditedData = { ...editedData };
    updatedEditedData[candidateId] = committeeId;
    setEditedData(updatedEditedData);
    setIsEditMode(false);

    // Here, you can dispatch an action to update the data in your Redux store or API
    // dispatch(yourUpdateAction(candidateId, committeeId, value));
  }

  // Function to toggle edit mode for a cell
  const toggleEditMode = (candidateId, committeeId) => {
    setIsEditMode(true);
    setEditedData({ ...editedData, [candidateId]: committeeId });
  }



  const createColumns = (data) => {
    const columns = [
      {
        Header: 'Candidate',
        accessor: 'candidate.id', // ← Adjusted this line
        Cell: (cellProps) => {
          const candidateId = cellProps.row.original['candidate.id'];  // ← Adjusted this line
          const candidate = electionCandidates.find((candidate) => candidate.id === candidateId);
          console.log(cellProps.row.original);  // To inspect the original row data
          if (!candidate) {
            return <p className="text-danger"><strong>Not Found (ID: {candidateId})</strong></p>;
          }
          return <p className="text-success"><strong>{candidate.name}</strong></p>;
        },
      }


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
            onClick={() => handleEditCommitteeClick(committeeId)}
            className="btn btn-primary">
            {committee ? committee.name : `Committee ${committeeId}`}
          </button>
        )

      });
    });
    const handleEditCommitteeClick = (committeeId) => {
      // Here, you'd initiate your editing logic for the specified committee.
      // dispatch(yourEditActionForCommittee(committeeId));

      // // OR if using a modal:
      // setIsEditModalOpen(true);
      // setSelectedCommitteeId(committeeId);
    }


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
      <ElectionCommitteeModal
        modal={modal} // boolean to control modal visibility
        setModal={setModal}
        isEdit={isEdit} // boolean to determine if editing
        toggle={toggle}
        electionCommitteeResult={electionCommitteeResult}
      />

      <Row>
        <Col lg={12}>
          {/* <div>
            <button
              className="btn btn-soft-success"
              onClick={() => setIsExportCSV(true)}
            >
              Export
            </button>
          </div> */}
          <Card id="electionCommitteeList">
            <CardBody>
              <div>
                <TableContainerHeader
                  // Title
                  ContainerHeaderTitle="Election Committees"

                  // Add Elector Button
                  isEdit={isEdit}
                  handleEntryClick={handleElectionCommitteeClicks}
                  toggle={toggle}
                />

                <TableContainer
                  // Data
                  columns={columns}
                  data={transformedData}
                  customPageSize={50}

                  // Header
                  isTableContainerHeader={true}
                  ContainerHeaderTitle="Election Committees"
                  AddButton="Add Election Committee"
                  setIsEdit={setIsEdit}
                  toggle={toggle}

                  // Filters
                  isGlobalFilter={true}
                  isCommitteeGenderFilter={true}
                  SearchPlaceholder="Search for Election Committees..."
                  setElectionCommitteeResults={setElectionCommitteeResults}
                  // handleElectionCommitteeClick={handleElectionCommitteeClicks}

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
