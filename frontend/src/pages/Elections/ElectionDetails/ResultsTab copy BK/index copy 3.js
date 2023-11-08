// React Core and Hooks
import React, { useState, useMemo, useEffect, useCallback } from "react";

// Redux Related Imports
import { useSelector, useDispatch } from "react-redux";
import { electionSelector } from 'Selectors';

// Component and UI Library Imports
import { TableContainer, TableContainerHeader } from "components";
import { ImageCandidateWinnerCircle } from "components";

import { ResultInputField, transformData, useSaveCommitteeResults, CommitteeVoteButton } from './ResultHelper'; // Importing the transformData function
import { updateElectionCandidateVotes } from "store/actions";

// Utility and Third-Party Library Imports
import { Col, Row, Card, CardBody } from "reactstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResultsDetailed = () => {
  const dispatch = useDispatch();

  const { election, electionCandidates, electionCommittees } = useSelector(electionSelector);


  // Final Result: States ---------
  const [electionCandidateVotes, setElectionCandidateVotes] = useState({});
  const [candidateVoteEdited, setCandidateVoteEdited] = useState({}); // Can Carry Arrays
  const [candidateVoteEditedData, setCandidateVoteEditedData] = useState({});


  // Final Result: handleSaveCandidateResults
  const handleSaveCandidateResults = useCallback(() => {
    dispatch(updateElectionCandidateVotes(electionCandidateVotes));
    setElectionCandidateVotes({});
    setCandidateVoteEdited({}); // Reset editing state
  }, [dispatch, electionCandidateVotes]);


  // Final Result: handleCandidateVoteChange
  const handleCandidateVoteChange = (candidateId, newValue) => {
    setElectionCandidateVotes((prevVotes) => ({
      ...prevVotes,
      [candidateId]: newValue
    }));
  };


  // This function should toggle the boolean edit state for a given candidate
  const toggleCandidateVoteToEdit = useCallback((candidateId) => {
    setCandidateVoteEdited((prevEdited) => ({
      ...prevEdited,
      [candidateId]: !prevEdited[candidateId]
    }));
  }, []);

  useEffect(() => {
    // Assuming electionCandidates is an array of candidates with an id property
    const initialEditState = electionCandidates.reduce((acc, candidate) => {
      acc[candidate.id] = false;
      return acc;
    }, {});

    setCandidateVoteEdited(initialEditState);
  }, [electionCandidates]);

  const CandidateVoteButton = ({
    isEdited,
    hasChanges,
    handleSaveCandidateResults,
    toggleCandidateVoteToEdit
  }) => {
    const buttonText = isEdited ? (hasChanges ? 'حفظ' : 'اغلاق') : "Edit Votes";
    const buttonClass = isEdited ? (hasChanges ? 'btn-success' : 'btn-danger') : 'btn-info';

    const handleClick = () => {
      if (isEdited && hasChanges) {
        handleSaveCandidateResults();
      }
      toggleCandidateVoteToEdit();
    };

    return (
      <button onClick={handleClick} className={`btn btn-sm ml-2 ${buttonClass}`}>
        {buttonText}
      </button>
    );
  };









  // Detailed Results: States ---------
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
    ];

    if (election.electResult === 2) {
      electionCommittees.forEach((committee) => {
        columns.push({
          Header: () => (
            <CommitteeVoteButton
              committeeId={committee.id}
              committee={committee}
              isEdited={committeeEdited[committee.id]}
              hasChanges={committeeEditedData && committeeEditedData[committee.id] && Object.keys(committeeEditedData[committee.id]).length > 0}
              handleSaveCommitteeResults={handleSaveCommitteeResults}
              toggleCommitteeToEdit={toggleCommitteeToEdit}
            />
          ),
          accessor: `committee_${committee.id}`,
        });
      });
    } else {
      columns.push({
        Header: () => (
          <CandidateVoteButton
            isEdited={Object.values(candidateVoteEdited).some(Boolean)} // Checks if any candidate is in edit mode globally
            hasChanges={Object.keys(candidateVoteEditedData).length > 0}
            handleSaveCandidateResults={handleSaveCandidateResults}
            toggleCandidateVoteToEdit={() => setCandidateVoteEdited(prev => Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: !prev[key] }), {}))}
          />
        ),
        accessor: 'votes',
        Cell: ({ row }) => {
          // Check if globally we are in edit mode
          const isGlobalEdit = Object.values(candidateVoteEdited).some(Boolean);
          return isGlobalEdit ? (
            <ResultInputField
              candidateId={row.original.id}
              value={row.original.votes} // Provide current value or empty string if not set
              onChange={(value) => handleCandidateVoteChange(row.original.id, value)}
            />
          ) : (
            row.original.votes // Show the votes if not in edit mode
          );
        }

      });

    }

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
