// Pages/Campaigns/CampaignDetails/index.js
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

// Store & Selectors
import { campaignSelector } from 'Selectors';
import { getCampaignDetails } from "store/actions";

// Components
import Section from "./Section";
import { Loader } from "components";
import { usePermission } from 'hooks';

// UI & Utilities
import { Container } from "reactstrap";
import { isEmpty } from "lodash";

const CampaignDetails = () => {
  const dispatch = useDispatch();

  const { slug } = useParams();
  const { campaign } = useSelector(campaignSelector);
  const { canViewCampaign } = usePermission();

  useEffect(() => {
    document.title = "الحملة الإنتخابية | كويت تصويت";
  }, []);


  useEffect(() => {
    // Set the document title
    document.title = "الانتخابات | كويت تصويت";

    // Fetch campaign details if the slug is available and candidate is empty
    if (slug && (isEmpty(campaign) || campaign.slug !== slug)) {
      dispatch(getCampaignDetails(slug));
    }

  }, [dispatch, slug]);

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
