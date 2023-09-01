import React, { useEffect, useState } from "react";
import { Container } from "reactstrap";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  getCampaignDetails,
  // getCampaigmembers,
} from "../../../store/actions";
import { isEmpty } from "lodash";
import Section from "./Section";

const CampaignDetails = () => {
  const dispatch = useDispatch();
  const campaignId = useParams().id;

  useEffect(() => {
    document.title =
      "Campaign Details | Q8Tasweet - React Admin & Dashboard Template";
  }, []);

  const { campaign, candidate, election, campaignMembers } = useSelector(
    (state) => ({
      campaign: state.Campaigns.campaignDetails,
      candidate: state.Campaigns.candidateDetails,
      election: state.Campaigns.electionDetails,
      campaignMembers: state.Campaigns.campaignMembers,
      // Add other selectors if needed
    })
  );

  useEffect(() => {
    console.log(campaignId);
    if (campaignId && !isEmpty({ id: campaignId })) {
      dispatch(getCampaignDetails({ id: campaignId }));
    }
  }, [dispatch, campaignId]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {!campaign || !candidate || !election ? (
            <div>Loading...</div> // or some loading component
          ) : (
            <Section
              campaign={campaign}
              candidate={candidate}
              election={election}
              campaignMembers={campaignMembers}
              // campaignMembers={campaignMembers}
            />
          )}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default CampaignDetails;
