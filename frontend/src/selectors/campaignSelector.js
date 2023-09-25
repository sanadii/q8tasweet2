import { createSelector } from 'reselect';

const selectCampaignsState = state => state.Campaigns;

export const electionsSelector = createSelector(
  selectCampaignsState,
  campaignsState => ({
    campaigns: campaignsState.campaigns,
    campaign: campaignsState.campaignDetails,
    campaignDetails: campaignsState.campaignDetails,
    campaignMembers: campaignsState.campaignMembers,
    campaignGuarantees: campaignsState.campaignGuarantees,

    // electionCommittees: campaignsState.electionCommittees,
    // electionCandidates: campaignsState.electionCandidates,
    // electionAttendees: campaignsState.electionAttendees,

    campaignCommittees: campaignsState.electionCommittees,
    campaignCandidates: campaignsState.electionCandidates,
    electionsSelector: campaignsState.electionAttendees,

    isCampaignSuccess: campaignsState.isCampaignSuccess,
    currentCampaignMember: campaignsState.currentCampaignMember,
    electors: campaignsState.electors,
  })
);
