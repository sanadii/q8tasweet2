import React from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, Row, Col } from "reactstrap";
import { ImageMedium } from "shared/components";
import moment from 'moment';

const ProfileCampaigns = ({ user }) => {
    const userCampaigns = user.campaigns;

    const checkDueDate = (dueDate) => {
        const today = moment().startOf('day');
        return moment(dueDate).isSameOrAfter(today);
    };

    return (
        <Card>
            <CardBody>
                <h5 className="card-title">الحملات الإنتخابية</h5>
                <Row>
                    {userCampaigns.map((campaign) => {
                        const isCurrentOrFuture = checkDueDate(campaign.election.dueDate);
                        return (
                            <Col lg={4} key={campaign.id}>
                                <Card className={`profile-project-card shadow-none ${isCurrentOrFuture ? "profile-project-success" : "profile-project-warning"}`}>
                                    <CardBody className="p-4">
                                        <div className="d-flex">
                                            <div className="flex-grow-1 text-muted overflow-hidden">
                                                <h5 className="fs-14 text-truncate mb-1">
                                                    <Link to="#" className="text-dark">
                                                        {campaign.name}
                                                    </Link>
                                                </h5>
                                                <p className="fw-semibold text-dark">
                                                    {campaign.election.dueDate}
                                                </p>
                                                <div className={`badge badge-soft-${isCurrentOrFuture ? "success" : "warning"} fs-10`}>
                                                    {isCurrentOrFuture ? "فعال" : "انتهت"}
                                                </div>
                                            </div>
                                            <div className="flex-shrink-0 ms-2">
                                                <ImageMedium imagePath={campaign.image} />
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            </CardBody>
        </Card>
    );
};

export default ProfileCampaigns;
