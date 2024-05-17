// React Core and Hooks
import React, { useState, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { electionSelector } from 'selectors';
import { TableContainerHeader } from "shared/components";
import { HeaderVoteButton, transformResultData, usePartyCommitteeVotes, useCommitteeResultSaver } from './ResultHelper';
import { Col, Row, Card, CardBody } from "reactstrap";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Parties from "./Parties";
import Candidates from "./Candidates";

const ResultsTab = () => {
  const { election, electionCandidates, electionParties, electionPartyCandidates, electionCommitteeSites } = useSelector(electionSelector);
  const { electionMethod, isDetailedResults, isSortingResults } = election

  // Based on electionMethod we will decide candidates vs parties
  const candidates = electionMethod === "candidateOnly" ? electionCandidates : electionPartyCandidates;
  const parties = electionMethod !== "candidateOnly" ? electionParties : electionParties;
  const partyCommitteeVoteList = usePartyCommitteeVotes(electionParties);

  // For the use of Party Only
  // Showing Candaites/Party results in different views
  const [resultsDisplayType, setResultsDisplayType] = useState("partyCandidateOriented");
  const [isColumnInEditMode, SetIsColumnInEditMode] = useState({});
  const [isEditField, setIsEditField] = useState(false);
  const [editedVoteFieldsData, setVoteFieldEditedData] = useState({});


  // Toggle Vote Column To Name / Edit / Save / Close Mode
  const toggleColumnEditMode = useCallback((committeeId) => {
    SetIsColumnInEditMode(prev => ({
      ...prev,
      [committeeId]: !prev[committeeId],
    }));

    setIsEditField(prev => ({
      ...prev,
      [committeeId]: false,
    }));
  }, []);


  // Handle Editing Cells
  const onVoteFieldChange = useCallback((committeeId, candidateId, newValue) => {
    setVoteFieldEditedData(prev => ({
      ...prev, [committeeId]: { ...(prev[committeeId] || {}), [candidateId]: newValue },
    }));

    // Set isEditField for the specific committee to true
    setIsEditField(prev => ({
      ...prev,
      [committeeId]: true,
    }));
  }, []);


  // Transformed Data [parties]
  const transforedPartyData = useMemo(
    () => transformResultData(
      parties,
      electionCommitteeSites,
      isColumnInEditMode,
      onVoteFieldChange,
      election,
      electionMethod,
      isDetailedResults,
    ), [parties, electionCommitteeSites, isColumnInEditMode, onVoteFieldChange, election, electionMethod,
    isDetailedResults,]
  );

  // Transformed Data [candidates]
  const transformedCandidateData = useMemo(
    () => transformResultData(
      candidates,
      electionCommitteeSites,
      isColumnInEditMode,
      onVoteFieldChange,
      election,
      partyCommitteeVoteList,
      resultsDisplayType,
    ), [candidates, electionCommitteeSites, isColumnInEditMode, onVoteFieldChange, election, resultsDisplayType, partyCommitteeVoteList]
  );


  // Handle Save Committee Results 
  const handleSaveResults = useCommitteeResultSaver(
    editedVoteFieldsData,
    isColumnInEditMode,
    SetIsColumnInEditMode,
    setVoteFieldEditedData,
    toggleColumnEditMode,
    election,

  );

  // Function to generate result columns
  const generateResultColumns = useCallback((isDetailedResults) => {
    const totalVoteHeader = electionMethod !== "partyOnly" ? 'مفرق' : 'المجموع';
    const isPartyOriented = electionMethod === "partyOnly";
    const isCandidateOriented = electionMethod === "candidateOnly";
    const isPartyCandidateOriented = electionMethod === "partyCandidateCombined";
    const isTotalViewCandidateOnly = !isDetailedResults && electionMethod === "candidateOnly";
    const isDetailedView = isDetailedResults;

    // Base columns that are always present
    const baseColumns = [
      { Header: 'المركز', accessor: 'position' },
      { Header: 'المرشح', accessor: 'name' },
    ];

    const totalVote = [{ Header: totalVoteHeader, accessor: 'sumVote' }];
    const aggregatedCandidateVotes = [{ Header: 'المجموع', accessor: 'sumPartyCandidateVote' }]
    const sumPartysingleCommitteeColumn = [{ Header: 'الالتزام', accessor: 'sumPartyVote' }];

    // Generating Committee Column Table Header
    const committeeColumHeader = (committee = { id: '0', committee: 0 }) => {
      return (
        <HeaderVoteButton
          committee={committee}
          isColumnInEditMode={isColumnInEditMode}
          isEditField={isEditField}
          handleSaveResults={handleSaveResults}
          toggleColumnEditMode={toggleColumnEditMode}
        />
      );
    };

    // Generating Column for single Committee
    const singleCommitteeColumn = [
      {
        Header: () => committeeColumHeader(),
        accessor: 'votes',
      },
    ];

    // Generating Column for multiple Committee
    const multiCommitteeColumns = electionCommitteeSites.map(committee => ({
      Header: () => committeeColumHeader(committee),
      accessor: `committee_${committee.id}`,
    }));

    // Check for electionResultView and resultsDisplayType to determine columns
    const determineColumns = () => {
      let additionalColumns = [];
      if (electionMethod === "candidateOnly") {
        additionalColumns = isDetailedResults ? [...aggregatedCandidateVotes, ...multiCommitteeColumns] : [...singleCommitteeColumn];
      } else {
        if (isPartyOriented) {
          additionalColumns = [...totalVote, ...multiCommitteeColumns];
        } else if (isPartyCandidateOriented) {
          if (electionMethod === "partyOnly") {
            additionalColumns = [];
          } else if (electionMethod === "partyCandidateOnly") {
            additionalColumns = [...totalVote];
          } else if (electionMethod === "partyCandidateCombined") {
            additionalColumns = [...totalVote, ...aggregatedCandidateVotes];
          }
        } else if (isCandidateOriented) {
          if (electionMethod === "partyCandidateOnly") {
            additionalColumns = [...totalVote, ...multiCommitteeColumns];
          } else if (electionMethod === "partyCandidateCombined") {
            additionalColumns = [...totalVote, ...aggregatedCandidateVotes, ...multiCommitteeColumns];
          }
        }
      }
      return [...baseColumns, ...additionalColumns];
    };

    return determineColumns();
  }, [
    electionMethod,
    electionCommitteeSites,
    isColumnInEditMode,
    isEditField,
    handleSaveResults,
    toggleColumnEditMode
  ]);

  const columns = useMemo(() => {
    return generateResultColumns(isDetailedResults);
  }, [
    isDetailedResults,
    generateResultColumns,
  ]);


  const displayElectionResults = () => {
    if (electionMethod !== "candidateOnly") {
      return (
        < Parties
          columns={columns}
          transformedCandidateData={transformedCandidateData}
          transforedPartyData={transforedPartyData}
          HeaderVoteButton={HeaderVoteButton}
          resultsDisplayType={resultsDisplayType}
          setResultsDisplayType={setResultsDisplayType}
        />
      );
    }
    return (
      <Candidates
        columns={columns}
        transformedCandidateData={transformedCandidateData}
      />
    );
  };

  return (
    <React.Fragment>
      <Row>
        <Col lg={12}>
          <Card id="electionCommitteeList">
            <CardBody>
              <TableContainerHeader ContainerHeaderTitle="تعديل نتائج الإنتخابات" />
              {displayElectionResults()}
              <ToastContainer closeButton={false} limit={1} />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default ResultsTab;