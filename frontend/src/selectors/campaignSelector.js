// Selectors/campaignsSelectors.js
import { createSelector } from 'reselect';

const selectCampaignsState = state => state.Campaigns;

export const campaignSelector = createSelector(
  selectCampaignsState,
  (campaignsState) => ({

    // Campaign Selectors
    campaigns: campaignsState.campaigns,
    campaign: campaignsState.campaignDetails,
    campaignDetails: campaignsState.campaignDetails,
    campaignMembers: campaignsState.campaignMembers,
    campaignGuarantees: campaignsState.campaignGuarantees,
    campaignAttendees: campaignsState.campaignAttendees,
    
    campaignElectionCommittees: campaignsState.campaignElectionCommittees,
    campaignElectionCandidates: campaignsState.campaignElectionCandidates,

    isCampaignSuccess: campaignsState.isCampaignSuccess,
    campaignError: campaignsState.error,

    currentCampaignMember: campaignsState.currentCampaignMember,
    electors: campaignsState.electors,

  })
);
