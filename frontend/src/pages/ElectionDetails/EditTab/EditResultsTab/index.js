// React Core and Hooks
import React, { useState, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { electionSelector } from 'selectors';
import { TableContainerHeader } from "shared/components";
import { HeaderVoteButton, usePartyCommitteeVotes, useCommitteeResultSaver } from './ResultHelper';
import { transformResultData } from "./transformResultData"
import { Button, Col, Row, Card, CardBody } from "reactstrap";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Parties from "./Parties";
import Candidates from "./Candidates";
import TheTable from "./TheTable"

const ResultsTab = () => {
  const { election, electionCandidates, electionParties, electionPartyCandidates, electionCommitteeSites } = useSelector(electionSelector);
  const { electionMethod, isDetailedResults, isSortingResults } = election

  // Based on electionMethod we will decide candidates vs parties
  const candidates = electionMethod === "candidateOnly" ? electionCandidates : electionCandidates;
  console.log("electionCommitteeSiteselectionCommitteeSites: ", electionCommitteeSites)
  const parties = electionMethod !== "candidateOnly" ? electionParties : electionParties;
  const partyCommitteeVoteList = usePartyCommitteeVotes(electionParties);

  // For the use of Party Only
  // Showing Candaites/Party results in different views
  const [resultsDisplayType, setResultsDisplayType] = useState("partyCandidateOriented");
  const [isColumnInEditMode, SetIsColumnInEditMode] = useState({});
  const [isEditField, setIsEditField] = useState(false);
  const [editedVoteFieldsData, setVoteFieldEditedData] = useState({});
  // const [committeeSiteDisplay, setCommitteeSiteDisplay] = useState(electionCommitteeSites[0])

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


  // Function to determine the background color based on gender
  const getBackgroundColor = (gender) => {
    return gender === 1 ? 'info' : 'pink';
  };

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
    const isPartyCandidateOriented = electionMethod === "partyCandidateOriented";
    const isTotalViewCandidateOnly = !isDetailedResults && electionMethod === "candidateOnly";
    const isDetailedView = isDetailedResults;


    // Base column header
    const baseColumnHeader = () => (
      <div className="d-flex justify-content-between align-items-center">
        {/* <Button color="danger" className="btn-icon btn-sm material-shadow-none"> <i className="ri-arrow-right-s-line" /> </Button> */}
        اللجان
        {/* <Button color="danger" className="btn-icon btn-sm material-shadow-none"> <i className="ri-arrow-left-s-line" /> </Button> */}
      </div>
    );

    // Base columns that are always present
    const baseColumns = [
      {
        Header: () => baseColumnHeader(),
        accessor: 'base', // Add a unique accessor
        columns: [
          { Header: 'المركز', accessor: 'position' },
          { Header: 'المرشح', accessor: 'name' },
        ]
      }
    ];

    const totalVote = [{ Header: totalVoteHeader, accessor: 'sumVote' }];
    const aggregatedCandidateVotes = [{ Header: 'المجموع', accessor: 'sumPartyCandidateVote' }]
    const sumPartysingleCommitteeColumn = [{ Header: 'الالتزام', accessor: 'sumPartyVote' }];

    // Generating Committee Column Table Header
    const committeeHeaderVoteButton = (committee = { id: '0', committee: 0 }, committeeSiteGender) => {
      const textColorByGender = getBackgroundColor(committeeSiteGender);


      return (
        <HeaderVoteButton
          committee={committee}
          textColorByGender={textColorByGender}
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
        Header: () => committeeHeaderVoteButton(),
        accessor: 'votes',
      },
    ];




    // Generating Columns for multiple Committees
    const committeeColumnHeader = (committeeSite, index) => {
      const textColorByGender = getBackgroundColor(committeeSite?.gender);

      return (
        <div
          key={`header-${index}`}
          className={`d-flex justify-content-center align-items-center text-${textColorByGender} text-center`}
        >
          {committeeSite.name}
        </div>
      );
    };


    console.log("electionCommitteeSiteselectionCommitteeSites: ", electionCommitteeSites)
    // Generating Rows for multiple Committees
    const multiCommitteeColumns = electionCommitteeSites.map((committeeSite, index) => ({
      Header: () => committeeColumnHeader(committeeSite, index),
      accessor: `committeeSite_${committeeSite.id}`,

      columns: committeeSite.committees.map((committee, subIndex) => ({
        Header: (
          <div key={`subheader-${subIndex}`}>
            {committeeHeaderVoteButton(committee, committeeSite.gender)}
          </div>
        ),
        accessor: `committee_${committee.id}`, // Ensure unique accessor for each committee
        id: `committee_${committee.id}`, // Add unique id
      }))
    }));


    //  console.log("123 transformedCandidateData: ", transformedCandidateData)
    //  console.log("multiCommitteeColumns: ", multiCommitteeColumns)
    // 
    // Check for electionResultView and resultsDisplayType to determine columns
    // 
    const determineColumnsBasedOnElectionMethod = () => {
      let additionalColumns = [];
      if (electionMethod === "partyCandidateOriented") {
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

    return determineColumnsBasedOnElectionMethod();
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

  console.log("transformedCandidateData: ", transformedCandidateData)

  const displayElectionResults = () => {
    if (electionMethod === "candidateOnly" || electionMethod === "partyCandidateOriented") {
      return (
        <Candidates
          columns={columns}
          transformedCandidateData={transformedCandidateData}
        />
      );

    }
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
  };

  return (
    <React.Fragment>
      <Row>
        <Col lg={12}>
          <Card id="committeeSiteList">
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