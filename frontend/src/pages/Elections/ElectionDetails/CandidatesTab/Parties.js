// React imports
import React from "react";
import { useSelector } from "react-redux";
import { electionSelector } from 'Selectors';
import { Col, Row, Card, CardHeader } from "reactstrap";
import { Loader, TableContainer } from "shared/components";

const Parties = ({ columns, electionPartyButtons }) => {

  // State Management
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
                  <CardHeader className="d-flex justify-content-between align-items-center">
                    <h4>
                      <strong>{party.name}</strong>
                    </h4>
                    <div className="list-inline hstack gap-2 mb-0">
                      {electionPartyButtons.map((button, btnIndex) => (
                        <React.Fragment key={btnIndex}>
                          {button.action(party)}
                        </React.Fragment>
                      ))}
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

export default Parties;
