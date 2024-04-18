// Selectors/campaignsSelectors.js
import { createSelector } from 'reselect';

const selectCampaignsState = state => state.Campaigns;

export const campaignSelector = createSelector(
  selectCampaignsState,
  (campaignsState) => ({

    // Campaign Selectors
    campaigns: campaignsState.campaigns || [],
    campaign: campaignsState.campaignDetails,
    activeCampaign: campaignsState.campaignDetails,
    campaignId: campaignsState.campaignDetails.id,
    campaignType: campaignsState.campaignDetails.campaignType,

    previousElection: campaignsState.previousElection,
    currentElection: campaignsState.currentElection,
    campaignElectionCommitteeSites: campaignsState.electionCommitteeSites || [],
    campaignElectionCandidates: campaignsState.campaignElectionCandidates || [],

    electionSlug: campaignsState.electionDetails?.slug,
    campaignDetails: campaignsState.campaignDetails,
    campaignMembers: campaignsState.campaignMembers || [],

    campaignGuarantees: campaignsState.campaignGuarantees || [],
    campaignGuaranteeGroups: campaignsState.campaignGuaranteeGroups || [],
    campaignAttendees: campaignsState.campaignAttendees || [],
    campaignNotifications: campaignsState.campaignNotifications,

    campaignSorting: campaignsState.campaignSorting,
    electionCommitteeSites: campaignsState.electionCommitteeSites || [],

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
