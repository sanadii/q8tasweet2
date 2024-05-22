import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { campaignSelector } from 'selectors';
import { getCampaignDetails } from "store/actions";
import Section from "./Section";
import { Loader } from "shared/components";
import { usePermission } from 'shared/hooks';
import { Container } from "reactstrap";
import { isEmpty } from "lodash";
import { WebSocketProvider } from 'shared/utils';

const CampaignDetails = () => {
  const dispatch = useDispatch();
  const { slug } = useParams();
  const { campaign, electionDetails } = useSelector(campaignSelector);
  const { canViewCampaign } = usePermission();

  useEffect(() => {
    // Set the document title
    document.title = "الانتخابات | كويت تصويت";

    // Fetch election details if the slug is available and candidate is empty
    if (slug && (isEmpty(campaign) || campaign.slug !== slug)) {
      dispatch(getCampaignDetails(slug));
    }
  }, [dispatch, slug]);


  return (
    <div className="page-content">
      <Container fluid>
        {canViewCampaign ? (
          campaign ?
            <WebSocketProvider channel="campaigns" slug={slug}>
              <Section />
            </WebSocketProvider>
            : <Loader />
        ) : (
          <div>لست مصرح بمعاينة الحملة الإنتخابية.</div>
        )}
      </Container>
    </div>
  );
};

export default CampaignDetails;
