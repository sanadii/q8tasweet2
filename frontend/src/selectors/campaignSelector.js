// Selectors/campaignsSelectors.js
import { createSelector } from 'reselect';

const selectCampaignsState = state => state.Campaigns;

export const campaignSelector = createSelector(
  selectCampaignsState,
  (campaignsState) => ({

    // Campaign Selectors
    campaigns: campaignsState.campaigns,
    campaign: campaignsState.campaignDetails,
    activeCampaign: campaignsState.campaignDetails,
    campaignId: campaignsState.campaignDetails.id,
    campaignType: campaignsState.campaignDetails.campaignType,

    electionDetails: campaignsState.electionDetails,
    campaignDetails: campaignsState.campaignDetails,
    campaignMembers: campaignsState.campaignMembers,

    campaignGuarantees: campaignsState.campaignGuarantees || [],
    campaignGuaranteeGroups: campaignsState.campaignGuaranteeGroups || [],
    campaignAttendees: campaignsState.campaignAttendees,
    campaignNotifications: campaignsState.campaignNotifications,

    campaignSorting: campaignsState.campaignSorting,
    campaignElectionCommittees: campaignsState.campaignElectionCommittees,
    campaignElectionCandidates: campaignsState.campaignElectionCandidates,

    isCampaignSuccess: campaignsState.isCampaignSuccess,
    campaignError: campaignsState.error,

    // CurrentCampaignMember
    currentCampaignMember: campaignsState.currentCampaignMember,
    // currentCampaignMemberCommittee: campaignsState.currentCampaignMember.committee,
    voters: campaignsState.voters,

    campaignRoles: campaignsState.campaignRoles,

    // Election


  })
);
