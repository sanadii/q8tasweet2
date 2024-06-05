
import React from "react";
import { ImageLarge, SectionBackagroundImage } from "shared/components";
import { Col, Row } from "reactstrap";
import { usePermission } from 'shared/hooks';

import { useSelector, useDispatch } from "react-redux";
import { layoutSelector, userSelector, campaignSelector } from 'selectors';

const SectionHeader = ({ campaign, electionDetails, campaignMembers, campaignGuarantees }) => {
    const { activeCampaign, userCampaigns } = useSelector(userSelector);

    const currentCampaign = campaign || activeCampaign;

    // Permissions
    const {
        canChangeCampaign,
        canViewCampaignMember,
        canViewCampaignGuarantee,
        // canViewCampaignAttendees,
    } = usePermission();

    if (!currentCampaign && currentCampaign.election) {
        return (
            <p>loading</p>
        )
    }
    
    const campaignId = currentCampaign?.id;
    const campaignName = currentCampaign?.candidate?.name;
    const campaignImage = currentCampaign?.candidate?.image;
    const electionName = electionDetails.name;
    const electionDueDate = electionDetails.dueDate;

    return (
        <React.Fragment>
            <SectionBackagroundImage imagePath={campaignImage} />
            <div className="pt-4 mb-4 mb-lg-3 pb-lg-2 profile-wrapper">
                <Row className="g-4">
                    <div className="col-auto">
                        <ImageLarge imagePath={campaignImage} />
                    </div>

                    <Col>
                        <div className="p-2">
                            <h3 className="text-white mb-1">{campaignName}</h3>
                            <p className="text-white-75">{electionName}</p>
                            <div className="hstack text-white gap-1">
                                <div className="me-2">
                                    <i className="ri-map-pin-user-line me-1 text-white-75 fs-16 align-middle"></i>
                                    التاريخ: <strong> {electionDueDate}</strong>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col xs={12} className="col-lg-auto order-last order-lg-0">
                        <Row className="text text-white-50 text-center">
                            {canViewCampaignMember &&
                                <Col lg={6} xs={4}>
                                    <div className="p-2">
                                        <h4 className="text-white mb-1">
                                            {campaignMembers?.length || 0}
                                        </h4>
                                        <p className="fs-14 mb-0">الفريق</p>
                                    </div>
                                </Col>
                            }
                            {canViewCampaignGuarantee &&
                                <Col lg={6} xs={4}>
                                    <div className="p-2">
                                        <h4 className="text-white mb-1">
                                            {campaignGuarantees?.length || 0}
                                        </h4>
                                        <p className="fs-14 mb-0">المضامين</p>
                                    </div>
                                </Col>
                            }
                            {/* {canViewCampaignAttendees &&
                                <Col lg={6} xs={4}>
                                    <div className="p-2">
                                    <h4 className="text-white mb-1">
                                        {campaignAttendees?.length || 0}
                                    </h4>
                                    <p className="fs-14 mb-0">الحضور</p>
                                    </div>
                                </Col>
                                } */}
                        </Row>
                    </Col>
                </Row>
            </div>
        </React.Fragment>
    )
}

export default SectionHeader;
