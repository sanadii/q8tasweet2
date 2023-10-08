// React & Redux core
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

// Store & Selectors
import { electionsSelector } from '../../../Selectors/electionsSelector';
import { getCampaignDetails } from "../../../store/actions";

// UI & Utilities
import { Container } from "reactstrap";

const CampaignDetails = () => {
  const dispatch = useDispatch();
  const { id: campaignId } = useParams();

  const {
    campaignDetails,
    // ... other properties
  } = useSelector(electionsSelector);

  useEffect(() => {
    document.title = "الحملة الإنتخابية | Q8Tasweet - React Admin & Dashboard Template";
    if (campaignId) {
      dispatch(getCampaignDetails({ id: campaignId }));
    }
  }, [dispatch, campaignId]);

  const isLoading = !campaignDetails || !campaignDetails.candidate || !campaignDetails.election;

  if (isLoading) {
    return (
      <div className="page-content">
        <Container fluid>
          <div>تحميل...</div>
        </Container>
      </div>
    );
  }

  // At this point, we're sure that campaignDetails, campaignDetails.candidate, and campaignDetails.election are all defined.
  return (
    <div className="page-content">
      <Container fluid>
        <h3 className="text-white mb-1">{campaignDetails.candidate.name}</h3>
        <p className="text-white-75">{campaignDetails.election.name}</p>
      </Container>
    </div>
  );
};

export default CampaignDetails;
