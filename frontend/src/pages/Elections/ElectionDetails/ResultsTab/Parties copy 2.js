import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { electionSelector } from 'Selectors';
import { Button, Col, Row, Card, CardHeader, Input } from "reactstrap";
import { Loader, TableContainer } from "components";
import { FormFields } from "components";

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

    let displayData, partyData, candidateData;

    if (resultsDisplayType === "partyOriented") {
        displayData = transforedPartyData;
    } else {
        displayData = transformedCandidateData;
        partyData = transforedPartyData;
        candidateData = transformedCandidateData;
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

    const ResultDisplayOption = [
        { id: 1, name: "القوائم والمرشحين", value: "partyCandidateOriented" },
        { id: 2, name: "القوائم فقط", value: "partyOriented" },
        { id: 3, name: "المرشحين فقط", value: "candidateOriented" },
    ]

    const fields = [
        {
            id: "resultDisplayType-field",
            name: "resultDisplayType",
            label: "طريقة العرض",
            type: "select",
            options: ResultDisplayOption.map(item => ({
                id: item.id,
                label: item.name,
                value: item.value
            })),
            onChange: (e) => setResultsDisplayType(e.target.value),
            colSize: 6,
        },
        {
            id: "committee-field",
            name: "committee",
            label: "اختر اللجنة",
            type: "select",
            options: electionCommittees.map(item => ({
                id: item.id,
                label: item.name,
                value: item.value
            })),
            onChange: handleSelectChange,
            condition: electionCommittees.length > 0,
            colSize: 6,
        },
    ];

    const renderDisplayFilter = () => (
        <Row className="g-4 mb-4">
            {fields.map((field) => (
                (field.condition === undefined || field.condition) && (
                    <div className="col d-flex g-2 row" key={field.id}>
                        <div className="d-flex">
                            <p>{field.label}</p>
                            <select
                                className="form-control mb-2"
                                name={field.name}
                                id={field.id}
                                onChange={field.onChange}
                                value={resultsDisplayType}
                            >
                                {field.options.map((option) => (
                                    <option key={option.id} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                )
            ))}
        </Row>
    );

    const renderPartyCandidateOriented = () => (
        <Row>
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
                                    isTableFooter={false}
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
                    isTableFooter={false}
                />
            ) : <Loader error={error} />}
        </Row>
    );


    return (
        <React.Fragment>
            {renderDisplayFilter()}

            {resultsDisplayType === "partyCandidateOriented" ?
                renderPartyCandidateOriented() : renderCandidateOrPartyOriented()}
        </React.Fragment>
    );

};

export default Parties;
