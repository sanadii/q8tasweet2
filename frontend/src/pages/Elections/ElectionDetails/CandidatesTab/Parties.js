// React imports
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

// Store & Selectors
import { electionSelector } from 'Selectors';

// UI & Utilities
import { Col, Row, Card, CardHeader } from "reactstrap";
import { Loader, TableContainer, TableContainerHeader } from "components";

const CandidatesTab = ({ columns }) => {

  const { electionParties, electionPartyCandidates, error } = useSelector(electionSelector);

  const getCandidatesForParty = (partyId) => {
    if (!electionPartyCandidates) return [];
    return electionPartyCandidates.filter(electionPartyCandidate => electionPartyCandidate.electionParty === partyId);
  };

  return (
    <React.Fragment>
      <div>
        <Row>
          {electionParties.map((party, index) => {
            const partyCandidates = getCandidatesForParty(party.id);
            return (
              <Col lg={4} key={index}>
                <Card className="border card-border-secondary">
                  <CardHeader>
                    <h4><strong>{party.name}</strong></h4>
                  </CardHeader>
                  
                  {partyCandidates && partyCandidates.length ? (
                    <TableContainer
                      columns={columns}
                      data={partyCandidates}
                      customPageSize={50}
                      divClass="table-responsive table-card mb-3"
                      tableClass="align-middle table-nowrap mb-0"
                      theadClass="table-light table-nowrap"
                      thClass="table-light text-muted"
                    />
                  ) : (
                    <Loader error={error} />
                  )}
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>
    </React.Fragment >
  );
};

export default CandidatesTab;
