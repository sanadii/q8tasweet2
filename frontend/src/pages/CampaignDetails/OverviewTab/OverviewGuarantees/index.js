import React from "react";

import GuaranteeCals from "./GuaranteeCals"
import GuaranteeChart from "./GuaranteeChart"
import GuaranteeTarget from "./GuaranteeRadialBar"
import GuaranteeRadialBar from "./GuaranteeRadialBar"
import GuaranteeTargetBar from "./GuaranteeTargetBar"
import Guarantors from "./Guarantors";
import { calculateCampaignData } from 'shared/hooks';
import { usePermission } from 'shared/hooks';
import { Col, Row } from "reactstrap";


const OverviewGuarantees = ({ campaign, campaignGuarantees, campaignMembers }) => {

    const results = calculateCampaignData(campaign, campaignGuarantees);

    const {
        canChangeCampaign,
        canViewCampaignGuarantee,
        isContributor,
        isModerator,
        isSubscriber
    } = usePermission();



    return (
        <React.Fragment>
            {/* Guarantees */}
            {canViewCampaignGuarantee && campaign?.electionDetails?.previousElections &&
                <GuaranteeTargetBar
                    campaign={campaign}
                    results={results}
                />
            }
            <Row>
                <Col sm={6}>
                    <GuaranteeChart
                        campaign={campaign}
                        campaignGuarantees={campaignGuarantees}
                        results={results}
                    />
                </Col>
                <Col sm={6}>
                    <GuaranteeRadialBar
                        campaign={campaign}
                        campaignGuarantees={campaignGuarantees}
                        results={results}
                    />
                </Col>
                {/* <Col sm={6}>
                <GuaranteeCals
                  campaign={campaign}
                  campaignGuarantees={campaignGuarantees}
                  results={results}
                />
              </Col> */}
            </Row>

            {canViewCampaignGuarantee &&
                <Guarantors
                    campaignMembers={campaignMembers}
                    campaignGuarantees={campaignGuarantees}
                />}
        </React.Fragment>
    );
};

export default OverviewGuarantees;
