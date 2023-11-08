// React Core and Hooks
import React, { useState, useEffect, useMemo, useCallback } from "react";

// Redux Related Imports
import { useSelector, useDispatch } from "react-redux";
import { updateElectionCommitteeResults } from "store/actions";
import { electionSelector } from 'Selectors';

// Component and UI Library Imports
import { Col, Row, Card, CardBody } from "reactstrap";
import { ImageCandidateWinnerCircle, Loader, TableContainer, TableContainerHeader } from "components";

// Utility and Third-Party Library Imports
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResultsTab = () => {
  const dispatch = useDispatch();
  const { electionCandidates, electionCommittees, electionCommitteeResults } = useSelector(electionSelector);
  const [committeeEdited, setCommitteeEdited] = useState({});
  const [committeeEditedData, setCommitteeEditedData] = useState({});

  const toggleCommitteeToEdit = (committeeId) => {
    setCommitteeEdited(preveditedCommittee => ({
      ...preveditedCommittee,
      [committeeId]: !preveditedCommittee[committeeId]
    }));
  };

  const handleEditCell = (candidateId, committeeId, value) => {
    setCommitteeEditedData(prev => ({
      ...prev,
      [committeeId]: {
        ...prev[committeeId],
        [candidateId]: value
      }
    }));
  };

  const handleSaveCommitteeResults = useCallback((committeeId) => {
    if (committeeEditedData[committeeId]) {
      const updatedElectionCommitteeResult = {
        id: committeeId,
        data: committeeEditedData[committeeId]
      };

      dispatch(updateElectionCommitteeResults(updatedElectionCommitteeResult));

      // Reset edited data for this specific committee
      const updatededitedCommittee = { ...committeeEdited };
      delete updatededitedCommittee[committeeId];
      setCommitteeEdited(updatededitedCommittee);

      // Reset the modified data for this committee if needed
      const updatedModifiedData = { ...committeeEditedData };
      delete updatedModifiedData[committeeId];
      setCommitteeEditedData(updatedModifiedData);

      // Toggle edit mode off immediately, don’t wait for the action to complete
      toggleCommitteeToEdit(committeeId);
    } else {
      // If no modifications are there but user still clicked save, simply toggle off the edit mode
      toggleCommitteeToEdit(committeeId);
    }
  }, [committeeEditedData, dispatch]);

  // Function to transform the data
  const transformData = (data) => {
    console.log("Original Data:", data);

    // Add a guard clause to handle null or undefined data
    if (data === null || data === undefined) {
      return [];
    }
    const transformed = [];
    const totals = {};

    // Calculate total votes for each candidate
    for (const committeeVotes of Object.values(data)) {
      for (const [candidateId, votes] of Object.entries(committeeVotes)) {
        const id = parseInt(candidateId);
        totals[id] = (totals[id] || 0) + votes;
      }
    }


    // Check whether any column is in edit mode
    const isEditingAnyColumn = Object.values(committeeEdited).some(Boolean);

    // Helper function to find candidate name
    const findCandidateName = (id) => electionCandidates.find(c => c.id === id)?.name;

    // Sort candidates either by name (if editing) or by total votes (if not editing)
    const sortedCandidates = Object.keys(totals)
      .map(Number)
      .sort((a, b) => {
        const result = isEditingAnyColumn
          ? (findCandidateName(a) || "").localeCompare(findCandidateName(b) || "")
          : (() => {
            const candidateA = electionCandidates.find(c => c.id === a);
            const candidateB = electionCandidates.find(c => c.id === b);
            return (candidateA.position || 0) - (candidateB.position || 0);
          })();
        return result;
      });

    // Organize and transform the data
    sortedCandidates.forEach((candidateId, index) => {
      // Creating initial row setup
      const row = { "candidate.id": candidateId, position: index + 1 };

      // Calculating and assigning total votes for each candidate
      row["total"] = totals[candidateId] || 0;

      // Assigning committee votes to each row
      for (const committeeId in data) {
        // Checking if column is in edit mode
        const isColumnInEditMode = committeeEdited[committeeId];

        // Assigning votes or input field based on edit mode
        row[`committee_${committeeId}`] = isColumnInEditMode
          ? <VotesInputField candidateId={candidateId} committeeId={committeeId} votes={data[committeeId][candidateId] || 0} />
          : data[committeeId][candidateId] || 0;
      }

      // Pushing each transformed row to the result
      transformed.push(row);
    });
    // Returning the transformed data

    return transformed;
  };

  // Input Field Component for readability
  const VotesInputField = ({ candidateId, committeeId, votes }) => {
    const [localVote, setLocalVotes] = useState(votes);

    useEffect(() => {
      setLocalVotes(votes); // This will sync the local state with the prop when it changes
    }, [votes]);

    const handleBlur = () => {
      handleEditCell(candidateId, committeeId, localVote);
    };

    return (
      <input
        key={`${candidateId}-${committeeId}`}
        type="text"
        maxLength="3"
        pattern="\d*"
        inputMode="numeric"
        style={{ width: "3em" }}
        value={localVote} // changed from committeeEditedData[committeeId]?.[candidateId] || votes to localValue
        onChange={(e) => setLocalVotes(e.target.value)}
        onBlur={handleBlur}
      />
    );
  };


  const CommitteeButton = ({ committeeId, committee }) => {
    const isEdited = committeeEdited[committeeId];
    const hasChanges = committeeEditedData[committeeId] && Object.keys(committeeEditedData[committeeId]).length > 0;
    const buttonText = isEdited ? (hasChanges ? 'حفظ' : 'اغلاق') : (committee ? committee.name : `Committee ${committeeId}`);
    const buttonClass = isEdited ? (hasChanges ? 'btn-success' : 'btn-danger') : 'btn-info';

    const handleClick = () => {
      if (isEdited && hasChanges) {
        handleSaveCommitteeResults(committeeId);
      }
      toggleCommitteeToEdit(committeeId);
    };

    return (
      <button onClick={handleClick} className={`btn btn-sm ml-2 ${buttonClass}`}>
        {buttonText}
      </button>
    );
  };


  const createColumns = (data) => {

    // Guard clause to handle undefined or null electionCommitteeResults
    if (electionCommitteeResults === undefined || electionCommitteeResults === null) {
      return null; // or render a loading indicator, error message, or empty state
    }
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
            return <p className="text-danger"><strong>المرشح غير موجود (الرمز: {candidateId})</strong></p>;
          }
          return (
            <ImageCandidateWinnerCircle
              gender={candidate.gender}
              name={candidate.name}
              imagePath={candidate.image}
              isWinner={candidate.isWinner}
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
  const [transformedData, setTransformedData] = useState([]);

  useEffect(() => {
    setTransformedData(transformData(electionCommitteeResults));
  }, [electionCommitteeResults, committeeEditedData, committeeEdited]); // added committeeEdited to dependencies

  console.log("electionCommitteeResults:", electionCommitteeResults)
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
