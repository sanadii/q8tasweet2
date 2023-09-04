import React, { useEffect, useState } from "react";
import { Container } from "reactstrap";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getCampaignDetails } from "../../../store/actions";
import { isEmpty } from "lodash";

import Section from "./Section";

const CampaignDetails = () => {
  const dispatch = useDispatch();
  const campaignId = useParams().id;

  document.title =
    "Campaign Details | Q8Tasweet - React Admin & Dashboard Template";

  const { currentCampaignMember, campaign, campaignMembers, campaignGuarantees, electionCommittees, isCampaignSuccess} = useSelector((state) => ({
    currentCampaignMember: state.Campaigns.currentCampaignMember,
    campaign: state.Campaigns.campaignDetails,
    campaignMembers: state.Campaigns.campaignMembers,
    campaignGuarantees: state.Campaigns.campaignGuarantees,
    electionCommittees: state.Campaigns.electionCommittees,
    electionCommittees: state.Campaigns.electionCommittees,
    isCampaignSuccess: state.Campaigns.isCampaignSuccess,
  }));

  useEffect(() => {
    if (campaignId && !isEmpty({ id: campaignId })) {
      dispatch(getCampaignDetails({ id: campaignId }));
    }
  }, [dispatch, campaignId]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {!campaign || !campaignMembers ? (
            <div>Loading...</div> // or some loading component
          ) : (
            <Section
              campaign={campaign}
              campaignMembers={campaignMembers}
              campaignGuarantees={campaignGuarantees}
              currentCampaignMember={currentCampaignMember}
              electionCommittees={electionCommittees}
            />
          )}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default CampaignDetails;
