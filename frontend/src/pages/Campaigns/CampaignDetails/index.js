import React, { useEffect, useState } from "react";
import { Container } from "reactstrap";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getCampaignDetails } from "../../../store/actions";
import { isEmpty } from "lodash";
import { electionsSelector } from '../../../selectors/electionsSelector';

import Section from "./Section";

const CampaignDetails = () => {
  const dispatch = useDispatch();
  const campaignId = useParams().id;

  document.title = "الحملة الإنتخابية | Q8Tasweet - React Admin & Dashboard Template";

  const { currentCampaignMember, campaign, campaignMembers, campaignGuarantees, electionCommittees, isCampaignSuccess } = useSelector(electionsSelector);

  useEffect(() => {
    if (campaignId && !isEmpty({ id: campaignId })) {
      dispatch(getCampaignDetails({ id: campaignId }));
    }
  }, [dispatch, campaignId]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {!campaign.election || !campaignMembers ? (
            <div>إنتظار...</div>
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
