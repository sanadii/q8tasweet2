import React from "react";

import GuaranteeCals from "./GuaranteeCals"
import Guarantors from "./Guarantors";

// Charts
import GuaranteeChart from "./Charts/GuaranteeChart"
import GuaranteeTarget from "./Charts/GuaranteeRadialBar"
import GuaranteeRadialBar from "./Charts/GuaranteeRadialBar"
import GuaranteeTargetBar from "./Charts/GuaranteeTargetBar"

import { calculateCampaignData } from 'shared/hooks';
import { usePermission } from 'shared/hooks';
import { Col, Row } from "reactstrap";


const OverviewGuarantees = ({ campaign, campaignGuarantees, campaignMembers, previousElection }) => {

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
            {/* {canViewCampaignGuarantee && campaign?.electionDetails?.previousElections &&
                <GuaranteeTargetBar
                    campaign={campaign}
                    results={results}
                />
            } */}
            {previousElection &&
                <GuaranteeTargetBar
                    campaign={campaign}
                    results={results}
                    previousElection={previousElection}
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
