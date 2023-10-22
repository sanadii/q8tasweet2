import React from 'react';
import { Card, CardBody, Col, Row, Progress } from "reactstrap";

const Marker = ({ percentage, color, label, total }) => {
    return (
        <div className="marker" style={{ position: 'absolute', right: `${percentage}%`, bottom: 0, width: '2px', height: '40px', backgroundColor: color }}>
            <span className="marker-label" style={{ position: 'absolute', bottom: '100%', left: '-50%', whiteSpace: 'nowrap' }}>
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

            <Row>
                <h5 className="card-title mb-3"><strong>هدف النجاح</strong></h5>

                <Col lg={6}>
                    <p><strong>مراكز الانتخابات الأخيرة - كيفان 2019: </strong></p>
                    <div className="pb-3">
                        {/* info color ball */}
                        <div className="d-flex align-items-center mb-2">
                            <i className="mdi mdi-circle align-middle me-2 text-danger"></i>
                            <span>لم يأكد حضورة: {results.totalGuarantees}</span>
                        </div>

                        {/* info warning ball */}
                        <div className="d-flex align-items-center mb-2">
                            <i className="mdi mdi-circle align-middle me-2 text-info"></i>
                            <span>مؤكد حضوره: {results.totalConfirmedGuarantees}</span>
                        </div>

                        {/* info success ball */}
                        <div className="d-flex align-items-center">
                            <i className="mdi mdi-circle align-middle me-2 text-success"></i>
                            <span>الحضور: {results.totalConfirmedAttendees}</span>
                        </div>
                    </div>
                </Col>
                <Col lg={6}>
                    <Col lg={6}>
                        <p><strong>مراكز الانتخابات الأخيرة - كيفان 2019: </strong></p>
                        <div className="pb-3">
                            <ul>
                                <li>الهدف: {targetVotes}</li>
                                <li>الأول: {firstWinnerVotes}</li>
                                <li>التاسع: {lastWinnerVotes}</li>
                                <li>متوسط النجاح: {medianWinnerVotes}</li>
                            </ul>
                        </div>
                    </Col>
                </Col>
            </Row>


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
        </React.Fragment>
    )
}

export default GuaranteeTargetBar;
