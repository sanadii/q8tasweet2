// React imports
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateElectionCommitteeResults } from "../../../store/actions";
import { electionsSelector } from '../../../selectors/electionsSelector';

// Utility and helper imports
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Custom component imports
import { ImageCandidateWinnerCircle, Loader, ExportCSVModal, TableContainer, TableContainerHeader } from "../../../Components/Common";

// Reactstrap (UI) imports
import { Col, Row, Card, CardBody } from "reactstrap";

const ResultsTab = () => {
  const dispatch = useDispatch();

  const { electionCandidates, electionCommittees, electionCommitteeResults, error } = useSelector(electionsSelector);

  const [editedData, setEditedData] = useState({});
  const [modifiedData, setModifiedData] = useState({});

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

      const updatedElectionCommitteeResult = {
        id: committeeId, // the committee ID
        data: modifiedData[committeeId] // the candidate-votes data for the committee
      };

      dispatch(updateElectionCommitteeResults(updatedElectionCommitteeResult));

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
    const totals = {};
  
    // Calculate total votes for each candidate
    for (const committeeVotes of Object.values(data)) {
      for (const [candidateId, votes] of Object.entries(committeeVotes)) {
        const id = parseInt(candidateId);
        totals[id] = (totals[id] || 0) + votes;
      }
    }
  
    // Sort candidate IDs based on total votes
    const sortedCandidates = Object.keys(totals)
      .map(Number)
      .sort((a, b) => totals[b] - totals[a]);
  
    // Organize the data for each sorted candidate
    sortedCandidates.forEach((candidateId, index) => {
      const row = { "candidate.id": candidateId, position: index + 1 };
      let totalVotesForCandidate = totals[candidateId] || 0;
  
      for (const committeeId in data) {
        const isColumnInEditMode = editedData[committeeId];
        
        const votes = data[committeeId][candidateId] || 0;
        row[`committee_${committeeId}`] = isColumnInEditMode ? (
          <input
            type="text"
            maxLength="3"
            pattern="\d*"
            inputMode="numeric"
            style={{ width: "3em" }}
            value={modifiedData[committeeId]?.[candidateId] || votes}
            onChange={(e) => handleEditCell(candidateId, committeeId, e.target.value)}
          />
        ) : votes;
      }
  
      // Set the total vote count for this candidate to the row
      row["total"] = totalVotesForCandidate;
      transformed.push(row);
    });
  
    return transformed;
  };
  
  





  const createColumns = (data) => {
    const columns = [
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
        Header: "المرشح",
        accessor: 'candidate',
        filterable: true,
        Cell: (cellProps) => {
          const candidateId = cellProps.row.original['candidate.id'];
          const candidate = electionCandidates.find((candidate) => candidate.id === candidateId);

          if (!candidate) {
            return <p className="text-danger"><strong>Not Found (ID: {candidateId})</strong></p>;
          }

          return (
            <ImageCandidateWinnerCircle
              gender={candidate.gender}
              name={candidate.name}
              imagePath={candidate.image}
              is_winner={candidate.is_winner}
            />
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
  // const [isExportCSV, setIsExportCSV] = useState(false);

  return (
    <React.Fragment>
      {/* <ExportCSVModal
        show={isExportCSV}
        onCloseClick={() => setIsExportCSV(false)}
        data={electionCommitteeResults}
      /> */}
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
                  isTableContainerFooter={true}

                  // Header
                  isTableContainerHeader={true}
                  ContainerHeaderTitle="Election Committees"
                  // Filters
                  isGlobalFilter={true}
                  isCommitteeGenderFilter={true}
                  SearchPlaceholder="Search for Election Committees..."

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
