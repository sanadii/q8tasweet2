// React imports
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

// Store & Selectors
import { deleteElectionCandidate } from "store/actions";
import { electionSelector } from 'Selectors';


import { Loader, DeleteModal, ExportCSVModal, TableContainer, TableContainerHeader } from "components";
// import { calculateCandidatePosition } from "./CandidateCalculations"
import { usePermission, useDelete } from "hooks";

// UI & Utilities
import { Col, Row, Card, CardBody, Nav, NavItem, NavLink } from "reactstrap";
import { isEmpty } from "lodash";
import { toast, ToastContainer } from "react-toastify";
import classnames from "classnames";

const CandidatesTab = ({ columns }) => {

  const { election, electionCandidates, electionParties, electionPartyCandidates, error } = useSelector(electionSelector);

  // Constants

  const [electionCandidate, setElectionCandidate] = useState([]);
  const [electionCandidateList, setElectionCandidateList] = useState(electionCandidates);

  // const partyCandidates = electionCandidates.filter where electionParty.id (electionParties) in electionPartyCandidates
  const getCandidatesForParty = (partyId) => {
    // Ensure electionPartyCandidates is not undefined
    if (!electionPartyCandidates) return [];
  
    // Filter electionPartyCandidates by partyId and get the candidate IDs
    const candidateIdsForParty = electionPartyCandidates
      .filter(electionPartyCandidate => 
        electionPartyCandidate.election_party && electionPartyCandidate.election_party.id === partyId
      )
      .map(electionPartyCandidate => 
        electionPartyCandidate.candidate && electionPartyCandidate.candidate.id
      )
      .filter(id => id !== undefined); // Ensure we filter out any undefined ids
  
    // Filter electionCandidates by these candidate IDs
    return electionCandidates.filter(ec => candidateIdsForParty.includes(ec.id));
  };
  
  console.log("electionPartyCandidates: ", electionPartyCandidates);
  
  // Sort List by Candidate Position
  useEffect(() => {
    const calculateCandidatePosition = (candidates) => {
      // Sort candidates by votes in desending order
      let sortedCandidates = [...candidates].sort((a, b) => b.votes - a.votes);

      // Assign positions
      for (let i = 0; i < sortedCandidates.length; i++) {
        sortedCandidates[i].position = i + 1;
      }

      // Set isWinner property based on electSeats
      const electSeats = election.electSeats || 0;
      sortedCandidates = sortedCandidates.map(candidate => ({
        ...candidate,
        isWinner: candidate.position <= electSeats
      }));

      // Sort candidates by positions in ascending order (issue in react its always reversing)
      sortedCandidates = sortedCandidates.sort((a, b) => b.position - a.position);
      return sortedCandidates;
    };

    const sortedCandidates = calculateCandidatePosition(electionCandidates);
    setElectionCandidateList(sortedCandidates);

  }, [electionCandidates, election.electSeats]);


  // Models
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  // Toggle for Add / Edit Models
  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setElectionCandidate(null);
    } else {
      setModal(true);
    }
  }, [modal]);


  return (
    <React.Fragment>
      <div>
        <Row>
          {electionParties.map((party, index) => {
            const partyCandidates = getCandidatesForParty(party.id);

            return (
              <Col lg={4} key={index}>
                <TableContainerHeader
                  ContainerHeaderTitle={party.name}
                />

                {partyCandidates && partyCandidates.length ? (
                  <TableContainer
                    columns={columns}
                    data={partyCandidates || []}
                    customPageSize={50}
                    divClass="table-responsive table-card mb-3"
                    tableClass="align-middle table-nowrap mb-0"
                    theadClass="table-light table-nowrap"
                    thClass="table-light text-muted"
                  />
                ) : (
                  <Loader error={error} />
                )}
              </Col>
            );
          })}
        </Row>
      </div>
    </React.Fragment>
  );
};

export default CandidatesTab;
