import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { electionSelector } from 'Selectors';
import { Button, Col, Row, Card, CardHeader, Input } from "reactstrap";
import { Loader, TableContainer } from "components";

const Parties = ({
    columns,
    transformedCandidateData,
    transforedPartyData,
    resultsDisplayType,
    setResultsDisplayType,
    HeaderVoteButton
}) => {
    const { electionParties, electionCommittees, electionPartyCandidates, error } = useSelector(electionSelector);

    const [selectedCommittee, setSelectedCommittee] = useState(0);

    let displayData;
    if (resultsDisplayType === "partyOriented") {
        displayData = transforedPartyData;
    } else {
        displayData = transformedCandidateData;
    }



    const getCandidatesForParty = useMemo(() => {
        return partyId => {
            if (!transformedCandidateData) return [];
            return transformedCandidateData.filter(candidate => candidate.electionParty === partyId);
        };
    }, [transformedCandidateData]);

    const handleSelectChange = (e) => {
        const selectedCommitteeId = e.target.value;
        // Handle the selected committee ID here
    };

    const renderPartyCandidateOriented = () => (
        <Row>
            {/* <button>تعديل أصوات المرشحين</button> */}
            {electionParties.map((party, index) => {
                const partyCandidates = getCandidatesForParty(party.id);
                return (
                    <Col lg={4} key={party.id}>
                        <Card className="border card-border-secondary">
                            <CardHeader className="d-flex justify-content-between align-items-center">
                                <h4><strong>{party.name}</strong></h4>
                                <div className="list-inline hstack gap-2 mb-0"><strong>{party.votes}</strong></div>
                            </CardHeader>
                            {partyCandidates.length ? (
                                <TableContainer
                                    columns={columns}
                                    data={partyCandidates}
                                    customPageSize={50}
                                    divClass="table-responsive table-card mb-3"
                                    tableClass="align-middle table-nowrap mb-0"
                                    theadClass="table-light table-nowrap"
                                    thClass="table-light text-muted"
                                    isTableContainerFooter={false}
                                />
                            ) : <Loader error={error} />}
                        </Card>
                    </Col>
                );
            })}
        </Row>
    );


    const renderCandidateOrPartyOriented = () => (
        <Row>
            {displayData && displayData.length ? (
                <TableContainer
                    columns={columns}
                    data={displayData}
                    customPageSize={50}
                    divClass="table-responsive table-card mb-3"
                    tableClass="align-middle table-nowrap mb-0"
                    theadClass="table-light table-nowrap"
                    thClass="table-light text-muted"
                    isTableContainerFooter={false}
                />
            ) : <Loader error={error} />}
        </Row>
    );

    return (
        <>
            <Row className="g-4 mb-4">
                <div className="d-flex align-items-center ">
                    <div className="col d-flex row">
                        <div className="d-flex">
                            <p>طريقة العرض</p>
                            <Input
                                type="select"
                                className="form-control mb-2"
                                name="resultDisplayType"
                                id="resultDisplayType"
                                onChange={(e) => setResultsDisplayType(e.target.value)}
                            >
                                <option value="partyCandidateOriented">القوائم والمرشحين</option>
                                <option value="partyOriented">القوائم فقط</option>
                                <option value="candidateOriented">المرشحين فقط</option>
                            </Input>
                        </div>
                    </div>
                    <div className="col d-flex g-2 row">
                        {electionCommittees.length < 1 &&
                            <div className="d-flex">
                                <p>اختر اللجنة</p>
                                <Input
                                    type="select"
                                    className="form-control mb-2"
                                    name="committee"
                                    id="committee"
                                    onChange={handleSelectChange}
                                >
                                    <option value="">-- جميع اللجان --</option>
                                    {electionCommittees.map((committee) => (
                                        <option key={committee.id} value={committee.id}>
                                            {committee.name}
                                        </option>
                                    ))}
                                </Input>
                            </div>
                        }
                    </div>
                </div>
            </Row>

            {resultsDisplayType === "partyCandidateOriented" ?
                renderPartyCandidateOriented() : renderCandidateOrPartyOriented()}
        </>
    );

};

export default Parties;

