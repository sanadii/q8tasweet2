import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Badge, Col, Nav, NavItem, NavLink, Row, TabContent, TabPane, Card, CardBody, } from "reactstrap";
import { electionSelector } from 'Selectors';

// Component, Constants, Hooks Imports
import { ImageGenderCircle, AvatarList, SectionBackagroundImage, TableContainer, TableContainerHeader } from "../../components";

import { Container } from "reactstrap";
import { useParams } from "react-router-dom";
import { getElectionDetails } from "../../store/actions";
import { isEmpty } from "lodash";

const ElectionDetails = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    document.title =
      "Election Details | Q8Tasweet Election App";
  }, []);

  const [election, setElection] = useState({
    id: useParams().id,
  });

  const { electionDetails, electionCandidates, electionCommittees, electionCommitteeResults, error } = useSelector(electionSelector);

  useEffect(() => {
    if (election.id && !isEmpty(election)) {
      dispatch(getElectionDetails(election));
    }
  }, [dispatch, election, election.id]);

  const [electionCommitteeResult, setElectionCommitteeResults] = useState(null);
  const [modifiedData, setModifiedData] = useState({});

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

    // Sort candidates by total votes (descending order)
    const sortedCandidates = [...allCandidates].sort((candidateId1, candidateId2) => {
      const totalVotes1 = Object.values(data).reduce((sum, committeeVotes) => sum + (committeeVotes[candidateId1] || 0), 0);
      const totalVotes2 = Object.values(data).reduce((sum, committeeVotes) => sum + (committeeVotes[candidateId2] || 0), 0);

      return totalVotes2 - totalVotes1;
    });

    // Organize the data for each candidate
    sortedCandidates.forEach(candidateId => {
      const row = { "candidate.id": candidateId };
      let totalVotesForCandidate = 0; // Initialize the total vote counter for each candidate

      for (const committeeId in data) {
        totalVotesForCandidate += data[committeeId][candidateId] || 0;
        row[`committee_${committeeId}`] = data[committeeId][candidateId] || 0;
      }

      row['total'] = <strong>{totalVotesForCandidate}</strong>;

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
        accessor: 'candidate.id',
        Cell: (cellProps) => {
          const candidateId = cellProps.row.original['candidate.id'];
          const candidate = electionCandidates.find((candidate) => candidate.id === candidateId);

          if (!candidate) {
            return <p className="text-danger"><strong>Not Found (ID: {candidateId})</strong></p>;
          }

          return (
            <>
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0">
                  {candidate.image ? (
                    // Use the ImageGenderCircle component here
                    <ImageGenderCircle
                      genderValue={candidate.gender}
                      imagePath={candidate.image}
                    />
                  ) : (
                    <div className="flex-shrink-0 avatar-xs me-2">
                      <div className="avatar-title bg-soft-success text-success rounded-circle fs-13">
                        {candidate.name.charAt(0)}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex-grow-1 ms-2 name">
                  {candidate.name}{" "}
                  {candidate.isWinner ? (
                    <Badge color="success" className="badge-label">
                      <i className="mdi mdi-circle-medium"></i> Winner
                    </Badge>
                  ) : null}
                </div>
              </div>
            </>
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
      });
    });
    return columns;
  }

  // Inside your component
  const transformedData = transformData(electionCommitteeResults);
  const columns = createColumns(electionCommitteeResults);

  // Export Modal
  const [isExportCSV, setIsExportCSV] = useState(false);
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <SectionBackagroundImage imagePath={electionDetails.image} />
          <div className="pt-4 mb-4 mb-lg-3 pb-lg-4 profile-wrapper">
            <Row className="g-4">
              <div className="col-auto">
                <AvatarList imagePath={electionDetails.image} />
              </div>

              <Col>
                <div className="p-2">
                  <h3 className="text-white mb-1">{electionDetails.name}</h3>
                  <p className="text-white-75">{electionDetails.name}</p>
                  <div className="hstack text-white-50 gap-1">
                    <div className="me-2">
                      <i className="ri-map-pin-user-line me-1 text-white-75 fs-16 align-middle"></i>
                      Date: {electionDetails.dueDate}
                    </div>
                  </div>
                </div>
              </Col>
              <Col xs={12} className="col-lg-auto order-last order-lg-0">
                <Row className="text text-white-50 text-center">
                  <Col lg={6} xs={4}>
                    <div className="p-2">
                      <h4 className="text-white mb-1">{electionCandidates.length}</h4>
                      <p className="fs-14 mb-0">المرشحون</p>
                    </div>
                  </Col>
                  {/* <Col lg={6} xs={4}>
                    <div className="p-2">
                      <h4 className="text-white mb-1">
                    
                      </h4>
                      <p className="fs-14 mb-0">الحضور</p>
                    </div>
                  </Col> */}
                </Row>
              </Col>
            </Row>
          </div>
          <Row>
            <Col lg={12}>
              <div>
                <div className="d-flex profile-wrapper">
                </div >
                <Row>
                  <Col lg={12}>
                    <Card id="electionCommitteeList">
                      <CardBody>
                        <div>
                          <TableContainerHeader
                            // Title
                            ContainerHeaderTitle="النتائج النهائية"
                          />

                          <TableContainer
                            // Data
                            columns={columns}
                            data={transformedData}
                            customPageSize={50}

                            // Header
                            isTableContainerHeader={true}
                            // Filters
                            isGlobalFilter={true}
                            isCommitteeGenderFilter={true}
                            SearchPlaceholder="Search for Election Committees..."
                            setElectionCommitteeResults={setElectionCommitteeResults}

                            // Styling
                            divClass="table-responsive table-card mb-3"
                            tableClass="align-middle table-nowrap mb-0"
                            theadClass="table-light table-nowrap"
                            thClass="table-light text-muted"
                          />
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </div >
            </Col >
          </Row >
        </Container>
      </div>
    </React.Fragment >
  );
};

export default ElectionDetails;
