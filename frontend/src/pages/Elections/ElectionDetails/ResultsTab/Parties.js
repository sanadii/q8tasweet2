import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { electionSelector } from 'Selectors';
import { Button, Col, Row, Card, CardHeader, Input } from "reactstrap";
import { Loader, TableContainer } from "shared/components";
import { FormFields } from "shared/components";

const Parties = ({
    columns,
    transformedCandidateData,
    transforedPartyData,
    resultsDisplayType,
    setResultsDisplayType,
    HeaderVoteButton
}) => {
    const { electionParties, electionCommittees, electionPartyCandidates, electionMethod, error } = useSelector(electionSelector);
    const [selectedCommittee, setSelectedCommittee] = useState(null);

    console.log("selectedCommittee: ", selectedCommittee)
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

    const ResultDisplayOption = [
        { id: 1, name: "القوائم والمرشحين", value: "partyCandidateOriented" },
        ...(electionMethod !== "partyCandidateOnly" ? [{ id: 2, name: "القوائم فقط", value: "partyOriented" }] : []),
        ...(electionMethod !== "partyOnly" ? [{ id: 3, name: "المرشحين فقط", value: "candidateOriented" }] : []),
    ];


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
        // {
        //     id: "committee-field",
        //     name: "committee",
        //     label: "اختر اللجنة",
        //     type: "select",
        //     options: [
        //         // Add the "Select Committee" option with a null value
        //         { id: null, label: "اختر اللجنة", value: null },
        //         ...electionCommittees.map(item => ({
        //             id: item.id,
        //             label: item.name,
        //             value: item.id
        //         }))
        //     ],
        //     onChange: (e) => setSelectedCommittee(e.target.value),
        //     condition: electionCommittees.length > 0,
        //     colSize: 6,
        // },
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
                                value={field.value}
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
            {transforedPartyData.map((party, index) => {
                const partyCandidates = getCandidatesForParty(party.id);
                return (
                    <Col lg={4} key={party.id}>
                        <Card className="border card-border-secondary">
                            <CardHeader className="d-flex justify-content-between align-items-center">
                                <h4><strong>{party.name}</strong></h4>
                                {(electionMethod !== "partyCandidateOnly") &&
                                    <div className="list-inline hstack gap-2 mb-0"><strong>التزام: {party.total}</strong></div>
                                }
                            </CardHeader>
                            {partyCandidates.length ? (
                                <TableContainer
                                    columns={columns}
                                    data={partyCandidates}
                                    sortBy="name"
                                    customPageSize={50}
                                    divClass="table-responsive table-card mb-3"
                                    tableClass="align-middle table-nowrap mb-0"
                                    theadClass="table-light table-nowrap"
                                    thClass="table-light text-muted"
                                    isTableFooter={false}
                                    isSorting={false}
                                    isTablePagination={false}
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
