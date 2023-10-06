// React & Redux core
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

// Store & Selectors
import { electionsSelector } from '../../../Selectors/electionsSelector';
import { getCampaignDetails } from "../../../store/actions";

// Components
import Section from "./Section";

// UI & Utilities
import { Container } from "reactstrap";
import { isEmpty } from "lodash";


const CampaignDetails = () => {
  const dispatch = useDispatch();
  const { id: campaignId } = useParams();
  
  const {
    campaignDetails,
    currentCampaignUser,
    campaignMembers,
    campaignGuarantees,
    campaignElectionCommittees,
    isCampaignSuccess
  } = useSelector(electionsSelector);

  const [campaign, setCampaign] = useState({ id: campaignId });

  useEffect(() => {
    document.title = "الحملة الإنتخابية | Q8Tasweet - React Admin & Dashboard Template";
    if (campaign.id && !isEmpty(campaign)) {
      dispatch(getCampaignDetails(campaign));
    }
  }, [dispatch, campaign]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {!campaign || !campaignMembers ? (
            <div>إنتظار...</div>
          ) : (
            <Section
              campaign={campaignDetails}
              campaignMembers={campaignMembers}
              campaignGuarantees={campaignGuarantees}
              currentCampaignUser={currentCampaignUser}
              campaignElectionCommittees={campaignElectionCommittees}
            />
          )}F
        </Container>
      </div>
    </React.Fragment>
  );
};

export default CampaignDetails;
