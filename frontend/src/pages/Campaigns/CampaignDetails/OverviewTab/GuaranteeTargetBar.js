import React from 'react';
import { Card, CardHeader, CardBody, Col, Row, Table, Progress } from "reactstrap";

const Marker = ({ percentage, color, label, total }) => {
    return (
        <div className="marker" style={{ position: 'absolute', right: `${percentage}%`, bottom: 0, width: '2px', height: '40px', backgroundColor: color }}>
            <span className="marker-label" style={{ position: 'absolute', bottom: '100%', right: '-50%', whiteSpace: 'nowrap' }}>
                {label} <br /> ({total})
            </span>
        </div>
    );
};



const GuaranteeTargetBar = ({ campaignDetails, results }) => {
    const { targetVotes, election: { firstWinnerVotes, lastWinnerVotes } } = campaignDetails;
    const medianWinnerVotes = 190; // This should be dynamic if possible
    const endOfBar = firstWinnerVotes + (firstWinnerVotes / 10);


    const totalGuarantees = results.totalGuarantees;
    const totalConfirmedGuarantees = results.totalConfirmedGuarantees;
    const totalConfirmedAttendees = results.totalConfirmedAttendees;

    const reductedConfirmedGuarantees = totalConfirmedGuarantees - totalConfirmedAttendees
    const reductedGuarantees = totalConfirmedGuarantees - totalConfirmedAttendees



    const calculatePercentage = (total) => ((total / endOfBar) * 100).toFixed(2);

    return (
        <React.Fragment>
            <Card>
                <CardHeader>
                    <h5 className="card-title">
                        <strong className="float-end text-success">{targetVotes}</strong>
                        <strong>هدف النجاح</strong>
                    </h5>
                </CardHeader>
                <CardBody className="p-3"> {/* Added p-3 for padding to the CardBody */}
                    <Row className="mb-4 p-3"> {/* Increased margin-bottom to mb-4 */}
                        <div className="d-flex align-items-center py-2 " style={{ height: '140px' }}>
                            <div className="flex-shrink-0 me-3">
                                <div className="avatar-xs">
                                    <div className="avatar-title bg-light rounded-circle text-muted fs-16">
                                        <i className=" ri-bar-chart-fill"></i>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-grow-1 position-relative">
                                <Progress multi>
                                    <Progress bar
                                        value={calculatePercentage(reductedGuarantees)}
                                        color="success" className="animated-progess progress-xs progress-label" />
                                    <Progress bar
                                        value={calculatePercentage(reductedConfirmedGuarantees)}
                                        color="info" className="animated-progess progress-md progress-label" />
                                    <Progress bar
                                        value={calculatePercentage(totalGuarantees)}
                                        color="danger" className="animated-progess progress-xl progress-label" />
                                </Progress>

                                <div className="position-absolute top-0" style={{ width: '100%', height: '100%' }}>
                                    <Marker percentage={calculatePercentage(firstWinnerVotes)} color="green" label="الأول" total={firstWinnerVotes} />
                                    <Marker percentage={calculatePercentage(lastWinnerVotes)} color="red" label="التاسع" total={lastWinnerVotes} />
                                    <Marker percentage={calculatePercentage(medianWinnerVotes)} color="red" label="المتوسط" total={medianWinnerVotes} />
                                    <Marker percentage={calculatePercentage(targetVotes)} color="blue" label="الهدف" total={targetVotes} />
                                </div>
                            </div>
                        </div>
                        <Col lg={6}>
                            <p><strong>مراكز النجاح في الانتخابات الأخيرة: </strong></p>
                            <div className="pb-3">
                                <Table>
                                    <tr>
                                        <td className="d-flex align-items-center">
                                            <i className="mdi mdi-circle align-middle me-2 text-success"></i>
                                            <span>الأول</span>
                                        </td>
                                        <td>{firstWinnerVotes}</td>
                                    </tr>
                                    <tr>
                                        <td className="d-flex align-items-center">
                                            <i className="mdi mdi-circle align-middle me-2 text-info"></i>
                                            <span>متوسط النجاح</span>
                                        </td>
                                        <td>{medianWinnerVotes}</td>
                                    </tr>
                                    <tr>
                                        <td className="d-flex align-items-center">
                                            <i className="mdi mdi-circle align-middle me-2 text-danger"></i>
                                            <span>التاسع</span>
                                        </td>
                                        <td>{lastWinnerVotes}</td>
                                    </tr>
                                </Table>
                            </div>
                        </Col>
                        <Col lg={6}>
                            <p><strong>متابعة المضامين: </strong></p>

                            <Table>
                                <tr>
                                    <td className="d-flex align-items-center">
                                        <i className="mdi mdi-circle align-middle me-2 text-success"></i>
                                        <span>الحضور</span>
                                    </td>
                                    <td>
                                        {results.totalConfirmedAttendees}
                                    </td>
                                </tr>

                                <tr>
                                    <td className="d-flex align-items-center">
                                        <i className="mdi mdi-circle align-middle me-2 text-info"></i>
                                        <span>مؤكد حضوره</span>
                                    </td>
                                    <td>{results.totalConfirmedGuarantees}</td>
                                </tr>

                                <tr>
                                    <td className="d-flex align-items-center">
                                        <i className="mdi mdi-circle align-middle me-2 text-danger"></i>
                                        <span>لم يأكد حضوره</span>
                                    </td>
                                    <td>{results.totalGuarantees}</td>
                                </tr>
                            </Table>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </React.Fragment >
    )
}

export default GuaranteeTargetBar;
