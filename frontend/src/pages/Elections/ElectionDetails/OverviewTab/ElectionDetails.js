import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Col, Row, Card, CardBody, CardHeader, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";
import { ImageGenderCircle, } from "Common/Components";
import { electionSelector } from 'Selectors';
import { ElectionTypeBadge, PriorityBadge } from "Common/Constants";

//SimpleBar
import SimpleBar from "simplebar-react";

const OverviewCampaigns = () => {

    const { election, electionCandidates, electionCampaigns, electionCommittees } = useSelector(electionSelector);

    const moderators = Array.isArray(election.moderators)
        ? election.moderators
        : [];

    return (
        <React.Fragment>
            <Card>
                <CardHeader>
                    <h5 className="card-title">
                        <strong>الإنتخابات</strong>
                    </h5>
                </CardHeader>
                <CardBody>
                    <div className="text-muted">
                        <div className="pt-3 buttom-top buttom-top-dashed mb-4">
                            <Row>
                                <Col lg={3} sm={6}>
                                    <div>
                                        <p className="mb-2 text-uppercase fw-medium">يوم الإقتراع:</p>
                                        <h5 className="fs-15 mb-0">{election.dueDate}</h5>
                                    </div>
                                </Col>
                                <Col lg={3} sm={6}>
                                    <div>
                                        <p className="mb-2 text-uppercase fw-medium">نوع الإنتخابات:</p>
                                        <ElectionTypeBadge electType={election.electType} />
                                    </div>
                                </Col>
                                <Col lg={3} sm={6}>
                                    <div>
                                        <p className="mb-2 text-uppercase fw-medium">عدد الأصوات:</p>
                                        <div className="badge bg-info fs-12">
                                            {election.electVotes} صوت
                                        </div>
                                    </div>
                                </Col>
                                <Col lg={3} sm={6}>
                                    <div>
                                        <p className="mb-2 text-uppercase fw-medium">
                                            المقاعد:
                                        </p>
                                        <div className="badge bg-info fs-12">
                                            {election.electSeats} مقاعد
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </React.Fragment>
    );
};

export default OverviewCampaigns;
