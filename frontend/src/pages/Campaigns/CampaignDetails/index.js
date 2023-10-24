// Pages/Campaigns/CampaignDetails/index.js
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

// Store & Selectors
import { campaignSelector } from 'Selectors';
import { getCampaignDetails } from "../../../store/actions";

// Components
import Section from "./Section";
import Loader from "../../../Common/Components/Components/Loader";
import usePermission from "../../../Common/Hooks/usePermission";

// UI & Utilities
import { Container } from "reactstrap";

const CampaignDetails = () => {
  const dispatch = useDispatch();
  
  const { id: campaignId } = useParams();
  const { campaign } = useSelector(campaignSelector);
  const { canViewCampaign } = usePermission();

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
        {canViewCampaign ? (
          campaign ? (
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
