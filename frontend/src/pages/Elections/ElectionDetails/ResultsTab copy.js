// React Core and Hooks
import React, { useState, useEffect, useMemo, useCallback } from "react";

// Redux Related Imports
import { useSelector, useDispatch } from "react-redux";
import { updateElectionCommitteeResults } from "../../../store/actions";
import { electionsSelector } from '../../../Selectors/electionsSelector';

// Component and UI Library Imports
import { Col, Row, Card, CardBody } from "reactstrap";
import { ImageCandidateWinnerCircle, Loader, TableContainer, TableContainerHeader } from "../../../Components/Common";

// Utility and Third-Party Library Imports
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResultsTab = () => {
  const dispatch = useDispatch();

  const { electionCandidates, electionCommittees, electionCommitteeResults, error } = useSelector(electionsSelector);
  const [editedData, setEditedData] = useState({});
  const [modifiedData, setModifiedData] = useState({});

  const isEditingAnyColumn = useMemo(() => Object.values(editedData).some(Boolean), [editedData]);



  const findCandidateName = useCallback((id) => {
    return electionCandidates.find(c => c.id === id)?.name;
  }, [electionCandidates]);

  const handleVoteChange = useCallback((candidateId, committeeId, value) => {
    setModifiedData(prev => ({
      ...prev,
      [committeeId]: {
        ...prev[committeeId],
        [candidateId]: value
      }
    }));
  }, []);


  const transformedData = useMemo(() => transformData(
    electionCommitteeResults,
    isEditingAnyColumn,
    findCandidateName,
    editedData,
    electionCandidates,
    handleVoteChange
  ), [electionCommitteeResults, isEditingAnyColumn, findCandidateName, editedData, electionCandidates, handleVoteChange]);

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

  const handleSaveCommitteeResults = useCallback((committeeId) => {
    if (modifiedData[committeeId]) {
      const updatedElectionCommitteeResult = {
        id: committeeId,
        data: modifiedData[committeeId]
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

      // Toggle edit mode off immediately, don’t wait for the action to complete
      toggleEditMode(committeeId);
    } else {
      // If no modifications are there but user still clicked save, simply toggle off the edit mode
      toggleEditMode(committeeId);
    }
  }, [modifiedData, dispatch, editedData]);





  const CommitteeButton = ({ committeeId, committee }) => {
    const isEdited = editedData[committeeId];
    const hasChanges = modifiedData[committeeId] && Object.keys(modifiedData[committeeId]).length > 0;
    let buttonText, buttonClass;

    if (isEdited) {
      buttonText = hasChanges ? 'Save' : 'Close';
      buttonClass = hasChanges ? 'btn-success' : 'btn-danger';
    } else {
      buttonText = committee ? committee.name : `Committee ${committeeId}`;
      buttonClass = 'btn-info';
    }

    const handleClick = () => {
      if (isEdited) {
        if (hasChanges) {
          handleSaveCommitteeResults(committeeId);
        }
        toggleEditMode(committeeId); // <- will close the edit mode whether or not there are changes
      } else {
        toggleEditMode(committeeId);
      }
    };
    return (
      <button onClick={handleClick} className={`btn btn-sm ml-2 ${buttonClass}`}>
        {buttonText}
      </button>
    );
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
        accessor: (row) => {
          const candidateId = row['candidate.id'];
          const candidate = electionCandidates.find((candidate) => candidate.id === candidateId);
          return candidate ? candidate.name : "";
        },
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
        filterable: true,
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
        Header: () => <CommitteeButton committeeId={committeeId} committee={committee} />,
        accessor: `committee_${committeeId}`, // Define accessor here
      });
    });

    return columns;
  }

  // Inside your component
  const columns = createColumns(electionCommitteeResults);

  return (
    <React.Fragment>
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

                  // Other props
                  sortMethod={(rowA, rowB) => {
                    if (isEditingAnyColumn) {
                      // sort alphabetically
                      const nameA = findCandidateName(rowA['candidate.id']) || "";
                      const nameB = findCandidateName(rowB['candidate.id']) || "";
                      return nameA.localeCompare(nameB);
                    } else {
                      // sort by position
                      const posA = rowA.position || 0;
                      const posB = rowB.position || 0;
                      return posA - posB;
                    }
                  }}

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


// Function to transform the data
const transformData = (data, isEditingAnyColumn, findCandidateName, editedData, electionCandidates, handleVoteChange) => {
  const transformed = [];
  const totals = {};

  // Calculate total votes for each candidate
  for (const committeeId in data) {
    for (const [candidateId, votes] of Object.entries(data[committeeId])) {
      totals[candidateId] = (totals[candidateId] || 0) + votes;
    }
  }

  // Sort candidates either by name (if editing) or by total votes (if not editing)
  const sortedCandidates = Object.keys(totals)
    .map(Number)
    .sort((a, b) => {
      if (isEditingAnyColumn) {
        return (findCandidateName(a) || "").localeCompare(findCandidateName(b) || "");
      } else {
        const candidateA = electionCandidates.find(c => c.id === a);
        const candidateB = electionCandidates.find(c => c.id === b);
        return (candidateA.position || 0) - (candidateB.position || 0);
      }
    });

  // Organize and transform the data
  sortedCandidates.forEach((candidateId, index) => {
    // Creating initial row setup
    const row = { "candidate.id": candidateId, position: index + 1, total: totals[candidateId] || 0 };

    // Assigning committee votes to each row
    for (const committeeId in data) {
      row[`committee_${committeeId}`] = editedData[committeeId] ? (
        <VotesInputField
          candidateId={candidateId}
          committeeId={committeeId}
          votes={data[committeeId][candidateId] || 0}
          onVoteChange={handleVoteChange}
        />
      ) : data[committeeId][candidateId] || 0;
    }
    transformed.push(row); // pushing the row after it's fully created
  });

  return transformed;
};

// Input Field Component for readability
const VotesInputField = ({ candidateId, committeeId, votes, onVoteChange }) => {
  const [localVotes, setLocalVotes] = useState(votes);

  useEffect(() => {
    setLocalVotes(votes); // This will sync the local state with the prop when it changes
  }, [votes]);

  const handleBlurOrEnter = () => {
    if (localVotes !== votes) {
      onVoteChange(candidateId, committeeId, localVotes);
    }
  };

  return (
    <input
      key={`${candidateId}-${committeeId}`}
      type="text"
      maxLength="5"
      pattern="\d*"
      inputMode="numeric"
      style={{ width: "3em" }}
      value={localVotes}
      onChange={(e) => setLocalVotes(e.target.value)}
      onBlur={handleBlurOrEnter}
      onKeyPress={(e) => {
        if (e.key === "Enter") {
          handleBlurOrEnter();
        }
      }}
    />
  );
};



export default ResultsTab;
