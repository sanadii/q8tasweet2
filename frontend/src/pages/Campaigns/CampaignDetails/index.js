// React & Redux core
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

// Store & Selectors
import { electionsSelector } from '../../../Selectors/electionsSelector';
import { getCampaignDetails } from "../../../store/actions";

// Components
import Section from "./Section";
import useCampaignPermission from "../../../Components/Hooks/useCampaignPermission";

// UI & Utilities
import { Container } from "reactstrap";
// import { isEmpty } from "lodash";


const CampaignDetails = () => {
  const dispatch = useDispatch();
  const { id: campaignId } = useParams();
  const { hasPermission } = useCampaignPermission(); // Use the hook

  const {
    campaignDetails,
    currentUser,
    currentCampaignMember,
    campaignMembers,
    campaignGuarantees,
    campaignElectionCommittees,
    isCampaignSuccess
  } = useSelector(electionsSelector);

  useEffect(() => {
    document.title = "الحملة الإنتخابية | Q8Tasweet - React Admin & Dashboard Template";
    if (campaignId) {
      dispatch(getCampaignDetails({ id: campaignId }));
    }
  }, [dispatch, campaignId]);

  const isLoading = !campaignDetails || !campaignDetails.candidate || !campaignDetails.election;

  if (!hasPermission('canViewCampaigns')) { // Check if the user doesn't have the permission
    return <div>You do not have permission to view this campaign.</div>;
  }

  if (isLoading) {
    return (
      <div className="page-content">
        <Container fluid>
          <div>تحميل...</div>
        </Container>
      </div>
    );
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Section
            campaign={campaignDetails}
            campaignMembers={campaignMembers}
            campaignGuarantees={campaignGuarantees}
            currentCampaignMember={currentCampaignMember}
            campaignElectionCommittees={campaignElectionCommittees}
          />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default CampaignDetails;
