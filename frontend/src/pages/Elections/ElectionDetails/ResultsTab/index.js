// React Core and Hooks
import React, { useState, useMemo, useCallback } from "react";

// Redux Related Imports
import { useSelector } from "react-redux";
import { electionSelector } from 'Selectors';

// Component and UI Library Imports
import { Loader, TableContainer, TableContainerHeader, ImageCandidateWinnerCircle } from "components";
import { HeaderVoteButton, transformResultData, useSaveCommitteeResults } from './ResultHelper';

// Utility and Third-Party Library Imports
import { Col, Row, Card, CardHeader, CardBody, Input } from "reactstrap";
import { toast, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import Parties from "./Parties";
import Candidates from "./Candidates";

const ResultsTab = () => {
  const { election, electionMethod, electionResultView, electionResultParty, electionResultSorting, electionCandidates, electionParties, electionPartyCandidates, electionCommittees } = useSelector(electionSelector);

  // candidates based on election Type
  const candidates = electionMethod !== "candidateOnly" ? electionPartyCandidates : electionCandidates;
  const parties = electionMethod !== "candidateOnly" ? electionParties : electionParties;

  // Parties
  const [resultsDisplayType, setResultsDisplayType] = useState("partyCandidateOriented");



  // States
  const [columnEdited, setColumnEdited] = useState({});
  const [partyEdited, setPartyEdited] = useState({});
  const [hasChanges, setHasChanges] = useState(false);


  const [voteFieldEditedData, setVoteFieldEditedData] = useState({});
  console.log("columnEdited? ", columnEdited, "hasChanges? ", hasChanges)


  // Toggle Vote Column To Edit / Save / Close Mode
  const toggleColumnToEdit = (committeeId) => {
    setColumnEdited(prev => ({
      ...prev,
      [committeeId]: !prev[committeeId], // Toggle the value for the specified committee
    }));

    setPartyEdited(prev => ({
      ...prev,
      [committeeId]: !prev[committeeId], // Toggle the value for the specified committee
    }));

    setHasChanges(prev => ({
      ...prev,
      [committeeId]: false, // Set hasChanges to false for the specified committee
    }));

  };

  // Handle Editing Cells
  const handleVoteFieldChange = useCallback((committeeId, candidateId, newValue) => {
    setVoteFieldEditedData(prev => ({
      ...prev, [committeeId]: { ...(prev[committeeId] || {}), [candidateId]: newValue },
    }));

    // Set hasChanges for the specific committee to true
    setHasChanges(prev => ({
      ...prev,
      [committeeId]: true,
    }));

  }, []);


  // Transformed Data [Taking ElectionCommitteeResults together with the result Field Edited]
  const transforedPartyData = useMemo(
    () => transformResultData(
      parties,
      electionCommittees,
      columnEdited,
      handleVoteFieldChange,
      election
    ), [parties, electionCommittees, columnEdited, handleVoteFieldChange, election]
  );

  // Transformed Data [Taking ElectionCommitteeResults together with the result Field Edited]
  const transformedCandidateData = useMemo(
    () => transformResultData(
      candidates,
      electionCommittees,
      columnEdited,
      handleVoteFieldChange,
      election
    ), [candidates, electionCommittees, columnEdited, handleVoteFieldChange, election]
  );


  // Handle Save Committee Results 
  const handleSaveResults = useSaveCommitteeResults(
    voteFieldEditedData,
    columnEdited,
    setColumnEdited,
    setVoteFieldEditedData,
    toggleColumnToEdit,
    electionMethod,
    resultsDisplayType,
  );



  // Creating the columns for both Final and Detailed Results
  const createColumns = (electionResultView) => {
    // Base columns that are always present
    const baseColumns = [
      {
        Header: 'المرشح',
        accessor: 'name',
      },
      
      {
        Header: 'المركز',
        accessor: 'position',
      },
    ];

    const voteColumn = [
      {
        Header: () => (
          <HeaderVoteButton
            committeeId={"0"}
            committee={0}
            columnEdited={columnEdited}  // Need some work
            hasChanges={hasChanges}
            handleSaveResults={handleSaveResults}
            toggleColumnToEdit={toggleColumnToEdit}
          />
        ),
        accessor: 'votes',
      },
    ];

    const committeeColumns = electionCommittees.map(committee => ({
      Header: () => (
        <HeaderVoteButton
          committeeId={committee.id}
          committee={committee}
          columnEdited={columnEdited}
          hasChanges={hasChanges}
          handleSaveResults={handleSaveResults}
          toggleColumnToEdit={toggleColumnToEdit}
        />
      ),
      accessor: `committee_${committee.id}`,
    }));

    const partyCandidateTotalColumn = [
      {
        Header: 'المجموع',
        accessor: 'partyCandidateTotal',
      },
    ]
    // Columns for when electionResultView is total or detailed
    if (electionResultView === "total") {
      return [
        ...baseColumns,
        ...partyCandidateTotalColumn, // for partyCandidate
        ...voteColumn,
      ];
    } else {
      return [
        ...baseColumns,
        { Header: 'المجموع', accessor: 'total' },
        ...committeeColumns,
      ];
    }
    return [];
  };


  const columns = useMemo(() => {
    return createColumns(electionResultView);
  }, [
    electionResultView,
    candidates,
    electionCommittees,
    columnEdited,
    voteFieldEditedData,
  ]);


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


                {
                  (
                    electionMethod !== "candidateOnly" ?
                      <Parties
                        columns={columns}
                        transformedCandidateData={transformedCandidateData}
                        transforedPartyData={transforedPartyData}
                        HeaderVoteButton={HeaderVoteButton}
                        resultsDisplayType={resultsDisplayType}
                        setResultsDisplayType={setResultsDisplayType}

                      />
                      :
                      <Candidates
                        columns={columns}
                        transformedCandidateData={transformedCandidateData}

                      />
                  )
                }
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