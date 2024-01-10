import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { campaignSelector } from 'Selectors';
// import { getCampaignDetails } from "store/actions";
import Section from "./Section";
import { Loader } from "components";
import { usePermission } from 'hooks';
import { Container } from "reactstrap";
import { isEmpty } from "lodash";
import { WebSocketProvider } from '../../../utils/WebSocketContext';

const CampaignDetails = () => {
  const dispatch = useDispatch();
  const { slug, campaignType } = useParams();
  const { campaign } = useSelector(campaignSelector);
  const { canViewCampaign } = usePermission();


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
