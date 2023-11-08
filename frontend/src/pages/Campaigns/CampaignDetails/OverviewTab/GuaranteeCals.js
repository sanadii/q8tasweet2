// Pages/Campaigns/CampaignDetails/Components/OverViewGuarantees.js
// React & Redux core
import React from "react";


// Components, Constants & Hooks
import { GuaranteeStatusOptions } from "constants";
import { calculateCampaignData } from 'hooks/campaignCalculation';

// UI & Utilities
import { Card, CardBody, Col, Row, Progress } from "reactstrap";


const GuaranteeCals = ({ campaignGuarantees, results }) => {



    return (
        <Card className="h-100">
            <CardBody>
                <Row className="align-items-center">
                    <Col sm={6} className="d-flex justify-content-start align-items-center">
                        <h5 className="card-title mb-3"><strong>الحضور: {results.totalAttendees}</strong></h5>
                    </Col>
                </Row>
                <div className="d-flex align-items-center py-2">
                    <div className="flex-shrink-0 me-3">
                        <div className="avatar-xs">
                            <div className="avatar-title bg-light rounded-circle text-muted fs-16">
                                <i className="bx bx-select-multiple"></i>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex align-items-center py-2"> تواصل</div>

                    <div className="flex-grow-1">
                        <div>
                            <Progress value={results.confirmedPercentage} color="warning" className="animated-progess custom-progress progress-label" >
                                <div className="label">{results.confirmedPercentage}%</div>
                            </Progress>
                        </div>
                    </div>
                </div>

                <div className="d-flex align-items-center py-2">
                    <div className="flex-shrink-0 me-3">
                        <div className="avatar-xs">
                            <div className="avatar-title bg-light rounded-circle text-muted fs-16">
                                <i className="bx bx-select-multiple"></i>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex align-items-center py-2"> مؤكد</div>

                    <div className="flex-grow-1">
                        <div>
                            <Progress
                                value={results.contactedPercentage}
                                color="success"
                                className="animated-progess custom-progress progress-label" >
                                <div className="label">{results.contactedPercentage}%</div>
                            </Progress>
                        </div>
                    </div>
                </div>

                <div className="d-flex align-items-center py-2">
                    <div className="flex-shrink-0 me-3">
                        <div className="avatar-xs">
                            <div className="avatar-title bg-light rounded-circle text-muted fs-16">
                                <i className="bx bx-select-multiple"></i>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex align-items-center py-2"> حضور</div>

                    <div className="flex-grow-1">
                        <div>
                            <Progress value={results.attendedPercentage} color="info" className="animated-progess custom-progress progress-label" >
                                <div className="label">{results.attendedPercentage}%</div>
                            </Progress>
                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>

    );
};

export default GuaranteeCals;