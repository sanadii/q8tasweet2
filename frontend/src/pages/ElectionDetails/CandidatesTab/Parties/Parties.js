// React imports
import React from "react";
import { useSelector } from "react-redux";
import { electionSelector } from 'selectors';
import { Col, Row, Card, CardHeader } from "reactstrap";
import { Loader, TableContainer } from "shared/components";

const Parties = ({ columns, electionPartyButtons }) => {
  // State Management
  const { electionParties, electionCandidates, error } = useSelector(electionSelector);

  // Get candidates for a specific party
  const getCandidatesForParty = (partyId) => {
    if (!electionCandidates) return [];
    return electionCandidates.filter(candidate => candidate.party === partyId);
  };

  // Get candidates without a party
  const independentCandidates = electionCandidates ? electionCandidates.filter(candidate => !candidate.party) : [];

  // Create electionPartyList
  const electionPartyList = [
    ...electionParties.map(party => ({
      id: party.id,
      name: party.name,
      candidates: getCandidatesForParty(party.id),
      isIndependent: false
    })),
    {
      id: 'independent',
      name: 'مرشحين مستقلين',
      candidates: independentCandidates,
      isIndependent: true
    }
  ];

  return (
    <React.Fragment>
      <div>
        <Row>
          {electionPartyList.map((party, index) => (
            <Col lg={6} key={index}>
              <Card className="border card-border-secondary">
                <CardHeader className="d-flex justify-content-between align-items-center">
                  <h4>
                    <strong>{party.name}</strong>
                  </h4>
                  {!party.isIndependent && (
                    <div className="list-inline hstack gap-2 mb-0">
                      {electionPartyButtons.map((button, btnIndex) => (
                        <React.Fragment key={btnIndex}>
                          {button.action(party)}
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                </CardHeader>
                {party.candidates.length ? (
                  <TableContainer
                    columns={columns}
                    data={party.candidates}
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
          ))}
        </Row>
      </div>
    </React.Fragment>
  );
};

export default Parties;
