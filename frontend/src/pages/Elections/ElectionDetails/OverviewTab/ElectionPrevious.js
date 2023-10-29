import React from "react";
import { useSelector } from "react-redux";
import { Col, Card, CardBody, CardHeader, Table } from "reactstrap";
import { electionSelector } from 'Selectors';

const ElectionPrevious = () => {

    const { previousElection } = useSelector(electionSelector);

    return (
        <React.Fragment>
            {previousElection &&
                <Card>
                    <CardHeader>
                        <h5 className="card-title">
                            {/* <strong className="float-end text-success">{results.totalGuarantees}</strong> */}
                            <strong>الإنتخابات السابقة</strong>
                        </h5>
                    </CardHeader>
                    <CardBody>
                        <Col lg={6}>
                            <p><strong>مراكز النجاح في الانتخابات السابقة </strong></p>
                            <div className="pb-3">
                                <Table>
                                    <tr>
                                        <td className="d-flex align-items-center">
                                            <i className="mdi mdi-circle align-middle me-2 text-success"></i>
                                            {previousElection.firstWinner.name}</td>
                                        <td>{previousElection.firstWinner.votes}</td>
                                    </tr>
                                    <tr>
                                        <td className="d-flex align-items-center">
                                            <i className="mdi mdi-circle align-middle me-2 text-info"></i>
                                            المتوسط</td>
                                        <td>{previousElection.medianWinner}</td>
                                    </tr>
                                    <tr>
                                        <td className="d-flex align-items-center">
                                            <i className="mdi mdi-circle align-middle me-2 text-danger"></i>
                                            {previousElection.lastWinner.name}</td>
                                        <td>{previousElection.lastWinner.votes}</td>
                                    </tr>
                                </Table>
                            </div>
                        </Col>
                    </CardBody>
                </Card>}
        </React.Fragment>
    );
};

export default ElectionPrevious;
