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

const ResultsTab = () => {
  const { election, electionType, electionCandidates, electionPartyCandidates, electionCommittees } = useSelector(electionSelector);
  const electionResult = election.electResult;

  // candidates based on election Type
  const candidates = election.electType !== 1 ? electionPartyCandidates : electionCandidates;

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
  const transformedResultData = useMemo(
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
    electionType,
  );



  // Creating the columns for both Final and Detailed Results
  const createColumns = (result) => {
    // Base columns that are always present
    const baseColumns = [
      {
        Header: 'المركز',
        accessor: 'position',
      },
      {
        Header: 'المرشح',
        accessor: 'name',
        Cell: ({ row }) => (
          <ImageCandidateWinnerCircle
            gender={row.original.gender}
            name={row.original.name}
            imagePath={row.original.image}
            isWinner={row.original.isWinner}
          />
        ),
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

    // Columns for when electionResult is 1
    if (result === 1) {
      return [
        ...baseColumns,
        ...voteColumn,
      ];
    }

    // Columns for when electionResult is 2
    if (result === 2 && candidates) {
      return [
        ...baseColumns,
        { Header: 'المجموع', accessor: 'total' },
        ...committeeColumns,
      ];
    }
    return [];
  };


  const columns = useMemo(() => {
    return createColumns(electionResult);
  }, [
    electionResult,
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
                    electionType !== 1 ?
                      <Parties
                        columns={columns}
                        data={transformedResultData}

                      />
                      :
                      <Candidates
                        columns={columns}
                        data={transformedResultData}

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


const Candidates = ({ columns, data }) => {
  return (

    <>
      <p>هذه الجدول يحتوي على المرشحين فقط</p>
      <TableContainer

        // Data
        columns={columns}
        data={data}
        customPageSize={50}
        isTableContainerFooter={true}
        sortBy="name"
        sortAsc={true}

        // Styling
        divClass="table-responsive table-card mb-3"
        tableClass="align-middle table-nowrap mb-0"
        theadClass="table-light table-nowrap"
        thClass="table-light text-muted"
      />
    </>
  )
};

const Parties = ({ columns, data }) => {
  const { electionParties, electionPartyCandidates, electionCommittees, error } = useSelector(electionSelector);

  console.log("Data: ", data)
  // Handle change in the select field
  const handleSelectChange = (e) => {
    const selectedCommitteeId = e.target.value;
    // Handle the selected committee ID here
  };


  const getCandidatesForParty = (partyId) => {
    if (!data) return [];
    return data.filter(electionPartyCandidate => electionPartyCandidate.electionParty === partyId);
  };

  return (
    <>
      <p>هذه الجدول يحتوي على القوائم والمرشحين</p>
      <div className="d-flex">
        <p>طريقة العرض</p>
        <Input
          type="select"
          className="form-control mb-2"
          name="committee"
          id="committee"
          onChange={handleSelectChange}
        >
          <option key="1" value="partiesOnly">
            القوائم والمرشحين
          </option>

          <option key="1" value="partiesOnly">
            المرشحين فقط
          </option>
        </Input>
      </div>

      {electionCommittees.length > 1 &&
        <>
          <p>اختر اللجنة</p>
          <Input
            type="select"
            className="form-control mb-2"
            name="committee"
            id="committee"
            onChange={handleSelectChange}
          >
            <option value="">-- اختر اللجنة --</option>
            {electionCommittees &&
              electionCommittees.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.name}
                </option>
              ))}
          </Input>
        </>
      }
      <Row>
        {electionParties.map((party, index) => {
          const partyCandidates = getCandidatesForParty(party.id);
          return (
            <Col lg={4} key={index}>
              <Card className="border card-border-secondary">
                <CardHeader className="d-flex justify-content-between align-items-center">
                  <h4>
                    <strong>{party.name}</strong>
                  </h4>
                  <div className="list-inline hstack gap-2 mb-0">
                    -
                  </div>
                </CardHeader>


                {partyCandidates && partyCandidates.length ? (
                  <TableContainer
                    columns={columns}
                    data={partyCandidates}
                    customPageSize={50}

                    // Styling
                    divClass="table-responsive table-card mb-3"
                    tableClass="align-middle table-nowrap mb-0"
                    theadClass="table-light table-nowrap"
                    thClass="table-light text-muted"
                    isTableContainerFooter={false}

                  />
                ) : (
                  <Loader error={error} />
                )}
              </Card>
            </Col>
          );
        })}
      </Row>
    </>
  )
};