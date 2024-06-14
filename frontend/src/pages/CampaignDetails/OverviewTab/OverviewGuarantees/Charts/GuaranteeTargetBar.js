import React, { useState, useEffect } from 'react';
import { Tooltip, Card, CardHeader, CardBody, Col, Row, Table, Progress } from "reactstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

const Marker = ({ percentage, color, label, total, height }) => {
    const [tooltipOpen, setTooltipOpen] = useState(false);

    const uniqueId = `markerTooltip-${label.replace(/\s/g, '')}-${total}`;

    useEffect(() => {
        setTooltipOpen(true);
    }, []);

    return (
        <div className="marker" style={{ position: 'absolute', right: `${percentage}%`, bottom: 0 }}>
            <div style={{ width: '36px', position: 'absolute', right: '-3px', bottom: `${height}px`, zIndex: 1000 }}>
                <div className={`bg-${color}`} style={{ width: '8px', height: '8px', borderRadius: '50%', position: 'absolute', bottom: 0, right: 0 }} id={uniqueId}></div>
                {tooltipOpen && document.getElementById(uniqueId) && (
                    <Tooltip className="red" placement="top" isOpen={tooltipOpen} target={uniqueId}>
                        {label} ({total})
                    </Tooltip>
                )}
            </div>
            <div className={`bg-${color}`} style={{ width: '2px', height: `${height}px` }}></div>
        </div>
    );
};

const usePreviousElection = (previousElectionDetails, previousElectionCandidates) => {
    const [firstWinnerVotes, setFirstWinnerVotes] = useState(null);
    const [medianWinnerVotes, setMedianWinnerVotes] = useState(null);
    const [lastWinnerVotes, setLastWinnerVotes] = useState(null);

    useEffect(() => {
        if (previousElectionDetails && previousElectionCandidates) {
            const { electSeats: seats } = previousElectionDetails;

            const sortedCandidates = previousElectionCandidates.sort((a, b) => b.votes - a.votes);

            if (sortedCandidates.length > 0) {
                const firstWinner = sortedCandidates[0];
                const lastWinner = seats > 0 ? sortedCandidates[seats - 1] : null;
                const medianWinnerVotes = seats > 0
                    ? Math.floor(sortedCandidates.slice(0, seats).reduce((acc, candidate) => acc + candidate.votes, 0) / seats)
                    : null;

                setFirstWinnerVotes(firstWinner.votes);
                setLastWinnerVotes(lastWinner ? lastWinner.votes : null);
                setMedianWinnerVotes(medianWinnerVotes);
            }
        }
    }, [previousElectionDetails, previousElectionCandidates]);

    return { firstWinnerVotes, medianWinnerVotes, lastWinnerVotes };
};

const getArabicOrdinal = (position) => {
    const ordinals = [
        "الأول",
        "الثاني",
        "الثالث",
        "الرابع",
        "الخامس",
        "السادس",
        "السابع",
        "الثامن",
        "التاسع",
        "العاشر"
    ];
    return ordinals[position - 1] || `${position}`;
};

const GuaranteeTargetBar = ({ campaign, results, previousElection }) => {
    const previousElectionDetails = previousElection?.electionDetails;
    const previousElectionCandidates = previousElection?.electionCandidates;

    const { firstWinnerVotes, medianWinnerVotes, lastWinnerVotes } = usePreviousElection(previousElectionDetails, previousElectionCandidates);
    const targetVotes = campaign.targetVotes;

    const endOfBar = firstWinnerVotes + (firstWinnerVotes / 10);

    const totalGuarantees = results.totalGuarantees;
    const totalConfirmedGuarantees = results.totalConfirmedGuarantees;
    const totalConfirmedAttendees = results.totalConfirmedAttendees;
    const reductedConfirmedGuarantees = totalConfirmedGuarantees - totalConfirmedAttendees;
    const reductedGuarantees = totalConfirmedGuarantees - totalConfirmedAttendees;

    const calculatePercentage = (total) => ((total / endOfBar) * 100).toFixed(2);

    // const calculatePercentage = (total) => {
    //     const percentage = (total / endOfBar) * 100;
    //     return percentage > 100 ? 100 : percentage.toFixed(2);
    // };
    
    return (
        <React.Fragment>
            <Card>
                <CardHeader>
                    <h5 className="card-title">
                        <strong className="float-end text-success">{targetVotes}</strong>
                        <strong>هدف النجاح</strong>
                    </h5>
                </CardHeader>
                <CardBody className="p-3">
                    <Row className="mb-4 p-3">
                        <div className="d-flex align-items-center py-2" style={{ height: '140px' }}>
                            <div className="flex-shrink-0 me-3">
                                <div className="avatar-xs">
                                    <div className="avatar-title bg-light rounded-circle text-muted fs-16">
                                        <i className="ri-bar-chart-fill"></i>
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
                                    <Marker percentage={calculatePercentage(firstWinnerVotes)} color="success" label="الأول" total={firstWinnerVotes} height={12} />
                                    <Marker percentage={calculatePercentage(lastWinnerVotes)} color="danger" label={getArabicOrdinal(previousElectionDetails.electSeats)} total={lastWinnerVotes} height={12} />
                                    <Marker percentage={calculatePercentage(medianWinnerVotes)} color="info" label="المتوسط" total={medianWinnerVotes} height={12} />
                                    <Marker percentage={calculatePercentage(targetVotes)} color="primary" label="الهدف" total={targetVotes} height={56} />
                                </div>
                            </div>
                        </div>
                        <Col lg={6}>
                            <p><strong>مراكز النجاح في الانتخابات الأخيرة: </strong></p>
                            <div className="pb-3">
                                <Table>
                                    <tbody>
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
                                                <span>{getArabicOrdinal(previousElectionDetails.electSeats)}</span>
                                            </td>
                                            <td>{lastWinnerVotes}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>
                        </Col>
                        <Col lg={6}>
                            <p><strong>متابعة المضامين: </strong></p>

                            <Table>
                                <tbody>
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
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </React.Fragment>
    );
}

export default GuaranteeTargetBar;



// العلامة الخضراء تدل على عدد الحضور الفعلي من المضامين
// العلامة الزرقاء تدل على المضامين المؤكد حضورهم أو لم يأكد ولم يصوتو بعد
// العلامة الحمراء تدل على عدد المضامين الذين لم يأكدو حضورهم بعد ولم يحضرو