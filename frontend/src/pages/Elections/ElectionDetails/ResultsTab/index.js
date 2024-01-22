// React Core and Hooks
import React, { useState, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { electionSelector } from 'Selectors';
import { TableContainerHeader } from "components";
import { HeaderVoteButton, transformResultData, usePartyCommitteeVotes, useCommitteeResultSaver } from './ResultHelper';
import { Col, Row, Card, CardBody } from "reactstrap";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Parties from "./Parties";
import Candidates from "./Candidates";

const ResultsTab = () => {
  const { election, electionMethod, electionResultView, electionCandidates, electionParties, electionPartyCandidates, electionCommittees } = useSelector(electionSelector);

  // candidates based on election Type
  const candidates = electionMethod !== "candidateOnly" ? electionPartyCandidates : electionCandidates;
  const parties = electionMethod !== "candidateOnly" ? electionParties : electionParties;
  const partyCommitteeVoteList = usePartyCommitteeVotes(electionParties);

  // Parties
  const [resultsDisplayType, setResultsDisplayType] = useState("partyCandidateOriented");
  const [isColumnInEditMode, SetIsColumnInEditMode] = useState({});
  const [isEditField, setIsEditField] = useState(false);
  const [editedVoteFieldsData, setVoteFieldEditedData] = useState({});


  // Toggle Vote Column To Edit / Save / Close Mode
  const toggleColumnEditMode = (committeeId) => {
    SetIsColumnInEditMode(prev => ({
      ...prev,
      [committeeId]: !prev[committeeId],
    }));

    setIsEditField(prev => ({
      ...prev,
      [committeeId]: false,
    }));

  };

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
      electionCommittees,
      isColumnInEditMode,
      onVoteFieldChange,
      election
    ), [parties, electionCommittees, isColumnInEditMode, onVoteFieldChange, election]
  );

  // Transformed Data [candidates]
  const transformedCandidateData = useMemo(
    () => transformResultData(
      candidates,
      electionCommittees,
      isColumnInEditMode,
      onVoteFieldChange,
      election,
      partyCommitteeVoteList,
      resultsDisplayType,
    ), [candidates, electionCommittees, isColumnInEditMode, onVoteFieldChange, election, resultsDisplayType]
  );


  // Handle Save Committee Results 
  const handleSaveResults = useCommitteeResultSaver(
    editedVoteFieldsData,
    isColumnInEditMode,
    SetIsColumnInEditMode,
    setVoteFieldEditedData,
    toggleColumnEditMode,
    electionMethod,
    resultsDisplayType,
  );

  // Creating the columns for both Final and Detailed Results
  const generateResultColumns = (electionResultView) => {
    const totalVoteHeader = resultsDisplayType !== "partyOriented" ? 'مفرق' : 'المجموع';
    const isPartyOriented = resultsDisplayType === "partyOriented";
    const isCandidateOriented = resultsDisplayType === "candidateOriented";
    const isPartyCandidateOriented = resultsDisplayType === "partyCandidateOriented";
    const isTotalViewCandidateOnly = electionResultView === "total" && electionMethod === "candidateOnly";
    const isDetailedView = electionResultView === "detailed";

    // Base columns that are always present
    const baseColumns = [
      { Header: 'المركز', accessor: 'position', },
      { Header: 'المرشح', accessor: 'name', },
    ];

    const totalVote = [{ Header: totalVoteHeader, accessor: 'sumVote', },];
    const partyCandidateTotalColumn = [{ Header: 'المجموع', accessor: 'sumPartyCandidateVote' }]
    const sumPartysingleCommitteeColumn = [{ Header: 'الالتزام', accessor: 'sumPartyVote', }];


    const singleCommitteeColumn = [
      {
        Header: () => (
          <HeaderVoteButton
            committeeId={"0"}
            committee={0}
            isColumnInEditMode={isColumnInEditMode}  // Need some work
            isEditField={isEditField}
            handleSaveResults={handleSaveResults}
            toggleColumnEditMode={toggleColumnEditMode}
          />
        ),
        accessor: 'votes',
      },
    ];

    const multiCommitteeColumns = electionCommittees.map(committee => ({
      Header: () => (
        <HeaderVoteButton
          committeeId={committee.id}
          committee={committee}
          isColumnInEditMode={isColumnInEditMode}
          isEditField={isEditField}
          handleSaveResults={handleSaveResults}
          toggleColumnEditMode={toggleColumnEditMode}
        />
      ),
      accessor: `committee_${committee.id}`,
    }));


    // Check for electionResultView and resultsDisplayType to determine columns
    const determineColumns = () => {

      let additionalColumns = [];

      if (electionMethod === "candidateOnly") {
        if (isTotalViewCandidateOnly) {
          additionalColumns = [...totalVote, ...singleCommitteeColumn];
        } else if (isDetailedView) {
          additionalColumns = [...multiCommitteeColumns, ...sumPartysingleCommitteeColumn];
        }
      } else {
        if (isPartyOriented) {
          additionalColumns = [...totalVote, ...multiCommitteeColumns];

        } else if (isPartyCandidateOriented) {
          if (electionMethod === "partyOnly") {
            additionalColumns = [];
          } else if (electionMethod === "partyCandidateOnly") {
            additionalColumns = [...totalVote];
          } else if (electionMethod === "partyCandidateCombined") {
            additionalColumns = [...totalVote, ...partyCandidateTotalColumn];
          }

        } else if (isCandidateOriented) {
          if (electionMethod === "partyCandidateOnly") {
            additionalColumns = [...totalVote, ...multiCommitteeColumns];
          } else if (electionMethod === "partyCandidateCombined") {
            additionalColumns = [...totalVote, ...partyCandidateTotalColumn, ...multiCommitteeColumns];
          }
        }
      }

      return [...baseColumns, ...additionalColumns];
    };

    return determineColumns();

  };


  const columns = useMemo(() => {
    return generateResultColumns(electionResultView);
  }, [
    resultsDisplayType,
    electionResultView,
    candidates,
    electionCommittees,
    isColumnInEditMode,
    editedVoteFieldsData,
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