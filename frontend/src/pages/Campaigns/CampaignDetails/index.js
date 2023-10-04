import React, { useEffect, useState } from "react";
import { Container } from "reactstrap";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getCampaignDetails } from "../../../store/actions";
import { isEmpty } from "lodash";
import { electionsSelector } from '../../../Selectors/electionsSelector';

import Section from "./Section";

const CampaignDetails = () => {
  const dispatch = useDispatch();

  document.title = "الحملة الإنتخابية | Q8Tasweet - React Admin & Dashboard Template";

  const { campaignDetails, currentCampaignMember, campaignMembers, campaignGuarantees, campaignCommittees, isCampaignSuccess } = useSelector(electionsSelector);

  const [campaign, setCampaign] = useState({
    id: useParams().id,
  });

  useEffect(() => {
    if (campaign.id && !isEmpty(campaign)) {
      dispatch(getCampaignDetails(campaign));
    }
  }, [dispatch, campaign, campaign.id]);


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
              currentCampaignMember={currentCampaignMember}
              campaignCommittees={campaignCommittees}
            />
          )}

        </Container>


      </div>
    </React.Fragment>
  );
};

export default CampaignDetails;
