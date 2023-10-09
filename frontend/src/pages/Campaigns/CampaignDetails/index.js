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

const CampaignDetails = () => {
  const dispatch = useDispatch();
  const { id: campaignId } = useParams();

  const {
    campaignDetails,
    currentUser,
    currentCampaignMember,
    campaignMembers,
    campaignGuarantees,
    campaignElectionCommittees,
    isCampaignSuccess
  } = useSelector(electionsSelector);

  const { isAdmin, isContributor, isModerator, hasPermission } = useCampaignPermission();
  const canViewCampaign = hasPermission('canViewCampaign');
  const canAddCampaign = hasPermission('canAddCampaign');

  useEffect(() => {
    document.title = "الحملة الإنتخابية | Q8Tasweet - React Admin & Dashboard Template";
    if (campaignId) {
      dispatch(getCampaignDetails({ id: campaignId }));
    }
  }, [dispatch, campaignId]);

  const isLoading = !campaignDetails || !campaignDetails.candidate || !campaignDetails.election;

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {canViewCampaign ? (
            isLoading ? (
              <div className="page-content">
                <Container fluid>
                  <div>تحميل...</div>
                </Container>
              </div>
            ) : (
              <Section
                campaign={campaignDetails}
                campaignMembers={campaignMembers}
                campaignGuarantees={campaignGuarantees}
                currentCampaignMember={currentCampaignMember}
                campaignElectionCommittees={campaignElectionCommittees}
              />
            )
          ) : (
            <div>
              لست مصرح بمعاينة الحملة الإنتخابية.
            </div>
          )}
        </Container>
      </div >
    </React.Fragment >
  );
};

export default CampaignDetails;
