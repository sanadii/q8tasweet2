// React & Redux core
import React, { useEffect } from "react";
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

  const { isCampaignSuccess } = useSelector(electionsSelector);
  const { hasPermission } = useCampaignPermission();

  useEffect(() => {
    document.title = "الحملة الإنتخابية | Q8Tasweet - React Admin & Dashboard Template";
  }, []);

  useEffect(() => {
    if (campaignId) {
      dispatch(getCampaignDetails({ id: campaignId }));
    }
  }, [dispatch, campaignId]);

  return (
    <div className="page-content">
      <Container fluid>
        {hasPermission('canViewCampaign') ? (
          isCampaignSuccess ? (
            <Section />
          ) : (
            <div>تحميل...</div>
          )
        ) : (
          <div>
            لست مصرح بمعاينة الحملة الإنتخابية.
          </div>
        )}
      </Container>
    </div>
  );
};

export default CampaignDetails;
